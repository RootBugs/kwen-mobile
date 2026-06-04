import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface MessageInputProps {
  onSend: (text: string) => void;
  onImagePick: () => void;
  onVoiceRecord: () => void;
  replyTo?: { id: string; sender_name: string; content: string } | null;
  onCancelReply?: () => void;
  disabled?: boolean;
}

export function MessageInput({
  onSend,
  onImagePick,
  onVoiceRecord,
  replyTo,
  onCancelReply,
  disabled,
}: MessageInputProps) {
  const [text, setText] = useState('');

  const handleSend = useCallback(() => {
    if (!text.trim() || disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend(text.trim());
    setText('');
  }, [text, onSend, disabled]);

  return (
    <View style={styles.container}>
      {/* Reply preview */}
      {replyTo && (
        <View style={styles.replyBar}>
          <View style={styles.replyInfo}>
            <Text style={styles.replyLabel}>Replying to {replyTo.sender_name}</Text>
            <Text style={styles.replyText} numberOfLines={1}>
              {replyTo.content || 'Media'}
            </Text>
          </View>
          <TouchableOpacity onPress={onCancelReply} style={styles.cancelReply}>
            <Ionicons name="close" size={18} color="#737373" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputRow}>
        {/* Image picker */}
        <TouchableOpacity style={styles.actionBtn} onPress={onImagePick}>
          <Ionicons name="image-outline" size={22} color="#737373" />
        </TouchableOpacity>

        {/* Text input */}
        <TextInput
          style={styles.input}
          placeholder="Message..."
          placeholderTextColor="#737373"
          value={text}
          onChangeText={setText}
          multiline
          maxLength={5000}
          editable={!disabled}
        />

        {/* Send or Voice */}
        {text.trim().length > 0 ? (
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#007AFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionBtn} onPress={onVoiceRecord}>
            <Ionicons name="mic-outline" size={22} color="#737373" />
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
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
  },
  replyInfo: {
    flex: 1,
  },
  replyLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#007AFF',
  },
  replyText: {
    fontSize: 12,
    color: '#737373',
    marginTop: 1,
  },
  cancelReply: {
    padding: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingTop: 8,
    gap: 4,
  },
  actionBtn: {
    padding: 6,
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
    padding: 6,
  },
});
