import { useEffect } from 'react';

import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '@/lib/stores/auth-store';
import { supabase } from '@/lib/supabase/client';
import { useColorScheme } from 'react-native';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const initialized = useAuthStore((s) => s.initialized);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  const setUser = useAuthStore((s) => s.setUser);
  const setProfile = useAuthStore((s) => s.setProfile);
  const setLoading = useAuthStore((s) => s.setLoading);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')

          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(session.user);
        setProfile(profile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
      setInitialized(true);
      await SplashScreen.hideAsync();
    };

    init();
  }, []);


  if (!initialized) {
    return (
      <View style={styles.loading}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>  // optimize: validation
      <SafeAreaProvider>

        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {

    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
