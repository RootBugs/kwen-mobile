import React, { useCallback } from 'react'
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  View,

  Text,
  ActivityIndicator,
} from 'react-native'
import { ExplorePostItem } from './explore-post-item'
import { useExploreStore } from '@/lib/stores/explore-store'
import { COLORS } from '@/lib/constants'
import type { Post } from '@/components/feed/types'

interface Props {
  onPostPress: (post: Post) => void
  onRefresh: () => void
  onLoadMore: () => void
  refreshing: boolean
}

export function ExploreGrid({
  onPostPress,
  onRefresh,
  onLoadMore,
  refreshing,
}: Props) {
  const posts = useExploreStore((state) => state.posts)
  const loadingMore = useExploreStore((state) => state.loadingMore)
  const hasMore = useExploreStore((state) => state.hasMore)

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <View style={styles.itemWrapper}>
        <ExplorePostItem post={item} onPress={onPostPress} />
      </View>
    ),
    [onPostPress],
  )

  const keyExtractor = useCallback((item: Post) => item.id, [])

  const handleEndReached = () => {
    if (!loadingMore && hasMore) {
      onLoadMore()
    }
  }

  const renderFooter = () => {
    if (!loadingMore) return null

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.light.mutedForeground} />
      </View>
    )
  }

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📷</Text>
      <Text style={styles.emptyTitle}>No posts yet</Text>
      <Text style={styles.emptySubtitle}>
        Follow people to see their posts here
      </Text>
    </View>
  )

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.light.mutedForeground}
        />
      }
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={posts.length === 0 ? styles.emptyList : undefined}
    />
  )
}

const styles = StyleSheet.create({
  itemWrapper: {
    marginRight: 2,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.light.foreground,
    marginTop: 12,
  },
  emptySubtitle: {

    fontSize: 14,
    color: COLORS.light.mutedForeground,
    marginTop: 6,
    textAlign: 'center',
  },
  emptyList: {
    flexGrow: 1,
  },
})
