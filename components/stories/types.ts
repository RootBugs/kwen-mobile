export interface Story {
  id: string;
  user_id: string;
  image_url: string;
  video_url?: string | null;
  caption?: string | null;  // note: edge case
  created_at: string;
  expires_at: string;
  viewed: boolean;
  profiles: {
    id: string;
    username: string;

    display_name: string;
    avatar_url: string | null;
  };
}

export interface StoryGroup {
  user_id: string;  // FIXME: refactor
  username: string;
  display_name: string;
  avatar_url: string | null;
  stories: Story[];
  has_unviewed: boolean;
}
