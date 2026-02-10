// src/screens/Ride/components/RideConfirmationFlow.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput
} from 'react-native'
import { useAlert } from '@/context/AlertContext'
import {
  Camera,
  Package,
  CheckCircle,
  X,
  Image as ImageIcon
} from 'lucide-react-native'
import { useImagePicker } from '@/hooks/useImagePicker'
import { ImagePickerPresets } from '@/services/picker/imagePickerPresets'
import { useFileUploadViewModel } from '@/viewModels/FileUploadViewModel'

interface RideConfirmationFlowProps {
  visible: boolean
  userId: string | null
  onClose: () => void
  isLoading?: boolean
}

export const RideConfirmationFlow: React.FC<RideConfirmationFlowProps> = ({
  visible,
  onClose,
  userId = 'under',
  isLoading = false
}) => {
  const {
    uploadSomeImageForUser,
    isUploadingSomeImageForUser: isUploadingRideImage,
    uploadSomeImageForUserError: uploadRideErrorImage
  } = useFileUploadViewModel()

  const { showAlert } = useAlert()

  const [currentStep, setCurrentStep] = useState<'photo' | 'otp'>('photo')
  const [otpCode, setOtpCode] = useState('')
  const [ridePhoto, setRidePhoto] = useState<string | null>(null)

  const { takePhoto, isUploading: isPickingImage } = useImagePicker()

  const handleTakePhoto = async () => {
    try {
      const imageUri = await takePhoto(
        ImagePickerPresets.GENERAL.config,
        ImagePickerPresets.GENERAL.validation
      )

      if (imageUri) {
        setRidePhoto(imageUri)
      }
    } catch (error) {
      showAlert('Erro', 'Não foi possível capturar a foto', 'error')
    }
  }

  const handleRemovePhoto = () => {
    setRidePhoto(null)
  }

  const handleContinueToOTP = () => {
    if (!ridePhoto) {
      showAlert(
        'Atenção',
        'Por favor, tire uma foto da encomenda antes de continuar',
        'warning'
      )
      return
    }
    setCurrentStep('otp')
  }

  const handleBackToPhoto = () => {
    setCurrentStep('photo')
  }

  const handleUploadImage = async (): Promise<string> => {
    if (!ridePhoto) return ''

    try {
      const { url, path } = await uploadSomeImageForUser({
        fileUri: ridePhoto,
        userId: userId || '',
        imageType: 'ride'
      })

      if (!url || !path) {
        const errorMsg =
          uploadRideErrorImage?.message || 'Erro ao carregar ficheiro'
        console.error('❌ Upload falhou:', errorMsg)
        showAlert('Erro na imagem', errorMsg, 'error')
        throw new Error('Upload inválido')
      }

      console.log('✅ Upload concluído:', url)
      return url
    } catch (err: any) {
      console.error('❌ Erro no upload:', err)
      showAlert(
        'Erro',
        'Erro ao carregar ficheiro, tente tirar outra fotografia',
        'error'
      )
      throw err
    }
  }

  const handleClose = () => {
    setCurrentStep('photo')
    setOtpCode('')
    setRidePhoto(null)
    onClose()
  }

  // Step 1: Foto da Encomenda
  const renderPhotoStep = () => (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <Text className="text-lg font-semibold text-gray-800">
          Confirmar Entrega - Passo 1 de 2
        </Text>
        <TouchableOpacity
          onPress={handleClose}
          disabled={isLoading || isUploadingRideImage}
        >
          <X size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="p-4 flex-1">
        <View className="items-center mb-6">
          <Camera size={48} color="#e40606" />
          <Text className="text-lg font-semibold text-gray-800 mt-2 text-center">
            Foto da Encomenda
          </Text>
          <Text className="text-gray-600 text-center mt-1">
            Tire uma foto da encomenda entregue como comprovativo
          </Text>
        </View>

        {/* Área da Foto */}
        <View className="flex-1 justify-center items-center">
          {ridePhoto ? (
            <View className="items-center">
              <Image
                source={{ uri: ridePhoto }}
                className="w-64 h-64 rounded-2xl border-2 border-primary-200"
                resizeMode="cover"
              />
              <View className="flex-row gap-2 mt-4">
                <TouchableOpacity
                  className="bg-red-500 px-4 py-2 rounded-lg flex-row items-center"
                  onPress={handleRemovePhoto}
                >
                  <X size={16} color="white" />
                  <Text className="text-white font-medium ml-2">
                    Tirar Outra
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-primary-200 px-4 py-2 rounded-lg flex-row items-center"
                  onPress={handleContinueToOTP}
                >
                  <CheckCircle size={16} color="white" />
                  <Text className="text-white font-medium ml-2">Usar Foto</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              className="border-2 border-dashed border-gray-300 rounded-2xl w-64 h-64 items-center justify-center bg-gray-50"
              onPress={handleTakePhoto}
              disabled={isPickingImage}
            >
              {isPickingImage ? (
                <Text className="text-gray-600">Carregando...</Text>
              ) : (
                <>
                  <Camera size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 mt-2 text-center">
                    Toque para tirar foto{'\n'}da encomenda entregue
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Informações Adicionais */}
        <View className="bg-blue-50 p-3 rounded-lg mt-4">
          <Text className="text-blue-800 text-sm font-semibold mb-1">
            Por que precisamos da foto?
          </Text>
          <Text className="text-blue-700 text-xs">
            • Comprovativo visual da entrega{'\n'}• Resolução de disputas{'\n'}•
            Melhoria da qualidade do serviço
          </Text>
        </View>
      </View>
    </View>
  )

  // Step 2: Código OTP
  const renderOTPStep = () => (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <Text className="text-lg font-semibold text-gray-800">
          Confirmar Entrega - Passo 2 de 2
        </Text>
        <TouchableOpacity
          onPress={handleClose}
          disabled={isLoading || isUploadingRideImage}
        >
          <X size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="p-4 flex-1">
        <View className="items-center mb-6">
          <Package size={48} color="#e40606" />
          <Text className="text-lg font-semibold text-gray-800 mt-2 text-center">
            Código de Confirmação
          </Text>
          <Text className="text-gray-600 text-center mt-1">
            Peça ao cliente o código OTP de 4 dígitos
          </Text>
        </View>

        {/* Foto Preview */}
        {ridePhoto && (
          <View className="items-center mb-4">
            <Text className="text-gray-600 text-sm mb-2">Foto da entrega:</Text>
            <Image
              source={{ uri: ridePhoto }}
              className="w-20 h-20 rounded-lg border border-gray-300"
              resizeMode="cover"
            />
            <TouchableOpacity
              className="mt-1 flex-row items-center"
              onPress={handleBackToPhoto}
            >
              <ImageIcon size={14} color="#6B7280" />
              <Text className="text-gray-600 text-xs ml-1">Alterar foto</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Input OTP */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2 text-center">
            Digite o código OTP:
          </Text>
          <TextInput
            className="text-black bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center text-2xl font-bold"
            placeholder="0000"
            placeholderTextColor="#b1b5bd"
            value={otpCode}
            onChangeText={setOtpCode}
            keyboardType="number-pad"
            maxLength={4}
            editable={!isLoading || isUploadingRideImage}
          />
        </View>

        {/* Instruções */}
        {/* <View className="bg-yellow-50 p-3 rounded-lg mb-4">
          <Text className="text-yellow-800 text-sm text-center">
            O código OTP foi fornecido pelo ao cliente.
          </Text>
        </View> */}
      </View>

      {/* Botões */}
      <View className="flex-row p-4 border-t border-gray-200 gap-2">
        <TouchableOpacity
          className="flex-1 bg-gray-100 py-3 rounded-lg"
          onPress={handleBackToPhoto}
          disabled={isLoading || isUploadingRideImage}
        >
          <Text className="text-gray-700 font-semibold text-center">
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-white">
        {currentStep === 'photo' ? renderPhotoStep() : renderOTPStep()}
      </View>
    </Modal>
  )
}
