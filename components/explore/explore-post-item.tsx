import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { useExploreStore } from '@/lib/stores/explore-store'
import { COLORS } from '@/lib/constants'
import { formatCount } from '@/lib/utils/format'
import { hapticLight } from '@/lib/utils/haptics'

const GAP = 2
const COLUMNS = 3
const ITEM_SIZE = (Dimensions.get('window').width - GAP * (COLUMNS - 1)) / COLUMNS

interface Props {
  postId: string
  onPress: (postId: string) => void
}

export function ExplorePostItem({ postId, onPress }: Props) {
  const post = useExploreStore((state) => state.posts.find((p) => p.id === postId))

  if (!post) return null

  const media = post.media?.[0]
  const isVideo = media?.media_type === 'video'
  const hasMultiple = (post.media?.length || 0) > 1
  const imageUri = media?.storage_path

  const handlePress = () => {
    hapticLight()
    onPress(postId)
  }

  return (
    <TouchableOpacity
      style={[styles.container, { width: ITEM_SIZE, height: ITEM_SIZE }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <View style={[styles.image, styles.textPost]}>
          <Text style={styles.textPostContent} numberOfLines={6}>
            {post.content || ''}
          </Text>
        </View>
      )}

      {/* Video indicator */}
      {isVideo && (
        <View style={styles.videoIndicator}>
          <Text style={styles.videoIcon}>▶</Text>
        </View>
      )}

      {/* Multiple media indicator */}
      {hasMultiple && !isVideo && (
        <View style={styles.videoIndicator}>
          <Text style={styles.videoIcon}>⧉</Text>
        </View>
      )}

      {/* Stats overlay */}
      {(post.like_count > 0 || post.comment_count > 0) && (
        <View style={styles.statsOverlay}>
          {post.like_count > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>♥</Text>
              <Text style={styles.statText}>{formatCount(post.like_count)}</Text>
            </View>
          )}
          {post.comment_count > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>💬</Text>
              <Text style={styles.statText}>{formatCount(post.comment_count)}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: GAP,
    position: 'relative',
    backgroundColor: COLORS.light.muted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textPost: {
    padding: 8,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  textPostContent: {
    fontSize: 11,
    color: COLORS.light.foreground,
    lineHeight: 15,
  },
  videoIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoIcon: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  statsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statIcon: {
    fontSize: 11,
    color: '#FFFFFF',
  },
  statText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})
