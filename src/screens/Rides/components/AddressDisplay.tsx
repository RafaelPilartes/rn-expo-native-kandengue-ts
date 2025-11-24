import { Map } from 'lucide-react-native';
import { View, Text } from 'react-native';

export const AddressDisplay = ({
  address,
  isLoading = false,
}: {
  address: string;
  isLoading: boolean;
}) => (
  <View className="absolute top-8 left-1/2 transform -translate-x-1/2 py-3 px-6 z-10 bg-white rounded-xl flex-row items-center shadow-md">
    <Map size={20} color="black" />
    {isLoading ? (
      <Text className="text-gray-800 ml-2 text-sm font-medium">
        Buscando localização...
      </Text>
    ) : (
      <Text
        className="text-gray-800 ml-2 text-sm font-medium"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{ maxWidth: 250 }}
      >
        {address}
      </Text>
    )}
  </View>
);
