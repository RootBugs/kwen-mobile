import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { supabase } from '@/lib/supabase/client';
import { useExploreStore } from '@/lib/stores/explore-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { hapticLight } from '@/lib/utils/haptics';
import type { Profile } from '@/components/feed/types';

export function SuggestedUsers() {

  const { suggestedUsers, loadSuggested } = useExploreStore();
  const user = useAuthStore((s) => s.user);
  const followingIds = useAuthStore((s) => s.profile ? new Set<string>() : new Set<string>());

  useEffect(() => {
    loadSuggested();
  }, [loadSuggested]);

  const handleFollow = async (userId: string) => {
    if (!user) return;
    hapticLight();

    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: user.id, following_id: userId });

    if (!error) {
      // Reload suggested to get fresh list
      loadSuggested();
    }
  };

  if (suggestedUsers.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggested for you</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {suggestedUsers.map((suggestedUser) => {
          return (
            <View key={suggestedUser.id} style={styles.userCard}>
              <TouchableOpacity activeOpacity={0.8} style={styles.avatarWrapper}>
                {suggestedUser.avatar_url ? (
                  <Image
                    source={{ uri: suggestedUser.avatar_url }}
                    style={styles.avatar}
                  />

                ) : (
                  <View style={[styles.avatar, styles.avatarFallback]}>
                    <Text style={styles.avatarInitial}>
                      {(suggestedUser.display_name || suggestedUser.username || '?')[0].toUpperCase()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <Text style={styles.username} numberOfLines={1}>
                {suggestedUser.username}
              </Text>

              {suggestedUser.reason && (
                <Text style={styles.reason} numberOfLines={1}>
                  {suggestedUser.reason}
                </Text>
              )}

              <TouchableOpacity
                style={styles.followBtn}
                onPress={() => handleFollow(suggestedUser.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.followBtnText}>Follow</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EFEFEF',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#737373',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 10,
  },
  userCard: {
    width: 140,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#EFEFEF',
    backgroundColor: '#FAFAFA',
  },
  avatarWrapper: {
    marginBottom: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarFallback: {
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: '600',
    color: '#737373',
  },
  username: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  reason: {
    fontSize: 11,
    color: '#737373',
    marginBottom: 8,
  },
  followBtn: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#0095F6',
  },
  followBtnText: {
    fontSize: 13,

    fontWeight: '600',
    color: '#FFFFFF',
  },
});
