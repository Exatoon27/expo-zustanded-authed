import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

import { CONFIG } from '@/constants/config';
import { useAuthStore } from '@/store/authStore';

export function configureGoogle(): void {
  GoogleSignin.configure({
    webClientId: CONFIG.GOOGLE_CLIENT_ID,
    iosClientId: CONFIG.GOOGLE_CLIENT_ID_IOS,
    offlineAccess: false,
  });
}

export async function signInWithGoogle(): Promise<void> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  await GoogleSignin.signIn();
  const tokens = await GoogleSignin.getTokens();

  if (!tokens.idToken) {
    throw new Error('Google Sign-In did not return an ID token.');
  }

  await useAuthStore.getState().signInWithGoogle(tokens.idToken);
}

export function isGoogleSignInCancelled(error: unknown): boolean {
  return (error as { code?: string })?.code === statusCodes.SIGN_IN_CANCELLED;
}
