import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { timeAgo } from '@/lib/utils/format';
import type { Message } from '@/lib/stores/messages-store';

interface MessageBubbleProps {
  message: Message;
  showTail?: boolean;
}

export function MessageBubble({ message, showTail = true }: MessageBubbleProps) {
  const isMine = message.is_mine;
  const isImage = message.message_type === 'image' || message.message_type === 'mixed';
  const isVoice = message.message_type === 'voice';

  return (
    <View style={[styles.container, isMine && styles.containerMine]}>
      <View style={[styles.bubble, isMine && styles.bubbleMine, isImage && styles.bubbleImage]}>
        {/* Reply preview */}
        {message.reply_to && (
          <View style={[styles.replyPreview, isMine && styles.replyPreviewMine]}>
            <Text style={styles.replySender}>{message.reply_to.sender_name}</Text>
            <Text style={styles.replyContent} numberOfLines={1}>
              {message.reply_to.content || 'Media'}
            </Text>
          </View>
        )}

        {/* Image */}
        {isImage && message.media_url && (
          <Image
            source={{ uri: message.media_url }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}

        {/* Voice message */}
        {isVoice && (
          <View style={styles.voiceContainer}>
            <TouchableOpacity style={styles.playBtn}>
              <Ionicons name="play" size={18} color={isMine ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
            <View style={styles.waveform}>
              {Array.from({ length: 20 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveBar,
                    { height: Math.random() * 16 + 4 },
                    isMine && styles.waveBarMine,
                  ]}
                />
              ))}
            </View>
            {message.duration && (
              <Text style={[styles.duration, isMine && styles.durationMine]}>
                {Math.floor(message.duration / 60)}:{(message.duration % 60).toString().padStart(2, '0')}
              </Text>
            )}
          </View>
        )}

        {/* Text content */}
        {message.content && (!isImage || message.message_type === 'mixed') && (
          <Text style={[styles.text, isMine && styles.textMine]}>
            {message.content}
          </Text>
        )}

        {/* Time */}
        <Text style={[styles.time, isMine && styles.timeMine]}>
          {timeAgo(message.created_at)}
        </Text>
      </View>

      {/* Status indicator for sent messages */}
      {isMine && message.status === 'sent' && (
        <Ionicons name="checkmark-done" size={14} color="#737373" style={styles.statusIcon} />
      )}
      {isMine && message.status === 'failed' && (
        <Ionicons name="alert-circle" size={14} color="#FF3B30" style={styles.statusIcon} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 2,
    marginHorizontal: 12,
    justifyContent: 'flex-start',
  },
  containerMine: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    backgroundColor: '#EFEFEF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  bubbleMine: {
    backgroundColor: '#007AFF',
  },
  bubbleImage: {
    padding: 2,
    overflow: 'hidden',
  },
  replyPreview: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 4,
  },
  replyPreviewMine: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  replySender: {
    fontSize: 11,
    fontWeight: '600',
    color: '#737373',
  },
  replyContent: {
    fontSize: 11,
    color: '#737373',
    marginTop: 1,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    minWidth: 160,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  waveBar: {
    width: 2,
    backgroundColor: '#737373',
    borderRadius: 1,
  },
  waveBarMine: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  duration: {
    fontSize: 11,
    color: '#737373',
  },
  durationMine: {
    color: 'rgba(255,255,255,0.8)',
  },
  text: {
    fontSize: 15,
    color: '#000000',
    lineHeight: 20,
  },
  textMine: {
    color: '#FFFFFF',
  },
  time: {
    fontSize: 10,
    color: '#737373',
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  timeMine: {
    color: 'rgba(255,255,255,0.7)',
  },
  statusIcon: {
    alignSelf: 'flex-end',
    marginRight: 4,
    marginBottom: 2,
  },
});
