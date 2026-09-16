import React, { useState, useRef } from 'react';
import { Upload, X, Star, Plus, Link, AlertCircle, Loader2 } from 'lucide-react';
import { readMultipleFilesAsDataUrls, optimizeImageFile } from '../utils/experienceStorage';

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  images,
  onChange,
  disabled = false,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validImageFiles = fileArray.filter((f) => f.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      setErrorMsg('Please select valid image files (PNG, JPG, SVG, WebP).');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg('');
      setProgressMsg(`Optimizing ${validImageFiles.length} ${validImageFiles.length === 1 ? 'image' : 'images'}...`);

      const newUploadedUrls = await readMultipleFilesAsDataUrls(
        validImageFiles,
        (current, total) => {
          setProgressMsg(`Processing image ${current} of ${total}...`);
        }
      );

      onChange([...images, ...newUploadedUrls]);
      setProgressMsg('');
    } catch {
      setErrorMsg('Failed to process some images. Please try again.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    try {
      new URL(trimmed);
      onChange([...images, trimmed]);
      setUrlInput('');
      setErrorMsg('');
    } catch {
      setErrorMsg('Please enter a valid URL (e.g. https://example.com/banner.jpg)');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleSetCover = (indexToMakeCover: number) => {
    if (indexToMakeCover === 0) return;
    const selected = images[indexToMakeCover];
    const remaining = images.filter((_, idx) => idx !== indexToMakeCover);
    onChange([selected, ...remaining]);
  };

  return (
    <div className="space-y-4">
      {/* Header controls & tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
            Design Images / Deliverables *
          </label>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-semibold">
            {images.length} {images.length === 1 ? 'image' : 'images'} added
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/40 border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Upload Files
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'url'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Add Image URL
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-lg text-xs bg-red-500/15 border border-red-500/30 text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      {activeTab === 'upload' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (!disabled && !isProcessing) {
              fileInputRef.current?.click();
            }
          }}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-orange-500 bg-orange-500/10 scale-[0.99]'
              : 'border-white/20 hover:border-orange-500/60 bg-white/[0.02] hover:bg-white/[0.04]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled || isProcessing}
            id="multi-file-upload-input"
          />

          <div className="flex flex-col items-center justify-center">
            {isProcessing ? (
              <>
                <Loader2 className="w-8 h-8 text-orange-400 animate-spin mb-2" />
                <p className="text-sm font-semibold text-white">{progressMsg || 'Processing images...'}</p>
                <p className="text-xs text-neutral-400 mt-1">Compressing and preparing deliverables</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-orange-400" />
                </div>
                <p className="text-sm font-semibold text-white">
                  Click to select <span className="text-orange-400 underline decoration-orange-400/40">multiple images</span> or drag &amp; drop
                </p>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                  Upload multiple campaign assets, story versions, flyers, and mockups in one batch (PNG, JPG, SVG, WebP).
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Image URL Input Form */
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
              placeholder="Paste public image link (e.g. https://images.unsplash.com/...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-[#0e1424] border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            type="button"
            onClick={() => handleAddUrl()}
            className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white shrink-0 active:scale-95 transition-all"
          >
            + Add URL
          </button>
        </div>
      )}

      {/* Uploaded Images Gallery / Management Strip */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>
              Deliverables Gallery ({images.length} {images.length === 1 ? 'file' : 'files'})
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add more images</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((imgUrl, index) => {
              const isCover = index === 0;
              return (
                <div
                  key={`${index}-${imgUrl.slice(0, 30)}`}
                  className={`group relative rounded-xl border overflow-hidden aspect-[4/3] bg-black/60 transition-all ${
                    isCover
                      ? 'border-orange-500 ring-2 ring-orange-500/40'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Deliverable ${index + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {/* Primary Cover Badge */}
                  {isCover ? (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-orange-500 text-white flex items-center gap-1 shadow-md">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>COVER</span>
                    </div>
                  ) : (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/70 text-neutral-300 backdrop-blur-sm">
                      #{index + 1}
                    </div>
                  )}

                  {/* Hover Overlay Controls */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        className="p-1 rounded-full bg-red-600/90 text-white hover:bg-red-700 transition-colors"
                        title="Remove this image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {!isCover && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetCover(index);
                        }}
                        className="w-full py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1 shadow"
                      >
                        <Star className="w-3 h-3 text-orange-500 fill-current" />
                        <span>Make Cover</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
