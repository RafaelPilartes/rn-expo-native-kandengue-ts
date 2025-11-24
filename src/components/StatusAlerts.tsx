// src/components/StatusAlerts.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DriverInterface } from '@/interfaces/IDriver';

interface StatusAlertsProps {
  driver: DriverInterface | null;
  balance: number;
  onToDocuments: () => void;
  onToWallet: () => void;
}

const StatusAlerts: React.FC<StatusAlertsProps> = ({
  driver,
  balance,
  onToDocuments,
  onToWallet,
}) => {
  if (driver?.status === 'inactive') {
    return (
      <View className="bg-red-100 border border-red-300 mx-5 p-4 rounded-2xl mb-4">
        <Text className="text-red-800">
          Sua conta está inativa. Por favor, envie seus documentos para
          verificação.
        </Text>
        <TouchableOpacity
          onPress={onToDocuments}
          className="mt-3 bg-red-300 px-4 py-2 rounded-full items-center"
        >
          <Text className="text-red-900 font-semibold">Enviar agora</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (driver?.status === 'pending') {
    return (
      <View className="bg-yellow-100 border border-yellow-300 mx-5 p-4 rounded-2xl mb-4">
        <Text className="text-yellow-800">
          Sua conta ainda está pendente de verificação. Por favor, aguarde.
        </Text>
      </View>
    );
  }

  if (balance < 500 && driver?.status === 'active') {
    return (
      <View className="bg-yellow-100 border border-yellow-300 mx-5 p-4 rounded-2xl mb-4">
        <Text className="text-yellow-800">
          Saldo insuficiente para aceitar corridas. Carregue sua carteira.
        </Text>
        <TouchableOpacity
          onPress={onToWallet}
          className="mt-3 bg-yellow-300 px-4 py-2 rounded-full items-center"
        >
          <Text className="text-yellow-900 font-semibold">Carregar agora</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

export default StatusAlerts;
