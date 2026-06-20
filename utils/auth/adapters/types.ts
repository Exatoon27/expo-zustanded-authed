import type { AuthResult, OtpChannel, User } from '@/types/auth';

export interface AuthAdapter {
  signInWithEmail(email: string, password: string): Promise<AuthResult>;
  signUpWithEmail(email: string, password: string, name?: string): Promise<AuthResult>;
  sendOtp(phone: string, channel: OtpChannel): Promise<void>;
  verifyOtp(phone: string, code: string): Promise<AuthResult>;
  signInWithGoogle(idToken: string): Promise<AuthResult>;
  signInWithApple(identityToken: string): Promise<AuthResult>;
  signInWithFacebook(accessToken: string): Promise<AuthResult>;
  forgotPassword(email: string): Promise<void>;
  signOut(): Promise<void>;
  refreshSession(refreshToken: string): Promise<AuthResult>;
  getCurrentUser(): Promise<User | null>;
}

export type AdapterType = 'rest' | 'supabase';

export interface RestAdapterConfig {
  baseUrl: string;
  /** Optionally inject an access token for authenticated requests */
  getAccessToken?: () => string | null;
}

export interface SupabaseAdapterConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}
