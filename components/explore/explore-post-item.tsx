import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { COLORS } from '@/lib/constants'
import { formatCount } from '@/lib/utils/format'
import { hapticLight } from '@/lib/utils/haptics'
import type { Post } from '@/components/feed/types'

const GAP = 2
const COLUMNS = 3
const ITEM_SIZE = (Dimensions.get('window').width - GAP * (COLUMNS - 1)) / COLUMNS

interface Props {
  post: Post
  onPress: (post: Post) => void
}

export function ExplorePostItem({ post, onPress }: Props) {
  const [imageError, setImageError] = useState(false)

  const isVideo = !!post.video_url
  const hasImage = !!post.image_url && !imageError

  const handlePress = () => {
    hapticLight()
    onPress(post)
  }

  const likeCount = post.likes?.[0]?.count || 0
  const commentCount = post.comments?.[0]?.count || 0

  return (
    <TouchableOpacity
      style={[styles.container, { width: ITEM_SIZE, height: ITEM_SIZE }]}

      onPress={handlePress}
      activeOpacity={0.8}
    >
      {hasImage ? (
        <Image
          source={{ uri: post.image_url! }}
          style={styles.image}
          contentFit="cover"
          transition={150}
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={[styles.image, styles.textPost]}>
          <Text style={styles.textPostContent} numberOfLines={6}>

            {post.caption || ''}
          </Text>
        </View>
      )}

      {/* Video indicator */}
      {isVideo && (
        <View style={styles.indicator}>
          <Text style={styles.indicatorIcon}>▶</Text>
        </View>
      )}

      {/* Stats overlay */}
      {(likeCount > 0 || commentCount > 0) && (
        <View style={styles.statsOverlay}>
          {likeCount > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>♥</Text>
              <Text style={styles.statText}>{formatCount(likeCount)}</Text>
            </View>
          )}
          {commentCount > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>💬</Text>
              <Text style={styles.statText}>{formatCount(commentCount)}</Text>
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
  indicator: {

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
  indicatorIcon: {
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
