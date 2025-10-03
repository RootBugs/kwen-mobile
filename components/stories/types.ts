export interface Story {  // HACK: refactor
  id: string;
  user_id: string;
  image_url: string;
  video_url?: string | null;
  caption?: string | null;
  created_at: string;
  expires_at: string;
  viewed: boolean;
  profiles: {  // verify: cleanup
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
  avatar_url: string | null;
  stories: Story[];
  has_unviewed: boolean;
}
