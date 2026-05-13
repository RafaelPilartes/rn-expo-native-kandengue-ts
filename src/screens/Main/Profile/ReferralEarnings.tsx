import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ArrowLeft, Wallet } from 'lucide-react-native'
import React from 'react'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ROUTES from '@/constants/routes'
import { ProfileStackParamList } from '@/types/navigation'
import { formatMoney } from '@/utils/formattedNumber'
import { useReferralEarningsViewModel } from '@/viewModels/ReferralViewModel'

export default function ReferralEarningsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>()
  const {
    earnings,
    totals,
    minimum,
    canWithdraw,
    isLoading,
    refetch,
  } = useReferralEarningsViewModel()

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-5 pb-4 bg-gray-50">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mr-4"
        >
          <ArrowLeft size={20} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">
          Os meus ganhos de referência
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={undefined}
      >
        {isLoading ? (
          <View className="items-center py-12">
            <ActivityIndicator color="#10B981" />
          </View>
        ) : (
          <>
            {/* Cards de totais */}
            <View className="px-4 mt-2">
              <View className="bg-white rounded-2xl p-5 shadow-sm">
                <View className="flex-row items-center mb-4">
                  <Wallet size={24} color="#10B981" />
                  <Text className="ml-2 text-lg font-bold text-gray-900">
                    Resumo
                  </Text>
                </View>

                <View className="flex-row justify-between mb-3">
                  <Text className="text-gray-600">Total recebido</Text>
                  <Text className="text-gray-900 font-semibold">
                    {formatMoney(totals.paid, 0)}
                  </Text>
                </View>

                <View className="flex-row justify-between mb-3">
                  <Text className="text-gray-600">Pendente</Text>
                  <Text className="text-green-600 font-semibold">
                    {formatMoney(totals.pending, 0)}
                  </Text>
                </View>

                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-600">Em processamento</Text>
                  <Text className="text-amber-600 font-semibold">
                    {formatMoney(totals.requested, 0)}
                  </Text>
                </View>

                {minimum > 0 && (
                  <Text className="text-gray-400 text-xs mt-3">
                    Mínimo para saque: {formatMoney(minimum, 0)}
                  </Text>
                )}
              </View>
            </View>

            {/* Botão Solicitar Saque */}
            <View className="px-4 mt-4">
              <TouchableOpacity
                disabled={!canWithdraw}
                onPress={() =>
                  navigation.navigate(
                    ROUTES.ProfileStack.WITHDRAWAL_REQUEST,
                  )
                }
                className={`py-4 rounded-xl items-center ${
                  canWithdraw ? 'bg-primary-200' : 'bg-gray-200'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    canWithdraw ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  Solicitar saque
                </Text>
              </TouchableOpacity>
              {!canWithdraw && totals.pending > 0 && (
                <Text className="text-gray-400 text-center text-xs mt-2">
                  Atinge o mínimo de {formatMoney(minimum, 0)} para sacar.
                </Text>
              )}
            </View>

            {/* Histórico */}
            <View className="px-4 mt-6">
              <Text className="text-gray-500 text-sm mb-2 px-1">
                Histórico
              </Text>
              {earnings.length === 0 ? (
                <View className="bg-white rounded-2xl p-5 items-center">
                  <Text className="text-gray-500">
                    Ainda não tens ganhos de referência.
                  </Text>
                </View>
              ) : (
                earnings.map(e => (
                  <View
                    key={e.id}
                    className="bg-white rounded-xl p-4 mb-2 flex-row justify-between items-center"
                  >
                    <View className="flex-1">
                      <Text className="text-gray-900 font-medium">
                        Ride {e.ride_id.slice(0, 8)}…
                      </Text>
                      <Text className="text-gray-400 text-xs mt-0.5">
                        {new Date(e.created_at).toLocaleDateString('pt-PT')}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-gray-900 font-semibold">
                        {formatMoney(e.reward_amount, 0)}
                      </Text>
                      <Text
                        className={`text-xs mt-0.5 ${
                          e.status === 'paid'
                            ? 'text-green-600'
                            : e.status === 'requested'
                              ? 'text-amber-600'
                              : e.status === 'cancelled'
                                ? 'text-red-500'
                                : 'text-gray-500'
                        }`}
                      >
                        {e.status}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
