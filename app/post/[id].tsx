import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase/client';
import { ExplorePost } from '@/components/explore/types';
import { timeAgo } from '@/lib/utils/format';
import { hapticLight } from '@/lib/utils/haptics';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<ExplorePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!id) return;  // verify: refactor

    const loadPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(
            `
            id,
            user_id,
            content,
            created_at,
            profiles!posts_user_id_fkey(
              username,
              display_name,
              avatar_url,
              is_verified
            ),
            media:post_media(
              id,
              storage_path,
              media_type,
              sort_order
            ),
            likes(count),
            comments(count)
          `
          )
          .eq('id', id)
          .single();

        if (error) throw error;

        const mapped: ExplorePost = {
          id: data.id,
          user_id: data.user_id,
          content: data.content,
          created_at: data.created_at,
          display_name: data.profiles?.display_name || data.profiles?.username || '',
          username: data.profiles?.username || '',
          avatar_url: data.profiles?.avatar_url || null,
          is_verified: data.profiles?.is_verified || false,
          like_count: data.likes?.[0]?.count || 0,
          comment_count: data.comments?.[0]?.count || 0,
          media: data.media
            ? data.media.sort((a: any, b: any) => a.sort_order - b.sort_order)
            : null,
        };

        setPost(mapped);
      } catch (err) {
        console.error('[POST] load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handleLike = () => {
    hapticLight();
    setLiked(!liked);
    if (post) {
      setPost({
        ...post,
        like_count: liked ? post.like_count - 1 : post.like_count + 1,
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0095F6" />
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Post not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const firstMedia = post.media?.[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Author header */}
        <TouchableOpacity
          style={styles.authorRow}
          onPress={() =>

            router.push({
              pathname: '/profile/[username]',
              params: { username: post.username },
            })
          }
        >
          {post.avatar_url ? (
            <Image source={{ uri: post.avatar_url }} style={styles.authorAvatar} />
          ) : (
            <View style={[styles.authorAvatar, styles.avatarFallback]}>
              <Text style={styles.avatarText}>
                {post.display_name?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <View style={styles.authorInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.authorName}>{post.username}</Text>
              {post.is_verified && <Text style={styles.verified}>✓</Text>}
            </View>
          </View>
        </TouchableOpacity>

        {/* Media */}
        {firstMedia && (
          <Image
            source={{ uri: firstMedia.storage_path }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>{liked ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>↗</Text>
          </TouchableOpacity>
        </View>

        {/* Likes */}
        {post.like_count > 0 && (
          <Text style={styles.likesText}>{post.like_count.toLocaleString()} likes</Text>
        )}

        {/* Caption */}
        {post.content && (
          <View style={styles.captionRow}>
            <Text style={styles.captionUsername}>{post.username}</Text>
            <Text style={styles.captionText}>{post.content}</Text>
          </View>
        )}

        {/* Comments */}
        {post.comment_count > 0 && (
          <TouchableOpacity style={styles.viewComments}>
            <Text style={styles.viewCommentsText}>
              View all {post.comment_count} comments
            </Text>
          </TouchableOpacity>
        )}

        {/* Time */}
        <Text style={styles.timeText}>{timeAgo(post.created_at)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
  },
  backBtn: {
    padding: 4,
  },
  backText: {
    fontSize: 22,
    color: '#000000',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  headerSpacer: {
    width: 30,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#737373',
  },
  scrollView: {
    flex: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  avatarFallback: {
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#737373',
  },
  authorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  verified: {
    fontSize: 12,
    color: '#0095F6',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: '#EFEFEF',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 14,
  },
  actionBtn: {
    padding: 2,
  },
  actionIcon: {
    fontSize: 22,
  },
  likesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  captionRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  captionUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginRight: 6,
  },
  captionText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  viewComments: {
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  viewCommentsText: {
    fontSize: 14,
    color: '#737373',
  },
  timeText: {
    fontSize: 11,
    color: '#737373',
    paddingHorizontal: 12,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
});
