import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  FileText,
} from 'lucide-react';
import { Project, ThemeMode, PortfolioSection } from '../types';
import { readFileAsDataUrl } from '../utils/storage';

interface CmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  projects: Project[];
  initialSection?: PortfolioSection;
  onSaveProject: (project: Project) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onReorderProjects: (projects: Project[]) => Promise<void>;
  onResetProjects: () => Promise<void>;
}

export const CmsModal: React.FC<CmsModalProps> = ({
  isOpen,
  onClose,
  theme,
  projects,
  initialSection = 'megasub',
  onSaveProject,
  onDeleteProject,
  onReorderProjects,
  onResetProjects,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [section, setSection] = useState<PortfolioSection>(initialSection);
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState('Campaign');
  const [customCategory, setCustomCategory] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [brief, setBrief] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [manageFilter, setManageFilter] = useState<'all' | PortfolioSection>('all');

  // When opening or changing initial section, update form section if not editing
  useEffect(() => {
    if (isOpen && !editingId) {
      setSection(initialSection);
      if (initialSection === 'megasub') {
        setClient('Megasub');
        setCategory('Campaign');
      } else {
        setClient('Kingdom Life Ministry');
        setCategory('Ministry / Event');
      }
    }
  }, [isOpen, initialSection, editingId]);

  const categoryPresets = [
    'Ministry / Event',
    'Campaign',
    'Event Communication',
    'Commercial Design',
    'Brand Identity',
    'Custom...',
  ];

  const handleFileSelect = async (file: File) => {
    setFormError('');
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setImageDataUrl(dataUrl);
      setImageFileName(file.name);
    } catch {
      setFormError('Failed to process image file. Please try another.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setSection(initialSection);
    setTitle('');
    setClient(initialSection === 'megasub' ? 'Megasub' : 'Kingdom Life Ministry');
    setCategory(initialSection === 'megasub' ? 'Campaign' : 'Ministry / Event');
    setCustomCategory('');
    setYear(new Date().getFullYear().toString());
    setBrief('');
    setDescription('');
    setTagsInput('');
    setImageDataUrl('');
    setImageFileName('');
    setFormError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!title.trim()) {
      setFormError('Project title is required.');
      return;
    }

    if (!imageDataUrl) {
      setFormError('Please upload a high-resolution image for this project.');
      return;
    }

    const finalCategory =
      category === 'Custom...'
        ? customCategory.trim() || 'Visual Design'
        : category;

    const tags = tagsInput
      ? tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    setIsSubmitting(true);

    try {
      const finalBrief = brief.trim() || description.trim();
      const projectData: Project = {
        id: editingId || `proj-${Date.now()}`,
        title: title.trim(),
        client: client.trim() || (section === 'megasub' ? 'Megasub' : 'Client'),
        category: finalCategory,
        section,
        brief: finalBrief,
        imageUrl: imageDataUrl,
        year: year.trim() || new Date().getFullYear().toString(),
        description: description.trim() || finalBrief,
        tags,
        order: editingId
          ? projects.find((p) => p.id === editingId)?.order || projects.length + 1
          : projects.length + 1,
        createdAt: editingId
          ? projects.find((p) => p.id === editingId)?.createdAt || Date.now()
          : Date.now(),
      };

      await onSaveProject(projectData);
      setSuccessMessage(
        editingId
          ? `Project updated in ${section === 'megasub' ? 'Megasub' : 'Freelance'} section!`
          : `Individual work uploaded to ${section === 'megasub' ? 'Megasub' : 'Freelance'} with brief!`
      );
      resetForm();
      setTimeout(() => {
        setSuccessMessage('');
        setActiveTab('manage');
      }, 1200);
    } catch {
      setFormError('Failed to save project. Please verify file size or storage.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (proj: Project) => {
    setEditingId(proj.id);
    setSection(proj.section || (proj.client?.toLowerCase().includes('megasub') ? 'megasub' : 'freelance'));
    setTitle(proj.title);
    setClient(proj.client);
    if (categoryPresets.includes(proj.category)) {
      setCategory(proj.category);
      setCustomCategory('');
    } else {
      setCategory('Custom...');
      setCustomCategory(proj.category);
    }
    setYear(proj.year || '');
    setBrief(proj.brief || proj.description || '');
    setDescription(proj.description || '');
    setTagsInput(proj.tags?.join(', ') || '');
    setImageDataUrl(proj.imageUrl);
    setImageFileName('Existing High-Resolution Artwork');
    setActiveTab('upload');
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;

    const copy = [...projects];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    await onReorderProjects(copy);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden border z-10 my-auto ${
            theme === 'dark'
              ? 'bg-[#0d0d0d] border-white/10 text-neutral-200'
              : 'bg-[#fafafa] border-neutral-200 text-neutral-800'
          }`}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b flex items-center justify-between ${
              theme === 'dark' ? 'border-white/5 bg-[#111]' : 'border-neutral-200 bg-neutral-100'
            }`}
          >
            <div>
              <h2
                className={`text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2.5 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>Content Management System</span>
              </h2>
              <p
                className={`text-[11px] mt-0.5 ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                }`}
              >
                Upload high-resolution design works directly into your gallery
              </p>
            </div>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-sm transition-colors ${
                theme === 'dark'
                  ? 'text-neutral-400 hover:text-white hover:bg-white/10'
                  : 'text-neutral-500 hover:text-black hover:bg-neutral-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div
            className={`flex border-b px-6 pt-2 font-mono text-xs ${
              theme === 'dark' ? 'border-white/5 bg-[#0d0d0d]' : 'border-neutral-200 bg-white'
            }`}
          >
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-3 px-4 border-b-2 font-medium uppercase tracking-wider text-[11px] transition-colors ${
                activeTab === 'upload'
                  ? theme === 'dark'
                    ? 'border-white text-white font-bold'
                    : 'border-black text-black font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {editingId ? 'Edit Project' : '+ Upload New Project'}
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`pb-3 px-4 border-b-2 font-medium uppercase tracking-wider text-[11px] transition-colors ${
                activeTab === 'manage'
                  ? theme === 'dark'
                    ? 'border-white text-white font-bold'
                    : 'border-black text-black font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Manage Work ({projects.length})
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {/* Feedback Messages */}
            {successMessage && (
              <div className="mb-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{successMessage}</span>
              </div>
            )}
            {formError && (
              <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                {formError}
              </div>
            )}

            {/* TAB 1: UPLOAD & EDIT */}
            {activeTab === 'upload' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Portfolio Section Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      className={`block font-mono text-[10px] tracking-[0.2em] uppercase font-bold ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                      }`}
                    >
                      Portfolio Section *
                    </label>
                    <span className="text-[10px] font-mono text-neutral-400">
                      Destination gallery for this work
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSection('megasub');
                        if (!editingId && (!client || client === 'Kingdom Life Ministry')) {
                          setClient('Megasub');
                          setCategory('Campaign');
                        }
                      }}
                      className={`p-3.5 rounded-sm border text-left transition-all ${
                        section === 'megasub'
                          ? theme === 'dark'
                            ? 'bg-white text-black border-white shadow-sm'
                            : 'bg-black text-white border-black shadow-sm'
                          : theme === 'dark'
                          ? 'bg-[#141414] text-neutral-400 border-white/10 hover:border-white/25'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider">
                          // MEGASUB
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-neutral-500/20">
                          IN-HOUSE
                        </span>
                      </div>
                      <p
                        className={`text-[11px] mt-1.5 leading-snug ${
                          section === 'megasub' ? 'opacity-90' : 'opacity-60'
                        }`}
                      >
                        Automated airtime/data vending, digital campaigns &amp; commercial banners
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSection('freelance');
                        if (!editingId && (!client || client === 'Megasub')) {
                          setClient('Kingdom Life Ministry');
                          setCategory('Ministry / Event');
                        }
                      }}
                      className={`p-3.5 rounded-sm border text-left transition-all ${
                        section === 'freelance'
                          ? theme === 'dark'
                            ? 'bg-white text-black border-white shadow-sm'
                            : 'bg-black text-white border-black shadow-sm'
                          : theme === 'dark'
                          ? 'bg-[#141414] text-neutral-400 border-white/10 hover:border-white/25'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider">
                          // FREELANCE
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-neutral-500/20">
                          COMMISSIONS
                        </span>
                      </div>
                      <p
                        className={`text-[11px] mt-1.5 leading-snug ${
                          section === 'freelance' ? 'opacity-90' : 'opacity-60'
                        }`}
                      >
                        Evangelistic crusades, church conferences, client branding &amp; typography
                      </p>
                    </button>
                  </div>
                </div>

                {/* Upload Drag & Drop Area */}
                <div>
                  <label
                    className={`block font-mono text-xs tracking-wider uppercase mb-2 ${
                      theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                    }`}
                  >
                    High-Resolution Artwork File *
                  </label>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : imageDataUrl
                        ? theme === 'dark'
                          ? 'border-indigo-500/40 bg-neutral-900/50'
                          : 'border-indigo-300 bg-indigo-50/50'
                        : theme === 'dark'
                        ? 'border-white/10 hover:border-white/20 bg-neutral-900/30'
                        : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                    />

                    {imageDataUrl ? (
                      <div className="flex flex-col items-center">
                        <div className="relative max-h-48 max-w-full rounded-lg overflow-hidden border border-white/10 shadow-md mb-3 bg-neutral-950">
                          <img
                            src={imageDataUrl}
                            alt="Preview"
                            className="max-h-48 w-auto object-contain"
                          />
                        </div>
                        <p className="text-xs font-mono text-indigo-400 truncate max-w-md font-medium">
                          {imageFileName || 'Image attached'}
                        </p>
                        <p
                          className={`text-[11px] mt-1 ${
                            theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                          }`}
                        >
                          Click or drop another file to replace
                        </p>
                      </div>
                    ) : (
                      <div className="py-4 flex flex-col items-center justify-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                            theme === 'dark' ? 'bg-neutral-800 text-indigo-400' : 'bg-neutral-200 text-indigo-600'
                          }`}
                        >
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold mb-1">
                          Click to upload or drag &amp; drop
                        </p>
                        <p
                          className={`text-xs ${
                            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                          }`}
                        >
                          High-res PNG, JPG, SVG, WEBP (saved locally in IndexedDB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <label
                      className={`block font-mono text-xs tracking-wider uppercase mb-1.5 ${
                        theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                      }`}
                    >
                      Work / Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        section === 'megasub'
                          ? 'e.g. Megasub Quick Airtime Promo'
                          : 'e.g. Annual Believers Convention Poster'
                      }
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-sm text-sm transition-colors border ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-white/10 text-white focus:border-white focus:outline-none'
                          : 'bg-white border-neutral-300 text-black focus:border-black focus:outline-none'
                      }`}
                    />
                  </div>

                  {/* Client */}
                  <div>
                    <label
                      className={`block font-mono text-xs tracking-wider uppercase mb-1.5 ${
                        theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                      }`}
                    >
                      Client / Organisation
                    </label>
                    <input
                      type="text"
                      placeholder={section === 'megasub' ? 'Megasub' : 'Kingdom Life Ministry'}
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-sm text-sm transition-colors border ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-white/10 text-white focus:border-white focus:outline-none'
                          : 'bg-white border-neutral-300 text-black focus:border-black focus:outline-none'
                      }`}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      className={`block font-mono text-xs tracking-wider uppercase mb-1.5 ${
                        theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                      }`}
                    >
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-sm text-sm transition-colors border ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-white/10 text-white focus:border-white focus:outline-none'
                          : 'bg-white border-neutral-300 text-black focus:border-black focus:outline-none'
                      }`}
                    >
                      {categoryPresets.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    {category === 'Custom...' && (
                      <input
                        type="text"
                        placeholder="Enter custom category"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className={`w-full mt-2 px-3.5 py-2 rounded-sm text-sm transition-colors border ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-white/10 text-white focus:border-white focus:outline-none'
                            : 'bg-white border-neutral-300 text-black focus:border-black focus:outline-none'
                        }`}
                      />
                    )}
                  </div>

                  {/* Year */}
                  <div>
                    <label
                      className={`block font-mono text-xs tracking-wider uppercase mb-1.5 ${
                        theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                      }`}
                    >
                      Year
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2025"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-sm text-sm transition-colors border ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-white/10 text-white focus:border-white focus:outline-none'
                          : 'bg-white border-neutral-300 text-black focus:border-black focus:outline-none'
                      }`}
                    />
                  </div>
                </div>

                {/* Design Brief / Client Objectives (KEY FEATURE) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      className={`block font-mono text-[10px] tracking-[0.2em] uppercase font-bold flex items-center gap-1.5 ${
                        theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Project Brief &amp; Creative Objectives *</span>
                    </label>
                    <span className="text-[10px] font-mono text-neutral-500">
                      Showcased in gallery &amp; lightbox
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder={
                      section === 'megasub'
                        ? 'e.g. Brief: Drive conversions for Megasub’s automated 24/7 instant data bundles. Challenge: Create vibrant, high-contrast mobile creatives that stand out on WhatsApp and Instagram feeds with clear tariff pricing.'
                        : 'e.g. Brief: Design stage backdrop, invitation cards, and social media flyers for a 5-day ministry revival convention. Challenge: High-contrast typography readable on 30ft outdoor displays.'
                    }
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-sm text-sm transition-colors border ${
                      theme === 'dark'
                        ? 'bg-neutral-900 border-white/10 text-white focus:border-white focus:outline-none'
                        : 'bg-white border-neutral-300 text-black focus:border-black focus:outline-none'
                    }`}
                  />
                  <p
                    className={`text-[11px] mt-1 ${
                      theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                    }`}
                  >
                    Include client problem, target audience, deliverables, and graphic approach.
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label
                    className={`block font-mono text-xs tracking-wider uppercase mb-1.5 ${
                      theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                    }`}
                  >
                    Skills / Tools (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Photoshop, Poster Design, Typography, Commercial Ads"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-sm text-sm transition-colors border ${
                      theme === 'dark'
                        ? 'bg-neutral-900 border-white/10 text-white focus:border-white focus:outline-none'
                        : 'bg-white border-neutral-300 text-black focus:border-black focus:outline-none'
                    }`}
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  {editingId ? (
                    <button
                      type="button"
                      onClick={resetForm}
                      className={`px-4 py-2 rounded-sm text-xs font-mono ${
                        theme === 'dark'
                          ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                          : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                      }`}
                    >
                      Cancel Edit
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className={`px-4 py-2 rounded-sm text-xs font-mono ${
                        theme === 'dark'
                          ? 'text-neutral-400 hover:text-white'
                          : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-2.5 rounded-sm text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-md active:scale-95 ${
                        theme === 'dark'
                          ? 'bg-white text-black hover:bg-neutral-200 disabled:opacity-50'
                          : 'bg-black text-white hover:bg-neutral-800 disabled:opacity-50'
                      }`}
                    >
                      {isSubmitting
                        ? 'Saving...'
                        : editingId
                        ? 'Save Changes'
                        : `Upload to ${section === 'megasub' ? 'Megasub' : 'Freelance'}`}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: MANAGE & REORDER */}
            {activeTab === 'manage' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
                  {/* Filter by Section in Manage view */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                      Filter:
                    </span>
                    {(['all', 'megasub', 'freelance'] as const).map((sec) => (
                      <button
                        key={sec}
                        onClick={() => setManageFilter(sec)}
                        className={`px-2.5 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-colors ${
                          manageFilter === sec
                            ? theme === 'dark'
                              ? 'bg-white text-black font-bold'
                              : 'bg-black text-white font-bold'
                            : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {sec === 'all'
                          ? `All (${projects.length})`
                          : sec === 'megasub'
                          ? `Megasub (${projects.filter((p) => p.section === 'megasub').length})`
                          : `Freelance (${projects.filter((p) => p.section === 'freelance').length})`}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={async () => {
                      if (
                        window.confirm(
                          'Reset all projects back to original showcase artworks with default briefs?'
                        )
                      ) {
                        await onResetProjects();
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono transition-colors ${
                      theme === 'dark'
                        ? 'text-neutral-400 hover:text-amber-400 hover:bg-neutral-800'
                        : 'text-neutral-500 hover:text-amber-600 hover:bg-neutral-100'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {projects
                    .filter((p) => manageFilter === 'all' || p.section === manageFilter)
                    .map((proj, idx) => (
                      <div
                        key={proj.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                          theme === 'dark'
                            ? 'bg-[#141414] border-white/10 hover:border-white/20'
                            : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Thumbnail */}
                          <div className="w-14 h-10 rounded-sm overflow-hidden bg-neutral-950 flex-shrink-0 border border-white/10">
                            {proj.imageUrl ? (
                              <img
                                src={proj.imageUrl}
                                alt={proj.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-4 h-4 m-auto text-neutral-600" />
                            )}
                          </div>

                          {/* Metadata */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${
                                  proj.section === 'megasub'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                {proj.section === 'megasub' ? 'MEGASUB' : 'FREELANCE'}
                              </span>
                              <h4
                                className={`text-sm font-bold truncate ${
                                  theme === 'dark' ? 'text-white' : 'text-neutral-900'
                                }`}
                              >
                                {proj.title}
                              </h4>
                            </div>
                            <p
                              className={`text-xs font-mono truncate mt-0.5 ${
                                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                              }`}
                            >
                              [{proj.client}] · {proj.category}
                            </p>
                            {(proj.brief || proj.description) && (
                              <p
                                className={`text-[11px] truncate max-w-md mt-0.5 ${
                                  theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                                }`}
                              >
                                <span className="font-semibold">Brief:</span> {proj.brief || proj.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMove(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded hover:bg-neutral-700/50 disabled:opacity-30"
                            title="Move up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMove(idx, 'down')}
                            disabled={idx === projects.length - 1}
                            className="p-1.5 rounded hover:bg-neutral-700/50 disabled:opacity-30"
                            title="Move down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStartEdit(proj)}
                            className="p-1.5 rounded hover:bg-neutral-700/50 text-indigo-400"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete project "${proj.title}"?`)) {
                                await onDeleteProject(proj.id);
                              }
                            }}
                            className="p-1.5 rounded hover:bg-red-500/20 text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('upload');
                    }}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold"
                  >
                    + Add Another Project
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
