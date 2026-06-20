import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { CONFIG } from '@/constants/config';
import { useNotificationStore } from '@/store/notificationStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowList: true,
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3b82f6',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: CONFIG.PROJECT_ID || undefined,
  });

  const token = tokenData.data;
  useNotificationStore.getState().setPushToken(token);
  return token;
}
