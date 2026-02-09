// core/interfaces/IFileRepository.ts
export interface UploadResult {
  url: string
  path: string
  metadata?: {
    fileName: string
    size: number
    type: string
    uploadedAt: Date
  }
}

export interface IFileRepository {
  // 🔹 PRINCIPAIS MÉTODOS (React Native)
  uploadSimple(fileUri: string, folder: string): Promise<UploadResult>
  uploadWithProgress(
    fileUri: string,
    folder: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult>
  uploadImagePicker(fileUri: string, folder: string): Promise<UploadResult>
  uploadProfileImage(fileUri: string, userId: string): Promise<UploadResult>
  uploadDocument(
    fileUri: string,
    userId: string,
    documentType: string
  ): Promise<UploadResult>
  uploadRidePhoto(
    fileUri: string,
    rideId: string,
    photoType: 'pickup' | 'dropoff'
  ): Promise<UploadResult>
  deleteFile(path: string): Promise<void>
}
