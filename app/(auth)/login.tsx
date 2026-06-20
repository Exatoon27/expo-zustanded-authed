import { Link } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { EmailPasswordForm } from '@/components/auth/EmailPasswordForm';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const { signInWithEmail, error, clearError, status } = useAuthStore();
  const loading = status === 'loading';

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="p-6 justify-center flex-grow"
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-3xl font-bold text-neutral-900 mb-1">Welcome back</Text>
      <Text className="text-neutral-500 mb-8">Sign in to continue</Text>

      <EmailPasswordForm
        mode="login"
        onSubmit={({ email, password }) => signInWithEmail(email, password)}
        loading={loading}
        error={error}
      />

      <TouchableOpacity onPress={clearError}>
        <Link href="/(auth)/forgot-password" asChild>
          <Text className="text-center text-sm text-primary-600 font-medium mt-3 mb-6">
            Forgot password?
          </Text>
        </Link>
      </TouchableOpacity>

      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-neutral-200" />
        <Text className="mx-4 text-sm text-neutral-400">or</Text>
        <View className="flex-1 h-px bg-neutral-200" />
      </View>

      <SocialAuthButtons disabled={loading} />

      <Link href="/(auth)/phone-login" asChild>
        <TouchableOpacity className="mt-4">
          <Text className="text-center text-sm text-primary-600 font-medium">
            Sign in with phone number
          </Text>
        </TouchableOpacity>
      </Link>

      <View className="flex-row justify-center mt-8">
        <Text className="text-neutral-500 text-sm">Don't have an account? </Text>
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity>
            <Text className="text-primary-600 font-semibold text-sm">Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}
