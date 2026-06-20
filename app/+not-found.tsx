import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-2xl font-bold text-neutral-900 mb-2">{t('not_found_title')}</Text>
      <Text className="text-neutral-500 text-center mb-8">{t('not_found_body')}</Text>
      <Link href="/" className="text-primary-600 font-semibold text-base">
        {t('go_home')}
      </Link>
    </View>
  );
}
