import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { useAuthStore } from '@/store/authStore';

export default function AuthLayout() {
  const { status } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/(tabs)');
    }
  }, [status, router]);

  if (status === 'idle' || status === 'loading') {
    return <LoadingOverlay />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="phone-login" />
      <Stack.Screen name="otp-verify" />
    </Stack>
  );
}
