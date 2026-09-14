import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SUPER_ADMIN } from '../../Super-admin-file';

interface NavbarProps {
  currentTab: 'home' | 'students' | 'gallery';
  setCurrentTab: (tab: 'home' | 'students' | 'gallery') => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const branding = SUPER_ADMIN.websiteBranding;

  const navLinks: Array<{ id: 'home' | 'students' | 'gallery'; label: string }> = [
    { id: 'home', label: branding.txt.navHome },
    { id: 'students', label: branding.txt.navStudentList },
    { id: 'gallery', label: branding.txt.navGallery }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A0A0A]/90 backdrop-blur-md border-b border-purple-900/40 shadow-[0_4px_25px_rgba(109,40,217,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left Side: College Logo & Name */}
        <button
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3.5 text-left group focus:outline-none"
          title={branding.txt.collegeName}
        >
          <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#6D28D9] via-[#FBBF24] to-[#6D28D9] shadow-[0_0_15px_rgba(109,40,217,0.5)] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center overflow-hidden">
            <img
              src={branding.pic.collegeLogo}
              alt={branding.txt.collegeName}
              className="w-full h-full object-contain rounded-full bg-[#0A0A0A]"
            />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-wider text-white uppercase group-hover:text-[#FBBF24] transition-colors">
              {branding.txt.collegeName}
            </h1>
            <p className="text-xs text-[#CFCFCF] tracking-wider uppercase font-medium">
              {branding.txt.batchName}
            </p>
          </div>
        </button>

        {/* Center: Nav Items */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3 bg-[#111111]/80 px-4 py-1.5 rounded-full border border-purple-900/30">
          {navLinks.map(link => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-[#6D28D9] text-white shadow-[0_0_18px_rgba(109,40,217,0.7)] scale-105'
                    : 'text-[#CFCFCF] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Side: RAD Day Registration Shortcut */}
        <div className="hidden sm:flex items-center gap-3.5">
          <button
            onClick={() => {
              setCurrentTab('home');
              const regSection = document.getElementById('register-section');
              if (regSection) {
                regSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }
            }}
            title={branding.txt.navRegisterBtn}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#FBBF24]/80 text-[#FBBF24] bg-[#FBBF24]/10 hover:bg-[#FBBF24]/20 text-xs sm:text-sm font-bold tracking-wide transition-all shadow-[0_0_14px_rgba(251,191,36,0.3)] hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] group"
          >
            <span>{branding.txt.navRegisterBtn}</span>
            <span className="text-xs bg-[#FBBF24] text-black px-1.5 py-0.5 rounded font-black group-hover:bg-white transition-colors">
              {branding.txt.batchShort}
            </span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#140D26] border border-purple-800/50 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F0D17] border-b border-purple-900/50 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col gap-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                  currentTab === link.id
                    ? 'bg-[#6D28D9] text-white'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-800 flex justify-between items-center">
            <button
              onClick={() => {
                setCurrentTab('home');
                setMobileMenuOpen(false);
                const regSection = document.getElementById('register-section');
                if (regSection) regSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-center py-2.5 rounded-lg bg-[#FBBF24] text-black font-bold text-sm"
            >
              {branding.txt.navRegisterBtn} ({branding.txt.batchShort})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
