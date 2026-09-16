import React from 'react';
import { motion } from 'motion/react';
import { ThemeMode } from '../types';

interface CapabilitiesSectionProps {
  theme: ThemeMode;
}

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({ theme }) => {
  const tools = [
    {
      name: 'Adobe Photoshop',
      role: 'Design & image editing',
    },
    {
      name: 'Canva',
      role: 'Visual communication',
    },
    {
      name: 'Figma',
      role: 'Digital design & layouts',
    },
  ];

  return (
    <section id="capabilities" className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Section Indicator */}
          <div className="md:col-span-3">
            <span
              className={`font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-bold ${
                theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              04 / CAPABILITIES
            </span>
          </div>

          {/* Content Area */}
          <div className="md:col-span-9 space-y-10">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`text-4xl sm:text-5xl font-light tracking-tighter leading-tight mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
              >
                Built around <br className="hidden sm:inline" />
                <span className="italic font-serif font-normal text-neutral-400 dark:text-neutral-500">
                  the brief.
                </span>
              </motion.h2>

              <p
                className={`text-sm sm:text-base leading-relaxed max-w-xl ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                I focus on visual communication, concept development, campaign and event design,
                social media design and consistent application of brand identity.
              </p>
            </div>

            {/* 3 Columns for Tools */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4">
              {tools.map((tool, idx) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`pt-5 border-t ${
                    theme === 'dark' ? 'border-white/5' : 'border-black/5'
                  }`}
                >
                  <h3
                    className={`text-base font-medium mb-1 tracking-tight ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}
                  >
                    {tool.name}
                  </h3>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                    }`}
                  >
                    {tool.role}
                  </p>
                </motion.div>
              ))}
            </div>
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
