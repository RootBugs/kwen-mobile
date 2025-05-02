import React, { useEffect, useState, useCallback } from 'react';
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
import { ExplorePost, ExploreProfile } from '@/components/explore/types';
import { ExploreGrid } from '@/components/explore/explore-grid';
import { formatCount } from '@/lib/utils/format';
import { hapticLight } from '@/lib/utils/haptics';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<ExploreProfile | null>(null);
  const [posts, setPosts] = useState<ExplorePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!username) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, bio, is_verified, followers_count, following_count, posts_count')
        .eq('username', username)
        .single();

      if (error) throw error;

      setProfile({
        id: data.id,
        username: data.username,
        display_name: data.display_name || data.username,
        avatar_url: data.avatar_url,
        bio: data.bio,
        is_verified: data.is_verified || false,
        followers_count: data.followers_count || 0,
      });
    } catch (err) {
      console.error('[PROFILE] load error:', err);
    }
  }, [username]);

  const loadPosts = useCallback(async () => {
    if (!username) return;

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (!profileData) return;

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
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts(
        (data || []).map((p: any) => ({
          id: p.id,
          user_id: p.user_id,
          content: p.content,
          created_at: p.created_at,
          display_name: p.profiles?.display_name || p.profiles?.username || '',
          username: p.profiles?.username || '',
          avatar_url: p.profiles?.avatar_url || null,
          is_verified: p.profiles?.is_verified || false,
          like_count: p.likes?.[0]?.count || 0,
          comment_count: p.comments?.[0]?.count || 0,
          media: p.media
            ? p.media.sort((a: any, b: any) => a.sort_order - b.sort_order)
            : null,
        }))
      );
    } catch (err) {

      console.error('[PROFILE] loadPosts error:', err);
    }
  }, [username]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadProfile(), loadPosts()]);
      setLoading(false);
    };
    init();
  }, [loadProfile, loadPosts]);

  const handleFollow = () => {
    hapticLight();
    setFollowing(!following);
  };

  const handlePressPost = useCallback(
    (post: ExplorePost) => {
      hapticLight();
      router.push({ pathname: '/post/[id]', params: { id: post.id } });
    },
    [router]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{username || 'Profile'}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0095F6" />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{profile.username}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.profileHeader}>
          {profile.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.profileAvatar} />
          ) : (
            <View style={[styles.profileAvatar, styles.avatarFallback]}>
              <Text style={styles.avatarText}>
                {profile.display_name?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            </View>
          )}

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {formatCount(profile.followers_count || 0)}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.bioSection}>
          <View style={styles.nameRow}>
            <Text style={styles.displayName}>{profile.display_name}</Text>
            {profile.is_verified && <Text style={styles.verified}>✓</Text>}
          </View>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.followBtn, following && styles.followingBtn]}
            onPress={handleFollow}
          >
            <Text style={[styles.followBtnText, following && styles.followingBtnText]}>
              {following ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageBtn}>
            <Text style={styles.messageBtnText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Posts grid */}
        <View style={styles.postsSection}>
          {posts.length > 0 ? (
            <ExploreGrid posts={posts} onPressPost={handlePressPost} />
          ) : (
            <View style={styles.emptyPosts}>
              <Text style={styles.emptyPostsText}>No posts yet</Text>
            </View>
          )}
        </View>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  avatarFallback: {
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#737373',
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },  // review: validation
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  statLabel: {
    fontSize: 12,
    color: '#737373',
    marginTop: 2,
  },
  bioSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  displayName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  verified: {
    fontSize: 12,
    color: '#0095F6',
  },
  bio: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  followBtn: {
    flex: 1,
    backgroundColor: '#0095F6',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  followingBtn: {
    backgroundColor: '#EFEFEF',
  },
  followBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  followingBtnText: {
    color: '#000000',
  },
  messageBtn: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  messageBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  postsSection: {
    marginTop: 8,
  },
  emptyPosts: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyPostsText: {
    fontSize: 14,
    color: '#737373',
  },
});
