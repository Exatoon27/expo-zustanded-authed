import { Link } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { EmailPasswordForm } from '@/components/auth/EmailPasswordForm';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { useAuthStore } from '@/store/authStore';

export default function RegisterScreen() {
  const { signUpWithEmail, error, status } = useAuthStore();
  const loading = status === 'loading';

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="p-6 justify-center flex-grow"
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-3xl font-bold text-neutral-900 mb-1">Create account</Text>
      <Text className="text-neutral-500 mb-8">Get started for free</Text>

      <EmailPasswordForm
        mode="register"
        onSubmit={({ email, password, name }) => signUpWithEmail(email, password, name)}
        loading={loading}
        error={error}
      />

      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-neutral-200" />
        <Text className="mx-4 text-sm text-neutral-400">or</Text>
        <View className="flex-1 h-px bg-neutral-200" />
      </View>

      <SocialAuthButtons disabled={loading} />

      <View className="flex-row justify-center mt-8">
        <Text className="text-neutral-500 text-sm">Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text className="text-primary-600 font-semibold text-sm">Sign in</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}
