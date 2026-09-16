import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Project, ThemeMode, PortfolioSection, ExperienceCompany, ExperienceDesign } from './types';
import { getProjects } from './utils/storage';
import {
  getStoredCompanies,
  getStoredExperienceDesigns,
  saveStoredExperienceDesign,
  deleteStoredExperienceDesign,
  saveStoredCompany,
  resetCompanyToDefault,
  clearAllStoredDesigns,
  loadDesignsFromIndexedDB,
  updateMemoryDesignsCache,
  loadCompaniesFromIndexedDB,
  updateMemoryCompaniesCache,
} from './utils/experienceStorage';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ExperienceDetailModal } from './components/ExperienceDetailModal';
import { SelectedWorkSection } from './components/SelectedWorkSection';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { EducationSection } from './components/EducationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('odunayo_portfolio_theme');
      return (saved as ThemeMode) || 'dark';
    }
    return 'dark';
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [companies, setCompanies] = useState<ExperienceCompany[]>([]);
  const [experienceDesigns, setExperienceDesigns] = useState<ExperienceDesign[]>([]);
  const [activeExperience, setActiveExperience] = useState<ExperienceCompany | null>(null);
  const [openAddOnModal, setOpenAddOnModal] = useState<boolean>(false);

  const [activePortfolioSection, setActivePortfolioSection] = useState<PortfolioSection>('megasub');
  const [activeLightboxProject, setActiveLightboxProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on startup
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProjects();
        setProjects(data);

        // Load companies: check IndexedDB first, then localStorage
        const idbCompanies = await loadCompaniesFromIndexedDB();
        if (idbCompanies && idbCompanies.length > 0) {
          setCompanies(idbCompanies);
          updateMemoryCompaniesCache(idbCompanies);
        } else {
          const storedCompanies = getStoredCompanies();
          setCompanies(storedCompanies);
          updateMemoryCompaniesCache(storedCompanies);
        }

        // Load designs: check IndexedDB first (quota-safe & full fidelity), then localStorage
        const idbDesigns = await loadDesignsFromIndexedDB();
        if (idbDesigns && idbDesigns.length > 0) {
          setExperienceDesigns(idbDesigns);
          updateMemoryDesignsCache(idbDesigns);
        } else {
          const storedDesigns = getStoredExperienceDesigns();
          setExperienceDesigns(storedDesigns);
          updateMemoryDesignsCache(storedDesigns);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update HTML body theme class and attribute
  useEffect(() => {
    localStorage.setItem('odunayo_portfolio_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.style.backgroundColor = '#080808';
      document.body.style.color = '#ffffff';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#fbfbfb';
      document.body.style.color = '#0a0a0a';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectPortfolioSection = (section: PortfolioSection) => {
    setActivePortfolioSection(section);
    const el = document.getElementById('work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewExperience = (company: ExperienceCompany, openAdd: boolean = false) => {
    setActiveExperience(company);
    setOpenAddOnModal(openAdd);
  };

  const handleSaveExperienceDesign = (design: ExperienceDesign) => {
    // Pass current experienceDesigns to guarantee no existing design is ever displaced
    const updated = saveStoredExperienceDesign(design, experienceDesigns);
    setExperienceDesigns(updated);
  };

  const handleDeleteExperienceDesign = (designId: string) => {
    const updated = deleteStoredExperienceDesign(designId, experienceDesigns);
    setExperienceDesigns(updated);
  };

  const handleClearAllDesigns = (experienceId?: string) => {
    const updated = clearAllStoredDesigns(experienceId, experienceDesigns);
    setExperienceDesigns(updated);
  };

  const handleSaveCompany = (updated: ExperienceCompany) => {
    const updatedList = saveStoredCompany(updated, companies);
    setCompanies(updatedList);
    if (activeExperience && activeExperience.id === updated.id) {
      setActiveExperience(updated);
    }
  };

  const handleResetCompany = (companyId: string) => {
    const updatedList = resetCompanyToDefault(companyId);
    setCompanies(updatedList);
    if (activeExperience && activeExperience.id === companyId) {
      const match = updatedList.find((c) => c.id === companyId) || null;
      setActiveExperience(match);
    }
  };

  const handleViewDesignFullscreen = (imageUrl: string, title: string) => {
    setActiveLightboxProject({
      id: `fullscreen-${Date.now()}`,
      title,
      client: activeExperience?.name || 'Experience Project',
      category: 'Design Showcase',
      imageUrl,
      order: 1,
      createdAt: Date.now(),
    });
  };

  // Convert user experience designs into work projects so both sections are synchronized from scratch
  const mappedExperienceProjects: Project[] = useMemo(() => {
    return experienceDesigns.map((d, idx) => ({
      id: d.id,
      title: d.title,
      category: d.category || 'Design Work',
      client: d.client || (d.experienceId === 'megasub' ? 'Megasub' : 'Freelance Graphic Designer'),
      year: d.year || '2024',
      description: d.brief || d.description,
      imageUrl: d.imageUrl || (d.images && d.images[0]) || '',
      images: d.images && d.images.length > 0 ? d.images : d.imageUrl ? [d.imageUrl] : [],
      brief: d.brief,
      tags: d.tags,
      section: (d.experienceId === 'megasub' ? 'megasub' : 'freelance') as PortfolioSection,
      order: idx + 1,
      createdAt: d.createdAt,
    }));
  }, [experienceDesigns]);

  const allDisplayProjects = useMemo(() => {
    const existingIds = new Set(projects.map((p) => p.id));
    const additions = mappedExperienceProjects.filter((p) => !existingIds.has(p.id));
    return [...projects, ...additions];
  }, [projects, mappedExperienceProjects]);

  const currentExperienceDesigns = activeExperience
    ? experienceDesigns.filter((d) => d.experienceId === activeExperience.id)
    : [];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans selection:bg-white selection:text-black dark:selection:bg-white dark:selection:text-black ${
        theme === 'dark' ? 'bg-[#080808] text-white' : 'bg-[#fbfbfb] text-[#0a0a0a]'
      }`}
    >
      {/* Top Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onSelectPortfolioSection={handleSelectPortfolioSection}
      />

      {/* Main Content with smooth fade-in motion */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <Hero theme={theme} />
        <AboutSection theme={theme} />
        <ExperienceSection
          theme={theme}
          companies={companies}
          designs={experienceDesigns}
          onViewExperience={handleViewExperience}
          onSaveDesign={handleSaveExperienceDesign}
          onDeleteDesign={handleDeleteExperienceDesign}
          onOpenLightbox={(img, title) => handleViewDesignFullscreen(img, title)}
          onSaveCompany={handleSaveCompany}
          onResetCompany={handleResetCompany}
          onClearAllDesigns={handleClearAllDesigns}
        />
        <SelectedWorkSection
          theme={theme}
          projects={allDisplayProjects}
          onOpenLightbox={(proj) => setActiveLightboxProject(proj)}
        />
        <CapabilitiesSection theme={theme} />
        <EducationSection theme={theme} />
        <ContactSection theme={theme} />
        <Footer theme={theme} />
      </motion.main>

      {/* Experience Workspace / Editable Place Modal */}
      <ExperienceDetailModal
        isOpen={Boolean(activeExperience)}
        onClose={() => {
          setActiveExperience(null);
          setOpenAddOnModal(false);
        }}
        experience={activeExperience}
        designs={currentExperienceDesigns}
        theme={theme}
        onSaveDesign={handleSaveExperienceDesign}
        onDeleteDesign={handleDeleteExperienceDesign}
        onViewFullscreen={handleViewDesignFullscreen}
        initialOpenAdd={openAddOnModal}
        onSaveCompany={handleSaveCompany}
        onResetCompany={handleResetCompany}
      />

      {/* High-Resolution Artwork Lightbox */}
      <LightboxModal
        project={activeLightboxProject}
        projects={allDisplayProjects}
        onClose={() => setActiveLightboxProject(null)}
        onSelectProject={(proj) => setActiveLightboxProject(proj)}
        theme={theme}
      />
    </div>
  );
}
