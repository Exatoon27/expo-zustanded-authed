import { useAuthStore } from '@/store/authStore';

export async function signInWithEmail(email: string, password: string): Promise<void> {
  await useAuthStore.getState().signInWithEmail(email, password);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name?: string,
): Promise<void> {
  await useAuthStore.getState().signUpWithEmail(email, password, name);
}
