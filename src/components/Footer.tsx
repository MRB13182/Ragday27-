import React from 'react';
import { Shield, Lock } from 'lucide-react';
import { SUPER_ADMIN } from '../../Super-admin-file';

interface FooterProps {
  setCurrentTab: (tab: 'home' | 'students' | 'gallery') => void;
  onOpenAdmin: () => void;
  onOpenSuperAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentTab,
  onOpenAdmin,
  onOpenSuperAdmin
}) => {
  const footer = SUPER_ADMIN.footerSettings;
  const banners = SUPER_ADMIN.bannerManagement;

  return (
    <footer className="w-full bg-[#08060D] border-t border-purple-900/50 py-10 mt-16 relative overflow-hidden">
      
      {/* Dynamic Footer Banner Background from SUPER_ADMIN if present */}
      {banners.pic.footerBanner && (
        <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-screen">
          <img
            src={banners.pic.footerBanner}
            alt="Footer Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Ambient footer glow */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#6D28D9]/15 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-purple-950/70">
          
          {/* Left: College Logo & Name */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#6D28D9] via-[#FBBF24] to-[#6D28D9] shadow-[0_0_15px_rgba(109,40,217,0.4)] flex items-center justify-center overflow-hidden">
              <img
                src={footer.pic.footerLogo || SUPER_ADMIN.websiteBranding.pic.collegeLogo}
                alt={footer.txt.collegeName}
                className="w-full h-full object-contain rounded-full bg-[#0A0A0A]"
              />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base tracking-wider text-white uppercase">
                {footer.txt.collegeName}
              </h2>
              <p className="text-xs text-[#CFCFCF] tracking-wider uppercase font-medium">
                {footer.txt.batchName}
              </p>
            </div>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold text-[#CFCFCF]">
            <button
              onClick={() => {
                setCurrentTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#FBBF24] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentTab('students');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#FBBF24] transition-colors"
            >
              Student List
            </button>
            <button
              onClick={() => {
                setCurrentTab('gallery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#FBBF24] transition-colors"
            >
              Gallery
            </button>
          </div>

          {/* Right: Social Media Links */}
          <div className="flex items-center gap-4">
            {/* Facebook */}
            <a
              href={footer.txt.facebookLink || 'https://facebook.com'}
              target="_blank"
              rel="noreferrer"
              title="Facebook"
              className="w-9 h-9 rounded-full bg-[#161224] border border-purple-800/50 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#FBBF24] hover:scale-110 transition-all shadow-[0_0_10px_rgba(109,40,217,0.2)]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href={footer.txt.instagramLink || 'https://instagram.com'}
              target="_blank"
              rel="noreferrer"
              title="Instagram"
              className="w-9 h-9 rounded-full bg-[#161224] border border-purple-800/50 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#FBBF24] hover:scale-110 transition-all shadow-[0_0_10px_rgba(109,40,217,0.2)]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a
              href={footer.txt.youtubeLink || 'https://youtube.com'}
              target="_blank"
              rel="noreferrer"
              title="YouTube"
              className="w-9 h-9 rounded-full bg-[#161224] border border-purple-800/50 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#FBBF24] hover:scale-110 transition-all shadow-[0_0_10px_rgba(109,40,217,0.2)]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p className="font-serif italic text-gray-300 text-center sm:text-left">
            "{footer.txt.quote}"
          </p>
          
          <div className="flex items-center gap-4">
            <p className="text-center sm:text-right text-[11px] text-gray-400">
              {footer.txt.copyright}
            </p>

            {/* Registration Admin Panel link (Access ID: Admin.rgnic27) */}
            <button
              onClick={onOpenAdmin}
              className="text-gray-400 hover:text-gray-200 text-[11px] underline cursor-pointer transition-colors flex items-center gap-1"
              title="Registration Approval & Reports"
            >
              <Shield className="w-3 h-3 text-purple-400" />
              <span>{footer.txt.adminLabel || 'Admin Panel'}</span>
            </button>

            {/* Super Admin Access Link */}
            {onOpenSuperAdmin && (
              <button
                onClick={onOpenSuperAdmin}
                className="text-gray-500 hover:text-[#FBBF24] text-[11px] cursor-pointer transition-colors flex items-center gap-1"
                title="Super Admin Website Content"
              >
                <Lock className="w-3 h-3 opacity-60 hover:opacity-100" />
                <span className="opacity-70 hover:opacity-100">Super Admin</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
