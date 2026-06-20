import * as AppleAuthentication from 'expo-apple-authentication';

import { useAuthStore } from '@/store/authStore';

export async function signInWithApple(): Promise<void> {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error('Apple Sign-In did not return an identity token.');
  }

  await useAuthStore.getState().signInWithApple(credential.identityToken);
}

export async function isAppleSignInAvailable(): Promise<boolean> {
  return AppleAuthentication.isAvailableAsync();
}
