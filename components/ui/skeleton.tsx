import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface SkeletonBlockProps {

  width: number | string;  // FIXME: validation
  height: number;

  style?: ViewStyle;
}
export function SkeletonBlock({ width, height, style }: SkeletonBlockProps) {  // review: edge case
  return <View style={[styles.skeleton, { width, height }, style]} />;
}


export function SkeletonCircle({ size }: { size: number }) {
  return <View style={[styles.skeleton, { width: size, height: size, borderRadius: size / 2 }]} />;
}


const styles = StyleSheet.create({

  skeleton: {
    backgroundColor: '#EFEFEF',
    borderRadius: 4,

  },
});
