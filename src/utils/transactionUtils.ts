// src/utils/transactionUtils.ts
import { TransactionCategoryType, TransactionType } from '@/types/enum';
import {
  Wallet,
  Car,
  Gift,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from 'lucide-react-native';

export const getTransactionIcon = (
  type: TransactionType,
  category: TransactionCategoryType,
) => {
  if (type === 'credit') {
    switch (category) {
      case 'wallet_topup':
        return TrendingUp;
      case 'bonus':
        return Gift;
      case 'refund':
        return RefreshCw;
      default:
        return TrendingUp;
    }
  } else {
    switch (category) {
      case 'ride_fee':
        return Car;
      case 'pension':
        return Wallet;
      default:
        return TrendingDown;
    }
  }
};

export const getTransactionColor = (type: TransactionType) => {
  if (type === 'credit') {
    return {
      bg: 'bg-green-100',
      icon: '#10B981',
      text: 'text-green-600',
    };
  } else {
    return {
      bg: 'bg-red-100',
      icon: '#EF4444',
      text: 'text-red-500',
    };
  }
};
