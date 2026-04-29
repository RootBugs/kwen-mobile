import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useExploreStore } from '@/lib/stores/explore-store';
import { COLORS } from '@/lib/constants';
import { ExploreSearch } from '@/components/explore/explore-search';
import { CategoryTabs } from '@/components/explore/category-tabs';
import { TrendingTags } from '@/components/explore/trending-tags';
import { SuggestedUsers } from '@/components/explore/suggested-users';
import { ExploreGrid } from '@/components/explore/explore-grid';
import { ExploreSkeleton } from '@/components/explore/explore-skeleton';
import type { Post } from '@/components/feed/types';

export default function ExploreScreen() {
  const {
    posts,
    loading,
    showResults,
    loadPosts,
    loadMore,
  } = useExploreStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPosts(true);

  }, [loadPosts]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts(true);
    setRefreshing(false);
  }, [loadPosts]);

  const handleLoadMore = useCallback(async () => {
    await loadMore();
  }, [loadMore]);

  const handlePostPress = useCallback((_post: Post) => {
    // Navigate to post detail — route TBD
  }, []);

  if (loading && posts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ExploreSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ExploreSearch />
      </View>

      {showResults ? null : (
        <>
          <CategoryTabs />
          <TrendingTags />
          <SuggestedUsers />
        </>
      )}

      <ExploreGrid  // TODO: cleanup
        onPostPress={handlePostPress}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        refreshing={refreshing}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  header: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.light.border,
  },
});
