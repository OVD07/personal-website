import { ExperienceCompany, ExperienceDesign } from '../types';

export const INITIAL_COMPANIES: ExperienceCompany[] = [
  {
    id: 'megasub',
    name: 'Megasub',
    category: 'Commercial Design & Digital Telecom',
    role: 'In-house Graphic Designer',
    period: '4 Months',
    description:
      'Commercial design within a digital-services environment, supporting product promotion, social content, digital advertising, customer-facing communication and brand application.',
    logoBg: 'white',
    logoKey: 'megasub',
    customIconUrl: '',
    iconType: 'preset',
    highlights: [
      'Commercial advertising suites across mobile airtime & data vending products',
      'Daily promotional banners, social media tiles, and customer tariff matrices',
      'Brand consistency across all digital services and customer touchpoints',
      'Turnaround of marketing assets in rapid high-volume commercial schedules',
    ],
  },
  {
    id: 'church',
    name: 'Freelance Graphic Designer',
    category: 'Ministry, Branding & Event Media',
    role: 'Freelance Graphic Designer',
    period: 'Approximately 5 Years',
    description:
      'Independent design practice across ministry, event, campaign, social media and promotional communication. Managed briefs, creative development, feedback and final delivery.',
    logoBg: 'white',
    logoKey: 'freelance',
    customIconUrl: '',
    iconType: 'preset',
    highlights: [
      'Creative direction & branding for events, conferences, and ministries',
      'Comprehensive deliverables: stage backdrops, print programs, and livestream lower-thirds',
      'End-to-end client brief management, revisions, and production-ready output',
      'Consistent 5-year track record of delivering visual identities and campaign materials',
    ],
  },
];

const createSvgDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

// High-fidelity Megasub Artworks
const megasubCampaignSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1329" />
      <stop offset="50%" stop-color="#161e47" />
      <stop offset="100%" stop-color="#0b0d1a" />
    </linearGradient>
    <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>
  
  <rect width="1200" height="900" fill="url(#bgGrad2)" />
  <g opacity="0.1" stroke="#38bdf8" stroke-width="1">
    <line x1="0" y1="150" x2="1200" y2="150" />
    <line x1="0" y1="450" x2="1200" y2="450" />
    <line x1="0" y1="750" x2="1200" y2="750" />
    <line x1="300" y1="0" x2="300" y2="900" />
    <line x1="600" y1="0" x2="600" y2="900" />
    <line x1="900" y1="0" x2="900" y2="900" />
  </g>
  
  <circle cx="600" cy="380" r="140" fill="#1e293b" stroke="#06b6d4" stroke-width="3" />
  <circle cx="600" cy="380" r="110" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="8,6" />
  
  <path d="M 560,330 L 630,330 L 650,350 L 650,430 L 560,430 Z" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linejoin="round" />
  <polyline points="575,370 595,395 635,355" fill="none" stroke="#22d3ee" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  
  <text x="600" y="580" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="54" fill="#ffffff" text-anchor="middle" letter-spacing="3">
    DATA UNLIMITED
  </text>
  <text x="600" y="635" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="24" fill="#38bdf8" text-anchor="middle" letter-spacing="6">
    MEGASUB SPECIAL PROMO
  </text>
  <text x="600" y="680" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="16" fill="#94a3b8" text-anchor="middle" letter-spacing="2">
    INSTANT AIRTIME · FAST VENDING · ZERO DELAY
  </text>
</svg>
`);

const megasubSystemSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <rect width="1200" height="900" fill="#090d16" />
  <rect x="80" y="80" width="1040" height="740" rx="16" fill="#111827" stroke="#1f2937" stroke-width="2" />
  
  <rect x="120" y="140" width="960" height="180" rx="8" fill="#1e293b" />
  <text x="160" y="220" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="40" fill="#ffffff">
    MEGASUB COMMERCIAL DESIGN SYSTEM
  </text>
  <text x="160" y="270" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="18" fill="#38bdf8" letter-spacing="2">
    AIRTIME &amp; VTU BRAND STANDARDS &amp; VISUAL ASSETS
  </text>
  
  <rect x="120" y="360" width="300" height="400" rx="8" fill="#1e293b" />
  <rect x="450" y="360" width="300" height="400" rx="8" fill="#1e293b" />
  <rect x="780" y="360" width="300" height="400" rx="8" fill="#1e293b" />
  
  <circle cx="270" cy="460" r="40" fill="#0284c7" />
  <text x="270" y="550" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="20" fill="#ffffff" text-anchor="middle">
    Social Banners
  </text>
  
  <circle cx="600" cy="460" r="40" fill="#2563eb" />
  <text x="600" y="550" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="20" fill="#ffffff" text-anchor="middle">
    Recharge Tariffs
  </text>
  
  <circle cx="930" cy="460" r="40" fill="#4f46e5" />
  <text x="930" y="550" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="20" fill="#ffffff" text-anchor="middle">
    App Mockups
  </text>
</svg>
`);

// High-fidelity Church / Ministry Artworks
const churchCrusadeSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <linearGradient id="bgChurch" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14151b" />
      <stop offset="50%" stop-color="#1b1d28" />
      <stop offset="100%" stop-color="#0a0b0e" />
    </linearGradient>
    <radialGradient id="goldGlowChurch" cx="50%" cy="35%" r="40%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
    </radialGradient>
  </defs>
  
  <rect width="1200" height="900" fill="url(#bgChurch)" />
  <rect width="1200" height="900" fill="url(#goldGlowChurch)" />
  
  <g opacity="0.15">
    <circle cx="600" cy="450" r="320" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4,8" />
    <circle cx="600" cy="450" r="220" fill="none" stroke="#fbbf24" stroke-width="2" />
  </g>
  
  <!-- Ministry Cross Motif -->
  <g transform="translate(600, 340)">
    <rect x="-6" y="-110" width="12" height="220" rx="6" fill="#fbbf24" />
    <rect x="-65" y="-45" width="130" height="12" rx="6" fill="#fbbf24" />
    <circle cx="0" cy="-40" r="18" fill="none" stroke="#ffffff" stroke-width="2.5" />
  </g>
  
  <text x="600" y="550" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="52" fill="#ffffff" text-anchor="middle" letter-spacing="4">
    BELIEVERS CONVENTION
  </text>
  <text x="600" y="605" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="22" fill="#fbbf24" text-anchor="middle" letter-spacing="8">
    THE OUTPOURING &amp; REVIVAL
  </text>
  <text x="600" y="650" font-family="'Plus Jakarta Sans', sans-serif" font-weight="400" font-size="16" fill="#9ca3af" text-anchor="middle" letter-spacing="3">
    KINGDOM LIFE MINISTRY · ANNUAL CRUSADE KEY ART
  </text>
</svg>
`);

const churchConferenceSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  
  <rect width="1200" height="900" fill="url(#silverGrad)" />
  <rect x="60" y="60" width="1080" height="780" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.3" />
  
  <text x="120" y="240" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="56" fill="#ffffff" letter-spacing="-1">
    GLOBAL EVANGELISM CRUSADE
  </text>
  <text x="120" y="320" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="78" fill="#f59e0b" letter-spacing="-2">
    THE SOUND OF REVIVAL
  </text>
  <text x="120" y="390" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="22" fill="#cbd5e1" letter-spacing="3">
    ANNUAL PRAISE &amp; PRAYER CONFERENCE
  </text>
  
  <line x1="120" y1="460" x2="800" y2="460" stroke="#f59e0b" stroke-width="3" />
  <text x="120" y="520" font-family="'Plus Jakarta Sans', sans-serif" font-weight="400" font-size="16" fill="#94a3b8" letter-spacing="2">
    STAGE BACKDROPS · LIVESTREAM LOWER-THIRDS · SERMON BULLETINS
  </text>
</svg>
`);

export const INITIAL_EXPERIENCE_DESIGNS: ExperienceDesign[] = [];
