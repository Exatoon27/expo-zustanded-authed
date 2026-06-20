import * as Notifications from 'expo-notifications';

import { useNotificationStore } from '@/store/notificationStore';

type Subscription = ReturnType<typeof Notifications.addNotificationReceivedListener>;

let receivedSub: Subscription | null = null;
let responseSub: Subscription | null = null;

export function addNotificationListeners(): () => void {
  receivedSub = Notifications.addNotificationReceivedListener((notification) => {
    useNotificationStore.getState().setLastNotification(notification);
    useNotificationStore.getState().incrementUnread();
  });

  responseSub = Notifications.addNotificationResponseReceivedListener((_response) => {
    // Handle notification tap — navigate to a specific screen if needed.
    // Example: router.push(`/notifications/${response.notification.request.identifier}`);
  });

  return () => {
    receivedSub?.remove();
    responseSub?.remove();
  };
}
