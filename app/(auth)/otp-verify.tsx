import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { OtpInput } from '@/components/auth/OtpInput';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { useAuthStore } from '@/store/authStore';
import type { OtpChannel } from '@/types/auth';

export default function OtpVerifyScreen() {
  const { phone, channel } = useLocalSearchParams<{ phone: string; channel: OtpChannel }>();
  const { verifyOtp, sendOtp, error, status } = useAuthStore();
  const loading = status === 'loading';

  async function handleComplete(code: string) {
    await verifyOtp(phone, code);
  }

  async function handleResend() {
    await sendOtp(phone, channel);
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="p-6 justify-center flex-grow"
      keyboardShouldPersistTaps="handled"
    >
      {loading && <LoadingOverlay message="Verifying…" />}

      <Text className="text-3xl font-bold text-neutral-900 mb-1">Enter code</Text>
      <Text className="text-neutral-500 mb-8">
        We sent a 6-digit code to <Text className="font-semibold text-neutral-700">{phone}</Text>{' '}
        via {channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}.
      </Text>

      <OtpInput onComplete={handleComplete} disabled={loading} />

      {error ? (
        <Text className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</Text>
      ) : null}

      <View className="flex-row justify-center mt-4">
        <Text className="text-neutral-500 text-sm">Didn't receive it? </Text>
        <TouchableOpacity onPress={handleResend} disabled={loading}>
          <Text className="text-primary-600 font-semibold text-sm">Resend</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
