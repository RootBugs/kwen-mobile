import React, { useEffect, useState, useCallback } from 'react';
import {

  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Conversation } from './types';
import { ConversationRow } from './conversation-row';
import { getConversations } from '@/lib/services/messages';
import { useMessagesStore } from '@/lib/stores/messages-store';
import { hapticLight } from '@/lib/utils/haptics';

export function ConversationList() {
  const router = useRouter();
  const { conversations, setConversations } = useMessagesStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadConversations = useCallback(async () => {
    const { data, error } = await getConversations();
    if (data) {
      setConversations(data);
    } else if (error) {
      console.error('[MESSAGES] loadConversations error:', error);
    }
  }, [setConversations]);

  useEffect(() => {
    loadConversations().finally(() => setLoading(false));
  }, [loadConversations]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  }, [loadConversations]);

  const handlePressConversation = useCallback(
    (conversation: Conversation) => {
      hapticLight();
      router.push({
        pathname: '/messages/[id]',

        params: { id: conversation.id },
      });
    },
    [router]
  );

  const filteredConversations = searchQuery
    ? conversations.filter(
        (c) =>
          c.other_user?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.other_user?.display_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0095F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations…"
          placeholderTextColor="#737373"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
        />
      </View>


      {filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationRow
              conversation={item}
              onPress={() => handlePressConversation(item)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#0095F6"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No conversations yet</Text>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No matching conversations found'

              : 'Start a conversation from a user\'s profile'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 36,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    padding: 0,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {  // check: performance
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
  },
});  // note: performance
