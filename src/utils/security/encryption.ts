import {
  CRYPTO_KEY_NAME,
  CRYPTO_KEY_SIZE,
  CRYPTO_SERVICE_NAME
} from '@/constants/cryption'
import 'react-native-get-random-values'
import { encode as btoa } from 'base-64'
import Keychain from 'react-native-keychain'

/**
 * Obtém a chave de criptografia segura armazenada no Keychain.
 * Se não existir, gera uma nova e armazena.
 */
export async function getEncryptionKey(): Promise<string> {
  try {
    let existingKey

    // 1. Tenta obter chave existente com tratamento de erro para dados corrompidos
    try {
      existingKey = await Keychain.getGenericPassword({
        service: CRYPTO_SERVICE_NAME
      })
    } catch (keychainError: any) {
      // Se falhar por descriptografia (dados corrompidos), reset
      if (
        keychainError?.message?.includes('Decryption failed') ||
        keychainError?.message?.includes(
          'Authentication tag verification failed'
        )
      ) {
        console.warn('⚠️ Keychain corrompido detectado. Resetando...')

        // Reset completo do Keychain
        await Keychain.resetGenericPassword({ service: CRYPTO_SERVICE_NAME })
        existingKey = null // Força criação de nova chave
      } else {
        throw keychainError
      }
    }

    if (existingKey && existingKey.password) {
      return existingKey.password
    }

    // 2. Gera nova chave
    const newKey = generateSecureKey()

    // 3. Armazena no Keychain
    await storeKeyInKeychain(newKey)

    return newKey
  } catch (error: any) {
    console.error('❌ Falha ao obter chave de criptografia:', error)

    // Última tentativa: força reset completo
    try {
      console.warn('🔄 Tentando reset completo do Keychain...')
      await Keychain.resetGenericPassword({ service: CRYPTO_SERVICE_NAME })

      const newKey = generateSecureKey()
      await storeKeyInKeychain(newKey)

      return newKey
    } catch (resetError) {
      console.error('💥 Falha ao resetar Keychain:', resetError)
    }

    throw new Error('Não foi possível acessar as credenciais seguras')
  }
}

/**
 * Gera uma chave aleatória e retorna em Base64.
 */
function generateSecureKey(): string {
  const randomArray = new Uint8Array(CRYPTO_KEY_SIZE)
  crypto.getRandomValues(randomArray) // Preenche com bytes aleatórios

  let binary = ''
  randomArray.forEach(byte => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary) // Converte para Base64
}

/**
 * Armazena a chave no Keychain com acesso seguro.
 */
async function storeKeyInKeychain(key: string): Promise<void> {
  const config = {
    service: CRYPTO_SERVICE_NAME,
    accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY
  }

  await Keychain.setGenericPassword(CRYPTO_KEY_NAME, key, config)
}
