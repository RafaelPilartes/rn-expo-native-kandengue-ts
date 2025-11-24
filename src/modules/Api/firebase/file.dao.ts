// src/infra/firebase/file.dao.ts
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  StorageError
} from 'firebase/storage'
import { storage } from '@/config/firebase.config'

interface UploadResult {
  url: string
  path: string
  metadata?: any
}

export class FirebaseFileDAO {
  /**
   * UPLOAD SIMPLES (principal método)
   */
  async uploadSimple(
    fileUri: string,
    folder: string = 'uploads'
  ): Promise<UploadResult> {
    try {
      console.log('📤 Iniciando upload:', fileUri)

      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExtension = this.getFileExtension(fileUri)
      const fileName = `file_${timestamp}_${randomString}.${fileExtension}`
      const fullPath = `${folder}/${fileName}`

      // Criar referência
      const storageRef = ref(storage, fullPath)

      // Buscar o arquivo como blob
      console.log('🔄 Buscando arquivo...')
      const response = await fetch(fileUri)
      const blob = await response.blob()

      console.log('🔄 Fazendo upload para:', fullPath)

      // Fazer upload
      const snapshot = await uploadBytesResumable(storageRef, blob)

      // Obter URL de download
      const url = await getDownloadURL(snapshot.ref)

      console.log('✅ Upload concluído:', url)

      return {
        url,
        path: fullPath,
        metadata: {
          fileName,
          uploadedAt: new Date(),
          size: snapshot.metadata.size,
          contentType: snapshot.metadata.contentType
        }
      }
    } catch (error: any) {
      console.error('❌ Erro no upload:', error)
      throw new Error(`Falha no upload: ${error.message}`)
    }
  }

  /**
   * UPLOAD COM PROGRESSO (para feedback visual)
   */
  async uploadWithProgress(
    fileUri: string,
    folder: string = 'uploads',
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const fileExtension = this.getFileExtension(fileUri)
        const fileName = `file_${timestamp}_${randomString}.${fileExtension}`
        const fullPath = `${folder}/${fileName}`

        const storageRef = ref(storage, fullPath)

        // Buscar arquivo
        const response = await fetch(fileUri)
        const blob = await response.blob()

        console.log('🔄 Iniciando upload com progresso...')

        const uploadTask = uploadBytesResumable(storageRef, blob)

        uploadTask.on(
          'state_changed',
          snapshot => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log(`📊 Progresso do upload: ${progress.toFixed(2)}%`)
            onProgress?.(progress)
          },
          (error: StorageError) => {
            console.error('❌ Erro no upload com progresso:', error)
            reject(new Error(`Falha no upload: ${error.message}`))
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref)
              console.log('✅ Upload com progresso concluído:', url)

              resolve({
                url,
                path: fullPath,
                metadata: {
                  fileName,
                  uploadedAt: new Date(),
                  size: uploadTask.snapshot.metadata.size,
                  contentType: uploadTask.snapshot.metadata.contentType
                }
              })
            } catch (error: any) {
              reject(new Error(`Falha ao obter URL: ${error.message}`))
            }
          }
        )
      } catch (error: any) {
        reject(new Error(`Falha no upload: ${error.message}`))
      }
    })
  }

  /**
   * UPLOAD MÚLTIPLO
   */
  async uploadMultiple(
    fileUris: string[],
    folder: string = 'uploads'
  ): Promise<UploadResult[]> {
    try {
      console.log(`📤 Iniciando upload de ${fileUris.length} arquivos`)
      const results: UploadResult[] = []

      for (const uri of fileUris) {
        const result = await this.uploadSimple(uri, folder)
        results.push(result)
      }

      console.log('✅ Upload múltiplo concluído')
      return results
    } catch (error: any) {
      console.error('❌ Erro no upload múltiplo:', error)
      throw new Error(`Falha no upload múltiplo: ${error.message}`)
    }
  }

  /**
   * DELETE (remover arquivo)
   */
  async deleteFile(path: string): Promise<void> {
    try {
      console.log('🗑️ Removendo arquivo:', path)
      const storageRef = ref(storage, path)
      await deleteObject(storageRef)
      console.log('✅ Arquivo removido com sucesso')
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') {
        console.warn('⚠️ Arquivo já não existe:', path)
        return
      }
      console.error('❌ Erro ao remover arquivo:', error)
      throw new Error(`Falha ao remover arquivo: ${error.message}`)
    }
  }

  /**
   * GET URL (obter URL de download)
   */
  async getFileURL(path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path)
      return await getDownloadURL(storageRef)
    } catch (error: any) {
      console.error('❌ Erro ao obter URL:', error)
      throw new Error(`Falha ao obter URL: ${error.message}`)
    }
  }

  /**
   * OBTÉM EXTENSÃO
   */
  private getFileExtension(uri: string): string {
    try {
      // Para URIs de arquivo local
      if (uri.startsWith('file://')) {
        const path = uri.split('?')[0]
        const parts = path.split('.')
        if (parts.length > 1) {
          return parts.pop()?.toLowerCase() || 'jpg'
        }
      }

      // Para URLs
      const match = uri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)
      if (match && match[1]) return match[1].toLowerCase()

      // Fallbacks baseados no conteúdo
      if (uri.includes('jpeg') || uri.includes('jpg')) return 'jpg'
      if (uri.includes('png')) return 'png'
      if (uri.includes('gif')) return 'gif'
      if (uri.includes('pdf')) return 'pdf'

      return 'jpg' // default
    } catch {
      return 'jpg'
    }
  }
}
