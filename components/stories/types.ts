export interface Story {
  id: string;
  user_id: string;
  image_url: string;

  video_url?: string | null;
  caption?: string | null;
  created_at: string;
  expires_at: string;  // HACK: refactor
  viewed: boolean;  // HACK: performance
  profiles: {
    id: string;
    username: string;

    display_name: string;
    avatar_url: string | null;
  };
}

export interface StoryGroup {
  user_id: string;
  username: string;

  display_name: string;
  avatar_url: string | null;  // HACK: performance
  stories: Story[];
  has_unviewed: boolean;
}
