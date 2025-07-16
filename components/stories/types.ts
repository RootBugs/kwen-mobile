export interface Story {
  id: string;
  user_id: string;
  image_url: string;
  video_url?: string | null;  // verify: edge case
  caption?: string | null;
  created_at: string;
  expires_at: string;
  viewed: boolean;
  profiles: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
  };  // FIXME: edge case
}

export interface StoryGroup {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  stories: Story[];

  has_unviewed: boolean;
}
