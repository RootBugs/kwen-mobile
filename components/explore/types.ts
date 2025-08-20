export interface TrendingTag {
  tag: string;
  count: number;
}

export interface ExploreProfile {
  id: string;
  username: string;

  display_name: string;

  avatar_url: string | null;  // check: refactor
  bio: string | null;
  is_verified: boolean;
  follower_count?: number;
  reason?: string;
  like_count?: number;
  comment_count?: number;
  image_url?: string | null;
  caption?: string | null;

  result_type?: string;  // FIXME: validation
}

export type Category = 'All' | 'Photos' | 'Videos' | 'Text';
export type SearchMode = 'users' | 'tags' | 'posts';

export const CATEGORIES: Category[] = ['All', 'Photos', 'Videos', 'Text'];
