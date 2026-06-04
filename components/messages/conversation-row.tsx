import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from '@/components/ui/avatar';
import { timeAgo } from '@/lib/utils/format';
import type { Conversation } from '@/lib/stores/messages-store';

interface ConversationRowProps {
  conversation: Conversation;
  onPress: () => void;
}

export function ConversationRow({ conversation, onPress }: ConversationRowProps) {
  const { other_user, last_message, last_message_at, unread_count } = conversation;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Avatar src={other_user?.avatar_url} name={other_user?.display_name} size="lg" />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {other_user?.display_name || 'Unknown'}
          </Text>
          {last_message_at && (
            <Text style={styles.time}>{timeAgo(last_message_at)}</Text>
          )}
        </View>
        <View style={styles.bottomRow}>
          <Text
            style={[styles.lastMessage, unread_count > 0 && styles.lastMessageUnread]}
            numberOfLines={1}
          >
            {last_message || 'Start a conversation'}
          </Text>
          {unread_count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unread_count > 99 ? '99+' : unread_count}</Text>
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
    gap: 12,
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
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: '#737373',
    marginLeft: 8,
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
  },
  lastMessageUnread: {
    fontWeight: '600',
    color: '#000000',
  },
  badge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
