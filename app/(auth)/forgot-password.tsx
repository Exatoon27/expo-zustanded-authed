import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getAuthAdapter } from '@/utils/auth';

const adapter = getAuthAdapter();

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation(['common', 'auth', 'errors']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!email.includes('@')) {
      setError(t('errors:invalid_email'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      await adapter.forgotPassword(email);
      Alert.alert(t('auth:check_inbox'), t('auth:reset_link_sent', { email }), [
        { text: t('ok'), onPress: () => router.back() },
      ]);
    } catch {
      setError(t('errors:generic'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="p-6 justify-center flex-grow"
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-3xl font-bold text-neutral-900 mb-1">{t('auth:reset_password')}</Text>
      <Text className="text-neutral-500 mb-8">{t('auth:reset_password_subtitle')}</Text>

      <Input
        label={t('auth:email_label')}
        placeholder={t('auth:email_placeholder')}
        value={email}
        onChangeText={setEmail}
        error={error}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
      />

      <Button label={t('auth:send_reset_link')} onPress={handleSubmit} loading={loading} />

      <Button
        label={t('back_to_sign_in')}
        onPress={() => router.back()}
        variant="ghost"
        className="mt-3"
      />
    </ScrollView>
  );
}
