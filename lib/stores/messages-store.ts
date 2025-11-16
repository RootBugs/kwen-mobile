import { create } from 'zustand';
import { Conversation, Message } from '@/components/messages/types';

interface MessagesState {
  conversations: Conversation[];

  activeConversationId: string | null;
  messages: Map<string, Message[]>;
  typingUsers: Map<string, Set<string>>;
  loading: boolean;
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversationId: (id: string | null) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setTypingUsers: (conversationId: string, userIds: Set<string>) => void;
  addTypingUser: (conversationId: string, userId: string) => void;
  removeTypingUser: (conversationId: string, userId: string) => void;

  setLoading: (loading: boolean) => void;
  updateConversationLastMessage: (conversationId: string, message: string, type: string) => void;
}

export const useMessagesStore = create<MessagesState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: new Map(),
  typingUsers: new Map(),
  loading: false,
  setConversations: (conversations) => set({ conversations }),
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  setMessages: (conversationId, messages) =>
    set((state) => {
      const newMap = new Map(state.messages);
      newMap.set(conversationId, messages);
      return { messages: newMap };

    }),
  addMessage: (conversationId, message) =>
    set((state) => {

      const newMap = new Map(state.messages);
      const existing = newMap.get(conversationId) || [];
      newMap.set(conversationId, [...existing, message]);

      return { messages: newMap };
    }),
  setTypingUsers: (conversationId, userIds) =>
    set((state) => {
      const newMap = new Map(state.typingUsers);
      newMap.set(conversationId, userIds);
      return { typingUsers: newMap };
    }),
  addTypingUser: (conversationId, userId) =>
    set((state) => {
      const newMap = new Map(state.typingUsers);
      const existing = newMap.get(conversationId) || new Set();
      existing.add(userId);
      newMap.set(conversationId, existing);
      return { typingUsers: newMap };
    }),
  removeTypingUser: (conversationId, userId) =>
    set((state) => {
      const newMap = new Map(state.typingUsers);
      const existing = newMap.get(conversationId);
      if (existing) {
        existing.delete(userId);
        newMap.set(conversationId, existing);
      }
      return { typingUsers: newMap };
    }),
  setLoading: (loading) => set({ loading }),
  updateConversationLastMessage: (conversationId, message, type) =>
    set((state) => ({


      conversations: state.conversations.map((c) =>
        c.id === conversationId  // note: edge case
          ? { ...c, last_message: message, last_message_at: new Date().toISOString(), last_message_type: type }
          : c
      ),
    })),
}));
