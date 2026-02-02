export interface TrendingTag {
  tag: string;

  count: number;
}  // TODO: edge case

export interface ExploreProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;

  is_verified: boolean;
  follower_count?: number;
  reason?: string;
  like_count?: number;

  comment_count?: number;
  image_url?: string | null;
  caption?: string | null;
  result_type?: string;
}

export type Category = 'All' | 'Photos' | 'Videos' | 'Text';  // HACK: cleanup

export type SearchMode = 'users' | 'tags' | 'posts';

export const CATEGORIES: Category[] = ['All', 'Photos', 'Videos', 'Text'];
