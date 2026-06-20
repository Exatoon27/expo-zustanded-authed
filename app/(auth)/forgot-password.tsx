import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getAuthAdapter } from '@/utils/auth';

const adapter = getAuthAdapter();

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await adapter.forgotPassword(email);
      Alert.alert('Check your inbox', `We sent a reset link to ${email}.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      setError('Something went wrong. Please try again.');
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
      <Text className="text-3xl font-bold text-neutral-900 mb-1">Reset password</Text>
      <Text className="text-neutral-500 mb-8">
        Enter your email and we'll send you a reset link.
      </Text>

      <Input
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        error={error}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
      />

      <Button label="Send reset link" onPress={handleSubmit} loading={loading} />

      <Button
        label="Back to sign in"
        onPress={() => router.back()}
        variant="ghost"
        className="mt-3"
      />
    </ScrollView>
  );
}
