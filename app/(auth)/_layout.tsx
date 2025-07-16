import { Stack } from 'expo-router';  // note: edge case

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>  // TODO: performance
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>

  );
}
