import React from 'react';
import { Crown } from 'lucide-react';
import { SUPER_ADMIN } from '../../SuperAdmin';

export const HeroBanner: React.FC = () => {
  const hero = SUPER_ADMIN.heroSection;

  // 1. Parse calligraphyLeft dynamically (e.g. "Last Chapter → Brighter Tomorrow")
  const rawTopText = hero.txt.calligraphyLeft || "Last Chapter → Brighter Tomorrow";
  const arrowMatch = rawTopText.match(/\s*(?:→|->|=>|–)\s*/);
  let topPartWords: string[] = [];
  let bottomPartWords: string[] = [];
  let hasArrow = false;

  if (arrowMatch && arrowMatch.index !== undefined) {
    hasArrow = true;
    const beforeArrow = rawTopText.substring(0, arrowMatch.index).trim();
    const afterArrow = rawTopText.substring(arrowMatch.index + arrowMatch[0].length).trim();
    topPartWords = beforeArrow ? beforeArrow.split(/\s+/) : [];
    bottomPartWords = afterArrow ? afterArrow.split(/\s+/) : [];
  } else {
    const allWords = rawTopText.trim().split(/\s+/);
    if (allWords.length <= 2) {
      topPartWords = allWords;
      bottomPartWords = [];
    } else {
      const half = Math.ceil(allWords.length / 2);
      topPartWords = allWords.slice(0, half);
      bottomPartWords = allWords.slice(half);
      hasArrow = bottomPartWords.length > 0;
    }
  }

  // 2. Parse calligraphyRight dynamically (e.g. "Same People Different Destinations")
  const rawBottomText = hero.txt.calligraphyRight || "Same People Different Destinations";
  const bottomWords = rawBottomText.trim().split(/\s+/);

  const topColors = ['text-[#80F2FF]', 'text-[#00E5FF]', 'text-[#E0FCFF]'];
  const bottomColors = ['text-[#00C8A8]', 'text-white', 'text-[#80F2FF]'];
  const rightColors = ['text-[#E0FCFF]', 'text-[#00E5FF]', 'text-[#00C8A8]', 'text-white'];

  return (
    <div className="relative w-full overflow-hidden bg-[#050505] border-b border-[#00E5FF]/20 py-8 sm:py-12 md:py-16 lg:py-20 select-none">
      
      {/* Dynamic Main Banner Background if present */}
      {hero.pic.bannerImage && (
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen">
          <img
            src={hero.pic.bannerImage}
            alt={hero.txt.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Background Volumetric Lighting & Atmospheric Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] md:w-[650px] h-[220px] sm:h-[300px] md:h-[350px] bg-[#00E5FF]/15 blur-[90px] sm:blur-[120px] rounded-full" />
        <div className="absolute top-10 left-1/4 w-[180px] sm:w-[280px] h-[140px] sm:h-[200px] bg-[#D4AF37]/10 blur-[70px] sm:blur-[100px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[180px] sm:w-[280px] h-[140px] sm:h-[200px] bg-[#00C8A8]/10 blur-[70px] sm:blur-[100px] rounded-full" />
        <div className="hidden sm:block absolute -top-20 left-10 w-72 md:w-96 h-[400px] md:h-[500px] bg-gradient-to-b from-[#00E5FF]/15 via-[#00C8A8]/5 to-transparent rotate-[-35deg] blur-2xl" />
        <div className="hidden sm:block absolute -top-20 right-10 w-72 md:w-96 h-[400px] md:h-[500px] bg-gradient-to-b from-[#00E5FF]/15 via-[#00C8A8]/5 to-transparent rotate-[35deg] blur-2xl" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:24px_24px] sm:[background-size:32px_32px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-4">
          
          {/* Center Main Title */}
          <div className="order-1 lg:order-2 lg:col-span-6 text-center flex flex-col items-center justify-center">
            
            {/* Gold Crown Outline with Gems */}
            <div className="mb-1.5 sm:mb-2 relative inline-flex items-center justify-center">
              <svg className="w-9 h-8 sm:w-12 sm:h-10 text-[#D4AF37] filter drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]" viewBox="0 0 48 36" fill="none">
                <path d="M4 30 L44 30 L40 10 L28 20 L24 4 L20 20 L8 10 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(212,175,55,0.1)"/>
                <circle cx="24" cy="4" r="2.5" fill="#D4AF37" />
                <circle cx="8" cy="10" r="2" fill="#D4AF37" />
                <circle cx="40" cy="10" r="2" fill="#D4AF37" />
              </svg>
            </div>

            {/* Giant Stylized Title */}
            <h1 className="relative font-brush text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-wider leading-none drop-shadow-[0_0_35px_rgba(0,229,255,0.7)] select-none">
              <span className="bg-gradient-to-b from-white via-[#F0FDFA] to-[#CCFBF1] bg-clip-text text-transparent break-words">
                {hero.txt.title}
              </span>
            </h1>

            {/* Sharp Subtitle Neon Brush */}
            <div className="mt-1 sm:mt-2">
              <span className="font-brush text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#00E5FF] tracking-widest uppercase drop-shadow-[0_0_20px_rgba(0,229,255,0.9)] italic">
                {hero.txt.subtitle}
              </span>
            </div>

            {/* Spaced College Title */}
            <h2 className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base lg:text-lg font-black tracking-[0.12em] sm:tracking-[0.22em] md:tracking-[0.35em] text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-full px-2">
              {hero.txt.collegeName}
            </h2>

            {/* Tagline / Slogan */}
            <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.4em] text-[#CFCFCF] uppercase max-w-full px-2">
              {hero.txt.slogan}
            </p>
          </div>

          {/* Left Graffiti Calligraphy */}
          <div className="order-2 lg:order-1 lg:col-span-3 text-center lg:text-left flex flex-col items-center lg:items-start justify-center">
            <div className="relative inline-block rotate-[-2deg] lg:rotate-[-4deg] hover:rotate-0 transition-transform duration-300">
              {topPartWords.map((word, idx) => (
                <span
                  key={`top-w-${idx}`}
                  className={`block font-brush ${idx === 1 ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-none' : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight'} ${topColors[idx % topColors.length]} drop-shadow-[0_0_15px_rgba(0,229,255,0.8)] tracking-wider uppercase`}
                >
                  {word}
                </span>
              ))}
              
              {hasArrow && (
                <div className="my-1 flex items-center justify-center lg:justify-start gap-2">
                  <svg className="w-16 sm:w-20 h-5 sm:h-6 text-[#00E5FF] filter drop-shadow-[0_0_8px_#00E5FF]" viewBox="0 0 100 24" fill="none">
                    <path d="M5 12 H85 M70 4 L88 12 L70 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {bottomPartWords.map((word, idx) => (
                <span
                  key={`bot-w-${idx}`}
                  className={`block font-brush text-xl sm:text-2xl md:text-3xl lg:text-4xl ${bottomColors[idx % bottomColors.length]} drop-shadow-[0_0_14px_rgba(0,200,168,0.8)] tracking-wide uppercase`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Right Calligraphy */}
          <div className="order-3 lg:order-3 lg:col-span-3 text-center lg:text-right flex flex-col items-center lg:items-end justify-center">
            <div className="relative inline-block rotate-[2deg] lg:rotate-[3deg] hover:rotate-0 transition-transform duration-300">
              {bottomWords.map((word, idx) => (
                <span
                  key={`r-w-${idx}`}
                  className={`block font-brush ${idx === 1 ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl' : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl'} ${rightColors[idx % rightColors.length]} drop-shadow-[0_0_15px_rgba(0,229,255,0.8)] tracking-wide`}
                >
                  {word}
                </span>
              ))}

              <div className="mt-1 sm:mt-2 flex justify-center lg:justify-end">
                <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37] filter drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
