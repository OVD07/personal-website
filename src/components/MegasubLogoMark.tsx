import React from 'react';

interface MegasubLogoMarkProps {
  className?: string;
  size?: number | string;
}

export const MegasubLogoMark: React.FC<MegasubLogoMarkProps> = ({
  className = 'w-16 h-16',
}) => {
  return (
    <svg
      viewBox="0 0 1000 1000"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        {/* Outer Shell Gradient */}
        <linearGradient id="msOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b54e3" />
          <stop offset="50%" stopColor="#3047d9" />
          <stop offset="100%" stopColor="#2437bd" />
        </linearGradient>

        {/* 3D Chiseled Facets */}
        <linearGradient id="msTopLeftFacet" x1="15%" y1="10%" x2="70%" y2="75%">
          <stop offset="0%" stopColor="#455ee8" />
          <stop offset="60%" stopColor="#2f45cc" />
          <stop offset="100%" stopColor="#2132a6" />
        </linearGradient>

        <linearGradient id="msTopRightFacet" x1="85%" y1="10%" x2="30%" y2="75%">
          <stop offset="0%" stopColor="#4f69f0" />
          <stop offset="55%" stopColor="#364dd6" />
          <stop offset="100%" stopColor="#2537b0" />
        </linearGradient>

        <linearGradient id="msCenterFoldLeft" x1="25%" y1="40%" x2="50%" y2="65%">
          <stop offset="0%" stopColor="#283cb8" />
          <stop offset="100%" stopColor="#1b288c" />
        </linearGradient>

        <linearGradient id="msCenterFoldRight" x1="75%" y1="40%" x2="50%" y2="65%">
          <stop offset="0%" stopColor="#354cdb" />
          <stop offset="100%" stopColor="#2334a8" />
        </linearGradient>

        <linearGradient id="msLeftLeg" x1="10%" y1="30%" x2="40%" y2="90%">
          <stop offset="0%" stopColor="#334ad4" />
          <stop offset="50%" stopColor="#2838b8" />
          <stop offset="100%" stopColor="#18237d" />
        </linearGradient>

        <linearGradient id="msRightLeg" x1="90%" y1="30%" x2="60%" y2="90%">
          <stop offset="0%" stopColor="#415be3" />
          <stop offset="50%" stopColor="#2e42c7" />
          <stop offset="100%" stopColor="#1f2c94" />
        </linearGradient>

        {/* Luminous Cyan Accent Glow */}
        <linearGradient id="msCyanCrease" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0" />
          <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#a5f3fc" stopOpacity="1" />
          <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 1. Outer Rounded Royal Blue Shield / Silhouette */}
      <path
        d="M 125,20
           C 56,20 0,76 0,145
           L 0,855
           C 0,935 65,995 145,995
           C 182,995 218,978 244,946
           L 492,642
           C 496,637 504,637 508,642
           L 756,946
           C 782,978 818,995 855,995
           C 935,995 1000,935 1000,855
           L 1000,145
           C 1000,76 944,20 875,20
           C 838,20 802,37 776,69
           L 508,373
           C 504,378 496,378 492,373
           L 224,69
           C 198,37 162,20 125,20 Z"
        fill="url(#msOuterGrad)"
      />

      {/* 2. Crisp White Inner Contour */}
      <path
        d="M 108,65
           L 108,918
           C 108,948 132,962 152,938
           L 368,525
           C 372,517 380,512 390,512
           L 500,590
           L 610,512
           C 620,512 628,517 632,525
           L 848,938
           C 868,962 892,948 892,918
           L 892,65
           C 892,48 878,40 864,52
           L 508,284
           C 503,288 497,288 492,284
           L 136,52
           C 122,40 108,48 108,65 Z"
        stroke="#ffffff"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. 3D Faceted Planes */}
      {/* Top Left Facet */}
      <polygon
        points="120,85 500,284 500,590 190,415"
        fill="url(#msTopLeftFacet)"
      />

      {/* Top Right Facet */}
      <polygon
        points="880,85 500,284 500,590 810,415"
        fill="url(#msTopRightFacet)"
      />

      {/* Center Fold Left */}
      <polygon
        points="190,415 500,284 500,590"
        fill="url(#msCenterFoldLeft)"
      />

      {/* Center Fold Right */}
      <polygon
        points="810,415 500,284 500,590"
        fill="url(#msCenterFoldRight)"
      />

      {/* Left Pillar / Leg */}
      <polygon
        points="120,85 190,415 500,590 375,520 125,930 115,85"
        fill="url(#msLeftLeg)"
      />

      {/* Right Pillar / Leg */}
      <polygon
        points="880,85 810,415 500,590 625,520 875,930 885,85"
        fill="url(#msRightLeg)"
      />

      {/* 4. Glowing Cyan Crease Line */}
      <path
        d="M 190,415 Q 345,502 500,590 Q 655,502 810,415"
        stroke="url(#msCyanCrease)"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
};
