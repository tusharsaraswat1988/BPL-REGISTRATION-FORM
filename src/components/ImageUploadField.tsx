import React, { useState, useRef } from 'react';
import { Upload, Check, AlertCircle, Loader2, RefreshCw, CloudCheck, HardDrive } from 'lucide-react';
import { compressImageToDataUrl, isDataUrl, dataUrlToFile } from '../utils/imageUtils';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  tag?: 'associations' | 'players' | 'mentors' | 'payment-proofs';
  required?: boolean;
  aspectRatio?: 'square' | 'wide';
  helperText?: string;
  error?: string;
  id?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  tag = 'associations',
  required = false,
  aspectRatio = 'square',
  helperText = 'PNG, JPG, or WEBP up to 5MB',
  error,
  id
}) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'compressing' | 'uploading' | 'success' | 'offline_saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFileToCloud = async (fileToUpload: File | Blob, originalName = 'photo.jpg') => {
    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', fileToUpload, originalName);
      formData.append('tag', tag);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success && data.url) {
        onChange(data.url);
        setUploadStatus('success');
      } else {
        // Upload failed on server side, but local dataUrl is preserved!
        setUploadStatus('offline_saved');
        setErrorMessage(data.message ? `Cloud sync pending: ${data.message}` : 'Photo saved to your device. Cloud sync will retry.');
      }
    } catch (err) {
      // Network disconnection or server offline: photo is safely saved locally!
      setUploadStatus('offline_saved');
      setErrorMessage('Offline: Photo saved locally on this device.');
    }
  };

  const processFile = async (file: File) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      setErrorMessage('File size exceeds the 5MB limit.');
      return;
    }

    // Validate MIME type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setUploadStatus('error');
      setErrorMessage('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    setUploadStatus('compressing');
    setErrorMessage('');

    try {
      // 1. Instant local compression & persistence (0ms delay for UI)
      const compressedDataUrl = await compressImageToDataUrl(file, {
        maxWidth: 900,
        maxHeight: 900,
        quality: 0.84,
      });

      // Immediately pass compressed base64 dataUrl to form state & local storage
      onChange(compressedDataUrl);

      // 2. If online, upload to Cloudinary in background
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setUploadStatus('offline_saved');
        return;
      }

      await uploadFileToCloud(file, file.name);
    } catch (err: any) {
      console.warn('[Image Processing Error]:', err);
      // Fallback: try direct upload if compression fails
      uploadFileToCloud(file, file.name);
    }
  };

  const retryCloudUpload = () => {
    if (value && isDataUrl(value)) {
      const reconstructedFile = dataUrlToFile(value, `${tag}_photo.jpg`);
      if (reconstructedFile) {
        uploadFileToCloud(reconstructedFile, `${tag}_photo.jpg`);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const isLocalData = isDataUrl(value);

  return (
    <div className="space-y-1.5" id={id}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label} {required && <span className="text-[#FFB800]">*</span>}
        </label>
        {uploadStatus === 'compressing' && (
          <span className="text-[11px] text-[#FFB800] flex items-center gap-1 font-medium animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Optimizing photo...
          </span>
        )}
        {uploadStatus === 'uploading' && (
          <span className="text-[11px] text-[#FFB800] flex items-center gap-1 font-medium animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Uploading to cloud...
          </span>
        )}
        {uploadStatus === 'offline_saved' && (
          <span className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
            <HardDrive className="w-3 h-3" />
            Saved to device
          </span>
        )}
        {(uploadStatus === 'success' || (value && !isLocalData)) && (
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <Check className="w-3 h-3" />
            Cloud Synced ✓
          </span>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (uploadStatus !== 'uploading' && uploadStatus !== 'compressing') {
            fileInputRef.current?.click();
          }
        }}
        className={`relative group border-2 border-dashed rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#FFB800] bg-[#FFB800]/10'
            : value
            ? 'border-[#1A2C68] bg-[#0A1230]/60 hover:border-[#FFB800]/50'
            : 'border-[#1A2C68] bg-[#070D24]/60 hover:border-slate-700 hover:bg-[#0A1230]'
        } ${uploadStatus === 'uploading' || uploadStatus === 'compressing' ? 'opacity-70 cursor-not-allowed pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploadStatus === 'uploading' || uploadStatus === 'compressing'}
        />

        {value ? (
          <div className="flex items-center gap-3">
            <div
              className={`relative overflow-hidden rounded-lg bg-[#070D24] border border-[#1A2C68] flex-shrink-0 flex items-center justify-center ${
                aspectRatio === 'wide' ? 'w-24 h-16' : 'w-14 h-14'
              }`}
            >
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                <span className={`inline-block w-2 h-2 rounded-full ${isLocalData ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                {isLocalData ? 'Photo Preserved (Local Draft)' : 'Photo Ready'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isLocalData ? 'Saved locally. Click Change to replace.' : 'Click or drag another image to replace'}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {isLocalData && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    retryCloudUpload();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#1A2C68] hover:bg-[#253D88] text-[#FFB800] text-xs font-semibold border border-[#FFB800]/30 transition-colors flex items-center gap-1"
                  title="Upload to cloud"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span className="hidden sm:inline">Sync</span>
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#0E1B48] hover:bg-[#1A2C68] text-slate-200 text-xs font-medium border border-[#1A2C68] transition-colors"
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <div className="py-2 flex flex-col items-center justify-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#0A1230] border border-[#1A2C68] flex items-center justify-center text-slate-400 group-hover:text-[#FFB800] group-hover:border-[#FFB800]/40 transition-colors">
              <Upload className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-300">
              <span className="text-[#FFB800] font-bold underline decoration-[#FFB800]/50 underline-offset-2">
                Choose File
              </span>{' '}
              or drag & drop here
            </p>
            <p className="text-[10px] text-slate-500">{helperText}</p>
          </div>
        )}
      </div>

      {(error || errorMessage) && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
          <span className={`flex items-center gap-1 ${error ? 'text-red-400' : 'text-slate-400'}`}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error || errorMessage}
          </span>
          {(uploadStatus === 'error' || uploadStatus === 'offline_saved') && (
            <button
              type="button"
              onClick={retryCloudUpload}
              className="text-[#FFB800] hover:underline flex items-center gap-1 text-[10px] font-semibold cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Retry Sync
            </button>
          )}
        </div>
      )}
    </div>
  );
};

