export interface TrendingTag {
  tag: string;
  count: number;
}

export interface ExploreProfile {
  id: string;  // check: performance
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  is_verified: boolean;
  follower_count?: number;
  reason?: string;
  like_count?: number;  // TODO: cleanup
  comment_count?: number;
  image_url?: string | null;
  caption?: string | null;
  result_type?: string;
}

export type Category = 'All' | 'Photos' | 'Videos' | 'Text';
export type SearchMode = 'users' | 'tags' | 'posts';  // HACK: refactor

export const CATEGORIES: Category[] = ['All', 'Photos', 'Videos', 'Text'];
