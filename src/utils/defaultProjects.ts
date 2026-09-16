import { Project } from '../types';

// High-fidelity SVG vector artworks representing Odunayo's actual domain works:
// 1. Ministry / Event (Crusade / Believers Convention)
// 2. Campaign (Megasub Airtime & Data Promo)
// 3. Event Communication (Praise & Prayer Conference)
// 4. Commercial Design (Megasub Bill-Vending Brand)

const createSvgDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

const ministryEventSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14151b" />
      <stop offset="50%" stop-color="#1b1d28" />
      <stop offset="100%" stop-color="#0a0b0e" />
    </linearGradient>
    <radialGradient id="glow1" cx="60%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#4f46e5" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="goldGlow" cx="30%" cy="70%" r="40%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
    </radialGradient>
    <filter id="blurFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="60" />
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="900" fill="url(#bgGrad1)" />
  <rect width="1200" height="900" fill="url(#glow1)" />
  <rect width="1200" height="900" fill="url(#goldGlow)" />
  
  <!-- Geometric Design Elements -->
  <g opacity="0.15">
    <circle cx="600" cy="450" r="320" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4,8" />
    <circle cx="600" cy="450" r="220" fill="none" stroke="#818cf8" stroke-width="2" />
    <path d="M 600,100 L 600,800 M 150,450 L 1050,450" stroke="#ffffff" stroke-width="0.8" />
  </g>
  
  <!-- Atmospheric light beam -->
  <polygon points="500,0 700,0 850,900 350,900" fill="#6366f1" opacity="0.08" />
  
  <!-- Ministry Cross / Beam Motif -->
  <g transform="translate(600, 360)">
    <rect x="-6" y="-120" width="12" height="240" rx="6" fill="#c7d2fe" opacity="0.9" />
    <rect x="-70" y="-45" width="140" height="12" rx="6" fill="#c7d2fe" opacity="0.9" />
    <circle cx="0" cy="-40" r="18" fill="none" stroke="#fbbf24" stroke-width="3" />
  </g>
  
  <!-- Typography for Ministry Poster -->
  <text x="600" y="560" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="52" fill="#ffffff" text-anchor="middle" letter-spacing="4">
    BELIEVERS CONVENTION
  </text>
  <text x="600" y="615" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="22" fill="#818cf8" text-anchor="middle" letter-spacing="8">
    THE OUTPOURING &amp; REVIVAL
  </text>
  <text x="600" y="660" font-family="'Plus Jakarta Sans', sans-serif" font-weight="400" font-size="16" fill="#9ca3af" text-anchor="middle" letter-spacing="3">
    KINGDOM LIFE MINISTRY · ANNUAL CRUSADE
  </text>
  
  <!-- Top Badge -->
  <rect x="500" y="80" width="200" height="32" rx="16" fill="#232636" stroke="#3730a3" stroke-width="1" />
  <text x="600" y="101" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="12" fill="#a5b4fc" text-anchor="middle" letter-spacing="2">
    SPECIAL EDITION 2024
  </text>
</svg>
`);

const campaignSvg = createSvgDataUrl(`
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
  
  <!-- Background -->
  <rect width="1200" height="900" fill="url(#bgGrad2)" />
  
  <!-- Grid Matrix -->
  <g opacity="0.1" stroke="#38bdf8" stroke-width="1">
    <line x1="0" y1="150" x2="1200" y2="150" />
    <line x1="0" y1="300" x2="1200" y2="300" />
    <line x1="0" y1="450" x2="1200" y2="450" />
    <line x1="0" y1="600" x2="1200" y2="600" />
    <line x1="0" y1="750" x2="1200" y2="750" />
    <line x1="200" y1="0" x2="200" y2="900" />
    <line x1="400" y1="0" x2="400" y2="900" />
    <line x1="600" y1="0" x2="600" y2="900" />
    <line x1="800" y1="0" x2="800" y2="900" />
    <line x1="1000" y1="0" x2="1000" y2="900" />
  </g>
  
  <!-- Dynamic Slanted Shapes for Campaign -->
  <polygon points="300,120 980,120 900,420 220,420" fill="url(#neonCyan)" opacity="0.12" />
  
  <!-- Center Graphic Elements -->
  <circle cx="600" cy="380" r="140" fill="#1e293b" stroke="#06b6d4" stroke-width="3" />
  <circle cx="600" cy="380" r="110" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="8,6" />
  
  <!-- High Speed Sim / Data Icon -->
  <path d="M 560,330 L 630,330 L 650,350 L 650,430 L 560,430 Z" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linejoin="round" />
  <polyline points="575,370 595,395 635,355" fill="none" stroke="#22d3ee" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  
  <!-- Main Campaign Typography -->
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

const eventCommSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e2e8f0" />
      <stop offset="50%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
    <linearGradient id="darkMonochrome" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  
  <!-- Silver Background (as shown in bottom-left tile in user's image) -->
  <rect width="1200" height="900" fill="url(#silverGrad)" />
  
  <!-- Subtle Swiss Design Typography Frame -->
  <rect x="60" y="60" width="1080" height="780" fill="none" stroke="#475569" stroke-width="1.5" opacity="0.3" />
  
  <!-- Editorial layout lines -->
  <line x1="60" y1="220" x2="1140" y2="220" stroke="#475569" stroke-width="1" opacity="0.3" />
  <line x1="60" y1="680" x2="1140" y2="680" stroke="#475569" stroke-width="1" opacity="0.3" />
  <line x1="400" y1="220" x2="400" y2="680" stroke="#475569" stroke-width="1" opacity="0.3" />
  
  <!-- Bold Graphic Design Poster Typography -->
  <text x="120" y="170" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="44" fill="#0f172a" letter-spacing="-1">
    GLOBAL EVANGELISM CRUSADE
  </text>
  <text x="120" y="320" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="78" fill="#0f172a" letter-spacing="-3">
    THE SOUND
  </text>
  <text x="120" y="400" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="78" fill="#1e293b" letter-spacing="-3">
    OF HARVEST
  </text>
  
  <!-- Swiss Style Metadata column -->
  <text x="440" y="300" font-family="'JetBrains Mono', monospace" font-size="14" fill="#334155" letter-spacing="1">
    DATE // 14-18 NOVEMBER 2024
  </text>
  <text x="440" y="340" font-family="'JetBrains Mono', monospace" font-size="14" fill="#334155" letter-spacing="1">
    VENUE // CENTRAL STADIUM GROUNDS
  </text>
  <text x="440" y="380" font-family="'JetBrains Mono', monospace" font-size="14" fill="#334155" letter-spacing="1">
    ROLE // CREATIVE DIRECTION &amp; POSTER DESIGN
  </text>
  <text x="440" y="420" font-family="'JetBrains Mono', monospace" font-size="14" fill="#334155" letter-spacing="1">
    FORMAT // PRINT, DIGITAL SIGNAGE, SOCIALS
  </text>
  
  <!-- Footer barcode / aesthetic badge -->
  <rect x="120" y="720" width="180" height="24" fill="#0f172a" />
  <text x="960" y="738" font-family="'JetBrains Mono', monospace" font-size="13" fill="#334155" text-anchor="end">
    DESIGN BY ODUNAYO OGUNNAIKE
  </text>
</svg>
`);

const commercialSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <linearGradient id="commGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#121318" />
      <stop offset="50%" stop-color="#181a22" />
      <stop offset="100%" stop-color="#0d0e12" />
    </linearGradient>
    <linearGradient id="indigoPurple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="900" fill="url(#commGrad)" />
  
  <!-- Modern Dark Fintech Brand Showcase -->
  <rect x="150" y="120" width="900" height="660" rx="24" fill="#1b1d28" stroke="#2a2e40" stroke-width="2" />
  
  <!-- Floating Dashboard Card Mockup -->
  <rect x="250" y="200" width="700" height="340" rx="16" fill="#13141c" stroke="#34384d" stroke-width="1.5" />
  
  <!-- Card Header -->
  <circle cx="290" cy="240" r="6" fill="#ef4444" />
  <circle cx="310" cy="240" r="6" fill="#f59e0b" />
  <circle cx="330" cy="240" r="6" fill="#10b981" />
  <text x="600" y="246" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="14" fill="#64748b" text-anchor="middle">
    MEGASUB ENTERPRISE PORTAL
  </text>
  
  <!-- App Visual UI -->
  <rect x="290" y="280" width="280" height="80" rx="10" fill="#1e2233" />
  <rect x="590" y="280" width="320" height="80" rx="10" fill="#1e2233" />
  
  <text x="310" y="315" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="13" fill="#94a3b8">WALLET BALANCE</text>
  <text x="310" y="342" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="20" fill="#ffffff">₦ 2,450,800.00</text>
  
  <text x="610" y="315" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="13" fill="#94a3b8">TRANSACTIONS PROCESSED</text>
  <text x="610" y="342" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="20" fill="#a855f7">184,920 SUCCEEDED</text>
  
  <!-- Commercial Brand Typography -->
  <text x="600" y="640" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="44" fill="#ffffff" text-anchor="middle" letter-spacing="-0.5">
    Megasub Brand System
  </text>
  <text x="600" y="685" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="18" fill="#a5b4fc" text-anchor="middle" letter-spacing="2">
    DIGITAL BILL-VENDING &amp; COMMODITY SUITE
  </text>
</svg>
`);

const megasubVtuSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <linearGradient id="vtuBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1329" />
      <stop offset="50%" stop-color="#111c3d" />
      <stop offset="100%" stop-color="#070c18" />
    </linearGradient>
    <linearGradient id="accentCyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#vtuBg)" />
  <circle cx="600" cy="450" r="360" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.15" stroke-dasharray="6,12" />
  <circle cx="600" cy="450" r="260" fill="none" stroke="#818cf8" stroke-width="1.5" opacity="0.25" />
  
  <!-- Central Icon Grid -->
  <g transform="translate(600, 360)">
    <rect x="-90" y="-90" width="180" height="180" rx="32" fill="#172554" stroke="#38bdf8" stroke-width="2" />
    <!-- Bolt / Power symbol -->
    <path d="M 10,-55 L -45,5 L 0,5 L -10,55 L 45,-5 L 0,-5 Z" fill="#38bdf8" />
  </g>
  
  <text x="600" y="550" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="52" fill="#ffffff" text-anchor="middle" letter-spacing="3">
    AUTOMATED AIRTIME &amp; BILLS
  </text>
  <text x="600" y="605" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="22" fill="#38bdf8" text-anchor="middle" letter-spacing="6">
    MEGASUB INSTANT DISPATCH
  </text>
  <text x="600" y="650" font-family="'JetBrains Mono', monospace" font-size="14" fill="#94a3b8" text-anchor="middle" letter-spacing="2">
    24/7 VTU API · CABLE TV · ELECTRICITY TOKEN RECHARGE
  </text>
</svg>
`);

const megasubAppPromoSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <linearGradient id="promoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#0b0f19" />
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#promoBg)" />
  <rect x="180" y="140" width="840" height="620" rx="20" fill="#131424" stroke="#312e81" stroke-width="2" />
  
  <!-- Phone Frame Silhouette -->
  <rect x="470" y="200" width="260" height="340" rx="28" fill="#1e1b4b" stroke="#6366f1" stroke-width="2" />
  <rect x="550" y="215" width="100" height="6" rx="3" fill="#4338ca" />
  <text x="600" y="320" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="34" fill="#ffffff" text-anchor="middle">
    MEGASUB
  </text>
  <text x="600" y="355" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="14" fill="#a5b4fc" text-anchor="middle" letter-spacing="2">
    MOBILE APP
  </text>
  <rect x="520" y="420" width="160" height="36" rx="18" fill="#4f46e5" />
  <text x="600" y="443" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="12" fill="#ffffff" text-anchor="middle">
    DOWNLOAD NOW
  </text>
  
  <text x="600" y="630" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="46" fill="#ffffff" text-anchor="middle" letter-spacing="-1">
    Zero Downtime Telecom Vending
  </text>
  <text x="600" y="675" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="16" fill="#818cf8" text-anchor="middle" letter-spacing="3">
    OFFICIAL MEGASUB SOCIAL ADVERT &amp; LAUNCH CAMPAIGN
  </text>
</svg>
`);

export const DEFAULT_PROJECTS: Project[] = [];
