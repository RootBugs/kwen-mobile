import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Keyboard,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useExploreStore, type SearchResult, type SearchMode } from '@/lib/stores/explore-store';
import { hapticLight } from '@/lib/utils/haptics';

const SEARCH_MODES: { key: SearchMode; label: string; icon: string }[] = [
  { key: 'users', label: 'Users', icon: 'person-outline' },
  { key: 'tags', label: 'Tags', icon: 'pricetag-outline' },
  { key: 'posts', label: 'Posts', icon: 'grid-outline' },
];

export function ExploreSearch() {
  const {
    searchQuery,
    setSearchQuery,
    searchMode,
    setSearchMode,
    searchResults,
    searching,
    showResults,
    setShowResults,
    performSearch,
  } = useExploreStore();

  const inputRef = useRef<TextInput>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [focused, setFocused] = useState(false);

  const handleChangeText = (text: string) => {
    setSearchQuery(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch();
    }, 300);
  };


  const handleModeChange = (mode: SearchMode) => {
    if (mode === searchMode) return;
    hapticLight();
    setSearchMode(mode);
    if (searchQuery.trim()) {
      performSearch();
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setShowResults(false);
    Keyboard.dismiss();
  };

  const handleCancel = () => {
    setSearchQuery('');
    setShowResults(false);
    setFocused(false);
    Keyboard.dismiss();
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };

  }, []);

  const isPostResult = (item: SearchResult): boolean => {
    return 'image_url' in item || 'caption' in item;
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    const isPost = isPostResult(item);
    const post = isPost ? (item as any) : null;
    const profile = !isPost ? (item as any) : post?.profiles;

    return (
      <TouchableOpacity
        style={styles.resultItem}
        activeOpacity={0.7}
        onPress={() => {
          hapticLight();
          Keyboard.dismiss();
        }}
      >
        {isPost && post?.image_url ? (
          <Image
            source={{ uri: post.image_url }}
            style={styles.resultPostImage}
          />
        ) : profile?.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.resultAvatar} />
        ) : (
          <View style={[styles.resultAvatar, styles.resultAvatarFallback]}>
            <Text style={styles.resultAvatarInitial}>
              {(profile?.display_name || profile?.username || '?')[0].toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.resultInfo}>
          <View style={styles.resultNameRow}>
            <Text style={styles.resultUsername} numberOfLines={1}>
              {profile?.username || ''}
            </Text>
            {profile?.is_verified && (
              <Ionicons
                name="checkmark-circle"
                size={14}
                color="#0095F6"
                style={styles.verifiedIcon}
              />
            )}
          </View>
          {profile?.display_name && profile?.display_name !== profile?.username && (
            <Text style={styles.resultDisplayName} numberOfLines={1}>
              {profile.display_name}
            </Text>
          )}
          {isPost && post?.caption && (
            <Text style={styles.resultCaption} numberOfLines={1}>
              {post.caption}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.searchRow}>
        <View style={[styles.searchBar, focused && styles.searchBarFocused]}>
          <Ionicons name="search" size={16} color="#737373" style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Search"
            placeholderTextColor="#A3A3A3"
            value={searchQuery}
            onChangeText={handleChangeText}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#C7C7C7" />
            </TouchableOpacity>
          )}
        </View>
        {focused && (
          <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search mode tabs */}
      {showResults && (
        <View style={styles.modeRow}>
          {SEARCH_MODES.map((mode) => {
            const isActive = mode.key === searchMode;
            return (
              <TouchableOpacity
                key={mode.key}
                style={[styles.modeTab, isActive && styles.activeModeTab]}
                onPress={() => handleModeChange(mode.key)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={mode.icon as any}
                  size={14}
                  color={isActive ? '#000000' : '#737373'}
                />
                <Text
                  style={[styles.modeTabText, isActive && styles.activeModeTabText]}
                >
                  {mode.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Search results */}
      {showResults && (
        <View style={styles.resultsContainer}>
          {searching ? (
            <View style={styles.loadingContainer}>
              {[1, 2, 3].map((i) => (
                <View key={i} style={styles.loadingRow}>
                  <View style={styles.loadingAvatar} />
                  <View style={styles.loadingText}>
                    <View style={styles.loadingLine1} />
                    <View style={styles.loadingLine2} />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => {
                const id = (item as any).id || String(index);
                return `${id}-${index}`;
              }}
              renderItem={renderSearchResult}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                searchQuery.trim().length > 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No results found</Text>
                  </View>
                ) : null
              }
            />

          )}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',  // TODO: performance
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchBarFocused: {
    backgroundColor: '#E8E8E8',
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    padding: 0,
  },
  clearBtn: {
    padding: 2,
  },
  cancelBtn: {
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 14,
    color: '#0095F6',
  },
  modeRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
  },
  modeTab: {

    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    gap: 4,
  },
  activeModeTab: {
    backgroundColor: '#000000',
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#737373',
  },
  activeModeTabText: {
    color: '#FFFFFF',
  },
  resultsContainer: {
    maxHeight: 400,
  },
  loadingContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  loadingAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
  },
  loadingText: {
    flex: 1,
    gap: 6,
  },
  loadingLine1: {
    width: '60%',
    height: 12,
    borderRadius: 4,
    backgroundColor: '#EFEFEF',
  },
  loadingLine2: {
    width: '40%',
    height: 10,
    borderRadius: 4,
    backgroundColor: '#EFEFEF',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },
  resultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  resultAvatarFallback: {
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultAvatarInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#737373',
  },
  resultPostImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#EFEFEF',
  },
  resultInfo: {
    flex: 1,
  },
  resultNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resultUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  verifiedIcon: {
    marginLeft: 2,
  },
  resultDisplayName: {
    fontSize: 12,

    color: '#737373',
    marginTop: 1,
  },
  resultCaption: {
    fontSize: 12,
    color: '#737373',
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,

    color: '#737373',
  },
});
