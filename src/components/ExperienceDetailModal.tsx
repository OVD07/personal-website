import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Image as ImageIcon,
  Calendar,
  ExternalLink,
  ChevronLeft,
  Check,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { ExperienceCompany, ExperienceDesign, ThemeMode } from '../types';
import { CompanyLogo } from './CompanyLogo';
import { MultiImageUpload } from './MultiImageUpload';
import { ExperienceDesignCard } from './ExperienceDesignCard';
import { SectionIconModal } from './SectionIconModal';

interface ExperienceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: ExperienceCompany | null;
  designs: ExperienceDesign[];
  theme: ThemeMode;
  onSaveDesign: (design: ExperienceDesign) => void;
  onDeleteDesign: (designId: string) => void;
  onViewFullscreen?: (imageUrl: string, title: string) => void;
  initialOpenAdd?: boolean;
  onSaveCompany?: (updated: ExperienceCompany) => void;
  onResetCompany?: (companyId: string) => void;
}

export const ExperienceDetailModal: React.FC<ExperienceDetailModalProps> = ({
  isOpen,
  onClose,
  experience,
  designs,
  theme,
  onSaveDesign,
  onDeleteDesign,
  onViewFullscreen,
  initialOpenAdd = false,
  onSaveCompany,
  onResetCompany,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(initialOpenAdd);
  const [editingDesign, setEditingDesign] = useState<ExperienceDesign | null>(null);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);

  // Sync initialOpenAdd prop when opened
  useEffect(() => {
    if (isOpen && initialOpenAdd) {
      setIsFormOpen(true);
    }
  }, [isOpen, initialOpenAdd]);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Commercial Ads');
  const [images, setImages] = useState<string[]>([]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [brief, setBrief] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen || !experience) return null;

  const resetForm = () => {
    setTitle('');
    setCategory('Commercial Ads');
    setImages([]);
    setYear(new Date().getFullYear().toString());
    setBrief('');
    setTagsInput('');
    setEditingDesign(null);
    setFormError('');
    setIsFormOpen(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (design: ExperienceDesign) => {
    setEditingDesign(design);
    setTitle(design.title);
    setCategory(design.category);
    const existingImages =
      design.images && design.images.length > 0
        ? design.images
        : design.imageUrl
        ? [design.imageUrl]
        : [];
    setImages(existingImages);
    setYear(design.year || new Date().getFullYear().toString());
    setBrief(design.brief || design.description || '');
    setTagsInput((design.tags || []).join(', '));
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please provide a title for the design.');
      return;
    }
    if (images.length === 0) {
      setFormError('Please upload at least one design image or enter an image URL.');
      return;
    }
    if (!brief.trim()) {
      setFormError('Please provide a project brief and deliverables summary.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const designToSave: ExperienceDesign = {
      id: editingDesign ? editingDesign.id : `des-${experience.id}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      experienceId: experience.id,
      client: experience.name,
      title: title.trim(),
      category: category.trim() || 'Design Work',
      imageUrl: images[0],
      images: images,
      brief: brief.trim(),
      description: brief.trim(),
      year: year.trim() || new Date().getFullYear().toString(),
      tags,
      createdAt: editingDesign ? editingDesign.createdAt : Date.now(),
    };

    onSaveDesign(designToSave);
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from this experience?`)) {
      onDeleteDesign(id);
      if (editingDesign?.id === id) {
        resetForm();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Main Dialog Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25 }}
        className={`relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border z-10 ${
          theme === 'dark'
            ? 'bg-[#0c101c] border-white/15 text-white'
            : 'bg-white border-neutral-200 text-black'
        }`}
      >
        {/* Header with authentic company branding & close action */}
        <div
          className={`p-6 sm:p-8 border-b flex items-start justify-between shrink-0 ${
            theme === 'dark' ? 'border-white/10 bg-[#121828]' : 'border-neutral-200 bg-neutral-50'
          }`}
        >
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Card container for company logo with Change Icon button */}
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center p-2.5 overflow-hidden shadow-md shrink-0 relative group"
              style={{
                backgroundColor:
                  experience.logoBg === 'white'
                    ? '#ffffff'
                    : experience.logoBg === 'transparent'
                    ? 'transparent'
                    : experience.logoBg || '#ffffff',
              }}
            >
              <CompanyLogo
                logoKey={experience.logoKey}
                customIconUrl={experience.customIconUrl}
                companyName={experience.name}
                className="max-w-full max-h-full"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-bold">
                  {experience.period}
                </span>
                <span className="text-neutral-400">&bull;</span>
                <span className="text-xs text-neutral-400 font-mono">
                  {designs.length} {designs.length === 1 ? 'Design' : 'Designs'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsIconModalOpen(true)}
                  className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition-colors"
                  title="Change section icon and branding"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Edit Icon</span>
                </button>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {experience.name} &bull; {experience.role}
              </h2>
              <p
                className={`text-xs sm:text-sm mt-1 max-w-xl line-clamp-2 ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                {experience.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              theme === 'dark'
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-neutral-200 text-black hover:bg-neutral-300'
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Key Achievements and Skills strip */}
          <div
            className={`p-5 rounded-xl border ${
              theme === 'dark'
                ? 'bg-[#141b2c] border-white/5'
                : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest mb-3 text-neutral-400">
              Key Contributions &amp; Experience Highlights
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs leading-relaxed">
              {experience.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                  <span className={theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form Toggle & Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                Design Artwork &amp; Project Briefs
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Add, manage, and inspect multiple deliverable assets and campaign briefs.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (isFormOpen) {
                  resetForm();
                } else {
                  handleOpenAdd();
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#ff5e00] to-[#ff9100] hover:from-[#e05300] hover:to-[#ff7b00] text-white shadow-md active:scale-95 transition-all self-start sm:self-auto"
              id="modal-toggle-add-design-btn"
            >
              {isFormOpen ? (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span>Hide Form</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>+ Add Design &amp; Brief</span>
                </>
              )}
            </button>
          </div>

          {/* Collapsible Add/Edit Design Form with Multi-Image Support */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className={`p-6 rounded-xl border overflow-hidden ${
                  theme === 'dark'
                    ? 'bg-[#151c2e] border-orange-500/30 shadow-lg'
                    : 'bg-neutral-50 border-orange-500/30 shadow-md'
                }`}
                id="modal-design-form"
              >
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <h4 className="text-sm sm:text-base font-bold tracking-tight">
                      {editingDesign
                        ? `Edit Design & Brief (${editingDesign.title})`
                        : `Add New Design & Brief for ${experience.name}`}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                {formError && (
                  <div className="p-3 mb-5 rounded-md text-xs font-medium bg-red-500/15 border border-red-500/30 text-red-300">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Design Title */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider mb-2 text-neutral-400">
                        Design Title *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Mobile VTU Promo Carousel or Annual Convention Poster"
                        className={`w-full px-3.5 py-2.5 rounded-md text-sm border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          theme === 'dark'
                            ? 'bg-[#0f1422] border-white/15 text-white'
                            : 'bg-white border-neutral-300 text-black'
                        }`}
                        required
                        id="modal-design-title-input"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider mb-2 text-neutral-400">
                        Category / Specialization
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Commercial Ads, Brand Identity, Ministry Media"
                        className={`w-full px-3.5 py-2.5 rounded-md text-sm border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          theme === 'dark'
                            ? 'bg-[#0f1422] border-white/15 text-white'
                            : 'bg-white border-neutral-300 text-black'
                        }`}
                        id="modal-design-category-input"
                      />
                    </div>
                  </div>

                  {/* Multi-Image Upload Area */}
                  <div>
                    <MultiImageUpload
                      images={images}
                      onChange={(newImages) => {
                        setImages(newImages);
                        if (formError && newImages.length > 0) {
                          setFormError('');
                        }
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Year */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider mb-2 text-neutral-400">
                        Year / Period
                      </label>
                      <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="e.g. 2024"
                        className={`w-full px-3.5 py-2.5 rounded-md text-sm border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          theme === 'dark'
                            ? 'bg-[#0f1422] border-white/15 text-white'
                            : 'bg-white border-neutral-300 text-black'
                        }`}
                        id="modal-design-year-input"
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider mb-2 text-neutral-400">
                        Tags / Tools Used (comma separated)
                      </label>
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="e.g. Photoshop, Illustrator, Social Ad"
                        className={`w-full px-3.5 py-2.5 rounded-md text-sm border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          theme === 'dark'
                            ? 'bg-[#0f1422] border-white/15 text-white'
                            : 'bg-white border-neutral-300 text-black'
                        }`}
                        id="modal-design-tags-input"
                      />
                    </div>
                  </div>

                  {/* Brief & Notes */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider mb-2 text-neutral-400">
                      Project Brief &amp; Completed Deliverables *
                    </label>
                    <textarea
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      rows={3}
                      placeholder="Outline the client brief, design objectives, execution methodology, and final results achieved..."
                      className={`w-full px-3.5 py-2.5 rounded-md text-sm border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        theme === 'dark'
                          ? 'bg-[#0f1422] border-white/15 text-white'
                          : 'bg-white border-neutral-300 text-black'
                      }`}
                      required
                      id="modal-design-brief-input"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className={`px-4 py-2 rounded-md text-xs font-semibold tracking-wide border transition-colors ${
                        theme === 'dark'
                          ? 'border-white/10 text-neutral-300 hover:bg-white/5'
                          : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#ff5e00] to-[#ff9100] hover:from-[#e05300] hover:to-[#ff7b00] text-white shadow-md active:scale-95 transition-all"
                      id="modal-save-design-submit-btn"
                    >
                      {editingDesign ? 'Update Design & Brief' : 'Save Design & Brief'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* List of Completed Designs for this Experience */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-mono uppercase tracking-widest font-bold text-neutral-400">
                Completed Designs for {experience.name} ({designs.length})
              </h3>
            </div>

            {designs.length === 0 ? (
              <div
                className={`py-16 px-6 text-center rounded-xl border border-dashed flex flex-col items-center justify-center ${
                  theme === 'dark'
                    ? 'border-white/10 bg-[#141b2c]/60'
                    : 'border-neutral-300 bg-neutral-50'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mb-3">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-semibold mb-1">No designs recorded yet</h4>
                <p className="text-xs text-neutral-400 max-w-sm mb-4">
                  Add designs you completed for {experience.name} with project briefs, categories, and multiple deliverable artwork mockups.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#ff5e00] to-[#ff9100] text-white shadow"
                >
                  + Add First Design
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {designs.map((design) => (
                  <ExperienceDesignCard
                    key={design.id}
                    design={design}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    onOpenLightbox={onViewFullscreen}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 sm:p-5 border-t flex items-center justify-between shrink-0 ${
            theme === 'dark' ? 'border-white/10 bg-[#121828]' : 'border-neutral-200 bg-neutral-100'
          }`}
        >
          <span className="text-xs text-neutral-400">
            Designs and briefs are persistently stored in browser storage.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide border border-white/15 hover:bg-white/10"
          >
            Done
          </button>
        </div>
      </motion.div>

      {/* Section Icon Customization Modal */}
      {isIconModalOpen && (
        <SectionIconModal
          isOpen={isIconModalOpen}
          onClose={() => setIsIconModalOpen(false)}
          company={experience}
          theme={theme}
          onSaveCompany={(updated) => {
            if (onSaveCompany) {
              onSaveCompany(updated);
            }
            setIsIconModalOpen(false);
          }}
          onResetCompany={(companyId) => {
            if (onResetCompany) {
              onResetCompany(companyId);
            }
            setIsIconModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
