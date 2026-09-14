/**
 * ========================================================================
 * MASTER SUPER ADMIN CONFIGURATION FILE
 * ========================================================================
 * 
 * THIS IS THE SINGLE MASTER SOURCE OF TRUTH FOR ALL WEBSITE CONTENT.
 * Edit any text or picture path below to instantly update the entire website.
 * 
 * Directory paths:
 * - Logos:   /logo/
 * - Banners: /banner/
 * - Jersey:  /jersey/
 * - Fonts:   /fonts/
 */

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
    txt: {
      collegeName: "National Ideal College",
      collegeShortName: "NIC",
      batchName: "HSC Batch 2027",
      batchShort: "HSC 27",
      eventTitle: "RAG DAY",
      tagline: "MEMORIES NEVER FADE",
      navHome: "Home",
      navStudentList: "Student List",
      navGallery: "Gallery",
      navRegisterBtn: "Register Now"
    },
    pic: {
      collegeLogo: "/logo/college-logo.png",
      radDayLogo: "/logo/rad-day-logo.png",
      favicon: "/logo/favicon.png"
    }
  },

  heroSection: {
    txt: {
      badge: "Last Chapter → Brighter Tomorrow",
      title: "RAG DAY",
      subtitle: "HSC 27",
      collegeName: "National Ideal College",
      slogan: "MEMORIES NEVER FADE",
      calligraphyLeft: "Last Chapter → Brighter Tomorrow",
      calligraphyRight: "Same People Different Destinations",
      ctaRegister: "Register Now",
      ctaCheckList: "Check Registration"
    },
    pic: {
      bannerImage: "/banner/main-banner.jpg"
    }
  },

  eventDetails: {
    txt: {
      dateLabel: "Date",
      eventDate: "01 February 2027",
      timeLabel: "Time",
      eventTime: "10:00 AM - 5:00 PM",
      venueLabel: "Venue",
      eventVenue: "NIC Campus",
      targetCountdownDate: "2027-02-01T10:00:00",
      countdownBadge: "COUNTDOWN TO RAG DAY HSC 27",
      countdownTitle: "THE GRAND CELEBRATION AWAITS",
      countdownSubtitle: "NIC Campus • Dhaka"
    },
    pic: {}
  },

  registrationSettings: {
    txt: {
      formTitle: "STUDENT REGISTRATION",
      formSubtitle: "National Ideal College • HSC Batch 2027",
      baseFee: 2000,
      extraCharge4XL: 100,
      currency: "৳",
      bkashNumber: "01813182885",
      bkashType: "Personal",
      nagadNumber: "01813182885",
      nagadType: "Personal",
      rocketNumber: "01813182885",
      rocketType: "Personal",
      instructionTitle: "Payment Instructions",
      instructionSteps: "1. Send Money (Personal) to any number above\n2. Note your Transaction ID (TrxID)\n3. Enter Transaction ID and Sender Number below",
      successTitle: "Registration Submitted Successfully!",
      successMessage: "Your registration has been submitted and is pending verification. Please save your registration number and slip.",
      adminAccessCode: "Admin.rgnic27",
      adminPanelTitle: "Admin Panel — Registration Management"
    },
    pic: {
      paymentQrCode: ""
    }
  },

  jerseyManagement: {
    txt: {
      sectionTitle: "JERSEY DESIGN",
      sectionSubtitle: "Official HSC 27 Jersey • Live Custom Font Preview",
      quoteLine1: "Start With A Spark",
      quoteLine2: "End With A Mark",
      frontLabel: "Front View",
      backLabel: "Back View",
      defaultName: "YOUR NAME",
      defaultNumber: "27",
      badgeText: "27",
      availableSizes: ["S", "M", "L", "XL", "XXL", "3XL", "4XL"]
    },
    pic: {
      frontJersey: "/jersey/jersey-front.png",
      backJersey: "/jersey/jersey-back.png"
    }
  },

  jerseyCustomFont: {
    txt: {
      fontJersey: "/fonts/jersey-font.ttf",
      fontNumber: "/fonts/number-font.ttf",
      fontHeading: "/fonts/heading-font.ttf",
      fontBody: "/fonts/body-font.ttf",
      numberFontFamily: "'Teko', 'Russo One', sans-serif",
      nameFontFamily: "'Montserrat', sans-serif"
    },
    pic: {},

    "0": "",
    "1": "",
    "2": "",
    "3": "",
    "4": "",
    "5": "",
    "6": "",
    "7": "",
    "8": "",
    "9": ""
  },

  bannerManagement: {
    txt: {
      mainBannerTitle: "RAG DAY HSC 27 Main Celebration",
      mainBannerSubtitle: "National Ideal College"
    },
    pic: {
      mainBanner: "/banner/main-banner.jpg",
      headerBanner: "",
      footerBanner: "/banner/main-banner.jpg",
      popupBanner: ""
    }
  },

  footerSettings: {
    txt: {
      collegeName: "National Ideal College",
      batchName: "HSC Batch 2027",
      quote: "Same People Different Destinations",
      copyright: "© 2027 National Ideal College - RAG Day HSC 27. All rights reserved.",
      contactEmail: "contact@nicradday27.com",
      contactPhone: "+880 1813-182885",
      address: "NIC Campus, Khilgaon, Dhaka",
      facebookLink: "https://facebook.com",
      instagramLink: "https://instagram.com",
      youtubeLink: "https://youtube.com",
      adminLabel: "Admin"
    },
    pic: {
      footerLogo: "/logo/college-logo.png"
    }
  },

  assetManager: {
    txt: {
      collegeShort: "NIC",
      collegeFullName: "National Ideal College"
    },
    pic: {
      collegeLogo: "/logo/college-logo.png",
      radDayLogo: "/logo/rad-day-logo.png",
      favicon: "/logo/favicon.png",
      bannerImage: "/banner/main-banner.jpg",
      jerseyFront: "/jersey/jersey-front.png",
      jerseyBack: "/jersey/jersey-back.png"
    }
  },

  galleryCMS: {
    txt: {
      title: "MOMENTS & EXHIBITS",
      badge: "RAG DAY HSC 27 MEMORIES",
      subtitle: "Relive the journey from classroom benches to the grand stage. The official collection of National Ideal College HSC 27.",
      categories: ["All", "Jersey", "Campus", "Prep", "Memories"]
    },
    pic: {
      items: [
        {
          id: "gal-1",
          title: "Official HSC 27 Jersey Reveal",
          caption: "The grand unveiling of our custom designed purple and gold athletic jersey.",
          imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&auto=format&fit=crop&q=80",
          category: "Jersey",
          date: "15 Jan 2027"
        },
        {
          id: "gal-2",
          title: "Batch Photo Sessions",
          caption: "Capturing smiles that will stay timeless long after graduation.",
          imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1000&auto=format&fit=crop&q=80",
          category: "Memories",
          date: "Dec 2023"
        },
        {
          id: "gal-3",
          title: "Farewell Rehearsal",
          caption: "Cultural performances, singing, and speech rehearsals.",
          imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&auto=format&fit=crop&q=80",
          category: "Prep",
          date: "Feb 2024"
        }
      ] as GalleryItemConfig[]
    }
  }

};

// Hydrate from localStorage if custom overrides were saved in browser
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('SUPER_ADMIN_CUSTOM_CONFIG');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(SUPER_ADMIN, parsed);
    }
  } catch (e) {
    console.warn('Could not hydrate SUPER_ADMIN from localStorage', e);
  }
}

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

export function updateSuperAdmin(updater: (current: typeof SUPER_ADMIN) => void): void {
  updater(SUPER_ADMIN);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('SUPER_ADMIN_CUSTOM_CONFIG', JSON.stringify(SUPER_ADMIN));
    } catch {}
  }
  listeners.forEach(fn => fn());
}

