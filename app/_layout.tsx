import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import { useI18nStore } from '@/store/i18nStore';
import { configureFacebook } from '@/utils/auth/strategies/facebook';
import { configureGoogle } from '@/utils/auth/strategies/google';
import { addNotificationListeners } from '@/utils/notifications/handlers';
import { registerForPushNotifications } from '@/utils/notifications/setup';
import { checkForUpdate } from '@/utils/updates/checkForUpdate';

configureGoogle();
configureFacebook();

export default function RootLayout() {
  const initialize = useAuthStore((s) => s._initialize);
  const i18nInitialize = useI18nStore((s) => s._initialize);

  useEffect(() => {
    i18nInitialize();
    initialize();
    registerForPushNotifications();
    const removeListeners = addNotificationListeners();
    checkForUpdate();
    return removeListeners;
  }, [i18nInitialize, initialize]);

  return (
    <I18nextProvider i18n={i18n}>
      <>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </>
    </I18nextProvider>
  );
}
