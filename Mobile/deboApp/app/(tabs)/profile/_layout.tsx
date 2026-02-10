import { Stack } from 'expo-router';

export default function ProfileStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="UpdateProfile" options={{ headerShown: false }} />
      <Stack.Screen name="ChangePassword" options={{ headerShown: false }} />
    </Stack>
  );
}
