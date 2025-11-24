import { Text } from 'react-native';
import { ActivityIndicator, View } from 'react-native';
import PageHeader from './PageHeader';

interface LoadingPageProps {
  title?: string;
  primaryText: string;
  canGoBack?: boolean;
  secondaryText?: string;
  isLoading?: boolean;
}

export const BlackLoadingPage = ({
  primaryText,
  secondaryText,
  isLoading = false,
}: LoadingPageProps) => {
  return (
    <View className="absolute inset-0 bg-black bg-opacity-50 items-center justify-center">
      {!secondaryText && (
        <View className="bg-white p-6 rounded-2xl items-center">
          <ActivityIndicator size="large" color="#EF4444" />
          <Text className="text-gray-700 mt-2">{primaryText}</Text>
        </View>
      )}
      {secondaryText && (
        <View className="bg-white p-6 rounded-2xl flex-col items-center justify-center">
          <ActivityIndicator size="large" color="#EF4444" />
          <View className="flex-col items-center justify-center">
            <Text className="text-lg font-semibold text-gray-700 mt-2">
              {primaryText}
            </Text>
            <Text className="text-sm text-gray-700 mt-2">{secondaryText}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export const BaseLoadingPage = ({
  title = 'Carregando...',
  primaryText,
  canGoBack = true,
  secondaryText,
  isLoading = false,
}: LoadingPageProps) => {
  return (
    <View className="flex-1 bg-gray-50">
      <PageHeader title={title} canGoBack={canGoBack} />
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#EF4444" />
        <Text className="text-gray-600 mt-4">{primaryText}</Text>
      </View>
    </View>
  );
};
