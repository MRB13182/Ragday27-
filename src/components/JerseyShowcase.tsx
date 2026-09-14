import React, { useState } from 'react';
import { Shirt, Crown, ZoomIn, Eye } from 'lucide-react';
import { FrontJerseySvg, BackJerseySvg } from './JerseyPreview';
import { SUPER_ADMIN } from '../../Super-admin-file';

export const JerseyShowcase: React.FC = () => {
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [zoomTarget, setZoomTarget] = useState<'front' | 'back'>('front');

  const jersey = SUPER_ADMIN.jerseyManagement;
  const branding = SUPER_ADMIN.websiteBranding;
  const banners = SUPER_ADMIN.bannerManagement;

  return (
    <div className="w-full space-y-6">
      
      {/* ================= TOP CARD: JERSEY DESIGN ================= */}
      <div className="w-full bg-[#111111] rounded-2xl border border-purple-700/40 shadow-[0_0_35px_rgba(109,40,217,0.25)] p-4 sm:p-6 md:p-7 flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-start gap-3 pb-3 sm:pb-4 border-b border-purple-900/30">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-500/10 border border-[#FBBF24]/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(251,191,36,0.3)]">
            <Shirt className="w-4 h-4 sm:w-5 sm:h-5 text-[#FBBF24]" />
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

        {/* Jersey Dual Display Container */}
        <div className="relative my-3 sm:my-4 bg-[#090710] rounded-xl border border-purple-900/40 p-3 sm:p-6 overflow-hidden min-h-[220px] sm:min-h-[300px] md:min-h-[360px] flex items-center justify-center">
          
          {/* Ambient Lighting Behind Jerseys */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-32 sm:w-48 h-32 sm:h-48 bg-[#6D28D9]/30 blur-3xl rounded-full" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-32 sm:w-48 h-32 sm:h-48 bg-[#6D28D9]/30 blur-3xl rounded-full" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-24 sm:h-32 bg-[#FBBF24]/15 blur-2xl rounded-full" />
          </div>

          {/* Jerseys Grid: Front and Back side by side */}
          <div className="relative z-10 w-full grid grid-cols-2 gap-2 sm:gap-6 items-center">
            
            {/* Front Jersey Card */}
            <div
              onClick={() => {
                setZoomTarget('front');
                setZoomModalOpen(true);
              }}
              className="group cursor-pointer flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.03]"
            >
              <div className="w-full max-w-[140px] xs:max-w-[170px] sm:max-w-[210px] aspect-[5/6] relative flex items-center justify-center">
                <FrontJerseySvg
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] group-hover:drop-shadow-[0_15px_25px_rgba(109,40,217,0.6)] transition-all"
                />
                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-1.5 rounded-full text-[#FBBF24] border border-[#FBBF24]/40">
                  <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </div>
              <span className="mt-1.5 text-[10px] sm:text-xs font-bold text-gray-400 group-hover:text-[#FBBF24] uppercase tracking-wider transition-colors">
                {jersey.txt.frontLabel}
              </span>
            </div>

            {/* Back Jersey Card */}
            <div
              onClick={() => {
                setZoomTarget('back');
                setZoomModalOpen(true);
              }}
              className="group cursor-pointer flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.03]"
            >
              <div className="w-full max-w-[140px] xs:max-w-[170px] sm:max-w-[210px] aspect-[5/6] relative flex items-center justify-center">
                <BackJerseySvg
                  name={jersey.txt.defaultName}
                  number={jersey.txt.defaultNumber}
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] group-hover:drop-shadow-[0_15px_25px_rgba(109,40,217,0.6)] transition-all"
                />
                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-1.5 rounded-full text-[#FBBF24] border border-[#FBBF24]/40">
                  <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </div>
              <span className="mt-1.5 text-[10px] sm:text-xs font-bold text-gray-400 group-hover:text-[#FBBF24] uppercase tracking-wider transition-colors">
                {jersey.txt.backLabel}
              </span>
            </div>

          </div>
        </div>

        {/* Buttons: FRONT VIEW and BACK VIEW */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 pt-1 sm:pt-2">
          <button
            type="button"
            onClick={() => {
              setZoomTarget('front');
              setZoomModalOpen(true);
            }}
            className="w-full min-h-[42px] py-2 px-3 sm:px-4 rounded-lg bg-[#140D26] hover:bg-[#20153D] text-white font-bold text-xs sm:text-sm tracking-wider uppercase border border-purple-600/50 hover:border-purple-400 transition-all shadow-[0_0_15px_rgba(109,40,217,0.3)] hover:shadow-[0_0_20px_rgba(109,40,217,0.5)] flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
            <span>{jersey.txt.frontLabel.toUpperCase()}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setZoomTarget('back');
              setZoomModalOpen(true);
            }}
            className="w-full min-h-[42px] py-2 px-3 sm:px-4 rounded-lg bg-[#140D26] hover:bg-[#20153D] text-white font-bold text-xs sm:text-sm tracking-wider uppercase border border-purple-600/50 hover:border-purple-400 transition-all shadow-[0_0_15px_rgba(109,40,217,0.3)] hover:shadow-[0_0_20px_rgba(109,40,217,0.5)] flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FBBF24]" />
            <span>{jersey.txt.backLabel.toUpperCase()}</span>
          </button>
        </div>

      </div>

      {/* ================= BOTTOM CARD: QUOTE SECTION ================= */}
      <div className="w-full bg-[#111111] rounded-2xl border border-purple-700/40 shadow-[0_0_35px_rgba(109,40,217,0.25)] p-6 sm:p-8 relative overflow-hidden text-center group">
        
        {/* Background Quote Banner if present */}
        {banners.pic.headerBanner && (
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <img src={banners.pic.headerBanner} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Atmospheric Nebula and Sparks Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 bg-[#6D28D9]/25 blur-3xl rounded-full" />
          <div className="absolute bottom-2 left-1/4 w-32 h-32 bg-[#FBBF24]/15 blur-2xl rounded-full" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#FBBF24_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center py-2">
          
          {/* Gold Crown Outline at top */}
          <div className="mb-3 text-[#FBBF24]">
            <Crown className="w-10 h-10 mx-auto text-[#FBBF24] filter drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
          </div>

          {/* Calligraphic Brush Quote Line 1 */}
          <p className="font-brush text-3xl sm:text-4xl md:text-5xl text-[#E9D5FF] tracking-wide uppercase drop-shadow-[0_0_15px_rgba(192,132,252,0.9)] leading-tight">
            {jersey.txt.quoteLine1}
          </p>

          {/* Calligraphic Brush Quote Line 2 */}
          {jersey.txt.quoteLine2 && (
            <p className="font-brush text-3xl sm:text-4xl md:text-5xl text-[#FBBF24] tracking-wider uppercase drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] leading-tight mt-1">
              {jersey.txt.quoteLine2}
            </p>
          )}

        </div>

      </div>

      {/* Full Resolution Zoom Modal */}
      {zoomModalOpen && (
        <div
          onClick={() => setZoomModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 cursor-pointer"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#120F1D] border-2 border-purple-500/60 rounded-2xl max-w-xl w-full p-4 sm:p-6 text-center relative shadow-[0_0_50px_rgba(109,40,217,0.6)] animate-in fade-in zoom-in duration-300 max-h-[92dvh] overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-3 border-b border-purple-900/50 mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm font-bold text-[#FBBF24] uppercase tracking-wider truncate mr-2">
                Official {branding.txt.batchName} Jersey - {zoomTarget === 'front' ? 'Front' : 'Back'}
              </span>
              <button
                onClick={() => setZoomModalOpen(false)}
                className="text-gray-400 hover:text-white text-xs px-2.5 py-1 rounded bg-white/10 shrink-0"
              >
                Close ✕
              </button>
            </div>

            <div className="w-full max-w-[220px] xs:max-w-[270px] sm:max-w-[340px] aspect-[5/6] mx-auto flex items-center justify-center my-2">
              {zoomTarget === 'front' ? (
                <FrontJerseySvg
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(109,40,217,0.7)]"
                />
              ) : (
                <BackJerseySvg
                  name={jersey.txt.defaultName}
                  number={jersey.txt.defaultNumber}
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(109,40,217,0.7)]"
                />
              )}
            </div>

            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => setZoomTarget('front')}
                className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  zoomTarget === 'front'
                    ? 'bg-[#6D28D9] text-white shadow-[0_0_15px_rgba(109,40,217,0.6)]'
                    : 'bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                {jersey.txt.frontLabel}
              </button>
              <button
                onClick={() => setZoomTarget('back')}
                className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  zoomTarget === 'back'
                    ? 'bg-[#FBBF24] text-black shadow-[0_0_15px_rgba(251,191,36,0.6)]'
                    : 'bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                {jersey.txt.backLabel}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
