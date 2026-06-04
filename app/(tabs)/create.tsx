import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/lib/supabase/client';
import { MAX_CAPTION_LENGTH } from '@/lib/constants';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CreateScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [posting, setPosting] = useState(false);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const handlePost = useCallback(async () => {
    if (!imageUri) {
      Alert.alert('No image', 'Please select an image first.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPosting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Not logged in', 'Please log in to post.');
        setPosting(false);
        return;
      }

      // Upload image
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const path = `${user.id}/${timestamp}-${random}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(path, blob, { contentType: 'image/jpeg', upsert: false });

      if (uploadError) {
        Alert.alert('Upload failed', uploadError.message);
        setPosting(false);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(path);

      // Create post
      const { error: postError } = await supabase.from('posts').insert({
        user_id: user.id,
        image_url: publicUrl,
        caption: caption.trim() || null,
      });

      if (postError) {
        Alert.alert('Post failed', postError.message);
        setPosting(false);
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setImageUri(null);
      setCaption('');
      router.push('/(tabs)/feed');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create post.');
    } finally {
      setPosting(false);
    }
  }, [imageUri, caption]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="close" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity
          style={[styles.postBtn, (!imageUri || posting) && styles.postBtnDisabled]}
          onPress={handlePost}
          disabled={!imageUri || posting}
        >
          {posting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.postBtnText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {/* Image area */}
        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            <TouchableOpacity style={styles.changeImageBtn} onPress={pickImage}>
              <Ionicons name="create-outline" size={16} color="#FFFFFF" />
              <Text style={styles.changeImageText}>Change</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={48} color="#737373" />
            <Text style={styles.placeholderText}>Tap to add a photo</Text>
            <View style={styles.imageActions}>
              <TouchableOpacity style={styles.imageActionBtn} onPress={pickImage}>
                <Ionicons name="images-outline" size={20} color="#000000" />
                <Text style={styles.imageActionText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageActionBtn} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={20} color="#000000" />
                <Text style={styles.imageActionText}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Caption */}
        <View style={styles.captionContainer}>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            placeholderTextColor="#737373"
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={MAX_CAPTION_LENGTH}
          />
          <Text style={styles.charCount}>
            {caption.length}/{MAX_CAPTION_LENGTH}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
  },
  headerBtn: {
    padding: 4,
    width: 60,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  postBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    width: 60,
    alignItems: 'center',
  },
  postBtnDisabled: {
    opacity: 0.5,
  },
  postBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  changeImageBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeImageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  imagePlaceholder: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#737373',
  },
  imageActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  imageActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  imageActionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
  },
  captionContainer: {
    padding: 12,
  },
  captionInput: {
    fontSize: 15,
    color: '#000000',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: '#737373',
    textAlign: 'right',
    marginTop: 4,
  },
});
