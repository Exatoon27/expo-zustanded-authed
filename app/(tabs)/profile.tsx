import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';

export default function ProfileScreen() {
  const { user, signOut, status } = useAuthStore();
  const pushToken = useNotificationStore((s) => s.pushToken);
  const loading = status === 'loading';
  const { t } = useTranslation(['profile', 'common']);

  function handleSignOut() {
    Alert.alert(t('sign_out'), t('sign_out_confirm'), [
      { text: t('common:cancel'), style: 'cancel' },
      { text: t('sign_out'), style: 'destructive', onPress: signOut },
    ]);
  }

  return (
    <ScrollView className="flex-1 bg-neutral-50" contentContainerClassName="p-6">
      <View className="mt-12 mb-6">
        <Text className="text-2xl font-bold text-neutral-900">{t('title')}</Text>
      </View>

      <View className="rounded-xl bg-white border border-neutral-200 mb-4 overflow-hidden">
        <InfoRow label={t('name')} value={user?.name ?? '—'} />
        <InfoRow label={t('email')} value={user?.email ?? '—'} />
        <InfoRow label={t('phone')} value={user?.phone ?? '—'} />
        <InfoRow
          label={t('member_since')}
          value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
          last
        />
      </View>

      {pushToken && (
        <View className="rounded-xl bg-neutral-100 p-4 mb-4">
          <Text className="text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">
            {t('push_token')}
          </Text>
          <Text className="text-xs text-neutral-600 font-mono" numberOfLines={2}>
            {pushToken}
          </Text>
        </View>
      )}

      <View className="mb-6">
        <Text className="text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-wide">
          {t('language')}
        </Text>
        <LanguageSelector />
      </View>

      <Button
        label={t('sign_out')}
        onPress={handleSignOut}
        variant="outline"
        loading={loading}
        className="border-red-400"
      />
    </ScrollView>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View
      className={`flex-row items-center justify-between px-4 py-3 ${!last ? 'border-b border-neutral-100' : ''}`}
    >
      <Text className="text-sm text-neutral-500 w-28">{label}</Text>
      <Text className="text-sm font-medium text-neutral-800 flex-1 text-right">{value}</Text>
    </View>
  );
}
