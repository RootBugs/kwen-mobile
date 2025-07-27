import { supabase } from '@/lib/supabase/client';
import { Message, Conversation, MediaMetadata } from '@/components/messages/types';

export async function getConversations(): Promise<{ data: Conversation[] | null; error?: string }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'Not authenticated' };

    const { data: participations, error: pError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id);

    if (pError || !participations || participations.length === 0) {
      return { data: [] };
    }

    const convIds = participations.map((p) => p.conversation_id);

    const { data: conversations, error: cError } = await supabase
      .from('conversations')
      .select(
        `
        id,
        user_ids,
        created_at,
        updated_at,
        last_message,
        last_message_at,
        last_message_type,
        conversation_participants!inner(user_id, profiles(id, username, display_name, avatar_url))
      `
      )
      .in('id', convIds)
      .order('updated_at', { ascending: false });

    if (cError) return { data: null, error: cError.message };

    const mapped: Conversation[] = (conversations || []).map((conv: any) => {
      const otherParticipant = conv.conversation_participants?.find(
        (p: any) => p.user_id !== user.id
      );
      const otherProfile = otherParticipant?.profiles;

      return {
        id: conv.id,
        user_ids: conv.user_ids || [],
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        last_message: conv.last_message || '',
        last_message_at: conv.last_message_at,
        last_message_type: conv.last_message_type,
        unread_count: 0,
        other_user: otherProfile
          ? {
              id: otherProfile.id,
              username: otherProfile.username,
              display_name: otherProfile.display_name || otherProfile.username,
              avatar_url: otherProfile.avatar_url,
            }
          : null,
      };
    });

    return { data: mapped };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to load conversations' };
  }
}

export async function getMessages(
  conversationId: string,
  limit: number = 30,
  before?: string
): Promise<{ data: Message[] | null; error?: string }> {
  try {
    let query = supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (before) {
      query = query.lt('created_at', before);
    }

    const { data, error } = await query;
    if (error) return { data: null, error: error.message };

    const mapped: Message[] = (data || []).map((m: any) => ({
      id: m.id,
      conversation_id: m.conversation_id,
      sender_id: m.sender_id,
      content: m.content || '',
      message_type: m.message_type || 'text',
      media_url: m.media_url,

      thumbnail_url: m.thumbnail_url,
      duration: m.duration || null,
      reply_to_message_id: m.reply_to_message_id,
      story_id: m.story_id,
      status: m.status || 'sent',
      created_at: m.created_at,
      delivered_at: m.delivered_at,
      seen_at: m.seen_at,
      reactions: m.reactions || [],
      reply_to: null,
    }));

    return { data: mapped.reverse() };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to load messages' };
  }
}


export async function sendMessage(
  conversationId: string,
  content: string,
  media?: MediaMetadata,
  replyToMessageId?: string,
  storyId?: string,
  voiceDuration?: number
): Promise<{ success: boolean; message?: Message; error?: string }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const cleanContent = content.trim().slice(0, 5000);
    if (!cleanContent && !media?.path && !storyId) {
      return { success: false, error: 'Message cannot be empty' };
    }

    let messageType: string;
    if (storyId) {
      messageType = 'story_reply';
    } else if (voiceDuration != null && media?.path) {
      messageType = 'voice';
    } else if (media?.path) {
      messageType = cleanContent ? 'mixed' : 'image';
    } else {
      messageType = 'text';
    }

    const insertData: Record<string, any> = {
      conversation_id: conversationId,
      sender_id: user.id,
      content: cleanContent || (voiceDuration != null ? '' : media?.path ? 'Photo' : storyId ? '' : ''),
      message_type: messageType,
      media_url: media?.path || null,
      thumbnail_url: media?.thumbnailPath || null,
      mime_type: media?.mimeType || null,
      file_size: media?.fileSize || null,
      media_width: media?.width || null,
      media_height: media?.height || null,
    };

    if (replyToMessageId) {
      insertData.reply_to_message_id = replyToMessageId;
    }

    if (storyId) {
      insertData.story_id = storyId;
      const { data: storyData } = await supabase
        .from('stories')
        .select('media_url')
        .eq('id', storyId)
        .single();
      if (storyData?.media_url) {
        insertData.media_url = storyData.media_url;
      }
    }

    let { data: message, error } = await supabase
      .from('messages')
      .insert(insertData)
      .select()
      .single();

    // Fallback: voice message_type not in CHECK constraint
    if (error && insertData.message_type === 'voice') {
      insertData.message_type = 'mixed';
      const retry = await supabase
        .from('messages')
        .insert(insertData)
        .select()
        .single();
      message = retry.data;
      error = retry.error;
    }

    if (error) return { success: false, error: 'Failed to send message' };

    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    const mapped: Message = {
      id: message.id,
      conversation_id: message.conversation_id,
      sender_id: message.sender_id,
      content: message.content || '',
      message_type: message.message_type || 'text',
      media_url: message.media_url,
      thumbnail_url: message.thumbnail_url,
      duration: message.duration || null,
      reply_to_message_id: message.reply_to_message_id,
      story_id: message.story_id,
      status: 'sent',
      created_at: message.created_at,
    };

    return { success: true, message: mapped };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to send message' };
  }
}

export async function getOrCreateConversation(
  otherUserId: string
): Promise<{ success: boolean; conversationId?: string; error?: string }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };
    if (user.id === otherUserId) return { success: false, error: 'Cannot message yourself' };

    // Try RPC first
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      'get_or_create_conversation',
      { p_user1: user.id, p_user2: otherUserId }
    );

    if (!rpcError && rpcResult) {
      return { success: true, conversationId: rpcResult };
    }

    // Fallback: client-side
    const { data: myParticipations } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id);

    if (myParticipations && myParticipations.length > 0) {
      const convIds = myParticipations.map((p) => p.conversation_id);
      const { data: existingConv } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', otherUserId)
        .in('conversation_id', convIds)
        .limit(1);

      if (existingConv && existingConv.length > 0) {
        return { success: true, conversationId: existingConv[0].conversation_id };
      }
    }

    // Create new conversation
    const { data: newConv, error: createError } = await supabase
      .from('conversations')
      .insert({ user_ids: [user.id, otherUserId] })
      .select('id')
      .single();

    if (createError || !newConv) {
      return { success: false, error: 'Failed to create conversation' };
    }

    // Add participants
    await supabase.from('conversation_participants').insert([
      { conversation_id: newConv.id, user_id: user.id },
      { conversation_id: newConv.id, user_id: otherUserId },
    ]);

    return { success: true, conversationId: newConv.id };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to get or create conversation' };
  }
}

export async function markAsRead(conversationId: string): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('messages')
      .update({ status: 'read', seen_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .eq('status', 'delivered');
  } catch (err) {
    console.error('[MESSAGES] markAsRead error:', err);
  }
}

export function subscribeToMessages(
  conversationId: string,
  onNewMessage: (message: Message) => void
) {
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
        const m = payload.new as any;
        onNewMessage({

          id: m.id,
          conversation_id: m.conversation_id,
          sender_id: m.sender_id,
          content: m.content || '',
          message_type: m.message_type || 'text',
          media_url: m.media_url,
          thumbnail_url: m.thumbnail_url,
          duration: m.duration || null,
          reply_to_message_id: m.reply_to_message_id,
          story_id: m.story_id,
          status: m.status || 'sent',
          created_at: m.created_at,
          delivered_at: m.delivered_at,
          seen_at: m.seen_at,
          reactions: [],
          reply_to: null,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
