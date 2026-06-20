import { create } from 'zustand';

import { sessionStorage } from '@/storage/session';
import type { AuthStatus, OtpChannel, User } from '@/types/auth';
import { getAuthAdapter } from '@/utils/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: AuthStatus;
  error: string | null;
}

interface AuthActions {
  _initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  sendOtp: (phone: string, channel: OtpChannel) => Promise<void>;
  verifyOtp: (phone: string, code: string) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signInWithApple: (identityToken: string) => Promise<void>;
  signInWithFacebook: (accessToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

const adapter = getAuthAdapter();

async function persistSession(result: { user: User; accessToken: string; refreshToken: string }) {
  await Promise.all([
    sessionStorage.setUser(result.user),
    sessionStorage.setAccessToken(result.accessToken),
    sessionStorage.setRefreshToken(result.refreshToken),
  ]);
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,

  async _initialize() {
    set({ status: 'loading' });
    try {
      const [accessToken, user] = await Promise.all([
        sessionStorage.getAccessToken(),
        sessionStorage.getUser(),
      ]);

      if (!accessToken || !user) {
        set({ status: 'unauthenticated' });
        return;
      }

      const freshUser = await adapter.getCurrentUser();
      if (freshUser) {
        set({ user: freshUser, accessToken, status: 'authenticated' });
      } else {
        await sessionStorage.clear();
        set({ status: 'unauthenticated' });
      }
    } catch {
      await sessionStorage.clear();
      set({ status: 'unauthenticated' });
    }
  },

  async signInWithEmail(email, password) {
    set({ status: 'loading', error: null });
    try {
      const result = await adapter.signInWithEmail(email, password);
      await persistSession(result);
      set({ user: result.user, accessToken: result.accessToken, status: 'authenticated' });
    } catch (e) {
      set({ status: 'unauthenticated', error: (e as Error).message });
    }
  },

  async signUpWithEmail(email, password, name) {
    set({ status: 'loading', error: null });
    try {
      const result = await adapter.signUpWithEmail(email, password, name);
      await persistSession(result);
      set({ user: result.user, accessToken: result.accessToken, status: 'authenticated' });
    } catch (e) {
      set({ status: 'unauthenticated', error: (e as Error).message });
    }
  },

  async sendOtp(phone, channel) {
    set({ error: null });
    try {
      await adapter.sendOtp(phone, channel);
    } catch (e) {
      set({ error: (e as Error).message });
      throw e;
    }
  },

  async verifyOtp(phone, code) {
    set({ status: 'loading', error: null });
    try {
      const result = await adapter.verifyOtp(phone, code);
      await persistSession(result);
      set({ user: result.user, accessToken: result.accessToken, status: 'authenticated' });
    } catch (e) {
      set({ status: 'unauthenticated', error: (e as Error).message });
    }
  },

  async signInWithGoogle(idToken) {
    set({ status: 'loading', error: null });
    try {
      const result = await adapter.signInWithGoogle(idToken);
      await persistSession(result);
      set({ user: result.user, accessToken: result.accessToken, status: 'authenticated' });
    } catch (e) {
      set({ status: 'unauthenticated', error: (e as Error).message });
    }
  },

  async signInWithApple(identityToken) {
    set({ status: 'loading', error: null });
    try {
      const result = await adapter.signInWithApple(identityToken);
      await persistSession(result);
      set({ user: result.user, accessToken: result.accessToken, status: 'authenticated' });
    } catch (e) {
      set({ status: 'unauthenticated', error: (e as Error).message });
    }
  },

  async signInWithFacebook(accessToken) {
    set({ status: 'loading', error: null });
    try {
      const result = await adapter.signInWithFacebook(accessToken);
      await persistSession(result);
      set({ user: result.user, accessToken: result.accessToken, status: 'authenticated' });
    } catch (e) {
      set({ status: 'unauthenticated', error: (e as Error).message });
    }
  },

  async signOut() {
    set({ status: 'loading', error: null });
    try {
      await adapter.signOut();
    } finally {
      await sessionStorage.clear();
      set({ user: null, accessToken: null, status: 'unauthenticated' });
    }
  },

  clearError() {
    set({ error: null });
  },
}));
