import { supabase } from '@/lib/supabase/client';

export interface MediaMetadata {
  path: string;
  thumbnailPath?: string;
  mimeType?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  duration?: number;
}

export async function getSignedUrl(storagePath: string): Promise<{ url?: string; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };
    if (!storagePath || typeof storagePath !== 'string') return { error: 'Invalid path' };
    if (storagePath.startsWith('http')) return { url: storagePath };

    const { data, error } = await supabase.storage
      .from('messages')
      .createSignedUrl(storagePath, 900);

    if (error || !data?.signedUrl) return { error: 'Failed to generate signed URL' };
    return { url: data.signedUrl };
  } catch {
    return { error: 'Failed to generate signed URL' };
  }
}

export async function sendMessage(
  conversationId: string,
  content: string,
  media?: MediaMetadata,
  replyToMessageId?: string,
  storyId?: string,
  voiceDuration?: number
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const cleanContent = content.trim().slice(0, 5000);
    if (!cleanContent && !media?.path && !storyId) return { error: 'Message cannot be empty' };

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

    const messageContent = cleanContent || (voiceDuration != null ? '' : media?.path ? 'Photo' : storyId ? '' : '');

    const insertData: Record<string, unknown> = {
      conversation_id: conversationId,
      sender_id: user.id,
      content: messageContent,
      message_type: messageType,
      media_url: media?.path || null,
      thumbnail_url: media?.thumbnailPath || null,
      mime_type: media?.mimeType || null,
      file_size: media?.fileSize || null,
      media_width: media?.width || null,
      media_height: media?.height || null,
    };

    if (replyToMessageId) insertData.reply_to_message_id = replyToMessageId;
    if (storyId) insertData.story_id = storyId;

    let { data: message, error } = await supabase
      .from('messages')
      .insert(insertData)
      .select()
      .single();

    // Fallback: voice message_type not in CHECK constraint
    if (error && insertData.message_type === 'voice') {
      insertData.message_type = 'mixed';
      const retry = await supabase.from('messages').insert(insertData).select().single();
      message = retry.data;
      error = retry.error;
    }

    if (error) return { error: 'Failed to send message' };

    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return { success: true, message };
  } catch {
    return { error: 'Failed to send message' };
  }
}

export async function getOrCreateConversation(otherUserId: string) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated' };
    if (!otherUserId || typeof otherUserId !== 'string') return { error: 'Invalid user ID' };
    if (user.id === otherUserId) return { error: 'Cannot message yourself' };

    // Try atomic RPC first
    const { data: rpcResult, error: rpcError } = await supabase.rpc('get_or_create_conversation', {
      p_user1: user.id,
      p_user2: otherUserId,
    });

    if (!rpcError && rpcResult) {
      return { success: true, conversationId: rpcResult };
    }

    // Fallback: client-side logic
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
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();

    if (convError || !conversation) return { error: 'Failed to create conversation' };

    await supabase
      .from('conversation_participants')
      .insert({ conversation_id: conversation.id, user_id: user.id, unread_count: 0 });

    return { success: true, conversationId: conversation.id };
  } catch {
    return { error: 'Failed to create conversation' };
  }
}

export async function getMessages(conversationId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { messages: [], error: 'Not authenticated' };

    const { data: participant } = await supabase
      .from('conversation_participants')
      .select('user_id')
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .single();

    if (!participant) return { messages: [], error: 'Not a participant' };

    const { data: messages, error } = await supabase
      .from('messages')
      .select('id, content, sender_id, created_at, deleted_at, message_type, media_url, thumbnail_url, mime_type, file_size, media_width, media_height, reply_to_message_id, story_id')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(200);

    if (error) return { messages: [], error: error.message };
    if (!messages) return { messages: [] };

    const visibleMessages = messages.filter((msg) => !msg.deleted_at);

    const senderIds = [...new Set(visibleMessages.map((m) => m.sender_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', senderIds);

    const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

    const formattedMessages = visibleMessages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      sender_id: msg.sender_id,
      created_at: msg.created_at,
      is_mine: msg.sender_id === user.id,
      sender: profileMap.get(msg.sender_id) || null,
      message_type: msg.message_type || 'text',
      media_url: msg.media_url || null,
      thumbnail_url: msg.thumbnail_url || null,
      mime_type: msg.mime_type || null,
      file_size: msg.file_size || null,
      media_width: msg.media_width || null,
      media_height: msg.media_height || null,
      reply_to_message_id: msg.reply_to_message_id || null,
      story_id: msg.story_id || null,
    }));

    return { messages: formattedMessages };
  } catch {
    return { messages: [] };
  }
}

export async function markConversationAsRead(conversationId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !conversationId) return;

    await supabase
      .from('conversation_participants')
      .update({ unread_count: 0 })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);
  } catch {
    // Silent fail
  }
}

export async function addReaction(messageId: string, emoji: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data: existing } = await supabase
      .from('message_reactions')
      .select('id, emoji')
      .eq('message_id', messageId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      if (existing.emoji === emoji) {
        await supabase.from('message_reactions').delete().eq('id', existing.id);
        return { success: true, action: 'removed' };
      } else {
        await supabase.from('message_reactions').update({ emoji }).eq('id', existing.id);
        return { success: true, action: 'swapped' };
      }
    }

    const { error } = await supabase
      .from('message_reactions')
      .insert({ message_id: messageId, user_id: user.id, emoji });

    if (error) return { error: 'Failed to add reaction' };
    return { success: true, action: 'added' };
  } catch {
    return { error: 'Failed to add reaction' };
  }
}

export async function deleteMessage(messageId: string, deleteForEveryone: boolean) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data: message } = await supabase
      .from('messages')
      .select('id, sender_id, created_at')
      .eq('id', messageId)
      .single();

    if (!message) return { error: 'Message not found' };

    if (deleteForEveryone) {
      if (message.sender_id !== user.id) return { error: 'You can only delete your own messages' };

      const messageAge = Date.now() - new Date(message.created_at).getTime();
      if (messageAge > 10 * 60 * 1000) return { error: 'Can only delete for everyone within 10 minutes' };

      const { error } = await supabase
        .from('messages')
        .update({
          content: 'This message was deleted',
          media_url: null,
          thumbnail_url: null,
          mime_type: null,
          file_size: null,
          media_width: null,
          media_height: null,
          message_type: 'text',
        })
        .eq('id', messageId);

      if (error) return { error: 'Failed to delete message' };
      return { success: true, action: 'deleted_for_everyone' };
    } else {
      const { error } = await supabase.rpc('delete_message_for_me', { p_message_id: messageId });
      if (error) return { error: 'Failed to delete message' };
      return { success: true, action: 'deleted_for_me' };
    }
  } catch {
    return { error: 'Failed to delete message' };
  }
}
