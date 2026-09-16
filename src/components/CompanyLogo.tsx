import React from 'react';
import {
  Palette,
  PenTool,
  Layers,
  Sparkles,
  Camera,
  Briefcase,
  Box,
  Type,
  Globe,
  Flame,
  Award,
} from 'lucide-react';
import { MegasubLogoMark } from './MegasubLogoMark';

export interface PresetIconOption {
  key: string;
  label: string;
  category: 'Commercial' | 'Creative' | 'Ministry' | 'General';
  description: string;
}

export const PRESET_ICONS: PresetIconOption[] = [
  { key: 'megasub', label: 'Megasub Official Mark', category: 'Commercial', description: 'Official 3D commercial telecom emblem' },
  { key: 'freelance', label: 'Freelance Graphic Designer', category: 'Creative', description: 'Creative design palette & studio mark' },
  { key: 'palette', label: 'Artisan Color Palette', category: 'Creative', description: 'Color swatch & brush studio emblem' },
  { key: 'pen-tool', label: 'Vector Pen Tool', category: 'Creative', description: 'Precision anchor points & vector paths' },
  { key: 'layers', label: 'Artboard & Layers', category: 'Creative', description: 'Multi-layer visual design hierarchy' },
  { key: 'church', label: 'Church & Ministry Seal', category: 'Ministry', description: 'Gold & navy kingdom ministry seal' },
  { key: 'sparkles', label: 'Creative Studio Sparkles', category: 'Creative', description: 'Modern dynamic studio spark' },
  { key: 'camera', label: 'Media & Lens', category: 'Ministry', description: 'Event photography & video media' },
  { key: 'briefcase', label: 'Client Agency Briefcase', category: 'Commercial', description: 'Corporate & client business practice' },
  { key: 'cube', label: '3D Isometric Studio', category: 'General', description: 'Modern dimensional design cube' },
  { key: 'typography', label: 'Typography & Typeface', category: 'Creative', description: 'Editorial & typography specialist' },
  { key: 'globe', label: 'Global Digital Reach', category: 'Commercial', description: 'Worldwide digital communication' },
];

interface CompanyLogoProps {
  logoKey?: string;
  customIconUrl?: string;
  iconType?: 'preset' | 'custom';
  companyName?: string;
  className?: string;
  hideText?: boolean;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoKey = 'freelance',
  customIconUrl,
  iconType,
  companyName,
  className = '',
  hideText = false,
}) => {
  // If custom icon URL is provided, display user's uploaded icon/logo
  if (customIconUrl && customIconUrl.trim() !== '') {
    return (
      <div className={`flex items-center justify-center gap-3 px-3 py-2 ${className}`}>
        <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-lg overflow-hidden flex items-center justify-center p-1 bg-white/5 border border-black/5 shadow-inner">
          <img
            src={customIconUrl}
            alt={companyName || 'Custom Section Logo'}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to text initials if image fails
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        {!hideText && companyName && (
          <div className="flex flex-col text-left">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 leading-tight">
              {companyName}
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-500 font-sans">
              Custom Identity
            </span>
          </div>
        )}
      </div>
    );
  }

  // Otherwise render by preset key
  switch (logoKey) {
    case 'megasub':
      return (
        <div className={`flex items-center justify-center gap-3 px-3 py-2 ${className}`}>
          {/* Official Megasub 3D Emblem from Uploaded Asset */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
            <MegasubLogoMark className="w-full h-full drop-shadow-sm" />
          </div>
          {!hideText && (
            <div className="flex flex-col text-left">
              <div className="flex items-baseline">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 font-sans">
                  mega<span className="text-[#3047d9]">sub</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-[#3047d9] ml-0.5 mb-1" />
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-500 -mt-1">
                Commercial Vending
              </span>
            </div>
          )}
        </div>
      );

    case 'freelance':
    case 'palette':
      return (
        <div className={`flex items-center justify-center gap-3 px-3 py-2 ${className}`}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#18181b] to-[#27272a] p-0.5 shadow-md shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-[10px] bg-neutral-900 flex items-center justify-center text-emerald-400">
              <Palette className="w-6 h-6 stroke-[1.75]" />
            </div>
          </div>
          {!hideText && (
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-bold uppercase tracking-tight text-neutral-900 leading-tight">
                {companyName || 'Freelance Graphic'}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-500 font-sans">
                Creative Design Practice
              </span>
            </div>
          )}
        </div>
      );

    case 'pen-tool':
      return (
        <div className={`flex items-center justify-center gap-3 px-3 py-2 ${className}`}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-indigo-900 to-violet-900 p-0.5 shadow-md shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-[10px] bg-neutral-900 flex items-center justify-center text-indigo-400">
              <PenTool className="w-6 h-6 stroke-[1.75]" />
            </div>
          </div>
          {!hideText && (
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 leading-tight">
                {companyName || 'Vector Graphics'}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-500 font-sans">
                Visual Studio
              </span>
            </div>
          )}
        </div>
      );

    case 'layers':
      return (
        <div className={`flex items-center justify-center gap-3 px-3 py-2 ${className}`}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-cyan-900 to-blue-900 p-0.5 shadow-md shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-[10px] bg-neutral-900 flex items-center justify-center text-cyan-400">
              <Layers className="w-6 h-6 stroke-[1.75]" />
            </div>
          </div>
          {!hideText && (
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 leading-tight">
                {companyName || 'Design Systems'}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-500 font-sans">
                Visual Artboards
              </span>
            </div>
          )}
        </div>
      );

    case 'church':
    case 'ministry':
      return (
        <div className={`flex items-center justify-center gap-3 px-3 py-2 ${className}`}>
          {/* Faith/Ministry Gold & Navy Seal */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-700 to-yellow-600 p-0.5 shadow-md shadow-amber-900/20 shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#0e1324] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-400">
                <path
                  d="M12 2 L12 22 M7 8 L17 8"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="8" r="4" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="1 2" />
              </svg>
            </div>
          </div>
          {!hideText && (
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-serif font-bold uppercase tracking-wider text-neutral-900 leading-tight">
                {companyName || 'Church & Ministry'}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-semibold text-neutral-500 font-sans">
                Media &amp; Visual Design
              </span>
            </div>
          )}
        </div>
      );

    case 'sparkles':
      return (
        <div className={`flex items-center justify-center gap-3 px-3 py-2 ${className}`}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-0.5 shadow-md shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-[10px] bg-neutral-900 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6 stroke-[1.75]" />
            </div>
          </div>
          {!hideText && (
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 leading-tight">
                {companyName || 'Creative Sparks'}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-500 font-sans">
                Campaign &amp; Identity
              </span>
            </div>
          )}
        </div>
      );

    case 'camera':
      return (
        <div className={`flex items-center justify-center gap-3 px-3 py-2 ${className}`}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neutral-800 p-0.5 shadow-md shrink-0 flex items-center justify-center text-blue-400">
            <Camera className="w-6 h-6 stroke-[1.75]" />
          </div>
          {!hideText && (
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 leading-tight">
                {companyName || 'Media & Production'}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-500 font-sans">
                Broadcasting &amp; Visuals
              </span>
            </div>
          )}
        </div>
      );

    case 'briefcase':
      return (
        <div className={`flex items-center justify-center gap-3 px-3 py-2 ${className}`}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neutral-800 p-0.5 shadow-md shrink-0 flex items-center justify-center text-rose-400">
            <Briefcase className="w-6 h-6 stroke-[1.75]" />
          </div>
          {!hideText && (
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 leading-tight">
                {companyName || 'Client Agency'}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-500 font-sans">
                Commercial Projects
              </span>
            </div>
          )}
        </div>
      );

    case 'cube':
      return (
        <div className={`flex items-center justify-center gap-3 px-3 py-2 ${className}`}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neutral-800 p-0.5 shadow-md shrink-0 flex items-center justify-center text-purple-400">
            <Box className="w-6 h-6 stroke-[1.75]" />
          </div>
          {!hideText && (
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 leading-tight">
                {companyName || '3D Studio'}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-500 font-sans">
                Dimensional Arts
              </span>
            </div>
          )}
        </div>
      );

    case 'typography':
      return (
        <div className={`flex items-center justify-center gap-3 px-3 py-2 ${className}`}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neutral-800 p-0.5 shadow-md shrink-0 flex items-center justify-center text-amber-400">
            <Type className="w-6 h-6 stroke-[1.75]" />
          </div>
          {!hideText && (
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 leading-tight">
                {companyName || 'Typography Arts'}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-500 font-sans">
                Font &amp; Editorial
              </span>
            </div>
          )}
        </div>
      );

    case 'globe':
      return (
        <div className={`flex items-center justify-center gap-3 px-3 py-2 ${className}`}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neutral-800 p-0.5 shadow-md shrink-0 flex items-center justify-center text-teal-400">
            <Globe className="w-6 h-6 stroke-[1.75]" />
          </div>
          {!hideText && (
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 leading-tight">
                {companyName || 'Global Services'}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-500 font-sans">
                Worldwide Creative
              </span>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className={`flex items-center justify-center gap-3 px-3 py-2 ${className}`}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neutral-800 p-0.5 shadow-md shrink-0 flex items-center justify-center text-neutral-300 font-bold text-lg">
            {(companyName || logoKey || 'EX').slice(0, 2).toUpperCase()}
          </div>
          {!hideText && (
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 leading-tight">
                {companyName || logoKey}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-500 font-sans">
                Design Experience
              </span>
            </div>
          )}
        </div>
      );
  }
};
