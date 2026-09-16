import React from 'react';
import { ThemeMode } from '../types';

interface FooterProps {
  theme: ThemeMode;
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <footer className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] tracking-[0.25em] uppercase font-medium">
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rotate-45 ${
              theme === 'dark' ? 'bg-white' : 'bg-black'
            }`}
          />
          <span
            className={`${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            ODUNAYO OGUNNAIKE / GRAPHIC DESIGNER
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span
            className={`${
              theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
            }`}
          >
            NIGERIA &amp; REMOTE
          </span>
          <span
            className={`${
              theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
            }`}
          >
            © 2026
          </span>
        </div>
      </div>
    </footer>
  );
};
