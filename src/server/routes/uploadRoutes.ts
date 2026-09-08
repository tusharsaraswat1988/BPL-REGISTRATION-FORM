import { Router } from 'express';
import multer from 'multer';
import { uploadToCloudinary, UploadFolderType, isCloudinaryReady } from '../services/cloudinaryService';
import { uploadLimiter } from '../middleware/rateLimiter';

export const uploadRoutes = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only JPG, PNG, and WEBP images are allowed.'));
    }
  },
});

uploadRoutes.post(
  '/upload',
  uploadLimiter,
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'NoFileProvided',
          message: 'Please choose an image file to upload.',
        });
        return;
      }

      const folderTypeRaw = (req.body.tag || req.body.folder || 'associations') as string;
      const validFolders: UploadFolderType[] = ['associations', 'players', 'mentors', 'payment-proofs'];
      const folderType: UploadFolderType = validFolders.includes(folderTypeRaw as UploadFolderType)
        ? (folderTypeRaw as UploadFolderType)
        : 'associations';

      if (!isCloudinaryReady()) {
        res.status(503).json({
          success: false,
          error: 'StorageNotConfigured',
          message: 'Cloudinary storage service is not configured. Please contact the tournament administrator.',
        });
        return;
      }

      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        req.file.mimetype,
        folderType,
        req.file.originalname
      );

      res.status(200).json({
        success: true,
        assetId: uploadResult.assetId,
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        format: uploadResult.format,
      });
    } catch (err: any) {
      next(err);
    }
  }
);
