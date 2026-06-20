import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { OtpChannel } from '@/types/auth';

interface PhoneOtpFormProps {
  onSubmit: (phone: string, channel: OtpChannel) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function PhoneOtpForm({ onSubmit, loading, error }: PhoneOtpFormProps) {
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<OtpChannel>('sms');
  const [fieldError, setFieldError] = useState('');

  function validate(): boolean {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 7) {
      setFieldError('Enter a valid phone number.');
      return false;
    }
    setFieldError('');
    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;
    await onSubmit(phone, channel);
  }

  return (
    <View>
      <Input
        label="Phone number"
        placeholder="+1 555 000 0000"
        value={phone}
        onChangeText={setPhone}
        error={fieldError}
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        autoComplete="tel"
      />

      <Text className="mb-2 text-sm font-medium text-neutral-700">Send code via</Text>
      <View className="mb-4 flex-row gap-3">
        {(['sms', 'whatsapp'] as OtpChannel[]).map((ch) => (
          <TouchableOpacity
            key={ch}
            onPress={() => setChannel(ch)}
            className={`flex-1 rounded-xl border py-2.5 items-center ${
              channel === ch ? 'border-primary-600 bg-primary-50' : 'border-neutral-200 bg-white'
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                channel === ch ? 'text-primary-600' : 'text-neutral-500'
              }`}
            >
              {ch === 'sms' ? 'SMS' : 'WhatsApp'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? (
        <Text className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</Text>
      ) : null}

      <Button label="Send code" onPress={handleSubmit} loading={loading} />
    </View>
  );
}
