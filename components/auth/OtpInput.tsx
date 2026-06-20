import { useRef, useState } from 'react';
import {
  type NativeSyntheticEvent,
  TextInput,
  type TextInputKeyPressEventData,
  View,
} from 'react-native';

const CODE_LENGTH = 6;

interface OtpInputProps {
  onComplete: (code: string) => void;
  disabled?: boolean;
}

export function OtpInput({ onComplete, disabled }: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const refs = useRef<Array<TextInput | null>>(Array(CODE_LENGTH).fill(null));

  function handleChange(text: string, index: number) {
    const digit = text.replace(/\D/g, '').slice(-1);
    const next = [...values];
    next[index] = digit;
    setValues(next);

    if (digit && index < CODE_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }

    const code = next.join('');
    if (code.length === CODE_LENGTH) {
      onComplete(code);
    }
  }

  function handleKeyPress(e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) {
    if (e.nativeEvent.key === 'Backspace' && !values[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  return (
    <View className="flex-row justify-between gap-2 mb-6">
      {values.map((val, i) => (
        <TextInput
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={val}
          onChangeText={(t) => handleChange(t, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          keyboardType="number-pad"
          maxLength={1}
          editable={!disabled}
          className={`h-14 flex-1 rounded-xl border text-center text-xl font-bold ${
            val
              ? 'border-primary-600 bg-primary-50 text-primary-700'
              : 'border-neutral-300 bg-white text-neutral-900'
          }`}
        />
      ))}
    </View>
  );
}
