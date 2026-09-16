import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { ThemeMode } from '../types';

interface HeroProps {
  theme: ThemeMode;
}

export const Hero: React.FC<HeroProps> = ({ theme }) => {
  return (
    <section className="pt-32 pb-16 sm:pt-44 sm:pb-24">
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        {/* Eyebrow metadata */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center justify-between"
        >
          <span
            className={`font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-bold ${
              theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
            }`}
          >
            GRAPHIC DESIGNER / 6 YEARS EXPERIENCE
          </span>
        </motion.div>

        {/* Display Headline with Clean Minimalism Editorial Style */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h1
            className={`text-6xl sm:text-7xl md:text-8xl lg:text-[7.2rem] font-light tracking-tighter leading-[0.92] ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}
          >
            Ideas into <br />
            <span className="italic font-serif font-normal text-neutral-400 dark:text-neutral-500">
              structure.
            </span>
          </h1>
        </motion.div>

        {/* Tag, intro statement and Hero section navigation buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <p
            className={`text-sm sm:text-base md:text-lg leading-relaxed max-w-xl ${
              theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            I design visual communication that gives ideas clarity, makes information intuitive
            and helps organisations connect meaningfully with their audiences.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#about"
              className={`py-3 px-6 rounded-sm text-xs font-bold uppercase tracking-widest transition-all border ${
                theme === 'dark'
                  ? 'bg-white text-black hover:bg-neutral-200 border-white'
                  : 'bg-black text-white hover:bg-neutral-800 border-black'
              }`}
              id="hero-about-link"
            >
              About
            </a>

            <a
              href="#experience"
              className={`py-3 px-6 rounded-sm text-xs font-bold uppercase tracking-widest border transition-colors ${
                theme === 'dark'
                  ? 'border-white/15 text-neutral-300 hover:border-white/40 hover:text-white bg-[#111]'
                  : 'border-black/15 text-neutral-700 hover:border-black/40 hover:text-black bg-neutral-50'
              }`}
              id="hero-experience-link"
            >
              Experience
            </a>

            <a
              href="#contact"
              className={`py-3 px-6 rounded-sm text-xs font-bold uppercase tracking-widest border transition-colors ${
                theme === 'dark'
                  ? 'border-white/15 text-neutral-300 hover:border-white/40 hover:text-white bg-[#111]'
                  : 'border-black/15 text-neutral-700 hover:border-black/40 hover:text-black bg-neutral-50'
              }`}
              id="hero-contact-link"
            >
              Contact
            </a>
          </div>
        </motion.div>

        {/* Hairline Section Divider */}
        <div
          className={`mt-20 sm:mt-24 border-b ${
            theme === 'dark' ? 'border-white/5' : 'border-black/5'
          }`}
        />
      </div>
    </section>
  );
};

