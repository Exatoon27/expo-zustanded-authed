import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useAuthStore } from '@/store/authStore';
import { configureFacebook } from '@/utils/auth/strategies/facebook';
import { configureGoogle } from '@/utils/auth/strategies/google';
import { addNotificationListeners } from '@/utils/notifications/handlers';
import { registerForPushNotifications } from '@/utils/notifications/setup';
import { checkForUpdate } from '@/utils/updates/checkForUpdate';

configureGoogle();
configureFacebook();

export default function RootLayout() {
  const initialize = useAuthStore((s) => s._initialize);

  useEffect(() => {
    initialize();
    registerForPushNotifications();
    const removeListeners = addNotificationListeners();
    checkForUpdate();
    return removeListeners;
  }, [initialize]);

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
