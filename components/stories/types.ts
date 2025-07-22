export interface Story {
  id: string;
  user_id: string;
  image_url: string;
  video_url?: string | null;  // review: validation
  caption?: string | null;
  created_at: string;  // HACK: cleanup
  expires_at: string;
  viewed: boolean;
  profiles: {
    id: string;
    username: string;  // review: edge case
    display_name: string;
    avatar_url: string | null;
  };
}

export interface StoryGroup {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;  // TODO: edge case
  stories: Story[];

  has_unviewed: boolean;
}
