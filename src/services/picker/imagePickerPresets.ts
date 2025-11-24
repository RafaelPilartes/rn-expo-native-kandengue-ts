// services/imagePickerPresets.ts
import type {
  ImageLibraryOptions,
  CameraOptions,
} from 'react-native-image-picker';
import { ImageValidationRules } from './imagePicker';

// Interface para presets corrigida
interface ImagePickerPreset {
  config: Partial<ImageLibraryOptions & CameraOptions>;
  validation: ImageValidationRules;
}

export const ImagePickerPresets: Record<string, ImagePickerPreset> = {
  // Perfil de usuário
  PROFILE: {
    config: {
      mediaType: 'photo', // CORREÇÃO: Valor literal
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    },
    validation: {
      maxFileSize: 2 * 1024 * 1024,
      minWidth: 200,
      minHeight: 200,
      maxWidth: 2000,
      maxHeight: 2000,
      allowedFormats: ['image/jpeg', 'image/jpg', 'image/png'],
      // aspectRatio: [1, 1],
    },
  },

  // Documentos
  DOCUMENT: {
    config: {
      mediaType: 'photo',
      quality: 0.9,
      maxWidth: 1200,
      maxHeight: 1600,
    },
    validation: {
      maxFileSize: 5 * 1024 * 1024,
      minWidth: 600,
      minHeight: 800,
      allowedFormats: ['image/jpeg', 'image/jpg', 'image/png'],
    },
  },

  // Imagens gerais do app
  GENERAL: {
    config: {
      mediaType: 'photo',
      quality: 0.7,
      maxWidth: 1024,
      maxHeight: 1024,
    },
    validation: {
      maxFileSize: 3 * 1024 * 1024,
      minWidth: 100,
      minHeight: 100,
      allowedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    },
  },

  // Thumbnails/ícones
  THUMBNAIL: {
    config: {
      mediaType: 'photo',
      quality: 0.6,
      maxWidth: 400,
      maxHeight: 400,
    },
    validation: {
      maxFileSize: 1 * 1024 * 1024,
      minWidth: 100,
      minHeight: 100,
      maxWidth: 800,
      maxHeight: 800,
      allowedFormats: ['image/jpeg', 'image/jpg', 'image/png'],
      aspectRatio: [1, 1],
    },
  },
};
