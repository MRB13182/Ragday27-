import React, { useState } from 'react';
import { X, Lock, KeyRound, Copy, Check, Download, RotateCcw, Save, ShieldCheck } from 'lucide-react';
import { SUPER_ADMIN, updateSuperAdmin } from '../../Super-admin-file';

interface SuperAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuperAdminModal: React.FC<SuperAdminModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'branding' | 'hero' | 'event' | 'registration' | 'jersey' | 'fonts' | 'banners' | 'footer' | 'gallery'
  >('branding');

  // Working copy of SUPER_ADMIN for edits
  const [config, setConfig] = useState(() => JSON.parse(JSON.stringify(SUPER_ADMIN)));
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'adminrdnic27.com') {
      setIsAuthenticated(true);
      setErrorMsg('');
      setConfig(JSON.parse(JSON.stringify(SUPER_ADMIN)));
    } else {
      setErrorMsg('Invalid Access Key. Access Denied.');
    }
  };

  const handleSave = () => {
    updateSuperAdmin(current => {
      Object.assign(current, config);
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const generateTsFileContent = () => {
    return `/**\n * MASTER SUPER ADMIN CONFIGURATION FILE\n * Single source of truth for all website content\n */\nexport const SUPER_ADMIN = ${JSON.stringify(config, null, 2)};\n`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateTsFileContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const element = document.createElement('a');
    const file = new Blob([generateTsFileContent()], { type: 'text/typescript' });
    element.href = URL.createObjectURL(file);
    element.download = 'Super-admin-file.ts';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    if (confirm('Reset to defaults and clear saved custom configurations?')) {
      localStorage.removeItem('SUPER_ADMIN_CUSTOM_CONFIG');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#12101B] border-2 border-purple-600/70 rounded-2xl max-w-5xl w-full max-h-[94dvh] flex flex-col text-gray-200 shadow-[0_0_50px_rgba(109,40,217,0.5)] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#171324] border-b border-purple-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-[#FBBF24]/50 flex items-center justify-center text-[#FBBF24]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide uppercase">
                SUPER ADMIN MASTER CONTROLLER
              </h2>
              <p className="text-[10px] text-gray-400 font-mono">
                Source: /Super-admin-file.ts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Authenticated State */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto my-auto text-center">
            <div className="w-14 h-14 rounded-full bg-purple-950/60 border border-purple-700/60 flex items-center justify-center text-purple-300 mx-auto mb-4 shadow-[0_0_20px_rgba(109,40,217,0.3)]">
              <KeyRound className="w-7 h-7 text-[#FBBF24]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Master Content Access Required</h3>
            <p className="text-xs text-gray-400 mb-6">
              Enter the Super Admin access key to manage all website text, banners, jersey settings, and configurations.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="Enter Access Key"
                  autoFocus
                  className="w-full bg-[#1A162B] border border-purple-900/80 focus:border-[#FBBF24] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition text-center tracking-widest font-mono"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-400 font-semibold bg-red-950/40 p-2 rounded border border-red-800/40">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(109,40,217,0.5)]"
              >
                Unlock Super Admin
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Action Bar */}
            <div className="px-5 py-2.5 bg-[#0E0C17] border-b border-purple-950/70 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {[
                  { id: 'branding', label: 'Branding' },
                  { id: 'hero', label: 'Hero Section' },
                  { id: 'event', label: 'Event Details' },
                  { id: 'registration', label: 'Registration' },
                  { id: 'jersey', label: 'Jersey Design' },
                  { id: 'fonts', label: 'Custom Fonts' },
                  { id: 'banners', label: 'Banners' },
                  { id: 'footer', label: 'Footer' },
                  { id: 'gallery', label: 'Gallery' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition whitespace-nowrap ${
                      activeTab === t.id
                        ? 'bg-[#6D28D9] text-white shadow-[0_0_12px_rgba(109,40,217,0.5)]'
                        : 'bg-[#181426] text-gray-400 hover:text-white border border-purple-950/60'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saveSuccess ? 'Saved!' : 'Save Live'}</span>
                </button>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-[#251D3E] hover:bg-[#342858] text-[#FBBF24] border border-amber-500/40 font-bold flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy File Code</span>
                </button>
                <button
                  onClick={handleDownloadFile}
                  className="px-3 py-1.5 rounded-lg bg-[#1D1830] hover:bg-[#282142] text-gray-300 font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .ts</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/40"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tab Form Fields */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* 1. BRANDING TAB */}
              {activeTab === 'branding' && (
                <div className="space-y-4 max-w-3xl">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#FBBF24]">Website Branding</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">College Full Name</label>
                      <input
                        type="text"
                        value={config.websiteBranding.txt.collegeName || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.websiteBranding.txt.collegeName = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">College Short Code</label>
                      <input
                        type="text"
                        value={config.websiteBranding.txt.collegeShortName || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.websiteBranding.txt.collegeShortName = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Batch Name</label>
                      <input
                        type="text"
                        value={config.websiteBranding.txt.batchName || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.websiteBranding.txt.batchName = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Event Title</label>
                      <input
                        type="text"
                        value={config.websiteBranding.txt.eventTitle || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.websiteBranding.txt.eventTitle = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">College Logo URL / Path</label>
                      <input
                        type="text"
                        value={config.websiteBranding.pic.collegeLogo || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.websiteBranding.pic.collegeLogo = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">RAD Day Logo URL / Path</label>
                      <input
                        type="text"
                        value={config.websiteBranding.pic.radDayLogo || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.websiteBranding.pic.radDayLogo = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. HERO TAB */}
              {activeTab === 'hero' && (
                <div className="space-y-4 max-w-3xl">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#FBBF24]">Hero Section</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Top Badge Text</label>
                      <input
                        type="text"
                        value={config.heroSection.txt.badge || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.heroSection.txt.badge = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Hero Title</label>
                      <input
                        type="text"
                        value={config.heroSection.txt.title || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.heroSection.txt.title = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Batch Year Badge</label>
                      <input
                        type="text"
                        value={config.heroSection.txt.batch || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.heroSection.txt.batch = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Top Quote</label>
                      <input
                        type="text"
                        value={config.heroSection.txt.topQuote || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.heroSection.txt.topQuote = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-300 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={config.heroSection.txt.tagline || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.heroSection.txt.tagline = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-300 mb-1">Hero Background Image Path / URL</label>
                      <input
                        type="text"
                        value={config.heroSection.pic.bannerImage || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.heroSection.pic.bannerImage = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. EVENT DETAILS TAB */}
              {activeTab === 'event' && (
                <div className="space-y-4 max-w-3xl">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#FBBF24]">Event Details & Countdown</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Event Date (Display)</label>
                      <input
                        type="text"
                        value={config.eventDetails.txt.eventDate || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.eventDetails.txt.eventDate = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Event Time</label>
                      <input
                        type="text"
                        value={config.eventDetails.txt.eventTime || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.eventDetails.txt.eventTime = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Venue</label>
                      <input
                        type="text"
                        value={config.eventDetails.txt.venue || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.eventDetails.txt.venue = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Countdown ISO Target (YYYY-MM-DDTHH:MM:SS)</label>
                      <input
                        type="text"
                        value={config.eventDetails.txt.countdownTarget || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.eventDetails.txt.countdownTarget = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. REGISTRATION SETTINGS TAB */}
              {activeTab === 'registration' && (
                <div className="space-y-4 max-w-3xl">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#FBBF24]">Registration Fees & Payment</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Base Registration Fee</label>
                      <input
                        type="number"
                        value={config.registrationSettings.txt.baseFee || 0}
                        onChange={e => {
                          const c = { ...config };
                          c.registrationSettings.txt.baseFee = Number(e.target.value);
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Extra Charge for 4XL</label>
                      <input
                        type="number"
                        value={config.registrationSettings.txt.extraCharge4XL || 0}
                        onChange={e => {
                          const c = { ...config };
                          c.registrationSettings.txt.extraCharge4XL = Number(e.target.value);
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Currency Symbol</label>
                      <input
                        type="text"
                        value={config.registrationSettings.txt.currency || '৳'}
                        onChange={e => {
                          const c = { ...config };
                          c.registrationSettings.txt.currency = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">bKash Send Money Number</label>
                      <input
                        type="text"
                        value={config.registrationSettings.txt.bkashNumber || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.registrationSettings.txt.bkashNumber = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Nagad Send Money Number</label>
                      <input
                        type="text"
                        value={config.registrationSettings.txt.nagadNumber || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.registrationSettings.txt.nagadNumber = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Rocket Send Money Number</label>
                      <input
                        type="text"
                        value={config.registrationSettings.txt.rocketNumber || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.registrationSettings.txt.rocketNumber = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. JERSEY TAB */}
              {activeTab === 'jersey' && (
                <div className="space-y-4 max-w-3xl">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#FBBF24]">Jersey & Showcase Quotes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Quote Line 1</label>
                      <input
                        type="text"
                        value={config.jerseyManagement.txt.quoteLine1 || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.jerseyManagement.txt.quoteLine1 = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Quote Line 2</label>
                      <input
                        type="text"
                        value={config.jerseyManagement.txt.quoteLine2 || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.jerseyManagement.txt.quoteLine2 = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Front Jersey Image Path</label>
                      <input
                        type="text"
                        value={config.jerseyManagement.pic.frontJersey || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.jerseyManagement.pic.frontJersey = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Back Jersey Image Path</label>
                      <input
                        type="text"
                        value={config.jerseyManagement.pic.backJersey || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.jerseyManagement.pic.backJersey = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 6. FONTS TAB */}
              {activeTab === 'fonts' && (
                <div className="space-y-4 max-w-3xl">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#FBBF24]">Custom Font Files & Digit Overrides</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Jersey Name Font</label>
                      <input
                        type="text"
                        value={config.jerseyCustomFont.txt.fontJersey || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.jerseyCustomFont.txt.fontJersey = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Jersey Number Font</label>
                      <input
                        type="text"
                        value={config.jerseyCustomFont.txt.fontNumber || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.jerseyCustomFont.txt.fontNumber = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-gray-400 mb-2">Optional Individual Digit Image Glyphs (0-9):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {['0','1','2','3','4','5','6','7','8','9'].map(d => (
                        <div key={d}>
                          <label className="block text-[10px] text-gray-400">Digit {d} Image URL</label>
                          <input
                            type="text"
                            placeholder="Optional Image URL"
                            value={(config.jerseyCustomFont as any)[d] || ''}
                            onChange={e => {
                              const c = { ...config };
                              (c.jerseyCustomFont as any)[d] = e.target.value;
                              setConfig(c);
                            }}
                            className="w-full bg-[#181426] border border-purple-900/60 rounded p-1 text-[11px] text-white font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 7. BANNERS TAB */}
              {activeTab === 'banners' && (
                <div className="space-y-4 max-w-3xl">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#FBBF24]">Banner Management</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Main Banner Image Path</label>
                      <input
                        type="text"
                        value={config.bannerManagement.pic.mainBanner || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.bannerManagement.pic.mainBanner = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Footer Banner Image Path</label>
                      <input
                        type="text"
                        value={config.bannerManagement.pic.footerBanner || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.bannerManagement.pic.footerBanner = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 8. FOOTER TAB */}
              {activeTab === 'footer' && (
                <div className="space-y-4 max-w-3xl">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#FBBF24]">Footer Content & Social Links</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-300 mb-1">Footer Quote</label>
                      <input
                        type="text"
                        value={config.footerSettings.txt.quote || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.footerSettings.txt.quote = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Facebook URL</label>
                      <input
                        type="text"
                        value={config.footerSettings.txt.facebookLink || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.footerSettings.txt.facebookLink = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={config.footerSettings.txt.instagramLink || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.footerSettings.txt.instagramLink = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">YouTube URL</label>
                      <input
                        type="text"
                        value={config.footerSettings.txt.youtubeLink || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.footerSettings.txt.youtubeLink = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Copyright Line</label>
                      <input
                        type="text"
                        value={config.footerSettings.txt.copyright || ''}
                        onChange={e => {
                          const c = { ...config };
                          c.footerSettings.txt.copyright = e.target.value;
                          setConfig(c);
                        }}
                        className="w-full bg-[#181426] border border-purple-900/60 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 9. GALLERY TAB */}
              {activeTab === 'gallery' && (
                <div className="space-y-4 max-w-3xl">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#FBBF24]">Gallery CMS Items ({config.galleryCMS.pic.items?.length || 0})</h3>
                  <div className="space-y-3">
                    {(config.galleryCMS.pic.items || []).map((item: any, idx: number) => (
                      <div key={item.id || idx} className="p-3 bg-[#181426] border border-purple-900/60 rounded-xl space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Title"
                            value={item.title || ''}
                            onChange={e => {
                              const c = { ...config };
                              c.galleryCMS.pic.items[idx].title = e.target.value;
                              setConfig(c);
                            }}
                            className="bg-[#120F1D] border border-purple-950/80 rounded px-2 py-1 text-xs text-white"
                          />
                          <input
                            type="text"
                            placeholder="Category (Jersey, Campus, Prep, Memories)"
                            value={item.category || ''}
                            onChange={e => {
                              const c = { ...config };
                              c.galleryCMS.pic.items[idx].category = e.target.value;
                              setConfig(c);
                            }}
                            className="bg-[#120F1D] border border-purple-950/80 rounded px-2 py-1 text-xs text-white"
                          />
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={item.imageUrl || ''}
                            onChange={e => {
                              const c = { ...config };
                              c.galleryCMS.pic.items[idx].imageUrl = e.target.value;
                              setConfig(c);
                            }}
                            className="bg-[#120F1D] border border-purple-950/80 rounded px-2 py-1 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
