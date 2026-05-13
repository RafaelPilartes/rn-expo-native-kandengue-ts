import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ArrowLeft } from 'lucide-react-native'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAlert } from '@/context/AlertContext'
import { ProfileStackParamList } from '@/types/navigation'
import { formatMoney } from '@/utils/formattedNumber'
import { useReferralEarningsViewModel } from '@/viewModels/ReferralViewModel'

export default function WithdrawalRequestScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>()
  const { showAlert } = useAlert()
  const {
    totals,
    minimum,
    canWithdraw,
    requestWithdrawal,
    isSubmittingWithdrawal,
  } = useReferralEarningsViewModel()

  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountHolder, setAccountHolder] = useState('')

  const formValid =
    bankName.trim().length > 0 &&
    accountNumber.trim().length >= 4 &&
    accountHolder.trim().length > 0

  const handleSubmit = async () => {
    if (!canWithdraw) {
      showAlert(
        'Saque',
        `Saldo pendente abaixo do mínimo (${formatMoney(minimum, 0)})`,
        'warning',
      )
      return
    }
    if (!formValid) {
      showAlert('Dados bancários', 'Preenche todos os campos.', 'warning')
      return
    }
    try {
      await requestWithdrawal({
        payment_details: {
          bank_name: bankName.trim(),
          account_number: accountNumber.trim(),
          account_holder: accountHolder.trim(),
        },
      })
      showAlert(
        'Pedido enviado',
        'O teu saque será processado em breve.',
        'success',
      )
      navigation.goBack()
    } catch (err: any) {
      showAlert('Erro', err.message ?? 'Falha ao solicitar saque', 'error')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-row items-center px-5 pb-4 bg-gray-50">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mr-4"
          >
            <ArrowLeft size={20} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">
            Solicitar saque
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View className="bg-white rounded-2xl p-5 mb-4">
            <Text className="text-gray-500 text-sm mb-1">
              Total a receber
            </Text>
            <Text className="text-2xl font-bold text-green-600">
              {formatMoney(totals.pending, 0)}
            </Text>
            {minimum > 0 && (
              <Text className="text-gray-400 text-xs mt-2">
                Mínimo para saque: {formatMoney(minimum, 0)}
              </Text>
            )}
          </View>

          <Text className="text-gray-600 mb-2 ml-1">Banco</Text>
          <TextInput
            value={bankName}
            onChangeText={setBankName}
            placeholder="Ex: BFA, BAI, BIC…"
            placeholderTextColor="#9CA3AF"
            className="bg-white rounded-xl px-4 py-3 mb-4 border border-gray-200"
          />

          <Text className="text-gray-600 mb-2 ml-1">
            Número de conta (IBAN)
          </Text>
          <TextInput
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="0000 0000 0000 0000 0000 0"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            className="bg-white rounded-xl px-4 py-3 mb-4 border border-gray-200"
          />

          <Text className="text-gray-600 mb-2 ml-1">Titular da conta</Text>
          <TextInput
            value={accountHolder}
            onChangeText={setAccountHolder}
            placeholder="Nome do titular"
            placeholderTextColor="#9CA3AF"
            className="bg-white rounded-xl px-4 py-3 mb-6 border border-gray-200"
          />

          <TouchableOpacity
            disabled={!canWithdraw || !formValid || isSubmittingWithdrawal}
            onPress={handleSubmit}
            className={`py-4 rounded-xl items-center ${
              canWithdraw && formValid && !isSubmittingWithdrawal
                ? 'bg-primary-200'
                : 'bg-gray-200'
            }`}
          >
            {isSubmittingWithdrawal ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text
                className={`font-semibold ${
                  canWithdraw && formValid
                    ? 'text-white'
                    : 'text-gray-500'
                }`}
              >
                Confirmar pedido
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
