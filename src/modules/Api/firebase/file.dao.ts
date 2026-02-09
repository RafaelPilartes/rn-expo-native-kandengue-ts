// src/modules/Api/firebase/file.dao.ts
import {
  putFile,
  ref,
  getDownloadURL,
  deleteObject
} from '@react-native-firebase/storage'
import { Platform } from 'react-native'
import * as FileSystem from 'expo-file-system/legacy'
import { storage } from '@/config/firebase.config'

interface UploadResult {
  url: string
  path: string
  metadata?: any
}

export class FirebaseFileDAO {
  async copyToExpoAccessiblePath(uri: string): Promise<string> {
    try {
      const newPath = `${FileSystem.cacheDirectory}${Date.now()}.jpg`
      await FileSystem.copyAsync({ from: uri, to: newPath })
      return newPath
    } catch (err) {
      console.error('❌ Erro ao copiar arquivo:', err)
      throw new Error('Falha ao preparar arquivo para upload')
    }
  }

  /**
   * ✅ UPLOAD HÍBRIDO - API modular + putFile namespaced
   * Usa o melhor de ambos: modular recomendado + putFile que funciona
   */
  async uploadSimple(
    fileUri: string,
    folder: string = 'uploads'
  ): Promise<UploadResult> {
    console.log('🚀 UPLOAD HÍBRIDO INICIADO')
    console.log('📍 URI Original:', fileUri)

    try {
      // 1. VALIDAR E CORRIGIR URI
      const processedUri = await this.copyToExpoAccessiblePath(fileUri)
      console.log('📍 URI Processada:', processedUri)

      // 2. VERIFICAR SE ARQUIVO EXISTE
      const fileInfo = await FileSystem.getInfoAsync(processedUri)
      if (!fileInfo.exists) {
        throw new Error(`Arquivo não encontrado: ${processedUri}`)
      }
      console.log('📄 Arquivo existe, tamanho:', fileInfo.size)

      // 3. GERAR NOME E CAMINHO
      const fileName = this.generateFileName(fileUri)
      const fullPath = `${folder}/${fileName}`
      console.log('📂 Caminho no Storage:', fullPath)

      // 4. CRIAR REFERÊNCIA (API MODULAR RECOMENDADA)
      const storageRef = ref(storage, fullPath)

      // 5. FAZER UPLOAD COM putFile() namespaced (QUE FUNCIONA!)
      console.log('🔼 Iniciando upload com putFile namespaced...')

      // Usar API namespaced APENAS para putFile
      const task = putFile(storageRef, processedUri, {
        contentType: this.getContentType(fileName)
      })

      // 6. AGUARDAR CONCLUSÃO
      await task
      console.log('✅ Upload com putFile concluído com sucesso!')

      // 7. OBTER URL (API MODULAR RECOMENDADA)
      const url = await getDownloadURL(storageRef)
      console.log('🌐 URL obtida:', url)

      return {
        url,
        path: fullPath,
        metadata: {
          fileName,
          uploadedAt: new Date(),
          contentType: this.getContentType(fileName),
          size: fileInfo.size
        }
      }
    } catch (error: any) {
      console.error('💥 ERRO NO UPLOAD:', error.code, error.message)

      // Tratamento específico de erros
      if (error.code === 'storage/unknown') {
        throw new Error(
          'Erro desconhecido no upload. Verifique: 1. Regras do Firebase 2. Conexão com internet'
        )
      }

      if (error.code === 'storage/object-not-found') {
        throw new Error('Arquivo local não encontrado para upload.')
      }

      if (error.code === 'storage/unauthorized') {
        throw new Error('Permissão negada no Firebase Storage.')
      }

      throw new Error(`Falha no upload: ${error.message}`)
    }
  }

  /**
   * ✅ UPLOAD COM PROGRESSO
   */
  uploadWithProgress(
    fileUri: string,
    folder: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    return new Promise(async (resolve, reject) => {
      const processedUri = await this.copyToExpoAccessiblePath(fileUri)
      const fileName = this.generateFileName(fileUri)
      const fullPath = `${folder}/${fileName}`

      console.log('🔄 UPLOAD COM PROGRESSO INICIADO')

      // Referência modular para getDownloadURL depois
      const storageRef = ref(storage, fullPath)

      // Referência namespaced para putFile com progresso
      const task = putFile(storageRef, processedUri, {
        contentType: this.getContentType(fileName)
      })

      task.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`📊 Progresso: ${progress.toFixed(0)}%`)
          onProgress?.(progress)
        },
        error => {
          console.error('💥 Erro no upload com progresso:', error)
          reject(error)
        },
        async () => {
          try {
            console.log('✅ Upload com progresso concluído')
            // Usar API modular para getDownloadURL
            const url = await getDownloadURL(storageRef)
            resolve({
              url,
              path: fullPath,
              metadata: {
                fileName,
                uploadedAt: new Date(),
                contentType: this.getContentType(fileName)
              }
            })
          } catch (error) {
            reject(error)
          }
        }
      )
    })
  }

  /**
   * ✅ UPLOAD PARA IMAGENS
   */
  async uploadImagePicker(
    fileUri: string,
    folder: string = 'images'
  ): Promise<UploadResult> {
    console.log('🖼️ UPLOAD DE IMAGEM')
    return this.uploadSimple(fileUri, folder)
  }

  /**
   * ✅ UPLOAD PARA PERFIL
   */
  async uploadProfileImage(
    fileUri: string,
    userId: string
  ): Promise<UploadResult> {
    console.log('👤 UPLOAD DE IMAGEM DE PERFIL')
    console.log('👤 User ID:', userId)
    return this.uploadSimple(fileUri, `profiles/${userId}`)
  }

  /**
   * ✅ UPLOAD PARA DOCUMENTOS
   */
  async uploadDocument(
    fileUri: string,
    userId: string,
    documentType: string
  ): Promise<UploadResult> {
    console.log('📄 UPLOAD DE DOCUMENTO')
    console.log('👤 User ID:', userId)
    console.log('📋 Tipo:', documentType)
    return this.uploadSimple(fileUri, `documents/${userId}/${documentType}`)
  }

  /**
   * ✅ UPLOAD PARA FOTOS DE CORRIDA
   */
  async uploadRidePhoto(
    fileUri: string,
    rideId: string,
    photoType: 'pickup' | 'dropoff'
  ): Promise<UploadResult> {
    console.log('📸 UPLOAD DE FOTO DE CORRIDA')
    console.log('🚗 Ride ID:', rideId)
    console.log('📍 Tipo:', photoType)

    const timestamp = Date.now()
    const fileName = `${photoType}_${timestamp}.jpg`
    const folder = `rides/${rideId}`

    return this.uploadSimple(fileUri, `${folder}/${fileName}`)
  }

  /**
   * ✅ DELETE ARQUIVO (API MODULAR)
   */
  async deleteFile(path: string): Promise<void> {
    console.log('🗑️ DELETANDO ARQUIVO:', path)

    try {
      const storageRef = ref(storage, path)
      await deleteObject(storageRef)
      console.log('✅ Arquivo removido')
    } catch (error: any) {
      console.error('❌ Erro ao remover arquivo:', error.message)

      if (error.code === 'storage/object-not-found') {
        console.log('ℹ️ Arquivo já não existe')
        return
      }

      throw new Error(`Falha ao remover: ${error.message}`)
    }
  }

  /**
   * ✅ OBTER URL (API MODULAR)
   */
  async getFileURL(path: string): Promise<string> {
    console.log('🔗 OBTENDO URL:', path)

    try {
      const storageRef = ref(storage, path)
      const url = await getDownloadURL(storageRef)
      console.log('✅ URL obtida')
      return url
    } catch (error: any) {
      console.error('❌ Erro ao obter URL:', error.message)

      if (error.code === 'storage/object-not-found') {
        throw new Error('Arquivo não encontrado no storage')
      }

      throw new Error(`Falha ao obter URL: ${error.message}`)
    }
  }

  /**
   * ✅ GERAR NOME DE ARQUIVO
   */
  private generateFileName(uri: string): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 10)
    const extension = this.getFileExtension(uri)
    return `file_${timestamp}_${randomString}.${extension}`
  }

  /**
   * ✅ EXTRAIR EXTENSÃO
   */
  private getFileExtension(uri: string): string {
    try {
      const cleanUri = uri.split('?')[0]
      const filename = cleanUri.split('/').pop() || ''
      const parts = filename.split('.')

      if (parts.length > 1) {
        const ext = parts.pop()?.toLowerCase() || 'jpg'
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf']
        return validExtensions.includes(ext) ? ext : 'jpg'
      }

      return 'jpg'
    } catch (error) {
      return 'jpg'
    }
  }

  /**
   * ✅ DETERMINAR CONTENT TYPE
   */
  private getContentType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase()
    const types: { [key: string]: string } = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      pdf: 'application/pdf'
    }
    return types[ext || ''] || 'image/jpeg'
  }

  /**
   * ✅ VERIFICAR SE ARQUIVO EXISTE (API MODULAR)
   */
  async fileExists(path: string): Promise<boolean> {
    try {
      await this.getFileURL(path)
      return true
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') {
        return false
      }
      throw error
    }
  }
}
