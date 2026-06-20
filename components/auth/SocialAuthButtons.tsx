import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

import { isAppleSignInAvailable, signInWithApple } from '@/utils/auth/strategies/apple';
import { signInWithFacebook } from '@/utils/auth/strategies/facebook';
import { signInWithGoogle } from '@/utils/auth/strategies/google';

interface SocialAuthButtonsProps {
  onError?: (error: Error) => void;
  disabled?: boolean;
}

export function SocialAuthButtons({ onError, disabled }: SocialAuthButtonsProps) {
  const [appleAvailable, setAppleAvailable] = useState(false);
  const { t } = useTranslation('auth');

  useEffect(() => {
    if (Platform.OS === 'ios') {
      isAppleSignInAvailable().then(setAppleAvailable);
    }
  }, []);

  async function handleGoogle() {
    try {
      await signInWithGoogle();
    } catch (e) {
      onError?.(e as Error);
    }
  }

  async function handleApple() {
    try {
      await signInWithApple();
    } catch (e) {
      onError?.(e as Error);
    }
  }

  async function handleFacebook() {
    try {
      await signInWithFacebook();
    } catch (e) {
      onError?.(e as Error);
    }
  }

  return (
    <View className="gap-3">
      <SocialButton label={t('google')} onPress={handleGoogle} disabled={disabled} />
      <SocialButton label={t('facebook')} onPress={handleFacebook} disabled={disabled} />
      {appleAvailable && (
        <SocialButton label={t('apple')} onPress={handleApple} disabled={disabled} dark />
      )}
    </View>
  );
}

function SocialButton({
  label,
  onPress,
  disabled,
  dark,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  dark?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      className={`flex-row items-center justify-center rounded-xl border py-3.5 px-6 ${
        dark ? 'border-black bg-black' : 'border-neutral-200 bg-white'
      } ${disabled ? 'opacity-50' : ''}`}
    >
      <Text className={`text-base font-semibold ${dark ? 'text-white' : 'text-neutral-800'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
