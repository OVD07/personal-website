import React, { useState, useEffect } from 'react';
import { Moon, Sun, Upload, Menu, X } from 'lucide-react';
import { ThemeMode, PortfolioSection } from '../types';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenCms?: () => void;
  projectsCount?: number;
  onSelectPortfolioSection?: (section: PortfolioSection) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenCms,
  projectsCount,
  onSelectPortfolioSection,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; href: string; section?: PortfolioSection }[] = [
    { label: 'WORK EXPERIENCE', href: '#work', section: 'megasub' },
    { label: 'ABOUT', href: '#about' },
    { label: 'EXPERIENCE', href: '#experience' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? theme === 'dark'
            ? 'bg-[#080808]/90 backdrop-blur-md border-b border-white/5 shadow-2xl shadow-black/60'
            : 'bg-[#fbfbfb]/90 backdrop-blur-md border-b border-black/5 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10 h-20 sm:h-24 flex items-center justify-between">
        {/* Brand Name with Minimalist Rotated Emblem */}
        <a
          href="#"
          className={`flex items-center gap-3 font-bold tracking-tighter text-sm sm:text-base transition-opacity hover:opacity-80 ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}
          id="nav-brand"
        >
          <div
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-45 transition-colors ${
              theme === 'dark' ? 'bg-white' : 'bg-black'
            }`}
          />
          <span className="tracking-[0.15em] uppercase font-bold text-xs sm:text-sm">
            ODUNAYO OGUNNAIKE
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8 text-[10px] font-bold tracking-[0.3em] uppercase">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.section && onSelectPortfolioSection) {
                    onSelectPortfolioSection(link.section);
                  }
                }}
                className={`transition-all duration-200 pb-0.5 ${
                  theme === 'dark'
                    ? 'text-neutral-400 hover:text-white hover:border-b hover:border-white'
                    : 'text-neutral-500 hover:text-black hover:border-b hover:border-black'
                }`}
                id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div
            className={`h-4 w-px ${
              theme === 'dark' ? 'bg-white/10' : 'bg-black/10'
            }`}
          />

          <div className="flex items-center gap-4">
            {/* Minimalist Switch Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors border cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#1a1a1a] border-white/10 justify-end'
                  : 'bg-neutral-200 border-neutral-300 justify-start'
              }`}
              id="theme-toggle-btn"
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  theme === 'dark'
                    ? 'bg-white shadow-md shadow-white/20'
                    : 'bg-black shadow-sm'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu and controls */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={onToggleTheme}
            className={`w-10 h-5 rounded-full p-0.5 flex items-center border ${
              theme === 'dark'
                ? 'bg-[#1a1a1a] border-white/10 justify-end'
                : 'bg-neutral-200 border-neutral-300 justify-start'
            }`}
            id="mobile-theme-toggle-btn"
          >
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                theme === 'dark' ? 'bg-white' : 'bg-black'
              }`}
            />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 rounded-sm ${
              theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'
            }`}
            aria-label="Toggle mobile navigation"
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden px-6 py-6 border-b transition-colors ${
            theme === 'dark'
              ? 'bg-[#080808] border-white/5 text-neutral-300'
              : 'bg-[#fbfbfb] border-black/5 text-neutral-700'
          }`}
        >
          <nav className="flex flex-col gap-4 text-[10px] font-bold tracking-[0.3em] uppercase">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.section && onSelectPortfolioSection) {
                    onSelectPortfolioSection(link.section);
                  }
                }}
                className="py-1 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCms();
              }}
              className={`mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-sm text-xs font-bold uppercase tracking-widest ${
                theme === 'dark'
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-black text-white hover:bg-neutral-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload &amp; Manage Work ({projectsCount})
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
