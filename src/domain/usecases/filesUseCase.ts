// domain/usecases/fileUseCase.ts
import { fileRepository } from '@/modules/Api';
import type {
  UploadResult,
  IFileRepository,
} from '@/core/interfaces/IFileRepository';

export class FileUseCase {
  private repository: IFileRepository = fileRepository;

  /**
   * UPLOAD SIMPLES: Upload básico de arquivo
   */
  async uploadSimple(
    fileUri: string,
    folder: string = 'uploads',
  ): Promise<UploadResult> {
    try {
      console.log('📤 UseCase: Iniciando upload simples');

      if (!fileUri || !fileUri.trim()) {
        throw new Error('URI do arquivo é obrigatória');
      }

      if (!folder || !folder.trim()) {
        throw new Error('Pasta de destino é obrigatória');
      }

      const result = await this.repository.uploadSimple(fileUri, folder);
      console.log('✅ UseCase: Upload simples concluído');

      return result;
    } catch (error: any) {
      console.error('❌ UseCase: Erro no upload simples:', error);
      throw new Error(error.message || 'Falha no upload do arquivo');
    }
  }

  /**
   * UPLOAD COM PROGRESSO: Upload com callback de progresso
   */
  async uploadWithProgress(
    fileUri: string,
    folder: string = 'uploads',
    onProgress?: (progress: number) => void,
  ): Promise<UploadResult> {
    try {
      console.log('📤 UseCase: Iniciando upload com progresso');

      if (!fileUri || !fileUri.trim()) {
        throw new Error('URI do arquivo é obrigatória');
      }

      const result = await this.repository.uploadWithProgress(
        fileUri,
        folder,
        onProgress,
      );
      console.log('✅ UseCase: Upload com progresso concluído');

      return result;
    } catch (error: any) {
      console.error('❌ UseCase: Erro no upload com progresso:', error);
      throw new Error(error.message || 'Falha no upload do arquivo');
    }
  }

  /**
   * UPLOAD MULTIPLO: Upload de vários arquivos
   */
  async uploadMultiple(
    fileUris: string[],
    folder: string = 'uploads',
  ): Promise<UploadResult[]> {
    try {
      console.log(
        `📤 UseCase: Iniciando upload de ${fileUris.length} arquivos`,
      );

      if (!fileUris || fileUris.length === 0) {
        throw new Error('Nenhum arquivo fornecido para upload');
      }

      if (fileUris.length > 10) {
        throw new Error('Número máximo de arquivos excedido (10)');
      }

      // Validar cada URI
      fileUris.forEach((uri, index) => {
        if (!uri || !uri.trim()) {
          throw new Error(
            `Arquivo na posição ${index + 1} possui URI inválida`,
          );
        }
      });

      const results = await this.repository.uploadMultiple(fileUris, folder);
      console.log(
        `✅ UseCase: Upload múltiplo concluído - ${results.length} arquivos`,
      );

      return results;
    } catch (error: any) {
      console.error('❌ UseCase: Erro no upload múltiplo:', error);
      throw new Error(error.message || 'Falha no upload dos arquivos');
    }
  }

  /**
   * DELETE: Remover arquivo do storage
   */
  async deleteFile(path: string): Promise<void> {
    try {
      console.log('🗑️ UseCase: Iniciando exclusão do arquivo:', path);

      if (!path || !path.trim()) {
        throw new Error('Caminho do arquivo é obrigatório');
      }

      await this.repository.deleteFile(path);
      console.log('✅ UseCase: Arquivo excluído com sucesso');
    } catch (error: any) {
      console.error('❌ UseCase: Erro ao excluir arquivo:', error);
      throw new Error(error.message || 'Falha ao excluir arquivo');
    }
  }

  /**
   * GET URL: Obter URL pública do arquivo
   */
  async getFileURL(path: string): Promise<string> {
    try {
      console.log('🔗 UseCase: Obtendo URL do arquivo:', path);

      if (!path || !path.trim()) {
        throw new Error('Caminho do arquivo é obrigatório');
      }

      const url = await this.repository.getFileURL(path);
      console.log('✅ UseCase: URL obtida com sucesso');

      return url;
    } catch (error: any) {
      console.error('❌ UseCase: Erro ao obter URL:', error);
      throw new Error(error.message || 'Falha ao obter URL do arquivo');
    }
  }

  /**
   * VALIDAR IMAGEM PARA USUARIO
   */
  async uploadSomeTypeImageUser(
    fileUri: string,
    userId: string,
    type: string = 'uploads',
  ): Promise<UploadResult> {
    try {
      console.log(
        '👤 UseCase: Iniciando upload de alguma imagem para ',
        userId,
      );

      if (!userId || !userId.trim()) {
        throw new Error('ID do usuário é obrigatório');
      }

      const folder = `${type}/${userId}`;
      const result = await this.uploadSimple(fileUri, folder);

      console.log('✅ UseCase: Imagem de perfil enviada com sucesso');
      return result;
    } catch (error: any) {
      console.error('❌ UseCase: Erro no upload de imagem de perfil:', error);
      throw new Error(error.message || 'Falha no upload da imagem de perfil');
    }
  }

  /**
   * VALIDAR IMAGEM DE PERFIL: Validações específicas para fotos de perfil
   */
  async uploadProfileImage(
    fileUri: string,
    userId: string,
  ): Promise<UploadResult> {
    try {
      console.log('👤 UseCase: Iniciando upload de imagem de perfil');

      if (!userId || !userId.trim()) {
        throw new Error('ID do usuário é obrigatório');
      }

      const folder = `profiles/${userId}`;
      const result = await this.uploadSimple(fileUri, folder);

      console.log('✅ UseCase: Imagem de perfil enviada com sucesso');
      return result;
    } catch (error: any) {
      console.error('❌ UseCase: Erro no upload de imagem de perfil:', error);
      throw new Error(error.message || 'Falha no upload da imagem de perfil');
    }
  }

  /**
   * UPLOAD DOCUMENTO: Upload com validações para documentos
   */
  async uploadDocument(
    fileUri: string,
    userId: string,
    documentType: string,
  ): Promise<UploadResult> {
    try {
      console.log('📄 UseCase: Iniciando upload de documento:', documentType);

      if (!userId || !userId.trim()) {
        throw new Error('ID do usuário é obrigatório');
      }

      if (!documentType || !documentType.trim()) {
        throw new Error('Tipo de documento é obrigatório');
      }

      const folder = `documents/${userId}/${documentType}`;
      const result = await this.uploadSimple(fileUri, folder);

      console.log('✅ UseCase: Documento enviado com sucesso');
      return result;
    } catch (error: any) {
      console.error('❌ UseCase: Erro no upload de documento:', error);
      throw new Error(error.message || 'Falha no upload do documento');
    }
  }

  /**
   * CLEANUP: Limpar arquivos temporários antigos
   */
  async cleanupOldFiles(
    folder: string,
    olderThanDays: number = 7,
  ): Promise<void> {
    try {
      console.log('🧹 UseCase: Iniciando limpeza de arquivos antigos');

      // Nota: Esta é uma implementação simplificada
      // Em produção, você precisaria listar os arquivos primeiro
      console.warn(
        '⚠️ UseCase: Limpeza de arquivos não implementada completamente',
      );
    } catch (error: any) {
      console.error('❌ UseCase: Erro na limpeza de arquivos:', error);
      throw new Error(error.message || 'Falha na limpeza de arquivos');
    }
  }
}
