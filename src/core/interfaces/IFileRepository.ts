// core/interfaces/IFileRepository.ts
export interface UploadResult {
  url: string;
  path: string;
  metadata?: {
    fileName: string;
    size: number;
    type: string;
    uploadedAt: Date;
  };
}

export interface IFileRepository {
  // PRINCIPAIS MÉTODOS (React Native)
  uploadSimple(fileUri: string, folder?: string): Promise<UploadResult>;
  uploadWithProgress(
    fileUri: string,
    folder?: string,
    onProgress?: (progress: number) => void,
  ): Promise<UploadResult>;
  uploadMultiple(fileUris: string[], folder?: string): Promise<UploadResult[]>;

  // MÉTODOS BÁSICOS
  deleteFile(path: string): Promise<void>;
  getFileURL(path: string): Promise<string>;

  // MÉTODOS DE COMPATIBILIDADE (Web)
  uploadFile(file: File, path: string): Promise<string>;
  uploadBlob(blob: Blob, path: string): Promise<string>;
}
