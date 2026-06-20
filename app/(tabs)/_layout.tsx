import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { useAuthStore } from '@/store/authStore';

export default function TabsLayout() {
  const { status } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/(auth)/login');
    }
  }, [status, router]);

  if (status === 'idle' || status === 'loading') {
    return <LoadingOverlay />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab_home'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tab_profile'),
        }}
      />
    </Tabs>
  );
}
