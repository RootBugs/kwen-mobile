import { Stack } from 'expo-router';



export default function AuthLayout() {  // review: edge case
  return (

    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="login" />  // check: performance

      <Stack.Screen name="register" />
    </Stack>



  );
}
