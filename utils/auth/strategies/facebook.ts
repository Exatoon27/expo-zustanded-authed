import { AccessToken, LoginManager, Settings } from 'react-native-fbsdk-next';

import { CONFIG } from '@/constants/config';
import { useAuthStore } from '@/store/authStore';

export function configureFacebook(): void {
  Settings.setAppID(CONFIG.FACEBOOK_APP_ID);
  Settings.initializeSDK();
}

export async function signInWithFacebook(): Promise<void> {
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

  if (result.isCancelled) {
    throw new Error('Facebook login was cancelled.');
  }

  const data = await AccessToken.getCurrentAccessToken();
  if (!data?.accessToken) {
    throw new Error('Facebook login did not return an access token.');
  }

  await useAuthStore.getState().signInWithFacebook(data.accessToken);
}
