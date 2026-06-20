export type OtpChannel = 'sms' | 'whatsapp';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthError {
  message: string;
  code?: string;
}
