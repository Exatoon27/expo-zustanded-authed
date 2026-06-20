/**
 * Supabase adapter stub.
 *
 * To activate:
 *  1. `bun add @supabase/supabase-js`
 *  2. Uncomment the implementation below and remove the TODOs.
 *  3. In utils/auth/index.ts change `getAuthAdapter()` to return
 *     `new SupabaseAdapter({ supabaseUrl: CONFIG.SUPABASE_URL, supabaseAnonKey: CONFIG.SUPABASE_ANON_KEY })`.
 */
import type { AuthResult, OtpChannel, User } from '@/types/auth';

import type { AuthAdapter, SupabaseAdapterConfig } from './types';

export class SupabaseAdapter implements AuthAdapter {
  // TODO: private supabase: SupabaseClient;

  constructor(_config: SupabaseAdapterConfig) {
    // TODO: this.supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
  }

  async signInWithEmail(_email: string, _password: string): Promise<AuthResult> {
    // TODO: const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    throw new Error('SupabaseAdapter: not implemented');
  }

  async signUpWithEmail(_email: string, _password: string, _name?: string): Promise<AuthResult> {
    // TODO: const { data, error } = await this.supabase.auth.signUp({ email, password, options: { data: { name } } });
    throw new Error('SupabaseAdapter: not implemented');
  }

  async sendOtp(_phone: string, _channel: OtpChannel): Promise<void> {
    // TODO: await this.supabase.auth.signInWithOtp({ phone, channel });
    throw new Error('SupabaseAdapter: not implemented');
  }

  async verifyOtp(_phone: string, _code: string): Promise<AuthResult> {
    // TODO: const { data, error } = await this.supabase.auth.verifyOtp({ phone, token: code, type: 'sms' });
    throw new Error('SupabaseAdapter: not implemented');
  }

  async signInWithGoogle(_idToken: string): Promise<AuthResult> {
    // TODO: const { data, error } = await this.supabase.auth.signInWithIdToken({ provider: 'google', token: idToken });
    throw new Error('SupabaseAdapter: not implemented');
  }

  async signInWithApple(_identityToken: string): Promise<AuthResult> {
    // TODO: const { data, error } = await this.supabase.auth.signInWithIdToken({ provider: 'apple', token: identityToken });
    throw new Error('SupabaseAdapter: not implemented');
  }

  async signInWithFacebook(_accessToken: string): Promise<AuthResult> {
    // TODO: const { data, error } = await this.supabase.auth.signInWithIdToken({ provider: 'facebook', token: accessToken });
    throw new Error('SupabaseAdapter: not implemented');
  }

  async forgotPassword(_email: string): Promise<void> {
    // TODO: await this.supabase.auth.resetPasswordForEmail(email);
    throw new Error('SupabaseAdapter: not implemented');
  }

  async signOut(): Promise<void> {
    // TODO: await this.supabase.auth.signOut();
    throw new Error('SupabaseAdapter: not implemented');
  }

  async refreshSession(_refreshToken: string): Promise<AuthResult> {
    // TODO: const { data, error } = await this.supabase.auth.refreshSession({ refresh_token: refreshToken });
    throw new Error('SupabaseAdapter: not implemented');
  }

  async getCurrentUser(): Promise<User | null> {
    // TODO: const { data } = await this.supabase.auth.getUser(); return data.user ? mapUser(data.user) : null;
    throw new Error('SupabaseAdapter: not implemented');
  }
}
