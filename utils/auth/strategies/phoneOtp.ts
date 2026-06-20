import { useAuthStore } from '@/store/authStore';
import type { OtpChannel } from '@/types/auth';

export async function sendOtp(phone: string, channel: OtpChannel): Promise<void> {
  await useAuthStore.getState().sendOtp(phone, channel);
}

export async function verifyOtp(phone: string, code: string): Promise<void> {
  await useAuthStore.getState().verifyOtp(phone, code);
}
