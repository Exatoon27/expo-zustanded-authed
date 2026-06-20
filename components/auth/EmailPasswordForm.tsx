import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface EmailPasswordFormProps {
  mode: 'login' | 'register';
  onSubmit: (values: { email: string; password: string; name?: string }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function EmailPasswordForm({ mode, onSubmit, loading, error }: EmailPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { t } = useTranslation(['auth', 'errors']);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!email.includes('@')) errors.email = t('errors:invalid_email');
    if (password.length < 8) errors.password = t('errors:password_too_short');
    if (mode === 'register' && !name.trim()) errors.name = t('errors:name_required');
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    await onSubmit({ email, password, name: mode === 'register' ? name : undefined });
  }

  return (
    <View>
      {mode === 'register' && (
        <Input
          label={t('full_name_label')}
          placeholder={t('full_name_placeholder')}
          value={name}
          onChangeText={setName}
          error={fieldErrors.name}
          autoCapitalize="words"
          textContentType="name"
        />
      )}
      <Input
        label={t('email_label')}
        placeholder={t('email_placeholder')}
        value={email}
        onChangeText={setEmail}
        error={fieldErrors.email}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
      />
      <Input
        label={t('password_label')}
        placeholder={t('password_placeholder')}
        value={password}
        onChangeText={setPassword}
        error={fieldErrors.password}
        secureTextEntry
        textContentType={mode === 'register' ? 'newPassword' : 'password'}
        autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
      />
      {error ? (
        <Text className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</Text>
      ) : null}
      <Button
        label={mode === 'login' ? t('sign_in') : t('create_account')}
        onPress={handleSubmit}
        loading={loading}
      />
    </View>
  );
}
