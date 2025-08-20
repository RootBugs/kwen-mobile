import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useExploreStore } from '@/lib/stores/explore-store'
import { COLORS } from '@/lib/constants'
import { hapticLight } from '@/lib/utils/haptics'

const CATEGORIES = ['All', 'Photos', 'Videos', 'Text'] as const

export function CategoryTabs() {
  const { activeCategory, setActiveCategory } = useExploreStore()

  const handleCategoryPress = (category: typeof activeCategory) => {
    hapticLight()
    setActiveCategory(category)
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}

      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.tab,
            activeCategory === category && styles.tabActive,
          ]}
          onPress={() => handleCategoryPress(category)}
        >
          <Text
            style={[
              styles.tabText,

              activeCategory === category && styles.tabTextActive,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.light.muted,
    borderWidth: 1,

    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: COLORS.light.foreground,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.light.mutedForeground,
  },
  tabTextActive: {
    color: COLORS.light.background,
  },
})
