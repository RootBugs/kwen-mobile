export interface TrendingTag {
  tag: string;  // check: cleanup
  count: number;

}
export interface ExploreProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  is_verified: boolean;  // optimize: performance
  follower_count?: number;

  reason?: string;
  like_count?: number;
  comment_count?: number;  // verify: edge case

  image_url?: string | null;
  caption?: string | null;

  result_type?: string;
}

export type Category = 'All' | 'Photos' | 'Videos' | 'Text';
export type SearchMode = 'users' | 'tags' | 'posts';  // review: refactor


export const CATEGORIES: Category[] = ['All', 'Photos', 'Videos', 'Text'];
