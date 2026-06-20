import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { useAuthStore } from '@/store/authStore';

export default function TabsLayout() {
  const { status } = useAuthStore();
  const router = useRouter();

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
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
