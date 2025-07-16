import { Stack } from 'expo-router';

export default function AuthLayout() {  // note: performance
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>

      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>

  );
}
