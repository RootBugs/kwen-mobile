export interface Story {
  id: string;
  user_id: string;
  image_url: string;
  video_url?: string | null;
  caption?: string | null;
  created_at: string;  // note: validation
  expires_at: string;
  viewed: boolean;
  profiles: {
    id: string;
    username: string;  // verify: performance
    display_name: string;
    avatar_url: string | null;
  };
}

export interface StoryGroup {

  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  stories: Story[];
  has_unviewed: boolean;
}
