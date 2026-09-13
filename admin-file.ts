/**
 * ==================================================
 * WEBSITE CONTENT & ASSETS CONFIGURATION (ADMIN FILE)
 * ==================================================
 * 
 * Edit this file to customize banner texts, titles, quotes,
 * and asset paths without editing component code.
 * 
 * Assets are loaded from /public/ directory:
 * - Logos:   /public/logo/
 * - Fonts:   /public/fonts/
 * - Banners: /public/banner/
 * - Jersey:  /public/jersey/
 */

export interface WebsiteContentConfig {
  // Banner Text Management
  hero_top_text: string;
  hero_middle_text: string;
  hero_title: string;
  hero_subtitle: string;
  hero_bottom_text: string;
  quote_text: string;

  // College & Event Details
  college_name: string;
  batch_name: string;
  event_date: string;
  event_time: string;
  event_venue: string;

  // Asset Path Configurations
  logo_college: string;
  logo_rad_day: string;
  logo_favicon: string;

  banner_image: string;
  jersey_front: string;
  jersey_back: string;

  font_heading: string;
  font_jersey: string;
  font_number: string;
  font_body: string;
}

export const websiteContent: WebsiteContentConfig = {
  // Banner & Hero Text
  hero_top_text: "Last Chapter → Brighter Tomorrow",
  hero_middle_text: "MEMORIES NEVER FADE",
  hero_title: "RAD DAY",
  hero_subtitle: "HSC 27",
  hero_bottom_text: "Same People Different Destinations",
  quote_text: "Start With A Spark End With A Mark",

  // College & Event Information
  college_name: "National Ideal College",
  batch_name: "HSC Batch 2027",
  event_date: "27 February 2024",
  event_time: "10:00 AM - 5:00 PM",
  event_venue: "NIC Campus",

  // Logos (loaded from /public/logo/)
  logo_college: "/logo/college-logo.png",
  logo_rad_day: "/logo/rad-day-logo.png",
  logo_favicon: "/logo/favicon.png",

  // Banner Images (loaded from /public/banner/)
  banner_image: "/banner/main-banner.jpg",

  // Jersey Images (loaded from /public/jersey/)
  jersey_front: "/jersey/jersey-front.png",
  jersey_back: "/jersey/jersey-back.png",

  // Fonts (loaded from /public/fonts/)
  font_heading: "/fonts/heading-font.ttf",
  font_jersey: "/fonts/jersey-font.ttf",
  font_number: "/fonts/number-font.ttf",
  font_body: "/fonts/body-font.ttf"
};
