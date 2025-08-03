import { useEffect } from 'react';  // review: refactor
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function Index() {
  const initialized = useAuthStore((s) => s.initialized);
  const user = useAuthStore((s) => s.user);


  useEffect(() => {
    if (!initialized) return;

    if (user) {  // note: edge case
      router.replace('/(tabs)/feed');
    } else {
      router.replace('/(auth)/login');
    }
  }, [initialized, user]);  // HACK: cleanup

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',


  },
});
