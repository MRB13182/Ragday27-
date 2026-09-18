import React, { useState } from 'react';
import { Shirt, Crown, ZoomIn } from 'lucide-react';
import { SUPER_ADMIN } from '../../SuperAdmin';

export const JerseyShowcase: React.FC = () => {
  const [zoomModalOpen, setZoomModalOpen] = useState(false);

  const jersey = SUPER_ADMIN.jerseyManagement;
  const branding = SUPER_ADMIN.websiteBranding;
  const banners = SUPER_ADMIN.bannerManagement;

  return (
    <div className="w-full space-y-6">
      
      {/* ================= TOP CARD: JERSEY DESIGN ================= */}
      <div className="w-full bg-[#050505] rounded-2xl border border-[#00E5FF]/30 shadow-[0_0_35px_rgba(0,229,255,0.18)] p-4 sm:p-6 md:p-7 flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-start gap-3 pb-3 sm:pb-4 border-b border-[#00E5FF]/20">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-500/10 border border-[#D4AF37]/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.3)]">
            <Shirt className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-wide text-white uppercase">
              {jersey.txt.sectionTitle}
            </h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-[#CFCFCF] mt-0.5">
              {jersey.txt.sectionSubtitle}
            </p>
          </div>
        </div>

        {/* Single Front Jersey Showcase Display Container */}
        <div className="relative my-3 sm:my-4 bg-[#050505] rounded-xl border border-[#00E5FF]/20 p-4 sm:p-6 md:p-8 overflow-hidden min-h-[260px] sm:min-h-[340px] md:min-h-[420px] flex items-center justify-center">
          
          {/* Ambient Lighting Behind Jersey */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 md:w-[450px] h-64 sm:h-96 md:h-[450px] bg-[#00E5FF]/15 blur-3xl rounded-full" />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-36 sm:w-56 h-36 sm:h-56 bg-[#00C8A8]/10 blur-2xl rounded-full" />
          </div>

          {/* Single Large Uploaded Front Jersey Image */}
          <div
            onClick={() => setZoomModalOpen(true)}
            className="relative z-10 group cursor-pointer w-full flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.015]"
          >
            <div className="relative w-full max-w-[280px] xs:max-w-[340px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[520px] flex items-center justify-center">
              <img
                src={jersey.pic.frontJersey}
                alt={jersey.txt.sectionTitle}
                className="w-full h-auto max-h-[320px] sm:max-h-[400px] md:max-h-[460px] object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] group-hover:drop-shadow-[0_18px_36px_rgba(0,229,255,0.4)] transition-all duration-300"
              />
              {/* Zoom Button Overlay */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 p-2 rounded-full text-[#D4AF37] border border-[#D4AF37]/50 shadow-lg">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>

            <span className="mt-3 text-xs sm:text-sm font-bold text-gray-400 group-hover:text-[#00E5FF] uppercase tracking-wider transition-colors flex items-center gap-1.5">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Click to view full resolution</span>
            </span>
          </div>

        </div>

      </div>

      {/* ================= BOTTOM CARD: QUOTE SECTION ================= */}
      <div className="w-full bg-[#050505] rounded-2xl border border-[#00E5FF]/30 shadow-[0_0_35px_rgba(0,229,255,0.18)] p-6 sm:p-8 relative overflow-hidden text-center group">
        
        {/* Background Quote Banner if present */}
        {banners.pic.headerBanner && (
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <img src={banners.pic.headerBanner} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Atmospheric Nebula and Sparks Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 bg-[#00E5FF]/15 blur-3xl rounded-full" />
          <div className="absolute bottom-2 left-1/4 w-32 h-32 bg-[#00C8A8]/10 blur-2xl rounded-full" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center py-2">
          
          {/* Gold Crown Outline at top */}
          <div className="mb-3 text-[#D4AF37]">
            <Crown className="w-10 h-10 mx-auto text-[#D4AF37] filter drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]" />
          </div>

          {/* Calligraphic Brush Quote Line 1 */}
          <p className="font-brush text-3xl sm:text-4xl md:text-5xl text-[#E0FCFF] tracking-wide uppercase drop-shadow-[0_0_15px_rgba(0,229,255,0.7)] leading-tight">
            {jersey.txt.quoteLine1}
          </p>

          {/* Calligraphic Brush Quote Line 2 */}
          {jersey.txt.quoteLine2 && (
            <p className="font-brush text-3xl sm:text-4xl md:text-5xl text-[#D4AF37] tracking-wider uppercase drop-shadow-[0_0_20px_rgba(212,175,55,0.8)] leading-tight mt-1">
              {jersey.txt.quoteLine2}
            </p>
          )}

        </div>

      </div>

      {/* Full Resolution Zoom Modal (Front Jersey Only) */}
      {zoomModalOpen && (
        <div
          onClick={() => setZoomModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 cursor-pointer"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#050505] border-2 border-[#00E5FF]/60 rounded-2xl max-w-xl w-full p-4 sm:p-6 text-center relative shadow-[0_0_50px_rgba(0,229,255,0.35)] animate-in fade-in zoom-in duration-300 max-h-[92dvh] overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-3 border-b border-[#00E5FF]/20 mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm font-bold text-[#D4AF37] uppercase tracking-wider truncate mr-2">
                Official {branding.txt.batchName} Jersey Design
              </span>
              <button
                type="button"
                onClick={() => setZoomModalOpen(false)}
                className="text-gray-400 hover:text-white text-xs px-2.5 py-1 rounded bg-white/10 shrink-0 cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="w-full max-w-[340px] sm:max-w-[440px] mx-auto flex items-center justify-center my-2">
              <img
                src={jersey.pic.frontJersey}
                alt={jersey.txt.sectionTitle}
                className="w-full h-auto max-h-[65vh] object-contain filter drop-shadow-[0_15px_30px_rgba(0,229,255,0.4)]"
              />
            </div>

            <p className="mt-3 text-[11px] sm:text-xs text-gray-300">
              {jersey.txt.jerseyDescriptions || jersey.txt.jerseyTexts}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
