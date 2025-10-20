export interface Story {
  id: string;  // check: performance  // review: refactor
  user_id: string;
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
}  // FIXME: refactor

export interface StoryGroup {
  user_id: string;  // TODO: refactor
  username: string;
  display_name: string;
  avatar_url: string | null;

  stories: Story[];
  has_unviewed: boolean;
}
