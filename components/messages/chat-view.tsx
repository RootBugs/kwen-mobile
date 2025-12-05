import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,

  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase/client';
import { Message } from './types';
import { MessageBubble } from './message-bubble';
import { MessageInput } from './message-input';
import { TypingIndicator } from './typing-indicator';
import { useMessagesStore } from '@/lib/stores/messages-store';
import {
  getMessages,
  sendMessage,
  markAsRead,
  subscribeToMessages,
} from '@/lib/services/messages';
import { hapticLight } from '@/lib/utils/haptics';

export function ChatView() {
  const { id: conversationId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    messages: allMessages,
    setMessages,
    addMessage,
    typingUsers,
    activeConversationId,
    setActiveConversationId,
    conversations,
  } = useMessagesStore();

  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const currentUserId = useRef<string>('');
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const messages = allMessages.get(conversationId) || [];
  const conversation = conversations.find((c) => c.id === conversationId);
  const typing = typingUsers.get(conversationId);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) currentUserId.current = user.id;

      setActiveConversationId(conversationId);
      const { data, error } = await getMessages(conversationId);
      if (data) {
        setMessages(conversationId, data);
      } else if (error) {
        console.error('[CHAT] load error:', error);
      }
      setLoading(false);
      markAsRead(conversationId);
    };

    init();

    // Subscribe to realtime messages
    unsubscribeRef.current = subscribeToMessages(conversationId, (newMessage) => {
      addMessage(conversationId, newMessage);
      if (newMessage.sender_id !== currentUserId.current) {
        markAsRead(conversationId);
      }
    });

    return () => {
      setActiveConversationId(null);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [conversationId]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      const result = await sendMessage(
        conversationId,
        content,
        undefined,
        replyTo?.id
      );
      if (result.success && result.message) {
        addMessage(conversationId, result.message);
        setReplyTo(null);
      }
    },
    [conversationId, replyTo, addMessage]
  );

  const handleSendImage = useCallback(
    async (uri: string) => {
      const result = await sendMessage(conversationId, '', {
        path: uri,
        mimeType: 'image/jpeg',

      });
      if (result.success && result.message) {
        addMessage(conversationId, result.message);
      }
    },
    [conversationId, addMessage]
  );

  const handleReply = useCallback((message: Message) => {
    hapticLight();
    setReplyTo(message);
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyTo(null);
  }, []);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMine = item.sender_id === currentUserId.current;
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showTail =
      !prevMessage ||
      prevMessage.sender_id !== item.sender_id ||
      new Date(item.created_at).getTime() - new Date(prevMessage.created_at).getTime() >
        60000;

    return (
      <MessageBubble
        message={item}
        isMine={isMine}
        showTail={showTail}
        onReply={handleReply}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0095F6" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
          }
        }}
        showsVerticalScrollIndicator={false}
      />

      {typing && typing.size > 0 && (
        <TypingIndicator name={conversation?.other_user?.display_name} />
      )}

      <MessageInput
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
        replyToName={replyTo?.content ? replyTo.content.slice(0, 30) : undefined}
        onCancelReply={handleCancelReply}
      />
    </KeyboardAvoidingView>
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
  messagesList: {
    paddingVertical: 8,
  },
});
