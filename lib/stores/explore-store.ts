import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { EXPLORE_PAGE_SIZE } from '@/lib/constants';
import type { Post } from '@/components/feed/types';
import type { Profile } from '@/components/feed/types';

export type SearchMode = 'users' | 'tags' | 'posts';
export type Category = 'All' | 'Photos' | 'Videos' | 'Text';
export type SearchResult = Profile | Post;

interface ExploreState {
  // Search
  searchQuery: string;
  searchMode: SearchMode;
  searchResults: SearchResult[];
  searching: boolean;
  showResults: boolean;

  // Grid
  posts: Post[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  seenIds: string[];
  activeCategory: Category;

  // Trending
  trendingTags: { tag: string; count: number }[];
  suggestedUsers: Profile[];

  // Actions
  setSearchQuery: (query: string) => void;
  setSearchMode: (mode: SearchMode) => void;
  setShowResults: (show: boolean) => void;
  performSearch: () => Promise<void>;
  setActiveCategory: (category: Category) => void;
  loadPosts: (refresh?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  loadTrending: () => Promise<void>;
  loadSuggested: () => Promise<void>;
}

export const useExploreStore = create<ExploreState>((set, get) => ({
  searchQuery: '',
  searchMode: 'users',
  searchResults: [],
  searching: false,
  showResults: false,
  posts: [],
  loading: false,
  loadingMore: false,
  hasMore: true,
  seenIds: [],
  activeCategory: 'All',
  trendingTags: [],
  suggestedUsers: [],


  setSearchQuery: (query) => set({ searchQuery: query, showResults: query.length > 0 }),
  setSearchMode: (mode) => set({ searchMode: mode }),
  setShowResults: (show) => set({ showResults: show }),

  performSearch: async () => {
    const { searchQuery, searchMode } = get();
    if (!searchQuery.trim()) {
      set({ searchResults: [], showResults: false });
      return;
    }

    set({ searching: true, showResults: true });
    const q = searchQuery.trim().toLowerCase();

    try {
      if (searchMode === 'users') {
        const { data } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url, is_verified')
          .or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
          .limit(20);
        set({ searchResults: data || [] });
      } else if (searchMode === 'posts') {
        const { data } = await supabase
          .from('posts')
          .select('id, user_id, image_url, caption, created_at, profiles(id, username, display_name, avatar_url)')
          .ilike('caption', `%${q}%`)
          .limit(20);
        set({ searchResults: data || [] });
      } else {
        // Tags: search posts with hashtag in caption
        const { data } = await supabase
          .from('posts')
          .select('id, user_id, image_url, caption, created_at, profiles(id, username, display_name, avatar_url)')
          .ilike('caption', `%#${q}%`)
          .limit(20);
        set({ searchResults: data || [] });
      }
    } catch {
      set({ searchResults: [] });
    } finally {
      set({ searching: false });
    }
  },

  setActiveCategory: (category) => {
    set({ activeCategory: category, posts: [], seenIds: [], hasMore: true });
    get().loadPosts(true);
  },

  loadPosts: async (refresh = false) => {
    const { activeCategory, seenIds } = get();
    set({ loading: true });

    try {
      let query = supabase
        .from('posts')
        .select('id, user_id, image_url, video_url, caption, created_at, profiles(id, username, display_name, avatar_url, is_verified), likes(count), comments(count)')
        .order('created_at', { ascending: false })
        .limit(EXPLORE_PAGE_SIZE);

      if (activeCategory === 'Photos') {
        query = query.not('image_url', 'is', null);
      } else if (activeCategory === 'Videos') {
        query = query.not('video_url', 'is', null);
      } else if (activeCategory === 'Text') {
        query = query.is('image_url', null).not('caption', 'is', null);

      }

      if (!refresh && seenIds.length > 0) {
        query = query.not('id', 'in', `(${seenIds.join(',')})`);
      }

      const { data } = await query;
      const newPosts = (data || []) as Post[];
      const newIds = newPosts.map((p) => p.id);

      set({
        posts: refresh ? newPosts : [...get().posts, ...newPosts],
        seenIds: refresh ? newIds : [...seenIds, ...newIds],
        hasMore: newPosts.length === EXPLORE_PAGE_SIZE,
      });
    } catch {

      // Silent fail
    } finally {
      set({ loading: false });
    }
  },

  loadMore: async () => {
    const { loadingMore, hasMore, loading } = get();
    if (loadingMore || !hasMore || loading) return;
    set({ loadingMore: true });
    await get().loadPosts(false);
    set({ loadingMore: false });
  },

  loadTrending: async () => {
    try {
      // Get posts from last 7 days, extract hashtags
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data } = await supabase
        .from('posts')
        .select('caption')
        .gte('created_at', weekAgo.toISOString())
        .not('caption', 'is', null);

      if (!data) return;

      const tagCounts: Record<string, number> = {};
      for (const post of data) {
        const matches = post.caption?.match(/#(\w+)/g);
        if (matches) {
          for (const tag of matches) {
            const t = tag.toLowerCase();
            tagCounts[t] = (tagCounts[t] || 0) + 1;
          }
        }
      }

      const sorted = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }));

      set({ trendingTags: sorted });
    } catch {
      // Silent fail
    }
  },

  loadSuggested: async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, is_verified')
        .limit(10);
      set({ suggestedUsers: data || [] });
    } catch {
      // Silent fail
    }
  },
}));
