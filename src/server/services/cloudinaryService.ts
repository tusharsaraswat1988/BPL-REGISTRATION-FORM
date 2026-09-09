import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
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
  if (cloudName) {
    cloudinary.config({
      cloud_name: cloudName,
      ...(apiKey ? { api_key: apiKey } : {}),
      ...(apiSecret ? { api_secret: apiSecret } : {}),
      secure: true,
    });
    isCloudinaryConfigured = true;
    return true;
  }

  return false;
}

export function isCloudinaryReady(): boolean {
  const { cloudName, uploadPreset, apiKey, apiSecret } = config.cloudinary;
  return Boolean(cloudName && (uploadPreset || (apiKey && apiSecret)));
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

  const { uploadPreset, apiKey, apiSecret } = config.cloudinary;

  const cleanFilename = originalFilename
    ? originalFilename.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40)
    : 'upload';

  // Determine upload options:
  // If upload_preset is configured (e.g. bpl_kids_public), use unsigned stream which works with upload preset
  // If signed upload credentials are provided without preset, use signed options.
  const uploadOptions: UploadApiOptions = uploadPreset
    ? {
        upload_preset: uploadPreset,
        unsigned: true,
        resource_type: 'image',
        tags: ['bpl-kids', folderType],
      }
    : {
        folder: `bpl-kids/${folderType}`,
        resource_type: 'image',
        public_id: `${cleanFilename}_${Date.now()}`,
        overwrite: true,
      };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error || !result) {
          const detail = error ? (typeof error === 'object' ? JSON.stringify(error) : String(error)) : 'No result returned';
          console.error('[Cloudinary Upload Error Details]', detail);

          const safeMessage = error?.message && !error.message.toLowerCase().includes('secret')
            ? `Cloudinary upload error: ${error.message}`
            : 'Failed to upload image to Cloudinary storage.';

          return reject(new Error(safeMessage));
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
