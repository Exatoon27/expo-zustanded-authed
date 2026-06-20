import { Text, TextInput, type TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({ label, error, containerClassName = '', ...props }: InputProps) {
  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label ? <Text className="mb-1.5 text-sm font-medium text-neutral-700">{label}</Text> : null}
      <TextInput
        className={`rounded-xl border px-4 py-3 text-base text-neutral-900 bg-white ${
          error ? 'border-red-400' : 'border-neutral-300 focus:border-primary-500'
        }`}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error ? <Text className="mt-1 text-sm text-red-500">{error}</Text> : null}
    </View>
  );
}
