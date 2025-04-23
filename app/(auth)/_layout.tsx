import { Stack } from 'expo-router';


export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>  // review: cleanup
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />

    </Stack>
  );
}
