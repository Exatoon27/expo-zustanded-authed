import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const { t } = useTranslation('home');

  return (
    <ScrollView className="flex-1 bg-neutral-50" contentContainerClassName="p-6">
      <View className="mb-6 mt-12">
        <Text className="text-2xl font-bold text-neutral-900">
          {t('greeting', { name: user?.name ?? user?.email?.split('@')[0] ?? 'there' })}
        </Text>
        <Text className="text-neutral-500 mt-1">{t('welcome')}</Text>
      </View>

      {unreadCount > 0 && (
        <View className="rounded-xl bg-primary-50 border border-primary-100 p-4 mb-4">
          <Text className="text-primary-700 font-medium">
            {t('unread', { count: unreadCount })}
          </Text>
        </View>
      )}

      <View className="rounded-xl bg-white border border-neutral-200 p-4">
        <Text className="text-sm font-semibold text-neutral-500 mb-1 uppercase tracking-wide">
          {t('your_account')}
        </Text>
        {user?.email && <Text className="text-neutral-700">{user.email}</Text>}
        {user?.phone && <Text className="text-neutral-700">{user.phone}</Text>}
      </View>
    </ScrollView>
  );
}
