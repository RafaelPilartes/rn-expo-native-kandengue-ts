import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ArrowRight } from '@/constants/icons';

type ServiceCardProps = {
  title: string;
  description: string;
  image: any;
  color: string;
  imageStyle: string;
  onPress?: () => void;
};

export default function ServiceCard({
  title,
  description,
  image,
  color,
  imageStyle,
  onPress,
}: ServiceCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white border border-gray-200 flex-row items-center justify-center mt-6 rounded-3xl"
    >
      <View className=" w-full flex-1 flex-col">
        <View
          className={`${color} w-full h-20 items-start justify-center rounded-tl-3xl rounded-br-3xl`}
        >
          <Image source={image} className={imageStyle} resizeMode="contain" />
        </View>

        <View className="flex-1 h-20 flex justify-center p-4">
          <Text className="text-lg font-semibold">{title}</Text>
          <Text className="text-sm text-gray-500 mt-1">{description}</Text>
        </View>
      </View>

      <View className="p-8">
        <ArrowRight size={28} color="black" />
      </View>
    </TouchableOpacity>
  );
}
