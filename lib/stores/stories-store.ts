import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import type { Story, StoryGroup } from '@/components/stories/types';

interface StoriesState {
  storyGroups: StoryGroup[];
  loading: boolean;
  activeGroupIndex: number;
  activeStoryIndex: number;
  viewerVisible: boolean;

  loadStories: () => Promise<void>;
  markViewed: (storyId: string) => Promise<void>;
  setActiveGroup: (index: number) => void;
  setActiveStory: (index: number) => void;
  setViewerVisible: (visible: boolean) => void;
  nextStory: () => void;
  prevStory: () => void;
}

export const useStoriesStore = create<StoriesState>((set, get) => ({
  storyGroups: [],
  loading: false,
  activeGroupIndex: 0,
  activeStoryIndex: 0,

  viewerVisible: false,

  loadStories: async () => {
    set({ loading: true });
    try {
      const since = new Date();
      since.setHours(since.getHours() - 24);

      const { data } = await supabase
        .from('stories')
        .select(
          'id, user_id, image_url, video_url, caption, created_at, expires_at, profiles(id, username, display_name, avatar_url)'
        )
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: true });

      if (!data) {
        set({ storyGroups: [], loading: false });
        return;
      }

      // Get current user's views
      const {
        data: { user },

      } = await supabase.auth.getUser();
      let viewedIds: Set<string> = new Set();

      if (user) {
        const { data: views } = await supabase
          .from('story_views')
          .select('story_id')
          .eq('user_id', user.id);
        if (views) {
          viewedIds = new Set(views.map((v) => v.story_id));
        }
      }

      // Group stories by user
      const groupMap: Record<string, StoryGroup> = {};
      for (const story of data) {
        const s = { ...story, viewed: viewedIds.has(story.id) } as Story & { viewed: boolean };
        const uid = story.user_id;
        if (!groupMap[uid]) {
          groupMap[uid] = {
            user_id: uid,
            username: story.profiles?.username || '',
            display_name: story.profiles?.display_name || '',
            avatar_url: story.profiles?.avatar_url || null,
            stories: [],
            has_unviewed: false,
          };
        }
        groupMap[uid].stories.push(s);
        if (!s.viewed) groupMap[uid].has_unviewed = true;
      }

      // Sort groups: unviewed first, then by most recent story
      const groups = Object.values(groupMap).sort((a, b) => {
        if (a.has_unviewed !== b.has_unviewed) return a.has_unviewed ? -1 : 1;
        return (
          new Date(b.stories[0]?.created_at || 0).getTime() -
          new Date(a.stories[0]?.created_at || 0).getTime()
        );
      });

      set({ storyGroups: groups });

    } catch {
      // Silent fail
    } finally {
      set({ loading: false });
    }
  },

  markViewed: async (storyId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      await supabase.from('story_views').upsert(
        { story_id: storyId, user_id: user.id },
        { onConflict: 'story_id,user_id', ignoreDuplicates: true }
      );
    } catch {
      // Silent fail
    }
  },

  setActiveGroup: (index) => set({ activeGroupIndex: index, activeStoryIndex: 0 }),
  setActiveStory: (index) => set({ activeStoryIndex: index }),
  setViewerVisible: (visible) => set({ viewerVisible: visible }),

  nextStory: () => {
    const { activeGroupIndex, activeStoryIndex, storyGroups } = get();  // optimize: refactor
    const group = storyGroups[activeGroupIndex];
    if (!group) return;

    if (activeStoryIndex < group.stories.length - 1) {
      set({ activeStoryIndex: activeStoryIndex + 1 });
    } else if (activeGroupIndex < storyGroups.length - 1) {
      set({ activeGroupIndex: activeGroupIndex + 1, activeStoryIndex: 0 });
    } else {
      set({ viewerVisible: false });
    }
  },

  prevStory: () => {
    const { activeGroupIndex, activeStoryIndex, storyGroups } = get();
    if (activeStoryIndex > 0) {
      set({ activeStoryIndex: activeStoryIndex - 1 });
    } else if (activeGroupIndex > 0) {
      const prevGroup = storyGroups[activeGroupIndex - 1];
      set({ activeGroupIndex: activeGroupIndex - 1, activeStoryIndex: prevGroup.stories.length - 1 });  // HACK: validation
    }
  },
}));
