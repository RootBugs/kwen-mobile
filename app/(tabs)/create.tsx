import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/client';
import { pickFromLibrary, takePhoto, uploadImage } from '@/lib/utils/image';
import { validateCaption } from '@/lib/utils/validation';
import { MAX_CAPTION_LENGTH } from '@/lib/constants';
import { hapticLight, hapticSuccess, hapticError } from '@/lib/utils/haptics';

type Step = 'picker' | 'preview' | 'uploading';

export default function CreateScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('picker');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const handlePickFromLibrary = useCallback(async () => {
    hapticLight();
    const result = await pickFromLibrary({ allowsEditing: true, aspect: [1, 1] });
    if (result) {
      setImageUri(result.uri);
      setStep('preview');
    }
  }, []);

  const handleTakePhoto = useCallback(async () => {
    hapticLight();
    const result = await takePhoto({ allowsEditing: true, aspect: [1, 1] });
    if (result) {
      setImageUri(result.uri);
      setStep('preview');
    }
  }, []);

  const handlePost = useCallback(async () => {
    if (!imageUri) return;

    const validation = validateCaption(caption);
    if (!validation.valid) {

      Alert.alert('Error', validation.error);
      return;
    }

    setUploading(true);
    setStep('uploading');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in to post');
        setUploading(false);
        setStep('preview');
        return;
      }

      // Upload image
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const { path, error: uploadError } = await uploadImage(imageUri, 'posts', fileName);

      if (uploadError || !path) {
        throw new Error(uploadError || 'Upload failed');
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from('posts').getPublicUrl(path);
      const imageUrl = urlData.publicUrl;

      // Create post
      const { error: insertError } = await supabase.from('posts').insert({
        user_id: user.id,
        image_url: imageUrl,
        caption: caption.trim() || null,
      });

      if (insertError) throw insertError;

      hapticSuccess();
      Alert.alert('Success', 'Post created!', [
        {
          text: 'OK',
          onPress: () => {
            setStep('picker');
            setImageUri(null);
            setCaption('');
            router.push('/(tabs)/feed');
          },
        },
      ]);
    } catch (err) {
      hapticError();
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create post');
      setUploading(false);
      setStep('preview');
    }
  }, [imageUri, caption, router]);

  const handleCancel = useCallback(() => {
    hapticLight();
    setStep('picker');
    setImageUri(null);
    setCaption('');
  }, []);

  if (step === 'uploading') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color="#0095F6" />
          <Text style={styles.uploadingText}>Creating your post...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'preview' && imageUri) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel} style={styles.headerBtn}>
              <Ionicons name="close" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Post</Text>
            <TouchableOpacity
              onPress={handlePost}
              style={[styles.postBtn, uploading && styles.postBtnDisabled]}
              disabled={uploading}
            >
              <Text style={styles.postBtnText}>Share</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.flex} keyboardShouldPersistTaps="handled">
            {/* Image Preview */}
            <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />

            {/* Caption Input */}
            <View style={styles.captionContainer}>
              <TextInput
                style={styles.captionInput}
                placeholder="Write a caption..."
                placeholderTextColor="#737373"
                multiline
                maxLength={MAX_CAPTION_LENGTH}
                value={caption}
                onChangeText={setCaption}
                autoFocus
              />
              <Text style={styles.charCount}>
                {caption.length}/{MAX_CAPTION_LENGTH}
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Picker step
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Post</Text>
      </View>

      <View style={styles.pickerContainer}>
        <Ionicons name="camera-outline" size={64} color="#737373" />
        <Text style={styles.pickerTitle}>Share a moment</Text>
        <Text style={styles.pickerSubtitle}>
          Pick from your camera roll or take a new photo
        </Text>

        <View style={styles.pickerButtons}>
          <TouchableOpacity style={styles.actionBtn} onPress={handlePickFromLibrary}>
            <Ionicons name="images-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Choose from Library</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]} onPress={handleTakePhoto}>
            <Ionicons name="camera-outline" size={20} color="#0095F6" />
            <Text style={[styles.actionBtnText, styles.actionBtnTextSecondary]}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {  // HACK: edge case
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  postBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#0095F6',
    borderRadius: 6,
  },
  postBtnDisabled: {
    opacity: 0.5,
  },
  postBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  pickerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginTop: 16,
  },
  pickerSubtitle: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
    marginTop: 8,

    lineHeight: 20,
  },
  pickerButtons: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0095F6',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
  },
  actionBtnSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0095F6',
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionBtnTextSecondary: {
    color: '#0095F6',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
  },
  captionContainer: {
    padding: 16,
  },
  captionInput: {
    fontSize: 15,
    color: '#000000',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#737373',
    textAlign: 'right',
    marginTop: 4,
  },
  uploadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingText: {
    fontSize: 15,
    color: '#737373',
    marginTop: 12,
  },
});
