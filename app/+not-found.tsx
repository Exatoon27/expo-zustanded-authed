import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-2xl font-bold text-neutral-900 mb-2">Screen not found</Text>
      <Text className="text-neutral-500 text-center mb-8">
        The page you're looking for doesn't exist.
      </Text>
      <Link href="/" className="text-primary-600 font-semibold text-base">
        Go home
      </Link>
    </View>
  );
}
