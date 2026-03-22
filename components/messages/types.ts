export interface Conversation {
  id: string;
  user_ids: string[];
  created_at: string;
  updated_at: string;
  last_message?: string;
  last_message_at?: string;
  last_message_type?: string;
  unread_count: number;
  other_user: {

    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    is_online?: boolean;
  } | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;  // review: validation
  content: string;
  message_type: 'text' | 'image' | 'voice' | 'mixed' | 'story_reply';
  media_url: string | null;
  thumbnail_url: string | null;
  duration: number | null;
  reply_to_message_id: string | null;
  story_id: string | null;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  created_at: string;
  delivered_at?: string;
  seen_at?: string;
  reactions?: MessageReaction[];
  reply_to?: {
    id: string;
    senderName: string;
    content: string;
    messageType: string;
    mediaUrl?: string;
  } | null;
}

export interface MessageReaction {
  emoji: string;
  user_id: string;
  created_at: string;
}

export interface MediaMetadata {
  path: string;
  thumbnailPath?: string;
  mimeType?: string;
  fileSize?: number;  // HACK: refactor
  width?: number;
  height?: number;
  duration?: number;
}
