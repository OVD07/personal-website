import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Eye, Layers, Sparkles, Plus } from 'lucide-react';
import { Project, ThemeMode } from '../types';

interface SelectedWorkSectionProps {
  theme: ThemeMode;
  projects: Project[];
  onOpenLightbox: (project: Project) => void;
}

type SectionFilter = 'all' | 'megasub' | 'freelance';

export const SelectedWorkSection: React.FC<SelectedWorkSectionProps> = ({
  theme,
  projects,
  onOpenLightbox,
}) => {
  const [activeSectionFilter, setActiveSectionFilter] = useState<SectionFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter projects based on section tab
  const sectionProjects = useMemo(() => {
    if (activeSectionFilter === 'all') return projects;
    if (activeSectionFilter === 'megasub') {
      return projects.filter(
        (p) => p.section === 'megasub' || p.client?.toLowerCase().includes('megasub')
      );
    }
    return projects.filter(
      (p) =>
        p.section === 'church' ||
        p.section === 'freelance' ||
        !p.client?.toLowerCase().includes('megasub')
    );
  }, [projects, activeSectionFilter]);

  // Extract unique categories for current filter
  const categories = useMemo(() => {
    const set = new Set<string>();
    sectionProjects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [sectionProjects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return sectionProjects;
    return sectionProjects.filter((p) => p.category === selectedCategory);
  }, [sectionProjects, selectedCategory]);

  const handleScrollToExperience = () => {
    const el = document.getElementById('experience');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="work" className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-10">
          {/* Section Indicator */}
          <div className="md:col-span-3">
            <span
              className={`font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-bold ${
                theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              03 / WORK EXPERIENCE
            </span>
          </div>

          {/* Title & Description */}
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
              Work <br className="hidden sm:inline" />
              <span className="italic font-serif font-normal text-neutral-400 dark:text-neutral-500">
                experience.
              </span>
            </motion.h2>

            <p
              className={`text-xs sm:text-sm leading-relaxed max-w-xl ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              Archived commercial and creative deliverables across Megasub and Freelance Graphic design practice.
            </p>
          </div>
        </div>

        {/* Section Tabs (All / Megasub / Freelance Graphic) */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveSectionFilter('all');
                setSelectedCategory('All');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                activeSectionFilter === 'all'
                  ? theme === 'dark'
                    ? 'bg-white text-black font-bold shadow'
                    : 'bg-black text-white font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All Sections ({projects.length})
            </button>

            <button
              onClick={() => {
                setActiveSectionFilter('megasub');
                setSelectedCategory('All');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                activeSectionFilter === 'megasub'
                  ? theme === 'dark'
                    ? 'bg-white text-black font-bold shadow'
                    : 'bg-black text-white font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Megasub
            </button>

            <button
              onClick={() => {
                setActiveSectionFilter('freelance');
                setSelectedCategory('All');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                activeSectionFilter === 'freelance'
                  ? theme === 'dark'
                    ? 'bg-white text-black font-bold shadow'
                    : 'bg-black text-white font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Freelance Graphic
            </button>
          </div>

          <button
            onClick={handleScrollToExperience}
            className="text-xs font-medium text-orange-400 hover:text-orange-300 inline-flex items-center gap-1 transition-colors"
          >
            <span>+ Add New in Experience</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sub-Category Filter Pills */}
        {categories.length > 2 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <span
              className={`font-mono text-[10px] uppercase tracking-widest mr-1 ${
                theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              Category:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-200 ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-white text-black font-bold'
                        : 'bg-black text-white font-bold'
                      : theme === 'dark'
                      ? 'bg-[#111] text-neutral-400 hover:text-white border border-white/5'
                      : 'bg-neutral-100 text-neutral-600 hover:text-black border border-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 sm:gap-y-16">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const imageCount = project.images && project.images.length > 0 ? project.images.length : 1;
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => onOpenLightbox(project)}
                >
                  {/* Image Container */}
                  <div
                    className={`aspect-[4/3] rounded-sm overflow-hidden mb-4 relative ${
                      theme === 'dark' ? 'bg-[#141414]' : 'bg-[#f0f0f0]'
                    }`}
                  >
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />

                    {/* Multiple images indicator */}
                    {imageCount > 1 && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-mono flex items-center gap-1.5 shadow">
                        <Layers className="w-3 h-3 text-orange-400" />
                        <span>{imageCount} Deliverables</span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                        <Eye className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-orange-500 font-bold uppercase tracking-wider">
                        {project.client || project.category}
                      </span>
                      <span className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}>
                        {project.year}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <h3
                        className={`text-base sm:text-lg font-medium tracking-tight ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}
                      >
                        {project.title}
                      </h3>
                      <span
                        className={`transition-transform duration-300 group-hover:translate-x-1 ${
                          theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
                        }`}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {project.description && (
                      <p className="text-xs text-neutral-400 line-clamp-2 pt-1 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Clean Slate Empty State */}
        {filteredProjects.length === 0 && (
          <div
            className={`text-center py-16 sm:py-20 px-6 rounded-2xl border border-dashed flex flex-col items-center justify-center ${
              theme === 'dark'
                ? 'border-white/10 bg-white/[0.01] text-neutral-400'
                : 'border-black/10 bg-black/[0.01] text-neutral-600'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h4
              className={`text-lg font-bold tracking-tight mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}
            >
              Clean Slate: Ready for Your Authentic Work
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
              No placeholder projects. Build your work experience archive from scratch by adding completed designs and project briefs in the Experience section above.
            </p>
            <button
              onClick={handleScrollToExperience}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#ff5e00] to-[#ff9100] hover:from-[#e05300] hover:to-[#ff7b00] text-white shadow-lg active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Designs in Experience Section</span>
            </button>
          </div>
        )}

        {/* Section Divider */}
        <div
          className={`mt-20 sm:mt-28 border-b ${
            theme === 'dark' ? 'border-white/5' : 'border-black/5'
          }`}
        />
      </div>
    </section>
  );
};
