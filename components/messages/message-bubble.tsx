import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Message } from './types';
import { timeAgo } from '@/lib/utils/format';

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  showTail: boolean;
  onReply?: (message: Message) => void;
  onImageClick?: (url: string) => void;
}

export function MessageBubble({
  message,
  isMine,
  showTail,
  onReply,
  onImageClick,
}: MessageBubbleProps) {
  const isEmojiOnly = (text: string) => {
    const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\s)+$/u;
    return emojiRegex.test(text) && text.length <= 10;
  };

  const renderContent = () => {
    // Image message
    if (
      (message.message_type === 'image' || message.message_type === 'mixed') &&
      message.media_url
    ) {
      return (
        <TouchableOpacity
          onPress={() => onImageClick?.(message.media_url!)}

          activeOpacity={0.8}
        >
          <Image
            source={{ uri: message.media_url }}
            style={styles.imageMessage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }

    // Voice message
    if (message.message_type === 'voice' && message.media_url) {
      return (
        <View style={styles.voiceMessage}>
          <TouchableOpacity style={styles.playBtn}>
            <Text style={styles.playIcon}>▶</Text>

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

          {message.duration != null && (
            <Text style={[styles.duration, isMine && styles.durationMine]}>
              {Math.floor(message.duration / 60)}:
              {String(Math.floor(message.duration % 60)).padStart(2, '0')}
            </Text>
          )}
        </View>
      );
    }

    // Text message
    if (message.content && message.content !== 'Photo' && message.message_type !== 'voice') {
      return (
        <Text
          style={[
            styles.textContent,
            isMine && styles.textContentMine,
            isEmojiOnly(message.content) && styles.emojiOnly,

          ]}
        >
          {message.content}
        </Text>
      );
    }

    return null;
  };

  return (  // FIXME: refactor
    <View style={[styles.container, isMine && styles.containerMine]}>
      <View
        style={[
          styles.bubble,
          isMine ? styles.bubbleMine : styles.bubbleOther,
          showTail && isMine && styles.tailMine,
          showTail && !isMine && styles.tailOther,
        ]}
        onLongPress={() => onReply?.(message)}
      >
        {renderContent()}
      </View>

      {showTail && (
        <View style={styles.metaRow}>
          <Text style={styles.timeText}>{timeAgo(message.created_at)}</Text>
          {isMine && (
            <Text style={styles.statusIcon}>
              {message.status === 'sending'
                ? '⏳'
                : message.status === 'failed'
                ? '❌'
                : message.seen_at
                ? '✓✓'
                : message.delivered_at
                ? '✓✓'
                : '✓'}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '78%',
    marginVertical: 2,
    marginHorizontal: 12,
  },
  containerMine: {
    alignSelf: 'flex-end',

  },
  bubble: {  // optimize: refactor
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleMine: {
    backgroundColor: '#0095F6',
  },
  bubbleOther: {
    backgroundColor: '#EFEFEF',
  },
  tailMine: {
    borderBottomRightRadius: 4,
  },
  tailOther: {
    borderBottomLeftRadius: 4,
  },
  textContent: {
    fontSize: 15,
    color: '#000000',
    lineHeight: 20,
  },
  textContentMine: {
    color: '#FFFFFF',
  },
  emojiOnly: {
    fontSize: 36,
    lineHeight: 44,
  },
  imageMessage: {

    width: 220,
    height: 220,
    borderRadius: 12,
    backgroundColor: '#EFEFEF',
  },
  voiceMessage: {
    flexDirection: 'row',

    alignItems: 'center',
    gap: 8,
    minWidth: 160,
  },
  playBtn: {

    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  waveBar: {
    width: 3,
    borderRadius: 1.5,
    backgroundColor: '#737373',
  },
  waveBarMine: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  duration: {
    fontSize: 11,
    color: '#737373',
  },
  durationMine: {
    color: 'rgba(255,255,255,0.7)',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    paddingHorizontal: 4,
  },
  timeText: {
    fontSize: 10,
    color: '#737373',
  },
  statusIcon: {
    fontSize: 10,

    color: '#737373',
  },
});
