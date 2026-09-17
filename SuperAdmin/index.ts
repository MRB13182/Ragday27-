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
import jerseyFront from './Jersey Management/pic/jersey.png';
import jerseyBack from './Jersey Management/pic/jersey-back.png';

// 6. Jersey Custom Font & 0-9 Digit & A-Z Alphabet Assets
import fontTxt from './Jersey Custom Font/txt/font.json';
import num0 from './Jersey Custom Font/0.png';
import num1 from './Jersey Custom Font/1.png';
import num2 from './Jersey Custom Font/2.png';
import num3 from './Jersey Custom Font/3.png';
import num4 from './Jersey Custom Font/4.png';
import num5 from './Jersey Custom Font/5.png';
import num6 from './Jersey Custom Font/6.png';
import num7 from './Jersey Custom Font/7.png';
import num8 from './Jersey Custom Font/8.png';
import num9 from './Jersey Custom Font/9.png';

import charA from './Jersey Custom Font/A.png';
import charB from './Jersey Custom Font/B.png';
import charC from './Jersey Custom Font/C.png';
import charD from './Jersey Custom Font/D.png';
import charE from './Jersey Custom Font/E.png';
import charF from './Jersey Custom Font/F.png';
import charG from './Jersey Custom Font/G.png';
import charH from './Jersey Custom Font/H.png';
import charI from './Jersey Custom Font/I.png';
import charJ from './Jersey Custom Font/J.png';
import charK from './Jersey Custom Font/K.png';
import charL from './Jersey Custom Font/L.png';
import charM from './Jersey Custom Font/M.png';
import charN from './Jersey Custom Font/N.png';
import charO from './Jersey Custom Font/O.png';
import charP from './Jersey Custom Font/P.png';
import charQ from './Jersey Custom Font/Q.png';
import charR from './Jersey Custom Font/R.png';
import charS from './Jersey Custom Font/S.png';
import charT from './Jersey Custom Font/T.png';
import charU from './Jersey Custom Font/U.png';
import charV from './Jersey Custom Font/V.png';
import charW from './Jersey Custom Font/W.png';
import charX from './Jersey Custom Font/X.png';
import charY from './Jersey Custom Font/Y.png';
import charZ from './Jersey Custom Font/Z.png';

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
    "0": num0,
    "1": num1,
    "2": num2,
    "3": num3,
    "4": num4,
    "5": num5,
    "6": num6,
    "7": num7,
    "8": num8,
    "9": num9,
    "A": charA,
    "B": charB,
    "C": charC,
    "D": charD,
    "E": charE,
    "F": charF,
    "G": charG,
    "H": charH,
    "I": charI,
    "J": charJ,
    "K": charK,
    "L": charL,
    "M": charM,
    "N": charN,
    "O": charO,
    "P": charP,
    "Q": charQ,
    "R": charR,
    "S": charS,
    "T": charT,
    "U": charU,
    "V": charV,
    "W": charW,
    "X": charX,
    "Y": charY,
    "Z": charZ
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
