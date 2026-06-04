import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import type { Profile } from '@/components/feed/types';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_mine: boolean;
  sender?: Profile | null;
  message_type: 'text' | 'image' | 'voice' | 'mixed' | 'story_reply';
  media_url?: string | null;
  thumbnail_url?: string | null;
  duration?: number | null;
  reply_to?: {
    id: string;
    content: string;
    sender_name: string;
    message_type: string;
    media_url?: string | null;
  } | null;
  reactions?: Record<string, { count: number; user_ids: string[] }>;
  my_reaction?: string | null;
  status?: 'sending' | 'sent' | 'failed';
  conversation_id?: string;
}

export interface Conversation {
  id: string;
  other_user: Profile | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  has_messages: boolean;
}

interface MessagesState {
  conversations: Conversation[];
  messages: Message[];
  selectedConversationId: string | null;
  loading: boolean;
  loadingMessages: boolean;
  typingUserIds: Set<string>;
  totalUnread: number;

  // Actions
  loadConversations: () => Promise<void>;
  selectConversation: (id: string | null) => void;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, options?: {
    mediaUrl?: string;
    mimeType?: string;
    duration?: number;
    replyToId?: string;
  }) => Promise<boolean>;
  markAsRead: (conversationId: string) => Promise<void>;
  subscribeToMessages: (conversationId: string) => () => void;
  addMessage: (message: Message) => void;
  updateMessageStatus: (tempId: string, updates: Partial<Message>) => void;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  conversations: [],
  messages: [],
  selectedConversationId: null,
  loading: false,
  loadingMessages: false,
  typingUserIds: new Set(),
  totalUnread: 0,

  loadConversations: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('conversation_id, unread_count')
        .eq('user_id', user.id);

      if (!participants || participants.length === 0) {
        set({ conversations: [], loading: false, totalUnread: 0 });
        return;
      }

      const convIds = participants.map((p) => p.conversation_id);
      const unreadMap = new Map(participants.map((p) => [p.conversation_id, p.unread_count || 0]));

      const { data: convData } = await supabase
        .from('conversations')
        .select('id, updated_at')
        .in('id', convIds)
        .order('updated_at', { ascending: false });

      if (!convData) {
        set({ conversations: [], loading: false });
        return;
      }

      // Get other user profiles
      const { data: allParticipants } = await supabase
        .from('conversation_participants')
        .select('conversation_id, user_id, profiles(id, username, display_name, avatar_url, is_verified)')
        .in('conversation_id', convIds)
        .neq('user_id', user.id);

      const profileMap = new Map<string, Profile>();
      for (const p of allParticipants || []) {
        if (p.profiles) {
          profileMap.set(p.conversation_id, p.profiles as Profile);
        }
      }

      // Get last messages
      const conversations: Conversation[] = [];
      for (const conv of convData) {
        const { data: lastMsg } = await supabase
          .from('messages')
          .select('content, message_type, sender_id, created_at')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        const otherUser = profileMap.get(conv.id) || null;
        const unread = unreadMap.get(conv.id) || 0;

        let lastMessageText: string | null = null;
        if (lastMsg) {
          if (lastMsg.message_type === 'image') lastMessageText = '📷 Photo';
          else if (lastMsg.message_type === 'voice') lastMessageText = '🎤 Voice message';
          else lastMessageText = lastMsg.content;
        }

        conversations.push({
          id: conv.id,
          other_user: otherUser,
          last_message: lastMessageText,
          last_message_at: lastMsg?.created_at || conv.updated_at,
          unread_count: unread,
          has_messages: !!lastMsg,
        });
      }

      const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);
      set({ conversations, totalUnread, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  selectConversation: (id) => {
    set({ selectedConversationId: id, messages: [] });
    if (id) {
      get().loadMessages(id);
      get().markAsRead(id);
    }
  },

  loadMessages: async (conversationId) => {
    set({ loadingMessages: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('messages')
        .select('id, content, sender_id, created_at, message_type, media_url, thumbnail_url, mime_type, reply_to_message_id, story_id')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (!data) {
        set({ messages: [], loadingMessages: false });
        return;
      }

      const senderIds = [...new Set(data.map((m) => m.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', senderIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      const messages: Message[] = data.map((m) => ({
        id: m.id,
        content: m.content,
        sender_id: m.sender_id,
        created_at: m.created_at,
        is_mine: m.sender_id === user.id,
        sender: profileMap.get(m.sender_id) || null,
        message_type: (m.message_type as Message['message_type']) || 'text',
        media_url: m.media_url,
        thumbnail_url: m.thumbnail_url,
        status: 'sent' as const,
        conversation_id: conversationId,
      }));

      set({ messages, loadingMessages: false });
    } catch {
      set({ loadingMessages: false });
    }
  },

  sendMessage: async (conversationId, content, options) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const messageType = options?.duration ? 'voice' : options?.mediaUrl ? (content.trim() ? 'mixed' : 'image') : 'text';

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim() || (options?.duration ? '' : options?.mediaUrl ? 'Photo' : ''),
          message_type: messageType,
          media_url: options?.mediaUrl || null,
          mime_type: options?.mimeType || null,
          reply_to_message_id: options?.replyToId || null,
        })
        .select()
        .single();

      if (error || !data) return false;

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return true;
    } catch {
      return false;
    }
  },

  markAsRead: async (conversationId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('conversation_participants')
        .update({ unread_count: 0 })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? { ...c, unread_count: 0 } : c
        ),
        totalUnread: Math.max(0, state.totalUnread - (get().conversations.find((c) => c.id === conversationId)?.unread_count || 0)),
      }));
    } catch {
      // Silent fail
    }
  },

  subscribeToMessages: (conversationId) => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const msg = payload.new as Record<string, unknown>;
          const message: Message = {
            id: msg.id as string,
            content: msg.content as string,
            sender_id: msg.sender_id as string,
            created_at: msg.created_at as string,
            is_mine: false,
            message_type: (msg.message_type as Message['message_type']) || 'text',
            media_url: msg.media_url as string | null,
            thumbnail_url: msg.thumbnail_url as string | null,
            status: 'sent',
            conversation_id: conversationId,
          };
          get().addMessage(message);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
      conversations: state.conversations.map((c) =>
        c.id === message.conversation_id
          ? {
              ...c,
              last_message: message.message_type === 'image' ? '📷 Photo' : message.message_type === 'voice' ? '🎤 Voice message' : message.content,
              last_message_at: message.created_at,
              has_messages: true,
            }
          : c
      ),
    }));
  },

  updateMessageStatus: (tempId, updates) => {
    set((state) => ({
      messages: state.messages.map((m) => (m.id === tempId ? { ...m, ...updates } : m)),
    }));
  },
}));
