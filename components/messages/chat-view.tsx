import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useMessagesStore } from '@/lib/stores/messages-store';
import { MessageBubble } from './message-bubble';
import { MessageInput } from './message-input';
import { Avatar } from '@/components/ui/avatar';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

export function ChatView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const flatListRef = useRef<FlatList>(null);
  const [replyTo, setReplyTo] = useState<{ id: string; sender_name: string; content: string } | null>(null);

  const messages = useMessagesStore((s) => s.messages);
  const loadingMessages = useMessagesStore((s) => s.loadingMessages);
  const conversations = useMessagesStore((s) => s.conversations);
  const loadMessages = useMessagesStore((s) => s.loadMessages);
  const sendMessage = useMessagesStore((s) => s.sendMessage);
  const markAsRead = useMessagesStore((s) => s.markAsRead);
  const subscribeToMessages = useMessagesStore((s) => s.subscribeToMessages);

  const conversation = conversations.find((c) => c.id === id);

  useEffect(() => {
    if (id) {
      loadMessages(id);
      markAsRead(id);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribeToMessages(id);
    return unsubscribe;
  }, [id]);

  const handleSend = useCallback(async (text: string) => {
    if (!id) return;
    const success = await sendMessage(id, text, { replyToId: replyTo?.id });
    if (success) {
      setReplyTo(null);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [id, sendMessage, replyTo]);

  const handleImagePick = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement image picker
  }, []);

  const handleVoiceRecord = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement voice recording
  }, []);

  const handleReply = useCallback((msg: any) => {
    setReplyTo({
      id: msg.id,
      sender_name: msg.sender?.display_name || 'Unknown',
      content: msg.content || 'Media',
    });
  }, []);

  const renderMessage = useCallback(({ item, index }: { item: any; index: number }) => {
    const prevMsg = index > 0 ? messages[index - 1] : null;
    const showTail = !prevMsg || prevMsg.sender_id !== item.sender_id;
    return <MessageBubble message={item} showTail={showTail} />;
  }, [messages]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Avatar src={conversation?.other_user?.avatar_url} name={conversation?.other_user?.display_name} size="sm" />
        <Text style={styles.headerName} numberOfLines={1}>
          {conversation?.other_user?.display_name || 'Messages'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Messages */}
      {loadingMessages ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#737373" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        onImagePick={handleImagePick}
        onVoiceRecord={handleVoiceRecord}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
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
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
    gap: 8,
  },
  backBtn: {
    padding: 4,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  headerSpacer: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
  },
});
