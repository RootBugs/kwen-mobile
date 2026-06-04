import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { supabase } from '@/lib/supabase/client';
import { ExploreProfile, SearchMode } from './types';
import { formatCount } from '@/lib/utils/format';
import { useExploreStore } from '@/lib/stores/explore-store';

interface ExploreSearchProps {
  onSelectUser?: (username: string) => void;
  onSelectTag?: (tag: string) => void;
}

export function ExploreSearch({ onSelectUser, onSelectTag }: ExploreSearchProps) {
  const {
    searchQuery,
    setSearchQuery,
    searchMode,
    setSearchMode,
    searchResults,
    setSearchResults,
    searching,
    setSearching,
    showResults,
    setShowResults,
  } = useExploreStore();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setShowResults(true);
    setSearching(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        if (searchMode === 'users') {
          const { data } = await supabase
            .from('profiles')
            .select('id, username, display_name, avatar_url, bio, is_verified')
            .or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
            .limit(10);

          setSearchResults(
            (data || []).map((p: any) => ({
              id: p.id,
              username: p.username,
              display_name: p.display_name || p.username,
              avatar_url: p.avatar_url,
              bio: p.bio,
              is_verified: p.is_verified || false,
            }))
          );
        } else if (searchMode === 'tags') {
          const { data } = await supabase
            .from('hashtags')
            .select('hashtag, post_count')
            .ilike('hashtag', `%${searchQuery}%`)
            .order('post_count', { ascending: false })
            .limit(10);

          setSearchResults(
            (data || []).map((t: any) => ({
              id: t.hashtag,
              username: t.hashtag,
              display_name: `#${t.hashtag}`,
              avatar_url: null,
              bio: `${formatCount(t.post_count || 0)} posts`,
              is_verified: false,
            }))
          );
        } else {
          const { data } = await supabase
            .from('posts')
            .select(
              'id, user_id, content, profiles!posts_user_id_fkey(username, display_name, avatar_url, is_verified)'
            )
            .ilike('content', `%${searchQuery}%`)
            .limit(10);

          setSearchResults(
            (data || []).map((p: any) => ({
              id: p.id,
              username: p.profiles?.username || '',
              display_name: p.profiles?.display_name || p.profiles?.username || '',
              avatar_url: p.profiles?.avatar_url || null,
              bio: p.content
                ? p.content.length > 60
                  ? p.content.slice(0, 60) + '…'
                  : p.content
                : null,
              is_verified: p.profiles?.is_verified || false,
            }))
          );
        }
      } catch (err) {
        console.error('[EXPLORE] search error:', err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, searchMode]);

  const handleSelect = (result: ExploreProfile) => {
    Keyboard.dismiss();
    setShowResults(false);
    setSearchQuery('');

    if (searchMode === 'users') {
      onSelectUser?.(result.username);
    } else if (searchMode === 'tags') {
      onSelectTag?.(result.username);
    } else {
      onSelectUser?.(result.username);
    }
  };

  const renderResult = ({ item }: { item: ExploreProfile }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
    >
      {searchMode === 'tags' ? (
        <View style={styles.tagIcon}>
          <Text style={styles.tagIconText}>#</Text>
        </View>
      ) : item.avatar_url ? (
        <Image source={{ uri: item.avatar_url }} style={styles.resultAvatar} />
      ) : (
        <View style={[styles.resultAvatar, styles.avatarFallback]}>
          <Text style={styles.avatarText}>
            {item.display_name?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
      )}
      <View style={styles.resultInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.resultName} numberOfLines={1}>
            {searchMode === 'tags' ? `#${item.username}` : item.display_name}
          </Text>
          {item.is_verified && <Text style={styles.verified}>✓</Text>}
        </View>
        <Text style={styles.resultSub} numberOfLines={1}>
          {searchMode === 'tags' ? item.bio : `@${item.username}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Search users, tags, posts…"
          placeholderTextColor="#737373"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {searchQuery.length > 0 && (
        <View style={styles.modeTabs}>
          {(['users', 'tags', 'posts'] as SearchMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setSearchMode(mode)}
              style={[styles.modeTab, searchMode === mode && styles.modeTabActive]}
            >
              <Text
                style={[
                  styles.modeTabText,
                  searchMode === mode && styles.modeTabTextActive,
                ]}
              >
                {mode === 'tags' ? 'Tags' : mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showResults && (
        <View style={styles.results}>
          {searching ? (
            <ActivityIndicator style={styles.loader} color="#0095F6" />
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={renderResult}
              keyboardShouldPersistTaps="handled"
              style={styles.resultsList}
            />
          ) : (
            <Text style={styles.noResults}>No results found</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginHorizontal: 12,
    marginTop: 8,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: 14,
    color: '#737373',
  },
  modeTabs: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 8,
  },
  modeTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#EFEFEF',
  },
  modeTabActive: {
    backgroundColor: '#000000',
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#737373',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },
  results: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
  },
  loader: {
    paddingVertical: 20,
  },
  resultsList: {
    maxHeight: 280,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EFEFEF',
  },
  resultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarFallback: {
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#737373',
  },
  tagIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  tagIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0095F6',
  },
  resultInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  verified: {
    fontSize: 12,
    color: '#0095F6',
  },
  resultSub: {
    fontSize: 12,
    color: '#737373',
    marginTop: 1,
  },
  noResults: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
    color: '#737373',
  },
});
