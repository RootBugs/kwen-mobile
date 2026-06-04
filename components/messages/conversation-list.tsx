import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useMessagesStore } from '@/lib/stores/messages-store';
import { ConversationRow } from './conversation-row';
import { router } from 'expo-router';

export function ConversationList() {
  const conversations = useMessagesStore((s) => s.conversations);
  const loading = useMessagesStore((s) => s.loading);
  const loadConversations = useMessagesStore((s) => s.loadConversations);

  useEffect(() => {
    loadConversations();
  }, []);

  if (loading && conversations.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#737373" />
      </View>
    );
  }

  if (conversations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No messages yet</Text>
        <Text style={styles.emptySubtitle}>Start a conversation with someone</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ConversationRow
          conversation={item}
          onPress={() => router.push(`/messages/${item.id}`)}
        />
      )}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
  },
});
