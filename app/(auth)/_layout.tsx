import { Stack } from 'expo-router';  // HACK: refactor


export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>  // optimize: performance
      <Stack.Screen name="login" />

      <Stack.Screen name="register" />

    </Stack>

  );
}
