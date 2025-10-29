import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { hapticLight } from '@/lib/utils/haptics';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onSendImage: (uri: string) => void;
  replyToName?: string;
  onCancelReply?: () => void;
}

export function MessageInput({
  onSendMessage,
  onSendImage,
  replyToName,
  onCancelReply,
}: MessageInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    hapticLight();
    onSendMessage(trimmed);
    setText('');
  };

  const handlePickImage = async () => {
    hapticLight();
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant photo library access.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        onSendImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error('[MESSAGES] image pick error:', err);
    }
  };

  const handleCamera = async () => {
    hapticLight();
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera access.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        onSendImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error('[MESSAGES] camera error:', err);
    }
  };

  return (
    <View style={styles.container}>
      {replyToName && (
        <View style={styles.replyBar}>
          <View style={styles.replyIndicator} />
          <Text style={styles.replyText} numberOfLines={1}>
            Replying to {replyToName}
          </Text>
          <TouchableOpacity onPress={onCancelReply} style={styles.cancelReply}>
            <Text style={styles.cancelReplyText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputRow}>
        <TouchableOpacity onPress={handleCamera} style={styles.actionBtn}>
          <Text style={styles.actionIcon}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePickImage} style={styles.actionBtn}>
          <Text style={styles.actionIcon}>🖼</Text>
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Message…"
          placeholderTextColor="#737373"
          value={text}
          onChangeText={setText}
          multiline
          maxLength={5000}
          returnKeyType="default"
          blurOnSubmit={false}
        />

        {text.trim().length > 0 && (
          <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#DBDBDB',
    paddingBottom: 8,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8F8F8',
  },
  replyIndicator: {
    width: 3,
    height: 24,
    backgroundColor: '#0095F6',
    borderRadius: 1.5,
    marginRight: 8,
  },
  replyText: {
    flex: 1,
    fontSize: 13,
    color: '#737373',
  },
  cancelReply: {
    padding: 4,
  },
  cancelReplyText: {
    fontSize: 14,
    color: '#737373',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',

    paddingHorizontal: 8,
    paddingTop: 6,
    gap: 4,
  },
  actionBtn: {
    padding: 6,
  },
  actionIcon: {
    fontSize: 22,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    backgroundColor: '#EFEFEF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 15,
    color: '#000000',
  },
  sendBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0095F6',
  },
});
