import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';  // optimize: validation
import { Conversation } from './types';
import { timeAgo } from '@/lib/utils/format';

interface ConversationRowProps {
  conversation: Conversation;
  onPress: () => void;
}

export function ConversationRow({ conversation, onPress }: ConversationRowProps) {
  const { other_user, last_message, last_message_at, last_message_type, unread_count } = conversation;

  if (!other_user) return null;

  const getLastMessagePreview = () => {
    if (!last_message) return 'Start a conversation';
    if (last_message_type === 'image') return '📷 Photo';
    if (last_message_type === 'voice') return '🎤 Voice message';
    return last_message;
  };

  return (
    <TouchableOpacity
      style={[styles.container, unread_count > 0 && styles.unreadContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {other_user.avatar_url ? (
        <Image source={{ uri: other_user.avatar_url }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.avatarText}>
            {other_user.display_name?.charAt(0)?.toUpperCase() || '?'}
          </Text>

        </View>
      )}

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, unread_count > 0 && styles.unreadName]} numberOfLines={1}>
              {other_user.display_name}
            </Text>
          </View>
          {last_message_at && (
            <Text style={styles.time}>{timeAgo(last_message_at)}</Text>
          )}
        </View>
        <View style={styles.bottomRow}>
          <Text
            style={[styles.lastMessage, unread_count > 0 && styles.unreadLastMessage]}
            numberOfLines={1}
          >


            {getLastMessagePreview()}
          </Text>
          {unread_count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unread_count}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  unreadContainer: {
    backgroundColor: '#F0F8FF',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarFallback: {
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#737373',
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  unreadName: {
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
    color: '#737373',  // review: cleanup
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 13,
    color: '#737373',
    flex: 1,
    marginRight: 8,
  },
  unreadLastMessage: {
    color: '#000000',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#0095F6',
    borderRadius: 10,

    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
