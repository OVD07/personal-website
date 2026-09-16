import React from 'react';
import { motion } from 'motion/react';
import { ThemeMode } from '../types';

interface EducationSectionProps {
  theme: ThemeMode;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ theme }) => {
  return (
    <section id="education" className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Section Indicator */}
          <div className="md:col-span-3">
            <span
              className={`font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-bold ${
                theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              05 / EDUCATION
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
              Beyond <br className="hidden sm:inline" />
              <span className="italic font-serif font-normal text-neutral-400 dark:text-neutral-500">
                design.
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-3 max-w-xl"
            >
              <div>
                <h3
                  className={`text-base font-medium tracking-tight ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}
                >
                  B.Tech. Quantity Surveying
                </h3>
                <p
                  className={`text-xs font-mono uppercase tracking-widest pt-0.5 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}
                >
                  Federal University of Technology, Minna
                </p>
              </div>

              <p
                className={`text-sm leading-relaxed pt-2 ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                My academic background in Quantity Surveying adds a practical, structured perspective
                to the way I approach briefs, information hierarchy and creative problem-solving.
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
