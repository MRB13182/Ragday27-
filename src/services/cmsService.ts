import { supabase, isSupabaseConfigured } from './supabaseClient';
import { GalleryItem } from '../types';

export interface SiteSettings {
  id?: boolean | string;
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
  countdown_target?: string;
  // Database columns
  hero_top_text?: string;
  hero_college_text?: string;
  hero_bottom_text?: string;
  quote_text?: string;
  venue?: string;
  payment_method?: string;
  payment_number?: string;
  payment_amount?: number;
}

export interface SiteAssets {
  id?: string;
  college_logo: string;
  header_logo: string;
  footer_logo: string;
  favicon: string;
  jersey_front: string;
  jersey_back: string;
  back_preview?: string;
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
  name_font?: string;
  number_font?: string;
  heading_font?: string;
}

export interface WebsiteBanners {
  id?: string;
  rad_day_main_banner: string;
  quote_banner: string;
  motivation_banner: string;
  footer_banner: string;
}

export interface SocialLinks {
  id?: boolean | string;
  facebook_link: string;
  instagram_link: string;
  youtube_link: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface RegistrationSettings {
  id?: boolean | string;
  registration_fee: number;
  extra_charge_4xl: number;
  payment_number: string;
  nagad_number: string;
  payment_instructions: string;
  is_open: boolean;
  registration_prefix?: string;
}

export interface CmsGalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CompleteCmsState {
  settings: SiteSettings;
  assets: SiteAssets;
  fonts: JerseyFonts;
  banners: WebsiteBanners;
  socials: SocialLinks;
  registration: RegistrationSettings;
  gallery: CmsGalleryItem[];
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
  id: true,
  college_name: 'National Ideal College',
  batch_name: 'HSC Batch 2027',
  event_date: '27 February 2024',
  event_time: '10:00 AM - 5:00 PM',
  event_venue: 'NIC Campus',
  venue: 'NIC Campus',
  hero_top_quote: 'Last Chapter → Brighter Tomorrow',
  hero_top_text: 'Last Chapter → Brighter Tomorrow',
  hero_title: 'RAD DAY',
  hero_subtitle: 'HSC 27',
  hero_tagline: 'MEMORIES NEVER FADE',
  quote_spark: 'Start With A Spark',
  quote_mark: 'End With A Mark',
  quote_text: 'Start With A Spark End With A Mark',
  footer_quote: 'Same People Different Destinations',
  hero_bottom_text: 'Same People Different Destinations',
  copyright_text: 'National Ideal College • HSC Batch 2027 • All Rights Reserved',
  countdown_target: '2026-12-25T10:00:00',
  payment_method: 'Bkash',
  payment_number: '01712345678',
  payment_amount: 1050
};

export const DEFAULT_SITE_ASSETS: SiteAssets = {
  id: 'current',
  college_logo: '/logo/college-logo.png',
  header_logo: '/logo/college-logo.png',
  footer_logo: '/logo/college-logo.png',
  favicon: '/logo/favicon.png',
  jersey_front: '/jersey/jersey-front.png',
  jersey_back: '/jersey/jersey-back.png',
  back_preview: '/jersey/back-preview.png'
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
  font_9: generateDefaultDigitSvg('9'),
  name_font: 'JerseyFont',
  number_font: 'NumberFont',
  heading_font: 'HeadingFont'
};

export const DEFAULT_WEBSITE_BANNERS: WebsiteBanners = {
  id: 'current',
  rad_day_main_banner: '/banner/main-banner.jpg',
  quote_banner: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200&auto=format&fit=crop&q=80',
  motivation_banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
  footer_banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80'
};

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  id: true,
  facebook_link: 'https://facebook.com',
  instagram_link: 'https://instagram.com',
  youtube_link: 'https://youtube.com',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com'
};

export const DEFAULT_REGISTRATION_SETTINGS: RegistrationSettings = {
  id: true,
  registration_fee: 1050,
  extra_charge_4xl: 50,
  payment_number: '01712345678',
  nagad_number: '01812345678',
  payment_instructions: 'Send Money (Personal) to the official bKash or Nagad number above. Keep your Transaction ID ready.',
  is_open: true,
  registration_prefix: 'RD27-'
};

export const DEFAULT_GALLERY_ITEMS: CmsGalleryItem[] = [
  {
    id: 'g-1',
    title: 'Official RAD Day 27 Jersey Reveal',
    category: 'Jersey',
    image_url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
    description: 'The purple, black, and gold royal jersey edition designed for HSC 27.',
    is_active: true,
    sort_order: 1,
    created_at: '2024-02-01'
  },
  {
    id: 'g-2',
    title: 'National Ideal College Main Campus Quad',
    category: 'Campus',
    image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    description: 'Where all our unforgettable memories and friendships started.',
    is_active: true,
    sort_order: 2,
    created_at: '2024-02-05'
  },
  {
    id: 'g-3',
    title: 'Stage & Lighting Setup Teaser',
    category: 'Prep',
    image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    description: 'Preparing the cinematic stage with royal purple spotlights and acoustic amps.',
    is_active: true,
    sort_order: 3,
    created_at: '2024-02-10'
  },
  {
    id: 'g-4',
    title: 'HSC 27 Committee Planning Session',
    category: 'Prep',
    image_url: 'https://images.unsplash.com/photo-1522071823990-2ff6eb823b12?w=800&auto=format&fit=crop&q=80',
    description: 'Organizing the grandest batch celebration in NIC history.',
    is_active: true,
    sort_order: 4,
    created_at: '2024-02-12'
  },
  {
    id: 'g-5',
    title: 'Batch Group Photo Session',
    category: 'Memories',
    image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    description: 'Same people, different destinations. Memories never fade.',
    is_active: true,
    sort_order: 5,
    created_at: '2024-02-15'
  },
  {
    id: 'g-6',
    title: 'Concert & Celebration Rehearsal',
    category: 'Memories',
    image_url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&auto=format&fit=crop&q=80',
    description: 'Electrifying music, flashmobs, and batch anthems in the making.',
    is_active: true,
    sort_order: 6,
    created_at: '2024-02-20'
  }
];

export function mapCmsGalleryToPublic(item: CmsGalleryItem): GalleryItem {
  return {
    id: item.id,
    title: item.title,
    category: (item.category as any) || 'Memories',
    imageUrl: item.image_url,
    caption: item.description,
    date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'HSC 27'
  };
}

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
      registration: get('cms_registration_settings', DEFAULT_REGISTRATION_SETTINGS),
      gallery: get('cms_gallery_items', DEFAULT_GALLERY_ITEMS)
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
      registration: partial.registration ? { ...this.state.registration, ...partial.registration } : this.state.registration,
      gallery: partial.gallery ? [...partial.gallery] : this.state.gallery
    };

    try {
      localStorage.setItem('cms_site_settings', JSON.stringify(this.state.settings));
      localStorage.setItem('cms_site_assets', JSON.stringify(this.state.assets));
      localStorage.setItem('cms_jersey_fonts', JSON.stringify(this.state.fonts));
      localStorage.setItem('cms_website_banners', JSON.stringify(this.state.banners));
      localStorage.setItem('cms_social_links', JSON.stringify(this.state.socials));
      localStorage.setItem('cms_registration_settings', JSON.stringify(this.state.registration));
      localStorage.setItem('cms_gallery_items', JSON.stringify(this.state.gallery));
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
        this.state.settings = {
          ...this.state.settings,
          ...sData,
          // Sync dual alias fields
          college_name: sData.hero_college_text || sData.college_name || this.state.settings.college_name,
          event_venue: sData.venue || sData.event_venue || this.state.settings.event_venue,
          venue: sData.venue || this.state.settings.venue,
          hero_top_quote: sData.hero_top_text || sData.hero_top_quote || this.state.settings.hero_top_quote,
          hero_top_text: sData.hero_top_text || this.state.settings.hero_top_text,
          footer_quote: sData.hero_bottom_text || sData.footer_quote || this.state.settings.footer_quote,
          hero_bottom_text: sData.hero_bottom_text || this.state.settings.hero_bottom_text,
          quote_spark: sData.quote_text ? sData.quote_text.split('End')[0]?.trim() || sData.quote_text : this.state.settings.quote_spark,
          quote_mark: sData.quote_text && sData.quote_text.includes('End') ? 'End' + sData.quote_text.split('End')[1] : this.state.settings.quote_mark,
          quote_text: sData.quote_text || this.state.settings.quote_text,
          payment_number: sData.payment_number || this.state.settings.payment_number,
          payment_method: sData.payment_method || this.state.settings.payment_method,
          countdown_target: sData.countdown_target || this.state.settings.countdown_target
        };
      }

      // 2. site_assets (query all rows by asset_key)
      const { data: aData, error: aErr } = await supabase.from('site_assets').select('*');
      if (!aErr && aData && Array.isArray(aData)) {
        const assetMap: Partial<SiteAssets> = {};
        aData.forEach((row: any) => {
          const effectiveUrl = row.public_url || (row.storage_path?.startsWith('http') ? row.storage_path : null);
          if (effectiveUrl) {
            if (row.asset_key === 'college_logo') assetMap.college_logo = effectiveUrl;
            if (row.asset_key === 'rad_day_logo') assetMap.header_logo = effectiveUrl;
            if (row.asset_key === 'front_jersey') assetMap.jersey_front = effectiveUrl;
            if (row.asset_key === 'back_jersey') assetMap.jersey_back = effectiveUrl;
            if (row.asset_key === 'back_preview') assetMap.back_preview = effectiveUrl;
          }
        });
        if (Object.keys(assetMap).length > 0) {
          this.state.assets = { ...this.state.assets, ...assetMap };
        }
      }

      // 3. jersey_fonts
      const { data: fData, error: fErr } = await supabase.from('jersey_fonts').select('*');
      if (!fErr && fData && Array.isArray(fData)) {
        const fontMap: Partial<JerseyFonts> = {};
        fData.forEach((row: any) => {
          const effectiveUrl = row.storage_path || row.image_url;
          if (row.font_key && effectiveUrl) {
            (fontMap as any)[row.font_key] = effectiveUrl;
          }
        });
        if (Object.keys(fontMap).length > 0) {
          this.state.fonts = { ...this.state.fonts, ...fontMap };
        }
      }

      // 4. website_banners
      const { data: bData, error: bErr } = await supabase.from('website_banners').select('*');
      if (!bErr && bData && Array.isArray(bData)) {
        const bannerMap: Partial<WebsiteBanners> = {};
        bData.forEach((row: any) => {
          const effectiveUrl = row.storage_path || row.image_url;
          if (row.banner_key && effectiveUrl) {
            (bannerMap as any)[row.banner_key] = effectiveUrl;
          }
        });
        if (Object.keys(bannerMap).length > 0) {
          this.state.banners = { ...this.state.banners, ...bannerMap };
        }
      }

      // 5. social_links
      const { data: socData, error: socErr } = await supabase.from('social_links').select('*').limit(1).maybeSingle();
      if (!socErr && socData) {
        this.state.socials = {
          ...this.state.socials,
          ...socData,
          facebook_link: socData.facebook || socData.facebook_link || this.state.socials.facebook_link,
          instagram_link: socData.instagram || socData.instagram_link || this.state.socials.instagram_link,
          youtube_link: socData.youtube || socData.youtube_link || this.state.socials.youtube_link
        };
      }

      // 6. registration_settings
      const { data: regData, error: regErr } = await supabase.from('registration_settings').select('*').limit(1).maybeSingle();
      if (!regErr && regData) {
        this.state.registration = {
          ...this.state.registration,
          ...regData,
          registration_fee: Number(regData.registration_fee) || this.state.registration.registration_fee,
          payment_number: regData.payment_number || this.state.registration.payment_number
        };
      }

      // 7. gallery_items
      const { data: gData, error: gErr } = await supabase
        .from('gallery_items')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!gErr && gData && Array.isArray(gData) && gData.length > 0) {
        this.state.gallery = gData.map((row: any) => ({
          id: row.id,
          title: row.title,
          description: row.description || '',
          image_url: row.image_url,
          category: row.category || 'Memories',
          is_active: row.is_active ?? true,
          sort_order: row.sort_order || 0,
          created_at: row.created_at,
          updated_at: row.updated_at
        }));
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
      // 1. site_settings (singleton row with id: true)
      await supabase.from('site_settings').update({
        hero_top_text: this.state.settings.hero_top_text || this.state.settings.hero_top_quote,
        hero_title: this.state.settings.hero_title,
        hero_subtitle: this.state.settings.hero_subtitle,
        hero_college_text: this.state.settings.college_name,
        hero_tagline: this.state.settings.hero_tagline,
        hero_bottom_text: this.state.settings.footer_quote || this.state.settings.hero_bottom_text,
        quote_text: this.state.settings.quote_text || `${this.state.settings.quote_spark} ${this.state.settings.quote_mark}`,
        event_date: this.state.settings.event_date,
        event_time: this.state.settings.event_time,
        venue: this.state.settings.event_venue || this.state.settings.venue,
        payment_method: this.state.settings.payment_method || 'Bkash',
        payment_number: this.state.settings.payment_number || this.state.registration.payment_number,
        payment_amount: this.state.settings.payment_amount || this.state.registration.registration_fee,
        copyright_text: this.state.settings.copyright_text,
        countdown_target: this.state.settings.countdown_target,
        updated_at: new Date().toISOString()
      }).match({ id: true });

      // 2. site_assets (update by asset_key)
      const assetUpdates = [
        { asset_key: 'college_logo', public_url: this.state.assets.college_logo },
        { asset_key: 'rad_day_logo', public_url: this.state.assets.header_logo },
        { asset_key: 'front_jersey', public_url: this.state.assets.jersey_front },
        { asset_key: 'back_jersey', public_url: this.state.assets.jersey_back },
        { asset_key: 'back_preview', public_url: this.state.assets.back_preview || this.state.assets.jersey_back }
      ];
      for (const item of assetUpdates) {
        if (item.public_url) {
          await supabase.from('site_assets').update({
            public_url: item.public_url,
            updated_at: new Date().toISOString()
          }).eq('asset_key', item.asset_key);
        }
      }

      // 3. social_links (singleton row with id: true)
      await supabase.from('social_links').update({
        facebook: this.state.socials.facebook_link || this.state.socials.facebook,
        instagram: this.state.socials.instagram_link || this.state.socials.instagram,
        youtube: this.state.socials.youtube_link || this.state.socials.youtube,
        updated_at: new Date().toISOString()
      }).match({ id: true });

      // 4. registration_settings (singleton row with id: true)
      await supabase.from('registration_settings').update({
        registration_fee: this.state.registration.registration_fee,
        payment_number: this.state.registration.payment_number,
        updated_at: new Date().toISOString()
      }).match({ id: true });

      return { success: true };
    } catch (err: any) {
      console.warn('Supabase push warning:', err);
      return { success: false, error: err.message || 'Error pushing to Supabase' };
    }
  }

  // ==========================================
  // GALLERY CMS METHODS
  // ==========================================

  public async addGalleryItem(item: Omit<CmsGalleryItem, 'id'>): Promise<{ success: boolean; item?: CmsGalleryItem; error?: string }> {
    const newItem: CmsGalleryItem = {
      ...item,
      id: `g-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString()
    };

    // Try Supabase insert first
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('gallery_items').insert([{
          title: newItem.title,
          description: newItem.description,
          image_url: newItem.image_url,
          category: newItem.category,
          is_active: newItem.is_active,
          sort_order: newItem.sort_order
        }]).select().single();

        if (!error && data) {
          newItem.id = data.id;
        }
      } catch (e) {
        console.warn('Supabase gallery insert notice:', e);
      }
    }

    const updatedGallery = [newItem, ...this.state.gallery];
    this.updateLocalState({ gallery: updatedGallery });
    return { success: true, item: newItem };
  }

  public async updateGalleryItem(id: string, partial: Partial<CmsGalleryItem>): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('gallery_items').update({
          title: partial.title,
          description: partial.description,
          image_url: partial.image_url,
          category: partial.category,
          is_active: partial.is_active,
          sort_order: partial.sort_order,
          updated_at: new Date().toISOString()
        }).eq('id', id);
      } catch (e) {
        console.warn('Supabase gallery update notice:', e);
      }
    }

    const updatedGallery = this.state.gallery.map(g => g.id === id ? { ...g, ...partial } : g);
    this.updateLocalState({ gallery: updatedGallery });
    return { success: true };
  }

  public async deleteGalleryItem(id: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('gallery_items').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase gallery delete notice:', e);
      }
    }

    const updatedGallery = this.state.gallery.filter(g => g.id !== id);
    this.updateLocalState({ gallery: updatedGallery });
    return { success: true };
  }

  public async toggleGalleryActive(id: string): Promise<{ success: boolean }> {
    const item = this.state.gallery.find(g => g.id === id);
    if (!item) return { success: false };
    return this.updateGalleryItem(id, { is_active: !item.is_active });
  }

  // Upload Asset to Supabase Storage or convert to Data URL
  public async uploadAsset(
    folder: 'logo' | 'banner' | 'jersey' | 'fonts' | 'footer' | 'gallery',
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
