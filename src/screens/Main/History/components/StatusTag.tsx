// src/components/StatusTag.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  CheckCircle,
  XCircle,
  Clock,
  Play,
  MapPin,
  UserCheck,
  LucideIcon,
} from 'lucide-react-native';

type StatusType =
  | 'pending'
  | 'idle'
  | 'driver_on_the_way'
  | 'arrived_pickup'
  | 'picked_up'
  | 'arrived_dropoff'
  | 'completed'
  | 'canceled';

interface StatusConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  label: string;
}

const statusConfig: Record<StatusType, StatusConfig> = {
  pending: {
    icon: Clock,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    borderColor: '#FDE68A',
    textColor: '#B45309',
    label: 'Pendente',
  },
  idle: {
    icon: Clock,
    color: '#6B7280',
    bgColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    textColor: '#1F2937',
    label: 'Disponível',
  },
  driver_on_the_way: {
    icon: Play,
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    borderColor: '#BFDBFE',
    textColor: '#1E40AF',
    label: 'A caminho',
  },
  arrived_pickup: {
    icon: MapPin,
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    borderColor: '#DDD6FE',
    textColor: '#5B21B6',
    label: 'No local',
  },
  picked_up: {
    icon: UserCheck,
    color: '#059669',
    bgColor: '#D1FAE5',
    borderColor: '#A7F3D0',
    textColor: '#065F46',
    label: 'Passageiro',
  },
  arrived_dropoff: {
    icon: MapPin,
    color: '#DC2626',
    bgColor: '#FEE2E2',
    borderColor: '#FECACA',
    textColor: '#991B1B',
    label: 'Chegou',
  },
  completed: {
    icon: CheckCircle,
    color: '#059669',
    bgColor: '#D1FAE5',
    borderColor: '#A7F3D0',
    textColor: '#065F46',
    label: 'Concluída',
  },
  canceled: {
    icon: XCircle,
    color: '#DC2626',
    bgColor: '#FEE2E2',
    borderColor: '#FECACA',
    textColor: '#991B1B',
    label: 'Cancelada',
  },
};

type Props = {
  status: StatusType;
};

export default function StatusTag({ status }: Props) {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
        },
      ]}
    >
      <IconComponent size={12} color={config.color} />
      <Text style={[styles.label, { color: config.textColor }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});
