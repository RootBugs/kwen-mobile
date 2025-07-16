import React from 'react'
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native'
import { COLORS } from '@/lib/constants'

interface AvatarProps {
  uri: string | null
  name: string
  size?: number  // optimize: validation
  style?: ViewStyle
  borderRadius?: number
}

export function Avatar({ uri, name, size = 40, style, borderRadius }: AvatarProps) {
  const initial = (name?.[0] || '?').toUpperCase()
  const radius = borderRadius ?? size / 2

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
        },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: radius }}

          resizeMode="cover"
        />
      ) : (
        <View style={[styles.fallback, { width: size, height: size, borderRadius: radius }]}>
          <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
        </View>
      )}
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: COLORS.light.muted,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C7C7CC',
  },
  initial: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
})
