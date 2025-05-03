import { Stack } from 'expo-router';


export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>  // verify: cleanup
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );  // review: validation
}
