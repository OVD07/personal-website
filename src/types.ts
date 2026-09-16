export type PortfolioSection = 'megasub' | 'freelance';

export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  imageUrl: string;
  section?: PortfolioSection;
  brief?: string;
  year?: string;
  description?: string;
  tags?: string[];
  order: number;
  createdAt: number;
}

export type ThemeMode = 'dark' | 'light';

export interface ExperienceItem {
  id: string;
  periodLabel: string;
  role: string;
  company?: string;
  description: string;
}

export interface ExperienceCompany {
  id: string;
  name: string;
  category?: string;
  role?: string;
  period?: string;
  description?: string;
  logoBg?: string; // 'white' | '#0e1424' | '#000000' | '#f4f4f5' | 'transparent'
  logoKey: string; // key for rendering company logo SVG preset
  customIconUrl?: string; // custom uploaded icon or image URL
  iconType?: 'preset' | 'custom';
  highlights?: string[];
}

export interface ExperienceDesign {
  id: string;
  experienceId: string; // id of the ExperienceCompany
  title: string;
  client: string;
  category: string;
  imageUrl: string; // primary/cover image
  images?: string[]; // multiple uploaded images/deliverables for this design
  brief?: string;
  description?: string;
  year?: string;
  tags?: string[];
  createdAt: number;
}

export interface CapabilityItem {
  title: string;
  subtitle: string;
  details?: string;
}
