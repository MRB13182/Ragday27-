import React from 'react';
import { SUPER_ADMIN } from '../../SuperAdmin';

interface BackJerseySvgProps {
  name?: string;
  number?: string;
  className?: string;
}

export const BackJerseySvg: React.FC<BackJerseySvgProps> = ({
  name = 'YOUR NAME',
  number = '27',
  className = 'w-full h-full'
}) => {
  const jerseyCfg = SUPER_ADMIN.jerseyManagement;
  const customFont = SUPER_ADMIN.jerseyCustomFont;

  const displayName = (name || jerseyCfg.txt.defaultName || 'YOUR NAME').toUpperCase().slice(0, 14);
  const displayNumber = (number || jerseyCfg.txt.defaultNumber || '27').slice(0, 3);
  const badgeText = jerseyCfg.txt.badgeText || '27';

  // Split number into digits
  const digits = displayNumber.split('');
  const digitWidth = 90;
  const totalDigitsWidth = digits.length * digitWidth;
  const startX = 250 - totalDigitsWidth / 2;

  // Check if back jersey has a custom uploaded picture
  const backPic = jerseyCfg.pic.backJersey;
  const hasCustomBackPic = backPic && !backPic.includes('placeholder') && !backPic.endsWith('jersey-back.png') && backPic.startsWith('http');

  if (hasCustomBackPic) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <img src={backPic} alt="Jersey Back" className={`${className} object-contain`} />
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 500 600"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="backJerseyDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#160c2b" />
          <stop offset="45%" stopColor="#0a0514" />
          <stop offset="100%" stopColor="#180e30" />
        </linearGradient>
        <linearGradient id="backPurpleAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="50%" stopColor="#6D28D9" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id="backGoldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="backGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="meshSheen" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Jersey Body Shadow */}
      <path
        d="M160 52 L110 92 L30 162 L65 242 L120 207 L130 542 L370 542 L380 207 L435 242 L470 162 L390 92 L340 52 C300 72 200 72 160 52 Z"
        fill="#000000"
        opacity="0.6"
        transform="translate(4, 6)"
      />

      {/* Main Jersey Torso */}
      <path
        d="M160 50 L110 90 L30 160 L65 240 L120 205 L130 540 L370 540 L380 205 L435 240 L470 160 L390 90 L340 50 C300 70 200 70 160 50 Z"
        fill="url(#backJerseyDark)"
        stroke="#4C1D95"
        strokeWidth="3.5"
      />

      {/* Mesh Fabric Lighting Overlay */}
      <path
        d="M160 50 L110 90 L30 160 L65 240 L120 205 L130 540 L370 540 L380 205 L435 240 L470 160 L390 90 L340 50 C300 70 200 70 160 50 Z"
        fill="url(#meshSheen)"
      />

      {/* Collar Gold Piping */}
      <path
        d="M160 50 C200 70 300 70 340 50 L330 65 C295 82 205 82 170 65 Z"
        fill="url(#backGoldAccent)"
      />
      <path
        d="M175 66 C210 82 290 82 325 66"
        stroke="#6D28D9"
        strokeWidth="2"
        fill="none"
      />

      {/* Left Sleeve Trim & Badge */}
      <path d="M30 160 L65 240 L72 234 L38 155 Z" fill="url(#backGoldAccent)" />
      <rect x="42" y="180" width="20" height="26" rx="4" fill="#581C87" stroke="#FBBF24" strokeWidth="1.5" />
      <text x="52" y="198" fill="#FBBF24" fontFamily={customFont.txt.numberFontFamily || "'Teko', sans-serif"} fontSize="12" fontWeight="900" textAnchor="middle">{badgeText}</text>

      {/* Right Sleeve Trim & Badge */}
      <path d="M470 160 L435 240 L428 234 L462 155 Z" fill="url(#backGoldAccent)" />
      <rect x="438" y="180" width="20" height="26" rx="4" fill="#581C87" stroke="#FBBF24" strokeWidth="1.5" />
      <text x="448" y="198" fill="#FBBF24" fontFamily={customFont.txt.numberFontFamily || "'Teko', sans-serif"} fontSize="12" fontWeight="900" textAnchor="middle">{badgeText}</text>

      {/* Dynamic Purple/Violet Crystalline Shards */}
      <polygon points="125,250 175,340 130,480 98,300" fill="url(#backPurpleAccent)" opacity="0.9" />
      <polygon points="135,370 205,460 148,536 130,450" fill="#7C3AED" opacity="0.95" />
      <polygon points="160,450 215,505 180,538" fill="#C084FC" opacity="0.8" />

      <polygon points="375,250 325,340 370,480 402,300" fill="url(#backPurpleAccent)" opacity="0.9" />
      <polygon points="365,370 295,460 352,536 370,450" fill="#7C3AED" opacity="0.95" />
      <polygon points="340,450 285,505 320,538" fill="#C084FC" opacity="0.8" />

      {/* Subtle Athletic Back Seams */}
      <path d="M170 70 L210 200 L210 535" stroke="#3B0764" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" fill="none" />
      <path d="M330 70 L290 200 L290 535" stroke="#3B0764" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" fill="none" />

      {/* Gold Crown Outline Above Player Name */}
      <g transform="translate(250, 150) scale(1.15)">
        <path
          d="M-24 0 L-30 -22 L-11 -10 L0 -26 L11 -10 L30 -22 L24 0 Z"
          fill="none"
          stroke="url(#backGoldAccent)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#backGlowFilter)"
        />
        <circle cx="-30" cy="-22" r="2.8" fill="#FBBF24" />
        <circle cx="0" cy="-26" r="3.2" fill="#FBBF24" />
        <circle cx="30" cy="-22" r="2.8" fill="#FBBF24" />
      </g>

      {/* Instant Dynamic Player Name */}
      <text
        x="250"
        y="215"
        fill="#FFFFFF"
        fontFamily={customFont.txt.nameFontFamily || "'Montserrat', sans-serif"}
        fontWeight="900"
        fontSize={displayName.length > 10 ? '28' : '34'}
        textAnchor="middle"
        letterSpacing="4"
        filter="drop-shadow(0 2px 6px rgba(0,0,0,0.9))"
      >
        {displayName}
      </text>

      {/* Instant Dynamic Player Number (Rendered via Custom Font Images or Font Family) */}
      <g id="jersey-number-group">
        {digits.map((digitChar, i) => {
          const fontPic = (customFont as any)[digitChar];
          const xPos = startX + i * digitWidth;

          if (fontPic && typeof fontPic === 'string' && fontPic.trim().length > 0) {
            return (
              <image
                key={i}
                href={fontPic}
                x={xPos + 5}
                y={240}
                width={digitWidth - 10}
                height={160}
                preserveAspectRatio="xMidYMid meet"
                filter="url(#backGlowFilter)"
              />
            );
          }

          // Fallback text if no font image
          return (
            <text
              key={i}
              x={xPos + digitWidth / 2}
              y={390}
              fill="#FFFFFF"
              fontFamily={customFont.txt.numberFontFamily || "'Teko', 'Russo One', sans-serif"}
              fontWeight="700"
              fontSize="180"
              textAnchor="middle"
              filter="url(#backGlowFilter)"
            >
              {digitChar}
            </text>
          );
        })}
      </g>

      {/* Bottom Hem Gold Line */}
      <path d="M130 536 L370 536" stroke="url(#backGoldAccent)" strokeWidth="4" />
    </svg>
  );
};

export const FrontJerseySvg: React.FC<{ className?: string }> = ({
  className = 'w-full h-full'
}) => {
  const jerseyCfg = SUPER_ADMIN.jerseyManagement;
  const branding = SUPER_ADMIN.websiteBranding;
  const customFront = jerseyCfg.pic.frontJersey;

  if (customFront && !customFront.includes('placeholder') && !customFront.endsWith('jersey-front.png') && customFront.startsWith('http')) {
    return (
      <img
        src={customFront}
        alt="Front Jersey"
        className={`${className} object-contain`}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 500 600"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="frontJerseyDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a0c32" />
          <stop offset="45%" stopColor="#0a0514" />
          <stop offset="100%" stopColor="#180e30" />
        </linearGradient>
        <linearGradient id="frontPurpleAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="50%" stopColor="#6D28D9" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id="frontGoldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="frontGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Silhouette Shadow */}
      <path
        d="M160 52 L110 92 L30 162 L65 242 L120 207 L130 542 L370 542 L380 207 L435 242 L470 162 L390 92 L340 52 C310 87 190 87 160 52 Z"
        fill="#000000"
        opacity="0.6"
        transform="translate(4, 6)"
      />

      {/* Main Jersey Torso */}
      <path
        d="M160 50 L110 90 L30 160 L65 240 L120 205 L130 540 L370 540 L380 205 L435 240 L470 160 L390 90 L340 50 C310 85 190 85 160 50 Z"
        fill="url(#frontJerseyDark)"
        stroke="#4C1D95"
        strokeWidth="3.5"
      />

      {/* Dynamic Polygon Shards (Front) */}
      <polygon points="125,260 180,360 135,490 100,310" fill="url(#frontPurpleAccent)" opacity="0.9" />
      <polygon points="135,380 215,480 152,536 132,460" fill="#7C3AED" opacity="0.95" />
      <polygon points="375,260 320,360 365,490 400,310" fill="url(#frontPurpleAccent)" opacity="0.9" />
      <polygon points="365,380 285,480 348,536 368,460" fill="#7C3AED" opacity="0.95" />

      {/* Front V-Collar with Gold and Violet Insets */}
      <path
        d="M160 50 C190 85 220 120 250 145 C280 120 310 85 340 50 L320 50 C295 80 275 105 250 125 C225 105 205 80 180 50 Z"
        fill="url(#frontGoldAccent)"
      />
      <polygon points="235,125 265,125 250,145" fill="#6D28D9" stroke="#FBBF24" strokeWidth="1.5" />

      {/* Left Sleeve Gold Trim */}
      <path d="M30 160 L65 240 L72 234 L38 155 Z" fill="url(#frontGoldAccent)" />

      {/* Right Sleeve Gold Trim */}
      <path d="M470 160 L435 240 L428 234 L462 155 Z" fill="url(#frontGoldAccent)" />

      {/* College Crest Badge (Left Chest) */}
      <g transform="translate(190, 195) scale(0.95)">
        <circle cx="0" cy="0" r="28" fill="#180e30" stroke="url(#frontGoldAccent)" strokeWidth="3" />
        <circle cx="0" cy="0" r="23" fill="#581C87" />
        <path d="M-10 6 L10 6 L8 -12 L0 -16 L-8 -12 Z" fill="#FBBF24" />
        <text x="0" y="2" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">{branding.txt.collegeShortName}</text>
        <text x="0" y="14" fill="#FBBF24" fontSize="6" fontWeight="bold" textAnchor="middle">{branding.txt.batchShort}</text>
      </g>

      {/* RAD DAY Logo / Crown (Right Chest) */}
      <g transform="translate(310, 195) scale(0.9)">
        <path
          d="M-20 8 L-25 -10 L-9 0 L0 -14 L9 0 L25 -10 L20 8 Z"
          fill="none"
          stroke="url(#frontGoldAccent)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <text x="0" y="24" fill="#FBBF24" fontSize="10" fontWeight="900" textAnchor="middle" letterSpacing="2">
          {branding.txt.eventTitle}
        </text>
      </g>

      {/* Central Majestic National Ideal Typography */}
      <g transform="translate(250, 310)">
        <text
          x="0"
          y="0"
          fill="#FFFFFF"
          fontFamily="'Montserrat', sans-serif"
          fontWeight="900"
          fontSize="24"
          textAnchor="middle"
          letterSpacing="5"
          filter="url(#frontGlowFilter)"
        >
          NATIONAL IDEAL
        </text>
        <text
          x="0"
          y="26"
          fill="url(#frontGoldAccent)"
          fontFamily="'Montserrat', sans-serif"
          fontWeight="900"
          fontSize="18"
          textAnchor="middle"
          letterSpacing="8"
        >
          COLLEGE
        </text>
        <line x1="-100" y1="42" x2="100" y2="42" stroke="#6D28D9" strokeWidth="2.5" />
        <circle cx="0" cy="42" r="4" fill="#FBBF24" />
      </g>

      {/* Bottom Hem Gold Line */}
      <path d="M130 536 L370 536" stroke="url(#frontGoldAccent)" strokeWidth="4" />
    </svg>
  );
};
