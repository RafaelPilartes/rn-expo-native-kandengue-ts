// src/screens/EditProfile.tsx
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import { useAlert } from '@/context/AlertContext'
import { Camera, Mail, Phone, User } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { useAuthStore } from '@/storage/store/useAuthStore'
import PrimaryButton from '@/components/ui/button/PrimaryButton'
import { useUsersViewModel } from '@/viewModels/UserViewModel'
import { useImagePicker } from '@/hooks/useImagePicker'
import { ImagePickerPresets } from '@/services/picker/imagePickerPresets'
import { useFileUploadViewModel } from '@/viewModels/FileUploadViewModel'
import { PageHeader } from '@/components/PageHeader'
import { InputField } from '@/components/ui/input/InputField'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function EditProfileScreen() {
  const navigation = useNavigation<any>()

  const { user, setUser } = useAuthStore()
  const { showAlert } = useAlert()
  const { updateUser, fetchOneUserByField } = useUsersViewModel()
  const {
    uploadProfileImage,
    isUploadingProfile: isUploadingProfileImage,
    uploadProfileError: uploadProfileErrorImage
  } = useFileUploadViewModel()

  const {
    pickImage,
    isUploading: isSelectingImage,
    error: imageError,
    clearError
  } = useImagePicker()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  // Estado local do formulário
  const [formData, setFormData] = useState({
    photo: user?.photo || '',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  const [hasChanges, setHasChanges] = useState(false)

  // VERIFICAR: mudanças no formulário
  useEffect(() => {
    const hasChanges =
      formData.photo !== user?.photo ||
      formData.name !== user?.name ||
      formData.email !== user?.email ||
      formData.phone !== user?.phone

    setHasChanges(hasChanges)
  }, [formData, user])

  // VALIDAR: formulário
  const validateForm = (): boolean => {
    setError(null)

    if (!formData.name.trim()) {
      setError('O nome é obrigatório')
      return false
    }

    if (!formData.email.trim()) {
      setError('O email é obrigatório')
      return false
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('O email é inválido')
      return false
    }

    if (!formData.phone.trim()) {
      setError('O telefone é obrigatório')
      return false
    }

    return true
  }

  // ATUALIZAR: campo específico
  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // UPLOAD: de imagem
  const handleImagePicker = async () => {
    clearError()

    try {
      const imageUri = await pickImage(
        ImagePickerPresets.PROFILE.config,
        ImagePickerPresets.PROFILE.validation
      )

      if (imageUri) {
        setSelectedFile(imageUri)
        setFormData(prev => ({
          ...prev,
          photo: imageUri
        }))
      }
    } catch (error) {
      console.error('Erro ao abrir image picker:', error)
      showAlert('Erro', 'Não foi possível abrir a galeria', 'error')
    }
  }

  // LIMPAR: imagem selecionada
  const handleClearPhoto = () => {
    setSelectedFile(null)
    setFormData(prev => ({
      ...prev,
      photo: user?.photo || '' // Volta para a foto original
    }))
  }

  // UPLOAD: de imagem - FUNÇÃO ADICIONADA
  const handleUploadPhoto = async (): Promise<string> => {
    if (!selectedFile) return formData.photo || ''

    try {
      console.log('📤 Iniciando upload da imagem...')

      const { url, path } = await uploadProfileImage({
        fileUri: selectedFile,
        userId: user?.id || ''
      })

      if (!url || !path) {
        const errorMsg =
          uploadProfileErrorImage?.message || 'Erro ao carregar ficheiro'
        console.error('❌ Upload falhou:', errorMsg)
        showAlert('Erro', errorMsg, 'error')
        throw new Error('Upload inválido')
      }

      console.log('✅ Upload concluído:', url)
      return url
    } catch (err: any) {
      console.error('❌ Erro no upload:', err)
      showAlert('Erro', 'Erro ao carregar ficheiro', 'error')
      throw err
    }
  }

  // SALVAR: alterações do perfil
  const handleUpdateProfile = async () => {
    if (!validateForm()) return
    if (!user?.id) {
      setError('ID do usuario não encontrado')
      return
    }

    // Antes de atualizar, verificar se email não pertence a outro user
    if (formData.email !== user?.email) {
      const existingUser = await fetchOneUserByField('email', formData.email)
      if (existingUser && existingUser.id !== user?.id) {
        setError('Este email já está em uso por outro usuario')
        return
      }
    }

    setIsLoading(true)
    setError(null)

    try {
      let finalPhotoUrl = formData.photo

      // FAZER UPLOAD se há nova imagem selecionada
      if (selectedFile && selectedFile !== user?.photo) {
        console.log('🔄 Fazendo upload da nova imagem...')
        finalPhotoUrl = await handleUploadPhoto()
      }

      // PREPARAR dados para atualização
      const updateData: any = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        updated_at: new Date()
      }

      // ADICIONAR foto apenas se mudou
      if (finalPhotoUrl !== user?.photo) {
        updateData.photo = finalPhotoUrl
      }

      // ATUALIZAR no backend
      const updatedUser = await updateUser.mutateAsync({
        id: user.id,
        user: updateData
      })

      // ATUALIZAR no estado global
      setUser(updatedUser)

      console.log('✅ Perfil atualizado com sucesso!')

      console.log('✅ Perfil atualizado com sucesso!')

      showAlert('Sucesso', 'Perfil atualizado com sucesso!', 'success', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ])
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error)
      showAlert('Erro', 'Ocorreu um erro ao atualizar o perfil', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <PageHeader title="Editar Perfil" canGoBack={true} />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Profile Image */}
        <View className="items-center mb-6">
          <View className="relative">
            <TouchableOpacity
              onPress={handleImagePicker}
              activeOpacity={0.7}
              disabled={
                isSelectingImage || isLoading || isUploadingProfileImage
              }
              className="relative"
            >
              <View className="w-28 h-28 rounded-full bg-gray-200 items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {formData.photo ? (
                  <Image
                    source={{ uri: formData.photo }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <User size={48} color="#9CA3AF" />
                )}

                {/* Overlay de loading durante upload */}
                {(isUploadingProfileImage || isSelectingImage) && (
                  <View className="absolute inset-0 bg-black bg-opacity-50 items-center justify-center">
                    <ActivityIndicator size="large" color="white" />
                  </View>
                )}
              </View>

              <View
                className={`absolute bottom-0 right-0 p-2 rounded-full ${
                  isUploadingProfileImage || isSelectingImage
                    ? 'bg-gray-400'
                    : 'bg-primary-200'
                }`}
              >
                {isSelectingImage || isUploadingProfileImage ? (
                  <ActivityIndicator size={16} color="white" />
                ) : (
                  <Camera size={18} color="white" />
                )}
              </View>
            </TouchableOpacity>

            {/* Botão para limpar foto se for nova */}
            {selectedFile && formData.photo !== user?.photo && (
              <TouchableOpacity
                onPress={handleClearPhoto}
                disabled={isLoading}
                className="absolute -top-2 -right-2 bg-red-500 w-6 h-6 rounded-full items-center justify-center"
              >
                <Text className="text-white text-xs font-bold">×</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Erro na seleção de imagem */}
          {imageError && (
            <Text className="text-xs text-red-600 mt-1">{imageError}</Text>
          )}

          {/* Status do upload */}
          {isUploadingProfileImage && (
            <Text className="text-xs text-blue-600 mt-1">
              Enviando imagem...
            </Text>
          )}
          {isSelectingImage && (
            <Text className="text-xs text-blue-600 mt-1">
              Selecionando imagem...
            </Text>
          )}
        </View>

        {/* Nome */}
        <InputField
          value={formData.name}
          label="Nome"
          placeholder="Digite o seu nome"
          onChangeText={value => handleFieldChange('name', value)}
          editable={!isLoading}
          icon={<User size={20} color="#9ca3af" />}
        />

        {/* Email */}
        <InputField
          value={formData.email}
          label="E-mail"
          placeholder="Digite o seu e-mail"
          onChangeText={value => handleFieldChange('email', value)}
          editable={!isLoading}
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          icon={<Mail size={20} color="#9ca3af" />}
        />

        {/* Telefone */}
        <InputField
          value={formData.phone}
          label="Telefone"
          placeholder="Digite o seu telefone"
          onChangeText={value => handleFieldChange('phone', value)}
          editable={!isLoading}
          keyboardType="phone-pad"
          autoComplete="tel"
          autoCapitalize="none"
          icon={<Phone size={20} color="#9ca3af" />}
        />

        {/* Erro */}
        {error && <Text className="text-red-500 text-sm mb-4">{error}</Text>}

        {/* Save Button */}
        <PrimaryButton
          className="mb-4"
          label={'Salvar Alterações'}
          onPress={handleUpdateProfile}
          disabled={!hasChanges || isLoading}
          loading={isLoading}
        />
        {/* Informações de conta */}
        <View className="mt-8 p-4 bg-blue-50 rounded-xl">
          <Text className="text-sm font-medium text-blue-800 mb-2">
            Informações de Conta
          </Text>
          <Text className="text-xs text-blue-600">
            Id de Usuário: {user?.id}
          </Text>
          <Text className="text-xs text-blue-600 mt-1">
            Data de Cadastro:{' '}
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString('pt-BR')
              : '--'}
          </Text>
        </View>

        {/* Debug info (apenas desenvolvimento) */}
        {__DEV__ && (
          <View className="mt-4 p-3 bg-gray-100 rounded-lg">
            <Text className="text-xs text-gray-600">
              🐛 Debug: {hasChanges ? 'Tem alterações' : 'Sem alterações'} |
              Upload: {isUploadingProfileImage ? 'Sim' : 'Não'} | Selected:{' '}
              {selectedFile ? 'Sim' : 'Não'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
