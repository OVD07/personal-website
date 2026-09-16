import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Edit3, Trash2, Eye, FileText, Layers } from 'lucide-react';
import { ExperienceDesign } from '../types';

interface ExperienceDesignCardProps {
  design: ExperienceDesign;
  onEdit: (design: ExperienceDesign) => void;
  onDelete: (id: string, title: string) => void;
  onOpenLightbox?: (imageUrl: string, title: string) => void;
}

export const ExperienceDesignCard: React.FC<ExperienceDesignCardProps> = ({
  design,
  onEdit,
  onDelete,
  onOpenLightbox,
}) => {
  // Normalize images list (support both multiple images and legacy single imageUrl)
  const imageList: string[] =
    design.images && design.images.length > 0
      ? design.images
      : design.imageUrl
      ? [design.imageUrl]
      : [];

  const [activeIndex, setActiveIndex] = useState(0);

  const currentImage = imageList[activeIndex] || design.imageUrl || '';
  const hasMultiple = imageList.length > 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : imageList.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev < imageList.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#172034] overflow-hidden flex flex-col justify-between hover:border-orange-500/40 transition-all duration-200 shadow-xl group/card">
      {/* Artwork Preview Box with Multi-Image Carousel */}
      <div className="relative aspect-[16/10] bg-black/50 overflow-hidden flex items-center justify-center group/image select-none">
        {currentImage ? (
          <img
            key={currentImage}
            src={currentImage}
            alt={`${design.title} - image ${activeIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-[1.02]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="text-neutral-500 text-xs">No image available</div>
        )}

        {/* Multi-Image Badge */}
        {hasMultiple && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/80 backdrop-blur-md text-orange-400 border border-orange-500/30 flex items-center gap-1.5 shadow-lg">
            <Layers className="w-3 h-3" />
            <span>
              {activeIndex + 1} / {imageList.length} Deliverables
            </span>
          </div>
        )}

        {/* Multi-Image Carousel Left / Right Arrows */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-sm opacity-90 hover:opacity-100 transition-all shadow-md active:scale-90"
              title="Previous image"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-sm opacity-90 hover:opacity-100 transition-all shadow-md active:scale-90"
              title="Next image"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Hover Action Bar */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity flex items-end justify-between p-4 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => onEdit(design)}
              className="p-2 rounded bg-white text-black text-xs font-semibold shadow hover:bg-neutral-200 transition-colors"
              title="Edit design & brief"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(design.id, design.title)}
              className="p-2 rounded bg-red-600 text-white text-xs font-semibold shadow hover:bg-red-700 transition-colors"
              title="Delete this design"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {onOpenLightbox && currentImage && (
            <button
              type="button"
              onClick={() =>
                onOpenLightbox(
                  currentImage,
                  hasMultiple
                    ? `${design.title} (${activeIndex + 1} of ${imageList.length})`
                    : design.title
                )
              }
              className="pointer-events-auto p-2 rounded bg-black/80 text-white text-xs font-semibold shadow hover:bg-black transition-colors flex items-center gap-1.5"
              title="View full size artwork"
            >
              <Eye className="w-4 h-4" />
              <span className="text-[11px] font-sans">Fullscreen</span>
            </button>
          )}
        </div>
      </div>

      {/* Mini Thumbnail Strip if Multiple Images */}
      {hasMultiple && (
        <div className="px-4 py-2 bg-[#0e1424] border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative rounded-md overflow-hidden h-10 w-14 shrink-0 border transition-all ${
                idx === activeIndex
                  ? 'border-orange-500 ring-2 ring-orange-500/40 opacity-100 scale-105'
                  : 'border-white/10 opacity-50 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      )}

      {/* Metadata & Creative Brief Section */}
      <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400">
              {design.category}
            </span>
            {design.year && (
              <span className="text-[10px] font-mono text-neutral-400">
                {design.year}
              </span>
            )}
          </div>

          <h4 className="text-lg font-bold text-white tracking-tight leading-snug">
            {design.title}
          </h4>

          {/* Project Brief Showcase */}
          {design.brief && (
            <div className="mt-4 p-4 rounded-xl bg-[#0f1525] border border-white/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-neutral-400">
                <FileText className="w-3.5 h-3.5 text-orange-400" />
                <span>Project Brief &amp; Deliverables:</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line font-sans">
                {design.brief}
              </p>
            </div>
          )}
        </div>

        {/* Footer Tags & Edit Trigger */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {design.tags &&
              design.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400"
                >
                  {tag}
                </span>
              ))}
          </div>

          <button
            type="button"
            onClick={() => onEdit(design)}
            className="text-xs text-orange-400 hover:text-orange-300 font-semibold inline-flex items-center gap-1 shrink-0 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Design &amp; Brief</span>
          </button>
        </div>
      </div>
    </div>
  );
};
