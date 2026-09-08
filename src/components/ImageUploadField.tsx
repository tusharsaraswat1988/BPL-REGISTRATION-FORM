import React, { useState, useRef } from 'react';
import { Upload, Check, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

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
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
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
        setUploadStatus('error');
        setErrorMessage(data.message || 'Image upload failed. Please try again.');
      }
    } catch (err) {
      setUploadStatus('error');
      setErrorMessage('Network error during upload. Please check connection and retry.');
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

  return (
    <div className="space-y-1.5" id={id}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label} {required && <span className="text-[#FFB800]">*</span>}
        </label>
        {uploadStatus === 'uploading' && (
          <span className="text-[11px] text-[#FFB800] flex items-center gap-1 font-medium animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Uploading image...
          </span>
        )}
        {uploadStatus === 'success' && (
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <Check className="w-3 h-3" />
            Uploaded ✓
          </span>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (uploadStatus !== 'uploading') {
            fileInputRef.current?.click();
          }
        }}
        className={`relative group border-2 border-dashed rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#FFB800] bg-[#FFB800]/10'
            : value
            ? 'border-[#1A2C68] bg-[#0A1230]/60 hover:border-[#FFB800]/50'
            : 'border-[#1A2C68] bg-[#070D24]/60 hover:border-slate-700 hover:bg-[#0A1230]'
        } ${uploadStatus === 'uploading' ? 'opacity-70 cursor-not-allowed pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploadStatus === 'uploading'}
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
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                Photo Ready
              </p>
              <p className="text-[11px] text-slate-400">
                Click or drag another image to replace
              </p>
            </div>

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
        <div className="flex items-center justify-between text-[11px] text-red-400 mt-1">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {errorMessage || error}
          </span>
          {uploadStatus === 'error' && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[#FFB800] hover:underline flex items-center gap-1 text-[10px] font-semibold"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
};
