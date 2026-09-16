import React from 'react';
import { motion } from 'motion/react';
import { ThemeMode } from '../types';

interface AboutSectionProps {
  theme: ThemeMode;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ theme }) => {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Section Indicator */}
          <div className="md:col-span-3">
            <span
              className={`font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-bold ${
                theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              01 / ABOUT
            </span>
          </div>

          {/* Content Area */}
          <div className="md:col-span-9 space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`text-4xl sm:text-5xl font-light tracking-tighter leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}
            >
              Design shaped <br className="hidden sm:inline" />
              <span className="italic font-serif font-normal text-neutral-400 dark:text-neutral-500">
                by practice.
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`space-y-5 text-sm sm:text-base leading-relaxed max-w-xl ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              <p>
                I am a graphic designer with approximately six years of practical experience,
                including five years of freelance work with different organisations and clients.
                Much of my freelance experience has been with Christian ministries and church
                organisations, creating visual communication for evangelistic crusades, conferences,
                programmes and campaigns. That work developed my ability to interpret briefs, translate
                ideas into visual concepts and design for different audiences.
              </p>
              <p>
                I now bring that experience into a commercial environment through my in-house role at
                Megasub, a digital-services company providing data, airtime and other bill-vending services.
              </p>
            </motion.div>
          </div>
        </div>

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
