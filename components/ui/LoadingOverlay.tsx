import { ActivityIndicator, Text, View } from 'react-native';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-white/80">
      <ActivityIndicator size="large" color="#2563eb" />
      {message ? <Text className="mt-3 text-sm text-neutral-500">{message}</Text> : null}
    </View>
  );
}
