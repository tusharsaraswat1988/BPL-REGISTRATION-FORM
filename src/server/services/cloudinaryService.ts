import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env';

export type UploadFolderType = 'associations' | 'players' | 'mentors' | 'payment-proofs';

export interface UploadResult {
  success: boolean;
  assetId: string;
  url: string;
  publicId: string;
  format?: string;
  bytes?: number;
}

let isCloudinaryConfigured = false;

export function configureCloudinary(): boolean {
  if (isCloudinaryConfigured) return true;

  const { cloudName, apiKey, apiSecret } = config.cloudinary;
  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    isCloudinaryConfigured = true;
    return true;
  }

  return false;
}

export function isCloudinaryReady(): boolean {
  return configureCloudinary();
}

/**
 * Validate image buffer MIME magic bytes for security
 */
export function validateImageBuffer(buffer: Buffer, mimeType: string): boolean {
  if (!buffer || buffer.length === 0 || buffer.length > 5 * 1024 * 1024) {
    return false;
  }

  // PNG Magic bytes: 89 50 4E 47
  if (mimeType === 'image/png') {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }

  // JPEG Magic bytes: FF D8 FF
  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // WebP: RIFF ... WEBP
  if (mimeType === 'image/webp') {
    const isRiff = buffer.toString('ascii', 0, 4) === 'RIFF';
    const isWebp = buffer.toString('ascii', 8, 12) === 'WEBP';
    return isRiff && isWebp;
  }

  return false;
}

/**
 * Upload an image buffer directly to Cloudinary using secure stream
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  mimeType: string,
  folderType: UploadFolderType,
  originalFilename?: string
): Promise<UploadResult> {
  if (!configureCloudinary()) {
    throw new Error('Cloudinary is not configured on this server. Please provide CLOUDINARY credentials.');
  }

  if (!validateImageBuffer(fileBuffer, mimeType)) {
    throw new Error('Invalid image file format or corrupted image payload. Must be JPG, PNG, or WEBP under 5MB.');
  }

  const folder = `bpl-kids/${folderType}`;
  const isPrivate = folderType === 'payment-proofs';

  const cleanFilename = originalFilename
    ? originalFilename.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40)
    : 'upload';

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        public_id: `${cleanFilename}_${Date.now()}`,
        type: isPrivate ? 'authenticated' : 'upload',
        overwrite: true,
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error || !result) {
          const detail = error ? (typeof error === 'object' ? JSON.stringify(error) : String(error)) : 'No result returned';
          console.error('[Cloudinary Upload Error Details]', detail);
          return reject(new Error(error?.message ? `Failed to upload image to Cloudinary: ${error.message}` : 'Failed to upload image to Cloudinary storage.'));
        }

        resolve({
          success: true,
          assetId: result.asset_id || result.public_id,
          url: result.secure_url || result.url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}
