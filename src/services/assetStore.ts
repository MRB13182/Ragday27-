import { AssetUrls, EventSettings, GalleryItem, StudentRegistration } from '../types';
import { websiteContent } from '../admin-file';

// College Logo SVG
export const DEFAULT_COLLEGE_LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2E1065"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E1B4B"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Shield Outer Border -->
  <path d="M80 8 L142 32 V88 C142 124 115 148 80 156 C45 148 18 124 18 88 V32 Z" fill="url(#purpleGrad)" stroke="url(#goldGrad)" stroke-width="4" filter="url(#glow)" />
  <!-- Inner Shield Inset -->
  <path d="M80 18 L132 38 V86 C132 116 110 136 80 144 C50 136 28 116 28 86 V38 Z" fill="#0B0914" stroke="#FBBF24" stroke-width="1.5" stroke-opacity="0.6"/>
  <!-- Laurel Wreath -->
  <path d="M42 96 C36 80 44 58 54 48 C50 62 58 74 64 80" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M118 96 C124 80 116 58 106 48 C110 62 102 74 96 80" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <!-- Center Emblem: Torch & Open Book -->
  <path d="M80 46 L76 72 H84 Z" fill="url(#goldGrad)" />
  <path d="M80 34 C74 40 86 44 80 48 C86 42 74 38 80 34 Z" fill="#EF4444" />
  <!-- Open Book -->
  <path d="M60 84 Q80 78 80 94 Q80 78 100 84 Q80 88 80 102 Q80 88 60 84 Z" fill="url(#goldGrad)" />
  <!-- Star / Year -->
  <circle cx="80" cy="116" r="3" fill="#FBBF24"/>
  <text x="80" y="132" fill="#FBBF24" font-family="'Montserrat', sans-serif" font-size="10" font-weight="900" text-anchor="middle" letter-spacing="1.5">NIC</text>
</svg>
`)}`;

// Front Jersey SVG Artwork
export const DEFAULT_JERSEY_FRONT = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" fill="none">
  <defs>
    <linearGradient id="jDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180c2e"/>
      <stop offset="40%" stop-color="#0c0717"/>
      <stop offset="100%" stop-color="#1b0e35"/>
    </linearGradient>
    <linearGradient id="jPurple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9333EA"/>
      <stop offset="50%" stop-color="#6D28D9"/>
      <stop offset="100%" stop-color="#4C1D95"/>
    </linearGradient>
    <linearGradient id="jGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="50%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <filter id="neon" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Jersey Torso Silhouette -->
  <path d="M160 50 L110 90 L30 160 L65 240 L120 205 L130 540 L370 540 L380 205 L435 240 L470 160 L390 90 L340 50 C310 85 190 85 160 50 Z" fill="url(#jDark)" stroke="#4C1D95" stroke-width="3" />

  <!-- Collar Gold Trim -->
  <path d="M160 50 C190 85 310 85 340 50 L328 65 C300 96 200 96 172 65 Z" fill="url(#jGold)" />
  <path d="M210 82 L250 115 L290 82" stroke="url(#jGold)" stroke-width="3" fill="none"/>

  <!-- Left Sleeve Trim & Badge -->
  <path d="M30 160 L65 240 L72 234 L38 155 Z" fill="url(#jGold)" />
  <rect x="42" y="180" width="18" height="24" rx="3" fill="#6D28D9" stroke="#FBBF24" stroke-width="1.5" />
  <text x="51" y="196" fill="#FBBF24" font-family="'Russo One', sans-serif" font-size="10" text-anchor="middle">27</text>

  <!-- Right Sleeve Trim & Badge -->
  <path d="M470 160 L435 240 L428 234 L462 155 Z" fill="url(#jGold)" />
  <rect x="440" y="180" width="18" height="24" rx="3" fill="#6D28D9" stroke="#FBBF24" stroke-width="1.5" />
  <text x="449" y="196" fill="#FBBF24" font-family="'Russo One', sans-serif" font-size="10" text-anchor="middle">27</text>

  <!-- Dynamic Purple Geometric Lightning / Shatter Shards -->
  <!-- Left Side Shards -->
  <polygon points="125,210 180,300 130,420 100,250" fill="url(#jPurple)" opacity="0.8" />
  <polygon points="140,280 210,380 150,510 135,390" fill="#7C3AED" opacity="0.9" />
  <polygon points="170,360 220,440 180,530" fill="#C084FC" opacity="0.7" />

  <!-- Right Side Shards -->
  <polygon points="375,210 320,300 370,420 400,250" fill="url(#jPurple)" opacity="0.8" />
  <polygon points="360,280 290,380 350,510 365,390" fill="#7C3AED" opacity="0.9" />
  <polygon points="330,360 280,440 320,530" fill="#C084FC" opacity="0.7" />

  <!-- Center Energy Streaks -->
  <path d="M250 180 L235 270 L265 310 L245 420 L255 530" stroke="#A855F7" stroke-width="3" stroke-linecap="round" opacity="0.7" />
  <polygon points="210,480 250,420 290,480 250,540" fill="#4C1D95" opacity="0.6"/>

  <!-- Left Chest: NIC Small Crest -->
  <g transform="translate(180, 160) scale(0.35)">
    <path d="M80 8 L142 32 V88 C142 124 115 148 80 156 C45 148 18 124 18 88 V32 Z" fill="#1E1B4B" stroke="#FBBF24" stroke-width="6"/>
    <text x="80" y="95" fill="#FBBF24" font-family="'Russo One', sans-serif" font-size="44" font-weight="900" text-anchor="middle">NIC</text>
  </g>

  <!-- Right Chest: "NiC" Script -->
  <text x="315" y="195" fill="#FFFFFF" font-family="'Montserrat', sans-serif" font-weight="800" font-size="22" letter-spacing="1">NiC</text>
  <circle cx="340" cy="180" r="3" fill="#FBBF24" />

  <!-- Center Big Chest Branding: "NIC HSC 27" -->
  <g transform="translate(250, 310)">
    <!-- NIC in White Bold Display with Gold & Purple shadow -->
    <text x="0" y="0" fill="#FFFFFF" font-family="'Montserrat', sans-serif" font-weight="900" font-size="58" text-anchor="middle" letter-spacing="4" filter="url(#neon)">NIC</text>
    <path d="M-80 14 L80 14" stroke="url(#jGold)" stroke-width="3" stroke-linecap="round" />
    <text x="0" y="44" fill="url(#jGold)" font-family="'Russo One', sans-serif" font-weight="900" font-size="34" text-anchor="middle" letter-spacing="3">HSC 27</text>
  </g>

  <!-- Bottom Hemline Accent -->
  <path d="M130 535 L370 535" stroke="url(#jGold)" stroke-width="4" />
</svg>
`)}`;

// Back Jersey SVG Artwork (Official)
export const DEFAULT_JERSEY_BACK = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" fill="none">
  <defs>
    <linearGradient id="jbDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#140a26"/>
      <stop offset="50%" stop-color="#0a0514"/>
      <stop offset="100%" stop-color="#160c2b"/>
    </linearGradient>
    <linearGradient id="jbPurple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9333EA"/>
      <stop offset="50%" stop-color="#6D28D9"/>
      <stop offset="100%" stop-color="#3B0764"/>
    </linearGradient>
    <linearGradient id="jbGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="50%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <filter id="bglow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Jersey Torso Silhouette -->
  <path d="M160 50 L110 90 L30 160 L65 240 L120 205 L130 540 L370 540 L380 205 L435 240 L470 160 L390 90 L340 50 C300 70 200 70 160 50 Z" fill="url(#jbDark)" stroke="#4C1D95" stroke-width="3" />

  <!-- Collar Back Trim -->
  <path d="M160 50 C200 70 300 70 340 50 L330 64 C295 82 205 82 170 64 Z" fill="url(#jbGold)" />

  <!-- Sleeves Gold Trim & 27 Badges -->
  <path d="M30 160 L65 240 L72 234 L38 155 Z" fill="url(#jbGold)" />
  <rect x="42" y="180" width="18" height="24" rx="3" fill="#6D28D9" stroke="#FBBF24" stroke-width="1.5" />
  <text x="51" y="196" fill="#FBBF24" font-family="'Russo One', sans-serif" font-size="10" text-anchor="middle">27</text>

  <path d="M470 160 L435 240 L428 234 L462 155 Z" fill="url(#jbGold)" />
  <rect x="440" y="180" width="18" height="24" rx="3" fill="#6D28D9" stroke="#FBBF24" stroke-width="1.5" />
  <text x="449" y="196" fill="#FBBF24" font-family="'Russo One', sans-serif" font-size="10" text-anchor="middle">27</text>

  <!-- Dynamic Geometric Crystals Bottom/Sides -->
  <polygon points="125,260 170,360 130,490 100,320" fill="url(#jbPurple)" opacity="0.85" />
  <polygon points="140,380 200,470 150,535 135,460" fill="#7C3AED" opacity="0.9" />

  <polygon points="375,260 330,360 370,490 400,320" fill="url(#jbPurple)" opacity="0.85" />
  <polygon points="360,380 300,470 350,535 365,460" fill="#7C3AED" opacity="0.9" />

  <!-- Gold Crown Icon Above Name -->
  <g transform="translate(250, 150) scale(1.1)">
    <path d="M-22 0 L-28 -22 L-10 -10 L0 -26 L10 -10 L28 -22 L22 0 Z" fill="none" stroke="url(#jbGold)" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="-28" cy="-22" r="2.5" fill="#FBBF24"/>
    <circle cx="0" cy="-26" r="3" fill="#FBBF24"/>
    <circle cx="28" cy="-22" r="2.5" fill="#FBBF24"/>
  </g>

  <!-- Name Placeholder (Dynamic in runtime) -->
  <text id="jerseyNameSvg" x="250" y="210" fill="#FFFFFF" font-family="'Montserrat', sans-serif" font-weight="900" font-size="34" text-anchor="middle" letter-spacing="4">YOUR NAME</text>

  <!-- Big Athletic Number -->
  <text id="jerseyNumberSvg" x="250" y="380" fill="#FFFFFF" font-family="'Teko', sans-serif" font-weight="700" font-size="190" text-anchor="middle" letter-spacing="4" filter="url(#bglow)">10</text>

  <!-- Bottom Hem Accent -->
  <path d="M130 535 L370 535" stroke="url(#jbGold)" stroke-width="4" />
</svg>
`)}`;

import { allocateNextRegistrationNumber } from '../utils/registrationNumber';

// Initial Mock Registrations
export const INITIAL_REGISTRATIONS: StudentRegistration[] = [
  {
    id: 'REG-1001',
    fullName: 'Arifur Rahman Tanvir',
    roll: '10214',
    section: 'ScB2',
    group: 'Science',
    className: 'HSC 2027',
    gender: 'Male',
    contactNumber: '01711223344',
    registrationNo: 'RD27-001',
    studentId: 'NIC-27-014',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    paymentMethod: 'Bkash',
    sendMoneyNumber: '01712345678',
    amount: 1050,
    transactionId: 'BKS98741253',
    senderNumber: '01711223344',
    jerseySize: 'L',
    jerseyName: 'TANVIR',
    jerseyNumber: '07',
    status: 'Verified',
    createdAt: '2024-02-01 11:24 AM'
  },
  {
    id: 'REG-1002',
    fullName: 'Nusrat Jahan Borshon',
    roll: '10105',
    section: 'ScG1',
    group: 'Science',
    className: 'HSC 2027',
    gender: 'Female',
    contactNumber: '01899887766',
    registrationNo: 'RD27-002',
    studentId: 'NIC-27-005',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    paymentMethod: 'Bkash',
    sendMoneyNumber: '01712345678',
    amount: 1050,
    transactionId: 'BKS45812904',
    senderNumber: '01899887766',
    jerseySize: 'M',
    jerseyName: 'BORSHON',
    jerseyNumber: '10',
    status: 'Approved',
    createdAt: '2024-02-02 02:40 PM'
  },
  {
    id: 'REG-1003',
    fullName: 'Siam Ahmed',
    roll: '10352',
    section: 'BsB1',
    group: 'Commerce',
    className: 'HSC 2027',
    gender: 'Male',
    contactNumber: '01911445566',
    registrationNo: 'RD27-003',
    studentId: 'NIC-27-152',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    paymentMethod: 'Nagad',
    sendMoneyNumber: '01712345678',
    amount: 1100,
    transactionId: 'NGD39485712',
    senderNumber: '01911445566',
    jerseySize: '4XL',
    jerseyName: 'SIAM',
    jerseyNumber: '99',
    status: 'Pending',
    createdAt: '2024-02-04 05:15 PM'
  },
  {
    id: 'REG-1004',
    fullName: 'Tahmid Hasan Mahir',
    roll: '10419',
    section: 'HuB1',
    group: 'Humanities',
    className: 'HSC 2027',
    gender: 'Male',
    contactNumber: '01622334455',
    registrationNo: 'RD27-004',
    studentId: 'NIC-27-219',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    paymentMethod: 'Bkash',
    sendMoneyNumber: '01712345678',
    amount: 1050,
    transactionId: 'BKS67123490',
    senderNumber: '01622334455',
    jerseySize: 'XL',
    jerseyName: 'MAHIR',
    jerseyNumber: '11',
    status: 'Approved',
    createdAt: '2024-02-05 09:30 AM'
  },
  {
    id: 'REG-1005',
    fullName: 'Sadia Afreen Ritu',
    roll: '10288',
    section: 'ScG2',
    group: 'Science',
    className: 'HSC 2027',
    gender: 'Female',
    contactNumber: '01533445566',
    registrationNo: 'RD27-005',
    studentId: 'NIC-27-088',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    paymentMethod: 'Bkash',
    sendMoneyNumber: '01712345678',
    amount: 1050,
    transactionId: 'BKS12498765',
    senderNumber: '01533445566',
    jerseySize: 'S',
    jerseyName: 'RITU',
    jerseyNumber: '03',
    status: 'Approved',
    createdAt: '2024-02-06 01:10 PM'
  }
];

// Initial Gallery Items
export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Official RAD Day 27 Jersey Reveal',
    category: 'Jersey',
    imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
    caption: 'The purple, black, and gold royal jersey edition designed for HSC 27.',
    date: 'February 2024'
  },
  {
    id: 'g-2',
    title: 'National Ideal College Main Campus Quad',
    category: 'Campus',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    caption: 'Where all our unforgettable memories and friendships started.',
    date: 'January 2024'
  },
  {
    id: 'g-3',
    title: 'Stage & Lighting Setup Teaser',
    category: 'Prep',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    caption: 'Preparing the cinematic stage with royal purple spotlights and acoustic amps.',
    date: 'February 2024'
  },
  {
    id: 'g-4',
    title: 'HSC 27 Committee Planning Session',
    category: 'Prep',
    imageUrl: 'https://images.unsplash.com/photo-1522071823990-2ff6eb823b12?w=800&auto=format&fit=crop&q=80',
    caption: 'Organizing the grandest batch celebration in NIC history.',
    date: 'January 2024'
  },
  {
    id: 'g-5',
    title: 'Batch Group Photo Session',
    category: 'Memories',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    caption: 'Same people, different destinations. Memories never fade.',
    date: 'February 2024'
  },
  {
    id: 'g-6',
    title: 'Concert & Celebration Rehearsal',
    category: 'Memories',
    imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&auto=format&fit=crop&q=80',
    caption: 'Electrifying music, flashmobs, and batch anthems in the making.',
    date: 'February 2024'
  }
];

// Initial Event Settings
export const DEFAULT_EVENT_SETTINGS: EventSettings = {
  collegeName: websiteContent.college_name || 'National Ideal College',
  batchName: websiteContent.batch_name || 'HSC Batch 2027',
  eventDate: websiteContent.event_date || '27 February 2024',
  eventTime: websiteContent.event_time || '10:00 AM - 5:00 PM',
  venue: websiteContent.event_venue || 'NIC Campus',
  targetCountdownDate: '2024-02-27T10:00:00',
  bkashNumber: '01712345678',
  nagadNumber: '01812345678',
  rocketNumber: '01912345678',
  baseFee: 1050,
  extraCharge4XL: 50,
  bannerTagline: websiteContent.hero_middle_text || 'MEMORIES NEVER FADE',
  quoteSpark: 'START WITH A SPARK',
  quoteMark: 'END WITH A MARK',
  destinationsQuote: websiteContent.hero_bottom_text || 'Same People Different Destinations'
};

// Initial Asset URLs
export const DEFAULT_ASSET_URLS: AssetUrls = {
  collegeLogo: websiteContent.logo_college || '/logo/college-logo.png',
  radDayLogo: websiteContent.logo_rad_day || '/logo/rad-day-logo.png',
  bannerArtwork: websiteContent.banner_image || '/banner/main-banner.jpg',
  jerseyFront: websiteContent.jersey_front || '/jersey/jersey-front.png',
  jerseyBack: websiteContent.jersey_back || '/jersey/jersey-back.png',
  jerseyMockup: websiteContent.jersey_front || '/jersey/jersey-front.png',
  fontJersey: 'JerseyFont',
  fontNumber: 'NumberFont'
};

// Reactive Asset & Data Store
class CentralizedStore {
  private assets: AssetUrls;
  private settings: EventSettings;
  private registrations: StudentRegistration[];
  private gallery: GalleryItem[];
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Load from localStorage or defaults
    const savedAssets = localStorage.getItem('nic_rad27_assets');
    const savedSettings = localStorage.getItem('nic_rad27_settings');
    const savedRegistrations = localStorage.getItem('nic_rad27_registrations');
    const savedGallery = localStorage.getItem('nic_rad27_gallery');

    this.assets = {
      ...DEFAULT_ASSET_URLS,
      ...(savedAssets ? JSON.parse(savedAssets) : {}),
      collegeLogo: websiteContent.logo_college || DEFAULT_ASSET_URLS.collegeLogo,
      radDayLogo: websiteContent.logo_rad_day || DEFAULT_ASSET_URLS.radDayLogo,
      bannerArtwork: websiteContent.banner_image || DEFAULT_ASSET_URLS.bannerArtwork
    };
    this.settings = {
      ...DEFAULT_EVENT_SETTINGS,
      ...(savedSettings ? JSON.parse(savedSettings) : {}),
      collegeName: websiteContent.college_name || DEFAULT_EVENT_SETTINGS.collegeName,
      batchName: websiteContent.batch_name || DEFAULT_EVENT_SETTINGS.batchName,
      bannerTagline: websiteContent.hero_middle_text || DEFAULT_EVENT_SETTINGS.bannerTagline,
      destinationsQuote: websiteContent.hero_bottom_text || DEFAULT_EVENT_SETTINGS.destinationsQuote
    };
    this.registrations = savedRegistrations ? JSON.parse(savedRegistrations) : INITIAL_REGISTRATIONS;
    this.gallery = savedGallery ? JSON.parse(savedGallery) : INITIAL_GALLERY;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // Getters
  public getAssets(): AssetUrls {
    return this.assets;
  }

  public getSettings(): EventSettings {
    return this.settings;
  }

  public getRegistrations(): StudentRegistration[] {
    return this.registrations;
  }

  public getGallery(): GalleryItem[] {
    return this.gallery;
  }

  // Setters
  public updateAssets(newAssets: Partial<AssetUrls>) {
    this.assets = { ...this.assets, ...newAssets };
    localStorage.setItem('nic_rad27_assets', JSON.stringify(this.assets));
    this.notify();
  }

  public updateSettings(newSettings: Partial<EventSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('nic_rad27_settings', JSON.stringify(this.settings));
    this.notify();
  }

  public addRegistration(reg: Omit<StudentRegistration, 'id' | 'createdAt' | 'status'>): StudentRegistration {
    let finalRegNo = reg.registrationNo;
    if (!finalRegNo || !finalRegNo.startsWith('RD27-') || finalRegNo === 'RD27-' || finalRegNo.includes('Auto')) {
      finalRegNo = allocateNextRegistrationNumber(this.registrations);
    } else {
      // Record assigned sequence to prevent reuse
      allocateNextRegistrationNumber([...this.registrations, { ...reg, registrationNo: finalRegNo } as any]);
    }

    const newReg: StudentRegistration = {
      ...reg,
      id: `REG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      registrationNo: finalRegNo,
      status: 'Pending',
      createdAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    };
    this.registrations = [newReg, ...this.registrations];
    localStorage.setItem('nic_rad27_registrations', JSON.stringify(this.registrations));
    this.notify();
    return newReg;
  }

  public updateRegistration(id: string, updated: Partial<StudentRegistration>) {
    this.registrations = this.registrations.map(r => (r.id === id ? { ...r, ...updated } : r));
    localStorage.setItem('nic_rad27_registrations', JSON.stringify(this.registrations));
    this.notify();
  }

  public deleteRegistration(id: string) {
    this.registrations = this.registrations.filter(r => r.id !== id);
    localStorage.setItem('nic_rad27_registrations', JSON.stringify(this.registrations));
    this.notify();
  }

  public addGalleryItem(item: Omit<GalleryItem, 'id' | 'date'>) {
    const newItem: GalleryItem = {
      ...item,
      id: `g-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    this.gallery = [newItem, ...this.gallery];
    localStorage.setItem('nic_rad27_gallery', JSON.stringify(this.gallery));
    this.notify();
  }

  public deleteGalleryItem(id: string) {
    this.gallery = this.gallery.filter(g => g.id !== id);
    localStorage.setItem('nic_rad27_gallery', JSON.stringify(this.gallery));
    this.notify();
  }

  public resetToDefaults() {
    this.assets = { ...DEFAULT_ASSET_URLS };
    this.settings = { ...DEFAULT_EVENT_SETTINGS };
    this.registrations = [...INITIAL_REGISTRATIONS];
    this.gallery = [...INITIAL_GALLERY];
    localStorage.removeItem('nic_rad27_assets');
    localStorage.removeItem('nic_rad27_settings');
    localStorage.removeItem('nic_rad27_registrations');
    localStorage.removeItem('nic_rad27_gallery');
    this.notify();
  }
}

export const centralizedStore = new CentralizedStore();
