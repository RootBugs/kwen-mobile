import { View, StyleSheet } from 'react-native';


function SkeletonBlock({ width, height, style }: { width: string | number; height: number; style?: any }) {
  return <View style={[styles.skeleton, { width, height }, style]} />;
}

export function FeedSkeleton() {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.post}>
          <View style={styles.header}>
            <SkeletonBlock width={36} height={36} style={styles.avatar} />
            <View style={styles.headerText}>
              <SkeletonBlock width={120} height={14} style={{ marginBottom: 6 }} />
              <SkeletonBlock width={80} height={11} />
            </View>
          </View>
          <SkeletonBlock width="100%" height={300} style={{ borderRadius: 0 }} />
          <View style={styles.actions}>
            <SkeletonBlock width={80} height={24} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  post: {
    marginBottom: 12,
  },
  header: {

    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  avatar: {
    borderRadius: 18,
    marginRight: 10,
  },
  headerText: {

    flex: 1,
  },
  actions: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  skeleton: {
    backgroundColor: '#EFEFEF',
    borderRadius: 4,
  },
});
