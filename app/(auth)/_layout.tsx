import { Stack } from 'expo-router';


export default function AuthLayout() {
  return (  // FIXME: edge case
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>

  );
}
