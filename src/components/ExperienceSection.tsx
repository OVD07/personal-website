import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Image as ImageIcon,
  FileText,
  X,
  Sparkles,
  Edit3,
  RotateCcw,
  Trash2,
  Sliders,
  ArrowRight,
} from 'lucide-react';
import { ExperienceCompany, ExperienceDesign, ThemeMode } from '../types';
import { CompanyLogo } from './CompanyLogo';
import { MultiImageUpload } from './MultiImageUpload';
import { ExperienceDesignCard } from './ExperienceDesignCard';
import { SectionIconModal } from './SectionIconModal';

interface ExperienceSectionProps {
  theme: ThemeMode;
  companies: ExperienceCompany[];
  designs: ExperienceDesign[];
  onViewExperience: (company: ExperienceCompany, openAdd?: boolean) => void;
  onSaveDesign: (design: ExperienceDesign) => void;
  onDeleteDesign: (designId: string) => void;
  onOpenLightbox?: (imageUrl: string, title: string) => void;
  onSaveCompany?: (updated: ExperienceCompany) => void;
  onResetCompany?: (companyId: string) => void;
  onClearAllDesigns?: (experienceId?: string) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  theme,
  companies,
  designs,
  onViewExperience,
  onSaveDesign,
  onDeleteDesign,
  onOpenLightbox,
  onSaveCompany,
  onResetCompany,
  onClearAllDesigns,
}) => {
  // Selected experience for inline design & brief viewing/adding
  const [selectedExpId, setSelectedExpId] = useState<string>('megasub');
  const [isInlineFormOpen, setIsInlineFormOpen] = useState<boolean>(false);
  const [editingDesign, setEditingDesign] = useState<ExperienceDesign | null>(null);

  // Modal for changing company icon & details
  const [editingCompanyForIcon, setEditingCompanyForIcon] = useState<ExperienceCompany | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Commercial Ads');
  const [images, setImages] = useState<string[]>([]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [brief, setBrief] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [formError, setFormError] = useState('');

  const activeCompany =
    companies.find((c) => c.id === selectedExpId) || companies[0] || null;
  const activeCompanyDesigns = designs.filter((d) => d.experienceId === selectedExpId);

  const resetForm = () => {
    setTitle('');
    setCategory('Commercial Ads');
    setImages([]);
    setYear(new Date().getFullYear().toString());
    setBrief('');
    setTagsInput('');
    setEditingDesign(null);
    setFormError('');
    setIsInlineFormOpen(false);
  };

  const handleOpenAddFor = (expId: string) => {
    setSelectedExpId(expId);
    resetForm();
    setIsInlineFormOpen(true);
    setTimeout(() => {
      document.getElementById('inline-design-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleOpenEdit = (design: ExperienceDesign) => {
    setSelectedExpId(design.experienceId);
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
    setIsInlineFormOpen(true);
    setTimeout(() => {
      document.getElementById('inline-design-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a design title.');
      return;
    }
    if (images.length === 0) {
      setFormError('Please upload at least one design image or enter an image URL.');
      return;
    }
    if (!brief.trim()) {
      setFormError('Please write a brief describing the project requirements, approach, and outcome.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const designToSave: ExperienceDesign = {
      id: editingDesign ? editingDesign.id : `des-${selectedExpId}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      experienceId: selectedExpId,
      client: activeCompany?.name || (selectedExpId === 'megasub' ? 'Megasub' : 'Freelance Graphic Designer'),
      title: title.trim(),
      category: category.trim() || 'Design Work',
      imageUrl: images[0], // primary cover
      images: images, // full list of multiple uploads
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
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      onDeleteDesign(id);
      if (editingDesign?.id === id) {
        resetForm();
      }
    }
  };

  const handleClearSectionDesigns = () => {
    if (onClearAllDesigns && activeCompany) {
      if (
        window.confirm(
          `Start from scratch for ${activeCompany.name}? This will remove all ${activeCompanyDesigns.length} recorded designs.`
        )
      ) {
        onClearAllDesigns(activeCompany.id);
        resetForm();
      }
    }
  };

  return (
    <section id="experience" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12">
          {/* Section Indicator */}
          <div className="md:col-span-3">
            <span
              className={`font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-bold ${
                theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              02 / EXPERIENCE
            </span>
          </div>

          {/* Headline & Description */}
          <div className="md:col-span-9 space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`text-4xl sm:text-5xl font-light tracking-tighter leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}
            >
              From freelance <br />
              <span className="italic font-serif font-normal text-neutral-400 dark:text-neutral-500">
                to in-house.
              </span>
            </motion.h2>

            <p
              className={`text-xs sm:text-sm leading-relaxed max-w-2xl ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              Build your authentic work experience archive from scratch. Customize the section icons and branding for both{' '}
              <strong className="text-white dark:text-white font-semibold">Megasub</strong> and{' '}
              <strong className="text-white dark:text-white font-semibold">
                Freelance Graphic Designer
              </strong>, then attach completed designs with multiple deliverable uploads and comprehensive creative briefs.
            </p>
          </div>
        </div>

        {/* 2 Primary Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-14">
          {companies.map((company, index) => {
            const count = designs.filter((d) => d.experienceId === company.id).length;
            const isSelected = selectedExpId === company.id;

            return (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 border relative ${
                  isSelected
                    ? 'ring-2 ring-orange-500/80 shadow-2xl'
                    : 'hover:border-white/20 shadow-lg'
                } ${
                  theme === 'dark'
                    ? 'bg-[#151c2e] border-white/10 text-white'
                    : 'bg-[#182033] border-neutral-700/50 text-white'
                }`}
                id={`experience-card-${company.id}`}
              >
                <div>
                  {/* Inner Container with Section Logo + Change Icon Action */}
                  <div
                    className="w-full h-36 sm:h-40 rounded-xl flex items-center justify-center p-4 overflow-hidden shadow-inner mb-5 relative group"
                    style={{
                      backgroundColor:
                        company.logoBg === 'white'
                          ? '#ffffff'
                          : company.logoBg === 'transparent'
                          ? 'transparent'
                          : company.logoBg || '#ffffff',
                    }}
                  >
                    <CompanyLogo
                      logoKey={company.logoKey}
                      customIconUrl={company.customIconUrl}
                      companyName={company.name}
                      className="max-w-full max-h-full"
                    />

                    {/* Change Icon Floating Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCompanyForIcon(company);
                      }}
                      className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-950 text-white text-xs font-semibold backdrop-blur-md border border-white/20 shadow-lg transition-transform active:scale-95"
                      title={`Change section icon for ${company.name}`}
                    >
                      <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                      <span>Change Icon</span>
                    </button>
                  </div>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-bold">
                        {company.period}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-neutral-300 font-semibold">
                        {count} {count === 1 ? 'Design & Brief' : 'Designs & Briefs'}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      {company.name}
                    </h3>
                    <p className="text-xs font-mono text-neutral-300 uppercase tracking-wider">
                      {company.role} &bull; {company.category}
                    </p>

                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pt-1">
                      {company.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedExpId(company.id);
                        setIsInlineFormOpen(false);
                      }}
                      className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                        isSelected
                          ? 'bg-white text-black shadow-md'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {isSelected ? 'Active Section' : 'Select'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingCompanyForIcon(company)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-neutral-300 bg-white/5 hover:bg-white/15 border border-white/10 transition-colors"
                      title="Change logo, preset, background, or titles"
                    >
                      <Sliders className="w-3.5 h-3.5 text-orange-400" />
                      <span>Edit Icon</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenAddFor(company.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold text-white bg-gradient-to-r from-[#ff5e00] to-[#ff9100] hover:from-[#e05300] hover:to-[#ff7b00] shadow-md active:scale-95 transition-all"
                    id={`add-brief-btn-${company.id}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Design</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dedicated Experience Showcase & Add Section */}
        {activeCompany && (
          <div
            className={`rounded-2xl border p-6 sm:p-10 transition-colors ${
              theme === 'dark'
                ? 'bg-[#121828] border-white/10'
                : 'bg-neutral-900 border-neutral-800 text-white'
            }`}
            id="experience-designs-container"
          >
            {/* Header with Title and Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center shrink-0 border border-white/10">
                  <CompanyLogo
                    logoKey={activeCompany.logoKey}
                    customIconUrl={activeCompany.customIconUrl}
                    companyName={activeCompany.name}
                    hideText
                    className="p-0"
                  />
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span>{activeCompany.name} &bull; Designs &amp; Briefs</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {activeCompany.role} &bull; {activeCompanyDesigns.length} deliverables recorded
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingCompanyForIcon(activeCompany)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-medium text-neutral-300 bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                  <span>Change {activeCompany.name} Icon</span>
                </button>

                {activeCompanyDesigns.length > 0 && onClearAllDesigns && (
                  <button
                    type="button"
                    onClick={handleClearSectionDesigns}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                    title="Clear all designs for this company and start from scratch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All (Scratch)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (isInlineFormOpen) {
                      resetForm();
                    } else {
                      handleOpenAddFor(activeCompany.id);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#ff5e00] to-[#ff9100] hover:from-[#e05300] hover:to-[#ff7b00] text-white shadow-lg shadow-orange-950/30 active:scale-95 transition-all"
                  id="toggle-add-design-brief-btn"
                >
                  {isInlineFormOpen ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>Close Form</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>+ Add Design for {activeCompany.name}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Inline Add / Edit Design & Brief Form with Multiple Uploads */}
            <AnimatePresence>
              {isInlineFormOpen && (
                <motion.div
                  id="inline-design-form"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-xl border p-6 sm:p-8 mb-10 overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-[#172034] border-orange-500/40 shadow-xl'
                      : 'bg-[#1c2438] border-orange-500/40 shadow-xl text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-orange-400" />
                      <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {editingDesign
                          ? `Edit Design & Brief for ${activeCompany.name}`
                          : `Add Completed Design & Project Brief for ${activeCompany.name}`}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="p-1.5 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {formError && (
                    <div className="mb-6 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                          Design / Project Title *
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Daily Social Bundle Promo or Faith Conference Identity"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-white/15 bg-neutral-900/80 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                          Category *
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-white/15 bg-neutral-900 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                        >
                          <option value="Commercial Ads">Commercial Ads</option>
                          <option value="Branding &amp; Identity">Branding &amp; Identity</option>
                          <option value="Social Media Creatives">Social Media Creatives</option>
                          <option value="Flyer &amp; Poster Design">Flyer &amp; Poster Design</option>
                          <option value="Product Package">Product Package</option>
                          <option value="Editorial &amp; Print">Editorial &amp; Print</option>
                          <option value="Ministry &amp; Event Media">Ministry &amp; Event Media</option>
                          <option value="Typography &amp; Layout">Typography &amp; Layout</option>
                        </select>
                      </div>
                    </div>

                    {/* Multi-Image Upload Component */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                        Project Deliverables &amp; Mockups (Multiple Uploads Allowed) *
                      </label>
                      <MultiImageUpload
                        images={images}
                        onChange={setImages}
                        theme={theme}
                        maxFiles={12}
                      />
                    </div>

                    {/* Project Brief Section */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-orange-400" />
                          <span>Creative Brief &amp; Project Description *</span>
                        </label>
                        <span className="text-[11px] text-neutral-400">
                          Explain client goals, visual rationale &amp; deliverables
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={brief}
                        onChange={(e) => setBrief(e.target.value)}
                        placeholder={`Provide the project brief for ${activeCompany.name}:
- Client Objective & Target Audience
- Creative Strategy & Design Execution
- Tools Used (Photoshop, Illustrator, InDesign)
- Final Results & Deliverables`}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-white/15 bg-neutral-900/80 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-orange-500 transition-colors leading-relaxed font-sans"
                        required
                      />
                    </div>

                    {/* Year & Tags */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                          Year
                        </label>
                        <input
                          type="text"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          placeholder="2024"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-white/15 bg-neutral-900/80 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          placeholder="e.g. Photoshop, Vector, Social Campaign, Billboard"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-white/15 bg-neutral-900/80 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-5 py-2.5 rounded-lg text-xs font-semibold text-neutral-300 border border-white/15 hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-7 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#ff5e00] to-[#ff9100] hover:from-[#e05300] hover:to-[#ff7b00] text-white shadow-lg shadow-orange-950/30 active:scale-95 transition-all"
                        id="inline-submit-design-btn"
                      >
                        {editingDesign ? 'Update Design & Brief' : 'Save Design & Brief'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List of Designs with Multi-Image Carousels & Prominent Creative Briefs */}
            {activeCompanyDesigns.length === 0 ? (
              <div className="py-16 px-6 text-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1.5">
                  Clean Slate: Starting from Scratch
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-md mb-6 leading-relaxed">
                  No placeholder items. You have complete control to upload multiple authentic images and write custom project briefs for <strong className="text-white font-semibold">{activeCompany.name}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenAddFor(activeCompany.id)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#ff5e00] to-[#ff9100] hover:from-[#e05300] hover:to-[#ff7b00] text-white shadow-lg shadow-orange-950/30 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add First Design &amp; Deliverables</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {activeCompanyDesigns.map((design) => (
                  <ExperienceDesignCard
                    key={design.id}
                    design={design}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    onOpenLightbox={onOpenLightbox}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section Divider */}
        <div
          className={`mt-20 sm:mt-28 border-b ${
            theme === 'dark' ? 'border-white/5' : 'border-black/5'
          }`}
        />
      </div>

      {/* Section Icon Customization Modal */}
      {editingCompanyForIcon && (
        <SectionIconModal
          isOpen={!!editingCompanyForIcon}
          onClose={() => setEditingCompanyForIcon(null)}
          company={editingCompanyForIcon}
          theme={theme}
          onSaveCompany={(updated) => {
            if (onSaveCompany) {
              onSaveCompany(updated);
            }
            setEditingCompanyForIcon(null);
          }}
          onResetCompany={(companyId) => {
            if (onResetCompany) {
              onResetCompany(companyId);
            }
            setEditingCompanyForIcon(null);
          }}
        />
      )}
    </section>
  );
};
