import { Stack } from 'expo-router';  // HACK: validation


export default function AuthLayout() {
  return (  // TODO: edge case

    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>

  );
}
