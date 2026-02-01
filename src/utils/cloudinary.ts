// Cloudinary upload utility for React Native
// Uses the web utility's configuration

import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../../constants/config";

const CLOUD_NAME = CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = CLOUDINARY_UPLOAD_PRESET;

interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format: string;
  resourceType: string;
  bytes: number;
  size: string;
}

/**
 * Determine Cloudinary resource type based on file MIME type
 */
const getResourceType = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  } else {
    return 'raw'; // For documents and other files
  }
};

/**
 * Format bytes to human-readable size
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Upload file to Cloudinary from React Native
 * @param uri - File URI from image picker
 * @param fileName - Original filename
 * @param mimeType - File MIME type
 * @param folder - Folder name in Cloudinary (default: "profile_images")
 */
export const uploadToCloudinary = async (
  uri: string,
  fileName: string,
  mimeType: string,
  folder: string = 'profile_images'
): Promise<CloudinaryUploadResult> => {
  if (!uri) throw new Error('No file URI provided');

  console.log('☁️ [Cloudinary] Starting upload...');
  console.log('Cloud name:', CLOUD_NAME);
  console.log('Upload preset:', UPLOAD_PRESET);
  console.log('File URI:', uri);
  console.log('MIME type:', mimeType);

  const resourceType = getResourceType(mimeType);
  
  // Create FormData for upload
  const formData = new FormData();
  
  // Append the file
  formData.append('file', {
    uri,
    type: mimeType,
    name: fileName,
  } as any);
  
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  try {
    console.log('📤 [Cloudinary] Uploading to:', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [Cloudinary] Error response:', errorData);
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    console.log('✅ [Cloudinary] Upload successful!');
    console.log('URL:', data.secure_url);

    // Return comprehensive data
    return {
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      resourceType: data.resource_type,
      bytes: data.bytes,
      size: formatFileSize(data.bytes),
    };
  } catch (error) {
    console.error('❌ [Cloudinary] Upload error:', error);
    throw error;
  }
};

export default {
  uploadToCloudinary,
};
