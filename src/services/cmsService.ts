import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface SiteSettings {
  id?: string;
  college_name: string;
  batch_name: string;
  event_date: string;
  event_time: string;
  event_venue: string;
  hero_top_quote: string;
  hero_title: string;
  hero_subtitle: string;
  hero_tagline: string;
  quote_spark: string;
  quote_mark: string;
  footer_quote: string;
  copyright_text: string;
}

export interface SiteAssets {
  id?: string;
  college_logo: string;
  header_logo: string;
  footer_logo: string;
  favicon: string;
  jersey_front: string;
  jersey_back: string;
}

export interface JerseyFonts {
  font_0: string;
  font_1: string;
  font_2: string;
  font_3: string;
  font_4: string;
  font_5: string;
  font_6: string;
  font_7: string;
  font_8: string;
  font_9: string;
}

export interface WebsiteBanners {
  id?: string;
  rad_day_main_banner: string;
  quote_banner: string;
  motivation_banner: string;
  footer_banner: string;
}

export interface SocialLinks {
  id?: string;
  facebook_link: string;
  instagram_link: string;
  youtube_link: string;
}

export interface RegistrationSettings {
  id?: string;
  registration_fee: number;
  extra_charge_4xl: number;
  payment_number: string;
  nagad_number: string;
  payment_instructions: string;
  is_open: boolean;
}

export interface CompleteCmsState {
  settings: SiteSettings;
  assets: SiteAssets;
  fonts: JerseyFonts;
  banners: WebsiteBanners;
  socials: SocialLinks;
  registration: RegistrationSettings;
}

// Helper to generate athletic SVG font digit image
export function generateDefaultDigitSvg(digit: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 180" fill="none">
    <defs>
      <linearGradient id="g_${digit}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="60%" stop-color="#F3E8FF" />
        <stop offset="100%" stop-color="#E9D5FF" />
      </linearGradient>
      <filter id="f_${digit}" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#581C87" flood-opacity="0.8"/>
      </filter>
    </defs>
    <text x="60" y="145" 
      fill="url(#g_${digit})" 
      stroke="#FBBF24" 
      stroke-width="3" 
      stroke-linejoin="round"
      font-family="'Russo One', 'Impact', sans-serif" 
      font-weight="900" 
      font-size="160" 
      text-anchor="middle"
      filter="url(#f_${digit})">${digit}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Initial Default Values
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'current',
  college_name: 'National Ideal College',
  batch_name: 'HSC Batch 2027',
  event_date: '27 February 2024',
  event_time: '10:00 AM - 5:00 PM',
  event_venue: 'NIC Campus',
  hero_top_quote: 'Last Chapter → Brighter Tomorrow',
  hero_title: 'RAD DAY',
  hero_subtitle: 'HSC 27',
  hero_tagline: 'MEMORIES NEVER FADE',
  quote_spark: 'Start With A Spark',
  quote_mark: 'End With A Mark',
  footer_quote: 'Same People Different Destinations',
  copyright_text: 'National Ideal College • HSC Batch 2027 • All Rights Reserved'
};

export const DEFAULT_SITE_ASSETS: SiteAssets = {
  id: 'current',
  college_logo: '/logo/college-logo.png',
  header_logo: '/logo/college-logo.png',
  footer_logo: '/logo/college-logo.png',
  favicon: '/logo/favicon.png',
  jersey_front: '/jersey/jersey-front.png',
  jersey_back: '/jersey/jersey-back.png'
};

export const DEFAULT_JERSEY_FONTS: JerseyFonts = {
  font_0: generateDefaultDigitSvg('0'),
  font_1: generateDefaultDigitSvg('1'),
  font_2: generateDefaultDigitSvg('2'),
  font_3: generateDefaultDigitSvg('3'),
  font_4: generateDefaultDigitSvg('4'),
  font_5: generateDefaultDigitSvg('5'),
  font_6: generateDefaultDigitSvg('6'),
  font_7: generateDefaultDigitSvg('7'),
  font_8: generateDefaultDigitSvg('8'),
  font_9: generateDefaultDigitSvg('9')
};

export const DEFAULT_WEBSITE_BANNERS: WebsiteBanners = {
  id: 'current',
  rad_day_main_banner: '/banner/main-banner.jpg',
  quote_banner: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200&auto=format&fit=crop&q=80',
  motivation_banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
  footer_banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80'
};

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  id: 'current',
  facebook_link: 'https://facebook.com',
  instagram_link: 'https://instagram.com',
  youtube_link: 'https://youtube.com'
};

export const DEFAULT_REGISTRATION_SETTINGS: RegistrationSettings = {
  id: 'current',
  registration_fee: 1050,
  extra_charge_4xl: 50,
  payment_number: '01712345678',
  nagad_number: '01812345678',
  payment_instructions: 'Send Money (Personal) to the official bKash or Nagad number above. Keep your Transaction ID ready.',
  is_open: true
};

// Central CMS Store
class CmsStore {
  private state: CompleteCmsState;
  private listeners: Set<() => void> = new Set();
  private isLoadedFromSupabase = false;

  constructor() {
    this.state = this.loadFromStorage();
  }

  private loadFromStorage(): CompleteCmsState {
    const get = (key: string, fallback: any) => {
      try {
        const item = localStorage.getItem(key);
        return item ? { ...fallback, ...JSON.parse(item) } : fallback;
      } catch {
        return fallback;
      }
    };

    return {
      settings: get('cms_site_settings', DEFAULT_SITE_SETTINGS),
      assets: get('cms_site_assets', DEFAULT_SITE_ASSETS),
      fonts: get('cms_jersey_fonts', DEFAULT_JERSEY_FONTS),
      banners: get('cms_website_banners', DEFAULT_WEBSITE_BANNERS),
      socials: get('cms_social_links', DEFAULT_SOCIAL_LINKS),
      registration: get('cms_registration_settings', DEFAULT_REGISTRATION_SETTINGS)
    };
  }

  public getState(): CompleteCmsState {
    return this.state;
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

  // Save partial state to local storage & broadcast
  public updateLocalState(partial: Partial<CompleteCmsState>) {
    this.state = {
      ...this.state,
      ...partial,
      settings: partial.settings ? { ...this.state.settings, ...partial.settings } : this.state.settings,
      assets: partial.assets ? { ...this.state.assets, ...partial.assets } : this.state.assets,
      fonts: partial.fonts ? { ...this.state.fonts, ...partial.fonts } : this.state.fonts,
      banners: partial.banners ? { ...this.state.banners, ...partial.banners } : this.state.banners,
      socials: partial.socials ? { ...this.state.socials, ...partial.socials } : this.state.socials,
      registration: partial.registration ? { ...this.state.registration, ...partial.registration } : this.state.registration
    };

    try {
      localStorage.setItem('cms_site_settings', JSON.stringify(this.state.settings));
      localStorage.setItem('cms_site_assets', JSON.stringify(this.state.assets));
      localStorage.setItem('cms_jersey_fonts', JSON.stringify(this.state.fonts));
      localStorage.setItem('cms_website_banners', JSON.stringify(this.state.banners));
      localStorage.setItem('cms_social_links', JSON.stringify(this.state.socials));
      localStorage.setItem('cms_registration_settings', JSON.stringify(this.state.registration));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }

    this.notify();
  }

  // Fetch all CMS content from Supabase
  public async syncFromSupabase(): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase client is not configured' };
    }

    try {
      // 1. site_settings
      const { data: sData, error: sErr } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
      if (!sErr && sData) {
        this.state.settings = { ...this.state.settings, ...sData };
      }

      // 2. site_assets
      const { data: aData, error: aErr } = await supabase.from('site_assets').select('*').limit(1).maybeSingle();
      if (!aErr && aData) {
        this.state.assets = { ...this.state.assets, ...aData };
      }

      // 3. jersey_fonts
      const { data: fData, error: fErr } = await supabase.from('jersey_fonts').select('*');
      if (!fErr && fData && Array.isArray(fData)) {
        const fontMap: Partial<JerseyFonts> = {};
        fData.forEach((row: any) => {
          if (row.font_key && row.image_url) {
            (fontMap as any)[row.font_key] = row.image_url;
          }
        });
        if (Object.keys(fontMap).length > 0) {
          this.state.fonts = { ...this.state.fonts, ...fontMap };
        }
      }

      // 4. website_banners
      const { data: bData, error: bErr } = await supabase.from('website_banners').select('*').limit(1).maybeSingle();
      if (!bErr && bData) {
        this.state.banners = { ...this.state.banners, ...bData };
      }

      // 5. social_links
      const { data: socData, error: socErr } = await supabase.from('social_links').select('*').limit(1).maybeSingle();
      if (!socErr && socData) {
        this.state.socials = { ...this.state.socials, ...socData };
      }

      // 6. registration_settings
      const { data: regData, error: regErr } = await supabase.from('registration_settings').select('*').limit(1).maybeSingle();
      if (!regErr && regData) {
        this.state.registration = { ...this.state.registration, ...regData };
      }

      this.isLoadedFromSupabase = true;
      this.updateLocalState(this.state);
      return { success: true };
    } catch (err: any) {
      console.warn('Supabase sync warning:', err);
      return { success: false, error: err.message || 'Error syncing from Supabase' };
    }
  }

  // Push all local CMS content to Supabase
  public async pushAllToSupabase(): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase client is not configured' };
    }

    try {
      // 1. site_settings
      await supabase.from('site_settings').upsert({
        id: 'current',
        college_name: this.state.settings.college_name,
        batch_name: this.state.settings.batch_name,
        event_date: this.state.settings.event_date,
        event_time: this.state.settings.event_time,
        event_venue: this.state.settings.event_venue,
        hero_top_quote: this.state.settings.hero_top_quote,
        hero_title: this.state.settings.hero_title,
        hero_subtitle: this.state.settings.hero_subtitle,
        hero_tagline: this.state.settings.hero_tagline,
        quote_spark: this.state.settings.quote_spark,
        quote_mark: this.state.settings.quote_mark,
        footer_quote: this.state.settings.footer_quote,
        copyright_text: this.state.settings.copyright_text
      });

      // 2. site_assets
      await supabase.from('site_assets').upsert({
        id: 'current',
        college_logo: this.state.assets.college_logo,
        header_logo: this.state.assets.header_logo,
        footer_logo: this.state.assets.footer_logo,
        favicon: this.state.assets.favicon,
        jersey_front: this.state.assets.jersey_front,
        jersey_back: this.state.assets.jersey_back
      });

      // 3. jersey_fonts (each digit)
      const fontRows = [
        { font_key: 'font_0', digit: 0, image_url: this.state.fonts.font_0 },
        { font_key: 'font_1', digit: 1, image_url: this.state.fonts.font_1 },
        { font_key: 'font_2', digit: 2, image_url: this.state.fonts.font_2 },
        { font_key: 'font_3', digit: 3, image_url: this.state.fonts.font_3 },
        { font_key: 'font_4', digit: 4, image_url: this.state.fonts.font_4 },
        { font_key: 'font_5', digit: 5, image_url: this.state.fonts.font_5 },
        { font_key: 'font_6', digit: 6, image_url: this.state.fonts.font_6 },
        { font_key: 'font_7', digit: 7, image_url: this.state.fonts.font_7 },
        { font_key: 'font_8', digit: 8, image_url: this.state.fonts.font_8 },
        { font_key: 'font_9', digit: 9, image_url: this.state.fonts.font_9 }
      ];
      await supabase.from('jersey_fonts').upsert(fontRows, { onConflict: 'font_key' });

      // 4. website_banners
      await supabase.from('website_banners').upsert({
        id: 'current',
        rad_day_main_banner: this.state.banners.rad_day_main_banner,
        quote_banner: this.state.banners.quote_banner,
        motivation_banner: this.state.banners.motivation_banner,
        footer_banner: this.state.banners.footer_banner
      });

      // 5. social_links
      await supabase.from('social_links').upsert({
        id: 'current',
        facebook_link: this.state.socials.facebook_link,
        instagram_link: this.state.socials.instagram_link,
        youtube_link: this.state.socials.youtube_link
      });

      // 6. registration_settings
      await supabase.from('registration_settings').upsert({
        id: 'current',
        registration_fee: this.state.registration.registration_fee,
        extra_charge_4xl: this.state.registration.extra_charge_4xl,
        payment_number: this.state.registration.payment_number,
        nagad_number: this.state.registration.nagad_number,
        payment_instructions: this.state.registration.payment_instructions,
        is_open: this.state.registration.is_open
      });

      return { success: true };
    } catch (err: any) {
      console.warn('Supabase push warning:', err);
      return { success: false, error: err.message || 'Error pushing to Supabase' };
    }
  }

  // Upload Asset to Supabase Storage or convert to Data URL
  public async uploadAsset(
    folder: 'logo' | 'banner' | 'jersey' | 'fonts' | 'footer',
    file: File | Blob,
    customName?: string
  ): Promise<{ success: boolean; url: string; error?: string }> {
    const extension = file.type ? file.type.split('/')[1] || 'png' : 'png';
    const cleanName = customName ? customName.replace(/[^a-zA-Z0-9_-]/g, '_') : `asset_${Date.now()}`;
    const filePath = `public/${folder}/${cleanName}.${extension}`;

    // First attempt Supabase Storage upload
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.storage
          .from('website-assets')
          .upload(filePath, file, { upsert: true });

        if (!error && data) {
          const { data: pubUrlData } = supabase.storage
            .from('website-assets')
            .getPublicUrl(filePath);

          if (pubUrlData && pubUrlData.publicUrl) {
            return { success: true, url: pubUrlData.publicUrl };
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload notice:', err);
      }
    }

    // Fallback: Read as Base64 Data URL so upload succeeds seamlessly
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ success: true, url: reader.result as string });
      };
      reader.onerror = () => {
        resolve({ success: false, url: '', error: 'Failed to read file' });
      };
      reader.readAsDataURL(file);
    });
  }
}

export const cmsStore = new CmsStore();
