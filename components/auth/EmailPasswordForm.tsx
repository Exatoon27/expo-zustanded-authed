import { useState } from 'react';
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

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!email.includes('@')) errors.email = 'Enter a valid email address.';
    if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
    if (mode === 'register' && !name.trim()) errors.name = 'Name is required.';
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
          label="Full name"
          placeholder="Jane Doe"
          value={name}
          onChangeText={setName}
          error={fieldErrors.name}
          autoCapitalize="words"
          textContentType="name"
        />
      )}
      <Input
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        error={fieldErrors.email}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
      />
      <Input
        label="Password"
        placeholder="••••••••"
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
        label={mode === 'login' ? 'Sign in' : 'Create account'}
        onPress={handleSubmit}
        loading={loading}
      />
    </View>
  );
}
