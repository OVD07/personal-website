import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Link,
  Grid,
  Check,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { ExperienceCompany, ThemeMode } from '../types';
import { CompanyLogo, PRESET_ICONS } from './CompanyLogo';
import { optimizeImageFile } from '../utils/experienceStorage';

interface SectionIconModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: ExperienceCompany | null;
  theme: ThemeMode;
  onSaveCompany: (updated: ExperienceCompany) => void;
  onResetCompany?: (companyId: string) => void;
}

type TabMode = 'upload' | 'preset' | 'url';

const BG_COLOR_OPTIONS = [
  { label: 'Clean White', value: 'white', hex: '#ffffff' },
  { label: 'Dark Slate', value: '#0e1424', hex: '#0e1424' },
  { label: 'Pure Black', value: '#000000', hex: '#000000' },
  { label: 'Subtle Gray', value: '#f4f4f5', hex: '#f4f4f5' },
  { label: 'Transparent', value: 'transparent', hex: 'transparent' },
];

export const SectionIconModal: React.FC<SectionIconModalProps> = ({
  isOpen,
  onClose,
  company,
  theme,
  onSaveCompany,
  onResetCompany,
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('upload');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [role, setRole] = useState('');
  const [period, setPeriod] = useState('');
  const [description, setDescription] = useState('');
  const [logoBg, setLogoBg] = useState('white');
  const [logoKey, setLogoKey] = useState('megasub');
  const [customIconUrl, setCustomIconUrl] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setCategory(company.category || '');
      setRole(company.role || '');
      setPeriod(company.period || '');
      setDescription(company.description || '');
      setLogoBg(company.logoBg || 'white');
      setLogoKey(company.logoKey || (company.id === 'megasub' ? 'megasub' : 'freelance'));
      setCustomIconUrl(company.customIconUrl || '');
      setUrlInput(company.customIconUrl?.startsWith('http') ? company.customIconUrl : '');
      setActiveTab(company.customIconUrl ? 'upload' : 'preset');
    }
  }, [company, isOpen]);

  if (!isOpen || !company) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUploadedFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processUploadedFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }
    setIsProcessingFile(true);
    try {
      const dataUrl = await optimizeImageFile(file, 800, 0.9);
      setCustomIconUrl(dataUrl);
      setUrlInput('');
    } catch (err) {
      console.error('Error optimizing logo image:', err);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processUploadedFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setCustomIconUrl(urlInput.trim());
    }
  };

  const handleClearCustomIcon = () => {
    setCustomIconUrl('');
    setUrlInput('');
  };

  const handleSelectPreset = (key: string) => {
    setLogoKey(key);
    setCustomIconUrl('');
    setUrlInput('');
  };

  const handleSave = () => {
    const updated: ExperienceCompany = {
      ...company,
      name: name.trim() || company.name,
      category: category.trim(),
      role: role.trim(),
      period: period.trim(),
      description: description.trim(),
      logoBg,
      logoKey,
      customIconUrl: customIconUrl.trim(),
      iconType: customIconUrl.trim() ? 'custom' : 'preset',
    };
    onSaveCompany(updated);
    onClose();
  };

  const handleResetToDefault = () => {
    if (onResetCompany) {
      onResetCompany(company.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden my-8 z-10 ${
            theme === 'dark'
              ? 'bg-[#0f0f10] border-white/10 text-white'
              : 'bg-white border-neutral-200 text-neutral-900'
          }`}
        >
          {/* Header */}
          <div
            className={`px-6 py-5 border-b flex items-center justify-between ${
              theme === 'dark' ? 'border-white/10 bg-neutral-950/40' : 'border-neutral-200 bg-neutral-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border p-1"
                style={{
                  backgroundColor:
                    logoBg === 'white'
                      ? '#ffffff'
                      : logoBg === 'transparent'
                      ? 'transparent'
                      : logoBg,
                }}
              >
                <CompanyLogo
                  logoKey={logoKey}
                  customIconUrl={customIconUrl}
                  companyName={name}
                  hideText
                  className="w-full h-full p-0"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                  Customize Section Icon &amp; Details
                </h3>
                <p className="text-xs text-neutral-400">
                  Configure the visual brand mark for {name || company.name}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-white/10 text-neutral-400 hover:text-white'
                  : 'hover:bg-neutral-200 text-neutral-500 hover:text-black'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[calc(85vh-130px)] overflow-y-auto">
            {/* Live Preview Banner */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                theme === 'dark' ? 'bg-neutral-900/60 border-white/10' : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                  Live Preview:
                </span>
                <div
                  className="rounded-xl p-2 border shadow-sm flex items-center justify-center min-w-[140px]"
                  style={{
                    backgroundColor:
                      logoBg === 'white'
                        ? '#ffffff'
                        : logoBg === 'transparent'
                        ? theme === 'dark'
                          ? '#18181b'
                          : '#ffffff'
                        : logoBg,
                  }}
                >
                  <CompanyLogo
                    logoKey={logoKey}
                    customIconUrl={customIconUrl}
                    companyName={name}
                    className="p-0"
                  />
                </div>
              </div>

              {customIconUrl && (
                <button
                  type="button"
                  onClick={handleClearCustomIcon}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Custom Icon</span>
                </button>
              )}
            </div>

            {/* Icon Source Navigation Tabs */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                Select Icon Source
              </label>
              <div className="flex gap-2 p-1 rounded-xl bg-neutral-800/40 border border-white/5">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'upload'
                      ? theme === 'dark'
                        ? 'bg-white text-black font-bold shadow'
                        : 'bg-black text-white font-bold shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('preset')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'preset'
                      ? theme === 'dark'
                        ? 'bg-white text-black font-bold shadow'
                        : 'bg-black text-white font-bold shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Choose Preset</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'url'
                      ? theme === 'dark'
                        ? 'bg-white text-black font-bold shadow'
                        : 'bg-black text-white font-bold shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Link className="w-3.5 h-3.5" />
                  <span>Image URL</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: UPLOAD */}
            {activeTab === 'upload' && (
              <div>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-500/10 scale-[0.99]'
                      : theme === 'dark'
                      ? 'border-white/15 hover:border-white/30 bg-neutral-900/40 hover:bg-neutral-900/70'
                      : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50 hover:bg-neutral-100'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center justify-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-white/10 text-white' : 'bg-neutral-200 text-black'
                      }`}
                    >
                      {isProcessingFile ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {isProcessingFile
                          ? 'Optimizing and loading icon...'
                          : 'Click to select or drag and drop your logo file'}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        PNG, JPG, SVG, WebP (Ideal size: square 200×200px or rectangular logo mark)
                      </p>
                    </div>
                  </div>
                </div>

                {customIconUrl && (
                  <div className="mt-3 flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-lg">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Custom icon successfully loaded and ready!</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="underline font-bold hover:text-white"
                    >
                      Replace
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: PRESETS */}
            {activeTab === 'preset' && (
              <div>
                <p className="text-xs text-neutral-400 mb-3">
                  Select a stylized vector preset designed for commercial, creative, or ministry sections:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PRESET_ICONS.map((preset) => {
                    const isSelected = logoKey === preset.key && !customIconUrl;
                    return (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => handleSelectPreset(preset.key)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? theme === 'dark'
                              ? 'bg-blue-600/20 border-blue-500 shadow-sm ring-1 ring-blue-500'
                              : 'bg-blue-50 border-blue-600 shadow-sm ring-1 ring-blue-600'
                            : theme === 'dark'
                            ? 'bg-neutral-900/60 border-white/10 hover:border-white/20'
                            : 'bg-white border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-10 h-10 rounded-lg bg-white/90 p-1 flex items-center justify-center border shadow-sm">
                            <CompanyLogo logoKey={preset.key} hideText className="p-0" />
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                        </div>
                        <div>
                          <span className="text-xs font-bold block">{preset.label}</span>
                          <span className="text-[10px] text-neutral-400 line-clamp-1">
                            {preset.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: URL */}
            {activeTab === 'url' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Direct Image or Logo URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className={`flex-1 px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none transition-colors ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-white/10 focus:border-white/30 text-white placeholder-neutral-500'
                          : 'bg-white border-neutral-300 focus:border-neutral-500 text-black placeholder-neutral-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                        theme === 'dark'
                          ? 'bg-white text-black hover:bg-neutral-200'
                          : 'bg-black text-white hover:bg-neutral-800'
                      }`}
                    >
                      Apply
                    </button>
                  </div>
                </div>
                {customIconUrl && customIconUrl.startsWith('http') && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> URL icon active.
                  </p>
                )}
              </div>
            )}

            {/* Logo Background Color Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                Icon Container Background
              </label>
              <div className="flex flex-wrap gap-2">
                {BG_COLOR_OPTIONS.map((bg) => {
                  const isSelected = logoBg === bg.value;
                  return (
                    <button
                      key={bg.value}
                      type="button"
                      onClick={() => setLogoBg(bg.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 border transition-all ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                          : theme === 'dark'
                          ? 'border-white/10 hover:border-white/20 bg-neutral-900/50'
                          : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{
                          backgroundColor:
                            bg.value === 'transparent'
                              ? theme === 'dark'
                                ? '#27272a'
                                : '#e4e4e7'
                              : bg.hex,
                        }}
                      />
                      <span>{bg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggle Advanced Section Details */}
            <div className="pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowAdvancedDetails((prev) => !prev)}
                className="text-xs font-medium text-blue-400 hover:underline flex items-center gap-1"
              >
                {showAdvancedDetails ? '− Hide' : '+ Edit'} Section Titles &amp; Role Details
              </button>

              {showAdvancedDetails && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        Section / Company Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Megasub or Freelance Graphic Designer"
                        className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-none ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-white/10 focus:border-white/30 text-white'
                            : 'bg-white border-neutral-300 focus:border-neutral-500 text-black'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        Domain / Category
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Commercial Design & Digital Telecom"
                        className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-none ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-white/10 focus:border-white/30 text-white'
                            : 'bg-white border-neutral-300 focus:border-neutral-500 text-black'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        Role Title
                      </label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. In-house Graphic Designer"
                        className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-none ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-white/10 focus:border-white/30 text-white'
                            : 'bg-white border-neutral-300 focus:border-neutral-500 text-black'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        Period / Duration
                      </label>
                      <input
                        type="text"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        placeholder="e.g. 4 Months or 5 Years"
                        className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-none ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-white/10 focus:border-white/30 text-white'
                            : 'bg-white border-neutral-300 focus:border-neutral-500 text-black'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Section Description
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief overview of responsibilities and focus..."
                      className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-none ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-white/10 focus:border-white/30 text-white'
                          : 'bg-white border-neutral-300 focus:border-neutral-500 text-black'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div
            className={`px-6 py-4 border-t flex items-center justify-between gap-3 ${
              theme === 'dark' ? 'border-white/10 bg-neutral-950/40' : 'border-neutral-200 bg-neutral-50'
            }`}
          >
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-white/10 text-neutral-300'
                    : 'hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg transition-transform active:scale-95 ${
                  theme === 'dark'
                    ? 'bg-white text-black hover:bg-neutral-200'
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
