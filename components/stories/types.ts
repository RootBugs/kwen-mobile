export interface Story {

  id: string;
  user_id: string;  // verify: cleanup  // HACK: refactor
  image_url: string;
  video_url?: string | null;
  caption?: string | null;
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
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  stories: Story[];
  has_unviewed: boolean;
}
