/**
 * ========================================================================
 * SUPERADMIN MASTER CONFIGURATION
 * ========================================================================
 * 
 * Master content aggregator loading directly and exclusively from the
 * /SuperAdmin folder structure:
 * - Website Branding (txt, pic)
 * - Hero Section (txt, pic)
 * - Event Details (txt, pic)
 * - Registration Settings (txt, pic)
 * - Jersey Management (txt, pic)
 * - Jersey Custom Font (txt, pic, and digit folders 0-9)
 * - Banner Management (txt, pic)
 * - Footer Settings (txt, pic)
 * - Asset Manager (txt, pic)
 * - Gallery CMS (txt, pic)
 * 
 * All website components load content strictly from these folders.
 */

// 1. Website Branding
import brandingTxt from './Website Branding/txt/branding.json';
import collegeLogo from './Website Branding/pic/college-logo.png';
import radDayLogo from './Website Branding/pic/rad-day-logo.png';
import faviconPic from './Website Branding/pic/favicon.png';

// 2. Hero Section
import heroTxt from './Hero Section/txt/hero.json';
import heroBackground from './Hero Section/pic/hero-background.jpg';

// 3. Event Details
import eventTxt from './Event Details/txt/event.json';
import eventBanner from './Event Details/pic/event-banner.jpg';

// 4. Registration Settings
import registrationTxt from './Registration Settings/txt/registration.json';

// 5. Jersey Management
import jerseyTxt from './Jersey Management/txt/jersey.json';
import jerseyFront from './Jersey Management/pic/jersey-front.png';
import jerseyBack from './Jersey Management/pic/jerseyback.png';

// 6. Jersey Custom Font & 0-9 Digit Assets
import fontTxt from './Jersey Custom Font/txt/font.json';
import digit0 from './Jersey Custom Font/0/digit-0.svg';
import digit1 from './Jersey Custom Font/1/digit-1.svg';
import digit2 from './Jersey Custom Font/2/digit-2.svg';
import digit3 from './Jersey Custom Font/3/digit-3.svg';
import digit4 from './Jersey Custom Font/4/digit-4.svg';
import digit5 from './Jersey Custom Font/5/digit-5.svg';
import digit6 from './Jersey Custom Font/6/digit-6.svg';
import digit7 from './Jersey Custom Font/7/digit-7.svg';
import digit8 from './Jersey Custom Font/8/digit-8.svg';
import digit9 from './Jersey Custom Font/9/digit-9.svg';

// 7. Banner Management
import bannerTxt from './Banner Management/txt/banner.json';
import bannerMain from './Banner Management/pic/main-banner.jpg';

// 8. Footer Settings
import footerTxt from './Footer Settings/txt/footer.json';
import footerLogo from './Footer Settings/pic/footer-logo.png';

// 9. Asset Manager
import assetTxt from './Asset Manager/txt/assets.json';
import assetLogo from './Asset Manager/pic/college-logo.png';
import assetBanner from './Asset Manager/pic/main-banner.jpg';

// 10. Gallery CMS
import galleryTxt from './Gallery CMS/txt/gallery.json';

// 11. PDF Settings CMS
import pdfTitle from './PDF Settings/txt/title.txt?raw';
import pdfSubtitle from './PDF Settings/txt/subtitle.txt?raw';
import pdfApprovedTitle from './PDF Settings/txt/approved_report_title.txt?raw';
import pdfRejectedTitle from './PDF Settings/txt/rejected_report_title.txt?raw';
import pdfAllTitle from './PDF Settings/txt/all_report_title.txt?raw';
import pdfFooter from './PDF Settings/txt/footer.txt?raw';
import pdfLogo from './PDF Settings/pic/logo.png';
import pdfWatermark from './PDF Settings/pic/watermark.png';

export interface GalleryItemConfig {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: 'Jersey' | 'Campus' | 'Prep' | 'Memories';
  date: string;
}

export const SUPER_ADMIN = {
  websiteBranding: {
    txt: brandingTxt,
    pic: {
      collegeLogo,
      radDayLogo,
      favicon: faviconPic
    }
  },

  heroSection: {
    txt: heroTxt,
    pic: {
      bannerImage: heroBackground
    }
  },

  eventDetails: {
    txt: eventTxt,
    pic: {
      eventBanner
    }
  },

  registrationSettings: {
    txt: registrationTxt,
    pic: {
      paymentQrCode: ''
    }
  },

  jerseyManagement: {
    txt: jerseyTxt,
    pic: {
      frontJersey: jerseyFront,
      backJersey: jerseyBack
    }
  },

  jerseyCustomFont: {
    txt: fontTxt,
    pic: {},
    "0": digit0,
    "1": digit1,
    "2": digit2,
    "3": digit3,
    "4": digit4,
    "5": digit5,
    "6": digit6,
    "7": digit7,
    "8": digit8,
    "9": digit9
  },

  bannerManagement: {
    txt: bannerTxt,
    pic: {
      mainBanner: bannerMain,
      headerBanner: '',
      footerBanner: bannerMain,
      popupBanner: ''
    }
  },

  footerSettings: {
    txt: footerTxt,
    pic: {
      footerLogo
    }
  },

  assetManager: {
    txt: assetTxt,
    pic: {
      collegeLogo: assetLogo,
      radDayLogo,
      favicon: faviconPic,
      bannerImage: assetBanner,
      jerseyFront,
      jerseyBack
    }
  },

  galleryCMS: {
    txt: {
      title: galleryTxt.title,
      badge: galleryTxt.badge,
      subtitle: galleryTxt.subtitle,
      categories: galleryTxt.categories
    },
    pic: {
      items: galleryTxt.items as GalleryItemConfig[]
    }
  },

  pdfSettings: {
    txt: {
      title: pdfTitle.trim() || 'National Ideal College',
      subtitle: pdfSubtitle.trim() || 'RAD Day HSC 27',
      approvedReportTitle: pdfApprovedTitle.trim() || 'Approved Student Report',
      rejectedReportTitle: pdfRejectedTitle.trim() || 'Rejected Student Report',
      allReportTitle: pdfAllTitle.trim() || 'All Registration Report',
      footer: pdfFooter.trim() || 'Generated From RAD Day Registration System'
    },
    pic: {
      logo: pdfLogo,
      watermark: pdfWatermark
    }
  }
};

// Simple lightweight subscriber hook for dynamic updates
const listeners: (() => void)[] = [];

export function subscribeSuperAdmin(callback: () => void): () => void {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

export default SUPER_ADMIN;
