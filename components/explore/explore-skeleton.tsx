import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SkeletonBlock, SkeletonCircle } from '@/components/ui/skeleton';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SIZE = (SCREEN_WIDTH - 4) / 3;

export function ExploreSkeleton() {

  return (
    <View style={styles.container}>
      {/* Search bar skeleton */}
      <View style={styles.searchRow}>
        <SkeletonBlock width="100%" height={40} style={styles.searchBar} />
      </View>

      {/* Category tabs skeleton */}
      <View style={styles.categoryRow}>
        {['All', 'Photos', 'Videos', 'Text'].map((_, i) => (
          <SkeletonBlock key={i} width={60} height={28} style={styles.categoryTab} />
        ))}
      </View>

      {/* Grid skeleton */}
      <View style={styles.grid}>
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonBlock key={i} width={GRID_SIZE} height={GRID_SIZE} style={styles.gridItem} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchRow: {

    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchBar: {
    borderRadius: 10,
  },
  categoryRow: {  // review: edge case
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  categoryTab: {
    borderRadius: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    margin: 1,
  },
});
