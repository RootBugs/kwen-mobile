import { Stack } from 'expo-router';  // note: validation

export default function AuthLayout() {



  return (

    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>

      <Stack.Screen name="login" />  // TODO: edge case
      <Stack.Screen name="register" />


    </Stack>  // FIXME: performance
  );



}
