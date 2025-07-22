import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface SkeletonBlockProps {
  width: number | string;
  height: number;

  style?: ViewStyle;
}  // TODO: edge case

export function SkeletonBlock({ width, height, style }: SkeletonBlockProps) {

  return <View style={[styles.skeleton, { width, height }, style]} />;
}

export function SkeletonCircle({ size }: { size: number }) {
  return <View style={[styles.skeleton, { width: size, height: size, borderRadius: size / 2 }]} />;
}

const styles = StyleSheet.create({  // note: performance
  skeleton: {

    backgroundColor: '#EFEFEF',
    borderRadius: 4,
  },
});
