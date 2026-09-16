import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, ArrowUpRight, Mail } from 'lucide-react';
import { ThemeMode } from '../types';

interface ContactSectionProps {
  theme: ThemeMode;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ theme }) => {
  const [copied, setCopied] = useState(false);
  const email = 'ogunnaikeodunayo2@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Section Indicator */}
          <div className="md:col-span-3">
            <span
              className={`font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-bold ${
                theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              06 / CONTACT
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
                className={`text-5xl sm:text-6xl md:text-7xl font-light tracking-tighter leading-none ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
              >
                Let&apos;s work <br />
                <span className="italic font-serif font-normal text-neutral-400 dark:text-neutral-500">
                  together.
                </span>
              </motion.h2>

              <p
                className={`text-sm sm:text-base leading-relaxed max-w-xl mt-4 ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Whether you have an upcoming project, need freelance design direction,
                or want to explore visual communication, feel free to reach out.
              </p>
            </div>

            {/* Email Contact Block */}
            <div className="pt-2 space-y-4">
              <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-neutral-400 block">
                DIRECT INQUIRIES &amp; COMMISSIONS
              </span>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${email}`}
                  className={`text-lg sm:text-xl md:text-2xl font-mono tracking-tight font-medium transition-opacity hover:opacity-75 flex items-center gap-2 group ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}
                  id="contact-email-link"
                >
                  <span>{email}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>

                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono transition-all border ${
                    theme === 'dark'
                      ? 'bg-[#111] hover:bg-neutral-800 text-neutral-300 border-white/10 hover:border-white/20'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-300'
                  }`}
                  title="Copy email to clipboard"
                  id="copy-email-btn"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick mailto action button */}
              <div className="pt-2">
                <a
                  href={`mailto:${email}?subject=Project%20Brief%20-%20Design%20Inquiry`}
                  className={`inline-flex items-center gap-2 py-3 px-5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${
                    theme === 'dark'
                      ? 'bg-white text-black hover:bg-neutral-200'
                      : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                  id="compose-email-btn"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send an Email</span>
                </a>
              </div>
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
