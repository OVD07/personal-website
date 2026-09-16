import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, Calendar, Tag, FileText } from 'lucide-react';
import { Project, ThemeMode } from '../types';

interface LightboxModalProps {
  project: Project | null;
  projects: Project[];
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  theme: ThemeMode;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  project,
  projects,
  onClose,
  onSelectProject,
  theme,
}) => {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setZoomed(false);
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, projects]);

  if (!project) return null;

  const currentIndex = projects.findIndex((p) => p.id === project.id);

  const handleNext = () => {
    if (currentIndex < projects.length - 1) {
      onSelectProject(projects[currentIndex + 1]);
    } else {
      onSelectProject(projects[0]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectProject(projects[currentIndex - 1]);
    } else {
      onSelectProject(projects[projects.length - 1]);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden">
        {/* Top Control Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/90 to-transparent">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-neutral-400">
              {currentIndex + 1} / {projects.length}
            </span>
            <span className="hidden sm:inline text-neutral-700">|</span>
            <span className="hidden sm:inline font-mono text-xs text-neutral-300 font-bold uppercase tracking-widest">
              {project.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Toggle */}
            <button
              onClick={() => setZoomed(!zoomed)}
              className="p-2 rounded-sm bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
              title={zoomed ? 'Fit to screen' : 'Zoom in'}
            >
              {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>

            {/* Download */}
            <a
              href={project.imageUrl}
              download={`${project.title.toLowerCase().replace(/\s+/g, '-')}-design`}
              className="p-2 rounded-sm bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
              title="Download High-Res Artwork"
            >
              <Download className="w-4 h-4" />
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-sm bg-white text-black hover:bg-neutral-200 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Arrow - Left */}
        {projects.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-sm bg-black/70 hover:bg-white/10 text-white border border-white/10 transition-all active:scale-95"
            aria-label="Previous artwork"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Navigation Arrow - Right */}
        {projects.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-sm bg-black/70 hover:bg-white/10 text-white border border-white/10 transition-all active:scale-95"
            aria-label="Next artwork"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Artwork Stage */}
        <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-12 sm:pb-28">
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`relative max-w-full max-h-[75vh] flex items-center justify-center overflow-auto ${
              zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setZoomed(!zoomed)}
          >
            <img
              src={project.imageUrl}
              alt={project.title}
              className={`rounded-lg object-contain transition-all duration-300 shadow-2xl ${
                zoomed ? 'max-w-none scale-150' : 'max-h-[72vh] w-auto max-w-full'
              }`}
            />
          </motion.div>
        </div>

        {/* Bottom Details Drawer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-20">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                    project.section === 'megasub'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {project.section === 'megasub' ? 'MEGASUB' : 'FREELANCE'}
                </span>
                <span className="font-mono text-xs text-neutral-300 font-bold uppercase tracking-widest">
                  [{project.client}] / {project.category}
                </span>
                {project.year && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400">
                    <Calendar className="w-3 h-3" />
                    {project.year}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
                {project.title}
              </h2>

              {/* Creative Brief */}
              {(project.brief || project.description) && (
                <div className="p-3 rounded-sm bg-white/5 border border-white/10 max-w-2xl">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                    <FileText className="w-3 h-3 text-neutral-300" />
                    <span>Creative Brief &amp; Objectives</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                    {project.brief || project.description}
                  </p>
                </div>
              )}
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:justify-end">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/10 text-neutral-200"
                  >
                    <Tag className="w-3 h-3 text-indigo-400" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
