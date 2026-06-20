import type { Notification } from 'expo-notifications';
import { create } from 'zustand';

interface NotificationState {
  pushToken: string | null;
  unreadCount: number;
  lastNotification: Notification | null;
}

interface NotificationActions {
  setPushToken: (token: string) => void;
  setLastNotification: (notification: Notification) => void;
  incrementUnread: () => void;
  clearUnread: () => void;
}

export const useNotificationStore = create<NotificationState & NotificationActions>((set) => ({
  pushToken: null,
  unreadCount: 0,
  lastNotification: null,

  setPushToken(token) {
    set({ pushToken: token });
  },

  setLastNotification(notification) {
    set({ lastNotification: notification });
  },

  incrementUnread() {
    set((s) => ({ unreadCount: s.unreadCount + 1 }));
  },

  clearUnread() {
    set({ unreadCount: 0 });
  },
}));
