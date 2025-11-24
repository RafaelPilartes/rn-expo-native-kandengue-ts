// viewModels/FileUploadViewModel.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UploadResult } from '@/core/interfaces/IFileRepository';
import { FileUseCase } from '@/domain/usecases/filesUseCase';

interface UploadOptions {
  folder?: string;
  onProgress?: (progress: number) => void;
}

export function useFileUploadViewModel() {
  const queryClient = useQueryClient();
  const fileUseCase = new FileUseCase();

  // --------------------------------------------------------------------
  // MUTATION: UPLOAD SIMPLES
  // --------------------------------------------------------------------
  const uploadSimpleMutation = useMutation({
    mutationFn: ({ fileUri, folder }: { fileUri: string; folder?: string }) =>
      fileUseCase.uploadSimple(fileUri, folder),

    onSuccess: (data: UploadResult) => {
      console.log('✅ ViewModel: Upload simples realizado com sucesso');
      // Invalidar queries relacionadas se necessário
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },

    onError: (error: Error) => {
      console.error('❌ ViewModel: Erro no upload simples:', error);
    },
  });

  // --------------------------------------------------------------------
  // MUTATION: UPLOAD COM PROGRESSO
  // --------------------------------------------------------------------
  const uploadWithProgressMutation = useMutation({
    mutationFn: ({
      fileUri,
      folder,
      onProgress,
    }: {
      fileUri: string;
      folder?: string;
      onProgress?: (progress: number) => void;
    }) => fileUseCase.uploadWithProgress(fileUri, folder, onProgress),

    onSuccess: (data: UploadResult) => {
      console.log('✅ ViewModel: Upload com progresso realizado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },

    onError: (error: Error) => {
      console.error('❌ ViewModel: Erro no upload com progresso:', error);
    },
  });

  // --------------------------------------------------------------------
  // MUTATION: UPLOAD MULTIPLO
  // --------------------------------------------------------------------
  const uploadMultipleMutation = useMutation({
    mutationFn: ({
      fileUris,
      folder,
    }: {
      fileUris: string[];
      folder?: string;
    }) => fileUseCase.uploadMultiple(fileUris, folder),

    onSuccess: (data: UploadResult[]) => {
      console.log(
        `✅ ViewModel: Upload múltiplo realizado - ${data.length} arquivos`,
      );
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },

    onError: (error: Error) => {
      console.error('❌ ViewModel: Erro no upload múltiplo:', error);
    },
  });

  // --------------------------------------------------------------------
  // MUTATION: DELETE FILE
  // --------------------------------------------------------------------
  const deleteFileMutation = useMutation({
    mutationFn: (path: string) => fileUseCase.deleteFile(path),

    onSuccess: () => {
      console.log('✅ ViewModel: Arquivo excluído com sucesso');
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },

    onError: (error: Error) => {
      console.error('❌ ViewModel: Erro ao excluir arquivo:', error);
    },
  });

  // --------------------------------------------------------------------
  // QUERY: GET FILE URL
  // --------------------------------------------------------------------
  const useFileURL = (path: string | null) => {
    return useQuery({
      queryKey: ['file-url', path],
      queryFn: () => {
        if (!path) throw new Error('Caminho do arquivo é obrigatório');
        return fileUseCase.getFileURL(path);
      },
      enabled: !!path, // Só executa se tiver um path
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 2,
    });
  };

  // --------------------------------------------------------------------
  // MUTATION: UPLOAD PROFILE IMAGE (ESPECIALIZADA)
  // --------------------------------------------------------------------
  const uploadProfileImageMutation = useMutation({
    mutationFn: ({ fileUri, userId }: { fileUri: string; userId: string }) =>
      fileUseCase.uploadProfileImage(fileUri, userId),

    onSuccess: (data: UploadResult) => {
      console.log('✅ ViewModel: Imagem de perfil enviada com sucesso');
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },

    onError: (error: Error) => {
      console.error('❌ ViewModel: Erro no upload de imagem de perfil:', error);
    },
  });

  // --------------------------------------------------------------------
  // MUTATION: UPLOAD DOCUMENT (ESPECIALIZADA)
  // --------------------------------------------------------------------
  const uploadDocumentMutation = useMutation({
    mutationFn: ({
      fileUri,
      userId,
      documentType,
    }: {
      fileUri: string;
      userId: string;
      documentType: string;
    }) => fileUseCase.uploadDocument(fileUri, userId, documentType),

    onSuccess: (data: UploadResult) => {
      console.log('✅ ViewModel: Documento enviado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['documents', 'user'] });
    },

    onError: (error: Error) => {
      console.error('❌ ViewModel: Erro no upload de documento:', error);
    },
  });

  // --------------------------------------------------------------------
  // MUTATION: UPLOAD TYPE
  // --------------------------------------------------------------------
  const uploadSomeTypeImageUserMutation = useMutation({
    mutationFn: ({
      fileUri,
      userId,
      imageType,
    }: {
      fileUri: string;
      userId: string;
      imageType: string;
    }) => fileUseCase.uploadSomeTypeImageUser(fileUri, userId, imageType),

    onSuccess: (data: UploadResult) => {
      console.log('✅ ViewModel: Imagem enviado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['imagesType', 'user'] });
    },

    onError: (error: Error) => {
      console.error('❌ ViewModel: Erro no upload da imagem:', error);
    },
  });

  // --------------------------------------------------------------------
  // RETORNO DO VIEWMODEL
  // --------------------------------------------------------------------
  return {
    // UPLOAD SIMPLES
    uploadSimple: uploadSimpleMutation.mutateAsync,
    isUploading: uploadSimpleMutation.isPending,
    uploadError: uploadSimpleMutation.error,
    resetUpload: uploadSimpleMutation.reset,

    // UPLOAD COM PROGRESSO
    uploadWithProgress: uploadWithProgressMutation.mutateAsync,
    isUploadingWithProgress: uploadWithProgressMutation.isPending,
    uploadWithProgressError: uploadWithProgressMutation.error,

    // UPLOAD MULTIPLO
    uploadMultiple: uploadMultipleMutation.mutateAsync,
    isUploadingMultiple: uploadMultipleMutation.isPending,
    uploadMultipleError: uploadMultipleMutation.error,

    // DELETE
    deleteFile: deleteFileMutation.mutateAsync,
    isDeleting: deleteFileMutation.isPending,
    deleteError: deleteFileMutation.error,

    // GET URL
    useFileURL,

    // UPLOAD ESPECIALIZADOS
    uploadProfileImage: uploadProfileImageMutation.mutateAsync,
    isUploadingProfile: uploadProfileImageMutation.isPending,
    uploadProfileError: uploadProfileImageMutation.error,

    uploadDocument: uploadDocumentMutation.mutateAsync,
    isUploadingDocument: uploadDocumentMutation.isPending,
    uploadDocumentError: uploadDocumentMutation.error,

    uploadSomeImageForUser: uploadSomeTypeImageUserMutation.mutateAsync,
    isUploadingSomeImageForUser: uploadSomeTypeImageUserMutation.isPending,
    uploadSomeImageForUserError: uploadSomeTypeImageUserMutation.error,

    // ESTADOS COMBINADOS
    isLoading:
      uploadSimpleMutation.isPending ||
      uploadWithProgressMutation.isPending ||
      uploadMultipleMutation.isPending ||
      uploadProfileImageMutation.isPending ||
      uploadDocumentMutation.isPending,

    hasError:
      !!uploadSimpleMutation.error ||
      !!uploadWithProgressMutation.error ||
      !!uploadMultipleMutation.error ||
      !!uploadProfileImageMutation.error ||
      !!uploadDocumentMutation.error,

    // DADOS DAS MUTATIONS
    uploadData: uploadSimpleMutation.data,
    multipleUploadData: uploadMultipleMutation.data,
    profileUploadData: uploadProfileImageMutation.data,
    documentUploadData: uploadDocumentMutation.data,
  };
}

// TIPO para uso em componentes
export type FileUploadViewModel = ReturnType<typeof useFileUploadViewModel>;
