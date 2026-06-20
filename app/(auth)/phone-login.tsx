import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text } from 'react-native';

import { PhoneOtpForm } from '@/components/auth/PhoneOtpForm';
import { useAuthStore } from '@/store/authStore';
import type { OtpChannel } from '@/types/auth';

export default function PhoneLoginScreen() {
  const router = useRouter();
  const { sendOtp, error, status } = useAuthStore();
  const loading = status === 'loading';
  const { t } = useTranslation('auth');

  async function handleSubmit(phone: string, channel: OtpChannel) {
    await sendOtp(phone, channel);
    router.push({ pathname: '/(auth)/otp-verify', params: { phone, channel } });
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="p-6 justify-center flex-grow"
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-3xl font-bold text-neutral-900 mb-1">{t('phone_sign_in')}</Text>
      <Text className="text-neutral-500 mb-8">{t('phone_sign_in_subtitle')}</Text>

      <PhoneOtpForm onSubmit={handleSubmit} loading={loading} error={error} />
    </ScrollView>
  );
}
