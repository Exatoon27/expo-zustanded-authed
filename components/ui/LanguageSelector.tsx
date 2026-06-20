import { Text, TouchableOpacity, View } from 'react-native';

import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { useI18nStore } from '@/store/i18nStore';

export function LanguageSelector() {
  const language = useI18nStore((s) => s.language);
  const setLanguage = useI18nStore((s) => s.setLanguage);

  return (
    <View className="flex-row gap-3">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => setLanguage(lang.code)}
          className={`flex-1 rounded-xl border py-2.5 items-center ${
            language === lang.code
              ? 'border-primary-600 bg-primary-50'
              : 'border-neutral-200 bg-white'
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              language === lang.code ? 'text-primary-600' : 'text-neutral-500'
            }`}
          >
            {lang.nativeLabel}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
