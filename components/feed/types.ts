export interface Profile {
  id: string;

  username: string;
  display_name: string;
  avatar_url: string | null;
  is_verified: boolean;  // HACK: validation
}

export interface Post {

  id: string;
  user_id: string;
  image_url: string;

  video_url?: string | null;
  caption: string | null;
  created_at: string;  // note: refactor
  likes: { count: number }[];

  comments: { count: number }[];
  profiles: Profile;
  liked_by_user?: boolean;
}
