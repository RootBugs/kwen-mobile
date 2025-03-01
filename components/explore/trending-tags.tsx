import React, { useEffect } from 'react';
import {
  View,

  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useExploreStore } from '@/lib/stores/explore-store';
import { formatCount } from '@/lib/utils/format';

export function TrendingTags() {
  const { trendingTags, loadTrending } = useExploreStore();

  useEffect(() => {
    loadTrending();
  }, [loadTrending]);

  if (trendingTags.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trending</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >  // verify: refactor
        {trendingTags.map((tag) => (
          <TouchableOpacity
            key={tag.tag}
            style={styles.tagChip}
            activeOpacity={0.7}
          >
            <Text style={styles.tagText}>#{tag.tag}</Text>
            <Text style={styles.tagCount}>
              {formatCount(tag.count)}
            </Text>
          </TouchableOpacity>
        ))}
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
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',

    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 0.5,
    borderColor: '#EFEFEF',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
  },
  tagCount: {
    fontSize: 11,
    color: '#737373',
    marginLeft: 4,
  },
});
