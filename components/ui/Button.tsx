import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
}

export function Button({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  const base = 'flex-row items-center justify-center rounded-xl py-3.5 px-6';

  const variantClass = {
    primary: 'bg-primary-600 active:bg-primary-700',
    outline: 'border border-primary-600 bg-transparent active:bg-primary-50',
    ghost: 'bg-transparent active:bg-neutral-100',
  }[variant];

  const labelClass = {
    primary: 'text-white font-semibold text-base',
    outline: 'text-primary-600 font-semibold text-base',
    ghost: 'text-neutral-700 font-semibold text-base',
  }[variant];

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`${base} ${variantClass} ${isDisabled ? 'opacity-50' : ''} ${className}`}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#ffffff' : '#2563eb'}
          size="small"
          className="mr-2"
        />
      ) : null}
      <Text className={labelClass}>{label}</Text>
    </TouchableOpacity>
  );
}
