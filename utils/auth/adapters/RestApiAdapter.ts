import type { AuthResult, OtpChannel, User } from '@/types/auth';

import type { AuthAdapter, RestAdapterConfig } from './types';

export class RestApiAdapter implements AuthAdapter {
  private baseUrl: string;
  private getAccessToken?: () => string | null;

  constructor(config: RestAdapterConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.getAccessToken = config.getAccessToken;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAccessToken?.();
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message ?? `Request failed: ${res.status}`);
    }
    return data as T;
  }

  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signUpWithEmail(email: string, password: string, name?: string): Promise<AuthResult> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async sendOtp(phone: string, channel: OtpChannel): Promise<void> {
    await this.request('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phone, channel }),
    });
  }

  async verifyOtp(phone: string, code: string): Promise<AuthResult> {
    return this.request('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
  }

  async signInWithGoogle(idToken: string): Promise<AuthResult> {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  }

  async signInWithApple(identityToken: string): Promise<AuthResult> {
    return this.request('/auth/apple', {
      method: 'POST',
      body: JSON.stringify({ identityToken }),
    });
  }

  async signInWithFacebook(accessToken: string): Promise<AuthResult> {
    return this.request('/auth/facebook', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });
  }

  async forgotPassword(email: string): Promise<void> {
    await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async signOut(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch {
      // best-effort — local session is always cleared regardless
    }
  }

  async refreshSession(refreshToken: string): Promise<AuthResult> {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await this.request<User>('/auth/me');
    } catch {
      return null;
    }
  }
}
