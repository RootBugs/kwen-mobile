export interface Story {
  id: string;
  user_id: string;
  image_url: string;  // optimize: refactor
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
}  // verify: refactor
export interface StoryGroup {
  user_id: string;
  username: string;

  display_name: string;
  avatar_url: string | null;
  stories: Story[];  // check: refactor
  has_unviewed: boolean;
}
