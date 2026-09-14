import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Upload,
  Save,
  RefreshCw,
  Database,
  Image as ImageIcon,
  Type,
  Calendar,
  CreditCard,
  Shirt,
  Layers,
  Share2,
  FolderTree,
  Check,
  Copy,
  ExternalLink,
  AlertCircle,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  cmsStore,
  CompleteCmsState,
  CmsGalleryItem,
  generateDefaultDigitSvg
} from '../services/cmsService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { SUPABASE_SQL_SCHEMA } from '../services/schemaSqlText';

interface SuperAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CmsTab =
  | 'branding'
  | 'hero'
  | 'event'
  | 'registration'
  | 'jersey'
  | 'fonts'
  | 'banners'
  | 'footer'
  | 'gallery'
  | 'asset_manager'
  | 'database';

export const SuperAdminModal: React.FC<SuperAdminModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKeyInput, setAccessKeyInput] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'key' | 'supabase'>('key');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<CmsTab>('branding');

  // Form State
  const [cmsData, setCmsData] = useState<CompleteCmsState>(cmsStore.getState());
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  // Gallery Management State
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState<Partial<CmsGalleryItem>>({
    title: '',
    description: '',
    category: 'Jersey',
    image_url: '',
    is_active: true,
    sort_order: 1
  });
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('All');

  // Font Tester state
  const [fontTestNumber, setFontTestNumber] = useState('27');

  // Asset folder filter
  const [assetFolderFilter, setAssetFolderFilter] = useState<'all' | 'logo' | 'banner' | 'jersey' | 'fonts' | 'footer'>('all');

  useEffect(() => {
    // Check if user is already authenticated with Supabase
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data }) => {
        if (data && data.session) {
          setIsAuthenticated(true);
        }
      });
    }

    const unsub = cmsStore.subscribe(() => {
      setCmsData({ ...cmsStore.getState() });
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'key') {
      if (accessKeyInput.trim() === 'adminrdnic27.com') {
        setIsAuthenticated(true);
        setAuthError('');
        setAccessKeyInput('');
      } else {
        setAuthError('Invalid Super Admin Access Key. Access Denied.');
      }
    } else {
      // Supabase email + password login
      if (!authEmail.trim() || !authPassword.trim()) {
        setAuthError('Please enter admin email and password.');
        return;
      }
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail.trim(),
          password: authPassword.trim()
        });
        if (error || !data.session) {
          setAuthError(error?.message || 'Authentication failed. Please check credentials.');
        } else {
          setIsAuthenticated(true);
          setAuthError('');
        }
      } catch (err: any) {
        setAuthError(err.message || 'Supabase authentication error.');
      }
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setAccessKeyInput('');
    setAuthEmail('');
    setAuthPassword('');
    setAuthError('');
  };

  // Gallery CRUD Handlers
  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFormData.title?.trim() || !galleryFormData.image_url?.trim()) {
      setStatusMessage('Title and Image are required for gallery item.');
      return;
    }

    if (editingGalleryId) {
      await cmsStore.updateGalleryItem(editingGalleryId, {
        title: galleryFormData.title,
        description: galleryFormData.description || '',
        category: galleryFormData.category || 'Memories',
        image_url: galleryFormData.image_url,
        is_active: galleryFormData.is_active ?? true,
        sort_order: Number(galleryFormData.sort_order) || 1
      });
      setEditingGalleryId(null);
      setStatusMessage('Gallery item updated successfully!');
    } else {
      await cmsStore.addGalleryItem({
        title: galleryFormData.title,
        description: galleryFormData.description || '',
        category: galleryFormData.category || 'Memories',
        image_url: galleryFormData.image_url,
        is_active: galleryFormData.is_active ?? true,
        sort_order: Number(galleryFormData.sort_order) || (cmsData.gallery.length + 1)
      });
      setIsAddingGallery(false);
      setStatusMessage('Gallery item added successfully!');
    }

    setGalleryFormData({
      title: '',
      description: '',
      category: 'Jersey',
      image_url: '',
      is_active: true,
      sort_order: cmsData.gallery.length + 1
    });

    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleDeleteGallery = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      await cmsStore.deleteGalleryItem(id);
      setStatusMessage('Gallery item deleted.');
      setTimeout(() => setStatusMessage(''), 2500);
    }
  };

  const handleToggleGalleryActive = async (id: string) => {
    await cmsStore.toggleGalleryActive(id);
  };

  const handleStartEditGallery = (item: CmsGalleryItem) => {
    setEditingGalleryId(item.id);
    setIsAddingGallery(false);
    setGalleryFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      image_url: item.image_url,
      is_active: item.is_active,
      sort_order: item.sort_order
    });
  };

  const handleMoveGalleryOrder = async (item: CmsGalleryItem, direction: 'up' | 'down') => {
    const currentOrder = item.sort_order || 0;
    const newOrder = direction === 'up' ? Math.max(1, currentOrder - 1) : currentOrder + 1;
    await cmsStore.updateGalleryItem(item.id, { sort_order: newOrder });
  };

  // Helper for uploading and updating state
  const handleFileUpload = async (
    folder: 'logo' | 'banner' | 'jersey' | 'fonts' | 'footer',
    file: File,
    onSuccess: (url: string) => void,
    customName?: string
  ) => {
    setSaveStatus('saving');
    setStatusMessage(`Uploading asset to /public/${folder}/...`);
    const res = await cmsStore.uploadAsset(folder, file, customName);
    if (res.success && res.url) {
      onSuccess(res.url);
      setSaveStatus('idle');
      setStatusMessage('Asset uploaded successfully');
    } else {
      setSaveStatus('error');
      setStatusMessage(res.error || 'Failed to upload asset');
    }
  };

  // Save all changes
  const handleSaveAll = async () => {
    setSaveStatus('saving');
    setStatusMessage('Saving CMS settings and synchronizing with Supabase...');
    
    // Save locally
    cmsStore.updateLocalState(cmsData);

    // Push to Supabase
    const res = await cmsStore.pushAllToSupabase();
    if (res.success) {
      setSaveStatus('saved');
      setStatusMessage('Saved to Supabase database & storage successfully!');
      setTimeout(() => {
        setSaveStatus('idle');
        setStatusMessage('');
      }, 3000);
    } else {
      setSaveStatus('saved'); // Local saved anyway
      setStatusMessage('Saved locally. (Note: Run SQL schema in Supabase to sync remote database)');
      setTimeout(() => {
        setSaveStatus('idle');
        setStatusMessage('');
      }, 4000);
    }
  };

  // Sync from Supabase
  const handleSyncFromSupabase = async () => {
    setSaveStatus('saving');
    setStatusMessage('Syncing latest CMS data from Supabase...');
    const res = await cmsStore.syncFromSupabase();
    if (res.success) {
      setCmsData({ ...cmsStore.getState() });
      setSaveStatus('saved');
      setStatusMessage('Successfully synchronized from Supabase!');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } else {
      setSaveStatus('error');
      setStatusMessage(res.error || 'Could not fetch from Supabase. Ensure tables exist.');
      setTimeout(() => setSaveStatus('idle'), 3500);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#111116] border border-purple-600/70 rounded-2xl max-w-6xl w-full max-h-[95dvh] flex flex-col text-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#171720] border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-600 to-amber-500 text-white shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-wide flex items-center gap-2">
                <span>Super Admin CMS</span>
                <span className="text-[10px] font-mono font-normal uppercase px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/50 text-[#FBBF24]">
                  Website Management Portal
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                <button
                  onClick={handleSaveAll}
                  disabled={saveStatus === 'saving'}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-md active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saveStatus === 'saving' ? 'Saving...' : 'Save & Publish'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-400 hover:text-white underline transition"
                >
                  Logout
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className={`px-4 py-2 text-xs font-semibold flex items-center justify-between ${
            saveStatus === 'saved' ? 'bg-emerald-950/90 text-emerald-300 border-b border-emerald-800' :
            saveStatus === 'error' ? 'bg-rose-950/90 text-rose-300 border-b border-rose-800' :
            'bg-purple-950/90 text-purple-300 border-b border-purple-800'
          }`}>
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage('')} className="text-xs hover:text-white">✕</button>
          </div>
        )}

        {/* Body Container */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!isAuthenticated ? (
            /* ================= KEY PROMPT (KEY IS NOT VISIBLE ANYWHERE) ================= */
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="max-w-sm w-full bg-[#181820] border border-gray-700/80 rounded-2xl p-7 shadow-2xl">
                <div className="w-12 h-12 rounded-xl bg-purple-900/60 border border-purple-600/50 flex items-center justify-center mx-auto mb-4 text-[#FBBF24]">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white text-center mb-1">
                  Super Admin Access
                </h3>
                <p className="text-xs text-gray-400 text-center mb-4">
                  Authenticate to access full website management and Supabase sync
                </p>

                {/* Mode Selector */}
                <div className="flex rounded-lg bg-black/40 p-1 border border-gray-800 mb-4">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('key'); setAuthError(''); }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                      authMode === 'key' ? 'bg-purple-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Access Key
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('supabase'); setAuthError(''); }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                      authMode === 'supabase' ? 'bg-purple-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Supabase Admin
                  </button>
                </div>

                <form onSubmit={handleKeySubmit} className="space-y-4">
                  {authMode === 'key' ? (
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">
                        Super Admin Access Key
                      </label>
                      <input
                        type="password"
                        value={accessKeyInput}
                        onChange={e => {
                          setAccessKeyInput(e.target.value);
                          if (authError) setAuthError('');
                        }}
                        placeholder="Enter Super Admin Access Key"
                        autoFocus
                        className="w-full bg-[#0e0e13] border border-gray-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1.5">
                          Admin Email
                        </label>
                        <input
                          type="email"
                          value={authEmail}
                          onChange={e => setAuthEmail(e.target.value)}
                          placeholder="admin@ragday27.com"
                          className="w-full bg-[#0e0e13] border border-gray-700 focus:border-purple-500 rounded-xl px-4 py-2 text-sm text-white outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1.5">
                          Admin Password
                        </label>
                        <input
                          type="password"
                          value={authPassword}
                          onChange={e => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#0e0e13] border border-gray-700 focus:border-purple-500 rounded-xl px-4 py-2 text-sm text-white outline-none transition"
                        />
                      </div>
                    </div>
                  )}

                  {authError && (
                    <div className="flex items-center gap-2 text-xs text-red-400 font-semibold bg-red-950/50 border border-red-800/40 p-2.5 rounded-lg">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm transition shadow-lg active:scale-98"
                  >
                    Unlock CMS Dashboard
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* ================= FULL CMS DASHBOARD ================= */
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* Sidebar Navigation */}
              <div className="w-full md:w-60 bg-[#14141c] border-b md:border-b-0 md:border-r border-gray-800 flex md:flex-col overflow-x-auto md:overflow-y-auto p-2 md:p-3 gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('branding')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'branding'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#FBBF24]" />
                  <span>1. Website Branding</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('hero')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'hero'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Type className="w-4 h-4 text-purple-400" />
                  <span>2. Hero Section</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('event')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'event'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>3. Event Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('registration')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'registration'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>4. Registration Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('jersey')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'jersey'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Shirt className="w-4 h-4 text-amber-400" />
                  <span>5. Jersey Management</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('fonts')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'fonts'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Type className="w-4 h-4 text-[#FBBF24]" />
                  <span>6. Jersey Custom Font</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('banners')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'banners'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-rose-400" />
                  <span>7. Banner Management</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('footer')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'footer'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Share2 className="w-4 h-4 text-teal-400" />
                  <span>8. Footer Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('asset_manager')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'asset_manager'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FolderTree className="w-4 h-4 text-amber-400" />
                  <span>9. Asset Manager</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('gallery')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'gallery'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-pink-400" />
                  <span>10. Gallery CMS</span>
                </button>

                <div className="pt-2 mt-2 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('database')}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition w-full whitespace-nowrap ${
                      activeTab === 'database'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-indigo-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Database className="w-4 h-4 text-[#FBBF24]" />
                    <span>Supabase SQL & Sync</span>
                  </button>
                </div>
              </div>

              {/* Main Content Form Area */}
              <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
                
                {/* 1. WEBSITE BRANDING */}
                {activeTab === 'branding' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    <div>
                      <h3 className="text-base font-bold text-white">1. Website Branding</h3>
                      <p className="text-xs text-gray-400">
                        Upload and replace logos stored in Supabase Storage <code className="text-[#FBBF24]">/public/logo/</code>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* College Logo */}
                      <div className="bg-[#181820] border border-gray-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-white">College Logo</label>
                          <span className="text-[11px] text-gray-400 font-mono">/public/logo/college-logo.png</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <img
                            src={cmsData.assets.college_logo}
                            alt="College Logo"
                            className="w-16 h-16 object-contain rounded-lg bg-black/40 border border-gray-700 p-1"
                          />
                          <div className="flex-1 space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              id="upload-college-logo"
                              className="hidden"
                              onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) handleFileUpload('logo', f, url => setCmsData(p => ({ ...p, assets: { ...p.assets, college_logo: url } })), 'college-logo');
                              }}
                            />
                            <label
                              htmlFor="upload-college-logo"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold cursor-pointer transition shadow"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload & Replace</span>
                            </label>
                            <input
                              type="text"
                              value={cmsData.assets.college_logo}
                              onChange={e => setCmsData(p => ({ ...p, assets: { ...p.assets, college_logo: e.target.value } }))}
                              placeholder="Or enter image URL"
                              className="w-full bg-[#0e0e13] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Header Logo */}
                      <div className="bg-[#181820] border border-gray-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-white">Header Logo</label>
                          <span className="text-[11px] text-gray-400 font-mono">/public/logo/rad-day-logo.png</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <img
                            src={cmsData.assets.header_logo}
                            alt="Header Logo"
                            className="w-16 h-16 object-contain rounded-lg bg-black/40 border border-gray-700 p-1"
                          />
                          <div className="flex-1 space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              id="upload-header-logo"
                              className="hidden"
                              onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) handleFileUpload('logo', f, url => setCmsData(p => ({ ...p, assets: { ...p.assets, header_logo: url } })), 'rad-day-logo');
                              }}
                            />
                            <label
                              htmlFor="upload-header-logo"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold cursor-pointer transition shadow"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload & Replace</span>
                            </label>
                            <input
                              type="text"
                              value={cmsData.assets.header_logo}
                              onChange={e => setCmsData(p => ({ ...p, assets: { ...p.assets, header_logo: e.target.value } }))}
                              placeholder="Or enter image URL"
                              className="w-full bg-[#0e0e13] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Footer Logo */}
                      <div className="bg-[#181820] border border-gray-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-white">Footer Logo</label>
                          <span className="text-[11px] text-gray-400 font-mono">/public/logo/footer-logo.png</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <img
                            src={cmsData.assets.footer_logo}
                            alt="Footer Logo"
                            className="w-16 h-16 object-contain rounded-lg bg-black/40 border border-gray-700 p-1"
                          />
                          <div className="flex-1 space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              id="upload-footer-logo"
                              className="hidden"
                              onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) handleFileUpload('logo', f, url => setCmsData(p => ({ ...p, assets: { ...p.assets, footer_logo: url } })), 'footer-logo');
                              }}
                            />
                            <label
                              htmlFor="upload-footer-logo"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold cursor-pointer transition shadow"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload & Replace</span>
                            </label>
                            <input
                              type="text"
                              value={cmsData.assets.footer_logo}
                              onChange={e => setCmsData(p => ({ ...p, assets: { ...p.assets, footer_logo: e.target.value } }))}
                              placeholder="Or enter image URL"
                              className="w-full bg-[#0e0e13] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Favicon */}
                      <div className="bg-[#181820] border border-gray-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-white">Favicon</label>
                          <span className="text-[11px] text-gray-400 font-mono">/public/logo/favicon.png</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <img
                            src={cmsData.assets.favicon}
                            alt="Favicon"
                            className="w-16 h-16 object-contain rounded-lg bg-black/40 border border-gray-700 p-1"
                          />
                          <div className="flex-1 space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              id="upload-favicon"
                              className="hidden"
                              onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) handleFileUpload('logo', f, url => setCmsData(p => ({ ...p, assets: { ...p.assets, favicon: url } })), 'favicon');
                              }}
                            />
                            <label
                              htmlFor="upload-favicon"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold cursor-pointer transition shadow"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload & Replace</span>
                            </label>
                            <input
                              type="text"
                              value={cmsData.assets.favicon}
                              onChange={e => setCmsData(p => ({ ...p, assets: { ...p.assets, favicon: e.target.value } }))}
                              placeholder="Or enter image URL"
                              className="w-full bg-[#0e0e13] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. HERO SECTION */}
                {activeTab === 'hero' && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div>
                      <h3 className="text-base font-bold text-white">2. Hero Section</h3>
                      <p className="text-xs text-gray-400">
                        Edit quotes, titles, taglines, and hero banner background
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Top Quote</label>
                        <input
                          type="text"
                          value={cmsData.settings.hero_top_quote}
                          onChange={e => setCmsData(p => ({ ...p, settings: { ...p.settings, hero_top_quote: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Main Title</label>
                        <input
                          type="text"
                          value={cmsData.settings.hero_title}
                          onChange={e => setCmsData(p => ({ ...p, settings: { ...p.settings, hero_title: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={cmsData.settings.hero_subtitle}
                          onChange={e => setCmsData(p => ({ ...p, settings: { ...p.settings, hero_subtitle: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Tagline</label>
                        <input
                          type="text"
                          value={cmsData.settings.hero_tagline}
                          onChange={e => setCmsData(p => ({ ...p, settings: { ...p.settings, hero_tagline: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Hero Banner Image */}
                    <div className="bg-[#181820] border border-gray-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white">Hero Banner Image</label>
                        <span className="text-[11px] text-gray-400 font-mono">/public/banner/main-banner.jpg</span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <img
                          src={cmsData.banners.rad_day_main_banner}
                          alt="Main Banner"
                          className="w-full sm:w-48 h-28 object-cover rounded-lg border border-gray-700"
                        />
                        <div className="flex-1 w-full space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            id="upload-main-banner"
                            className="hidden"
                            onChange={e => {
                              const f = e.target.files?.[0];
                              if (f) handleFileUpload('banner', f, url => setCmsData(p => ({ ...p, banners: { ...p.banners, rad_day_main_banner: url } })), 'main-banner');
                            }}
                          />
                          <label
                            htmlFor="upload-main-banner"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold cursor-pointer transition shadow"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload Hero Banner</span>
                          </label>
                          <input
                            type="text"
                            value={cmsData.banners.rad_day_main_banner}
                            onChange={e => setCmsData(p => ({ ...p, banners: { ...p.banners, rad_day_main_banner: e.target.value } }))}
                            placeholder="Image URL"
                            className="w-full bg-[#0e0e13] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. EVENT DETAILS */}
                {activeTab === 'event' && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div>
                      <h3 className="text-base font-bold text-white">3. Event Details</h3>
                      <p className="text-xs text-gray-400">
                        Date, time, venue, and batch identity
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Event Date</label>
                        <input
                          type="text"
                          value={cmsData.settings.event_date}
                          onChange={e => setCmsData(p => ({ ...p, settings: { ...p.settings, event_date: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Event Time</label>
                        <input
                          type="text"
                          value={cmsData.settings.event_time}
                          onChange={e => setCmsData(p => ({ ...p, settings: { ...p.settings, event_time: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Event Venue</label>
                        <input
                          type="text"
                          value={cmsData.settings.event_venue}
                          onChange={e => setCmsData(p => ({ ...p, settings: { ...p.settings, event_venue: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">College Name</label>
                        <input
                          type="text"
                          value={cmsData.settings.college_name}
                          onChange={e => setCmsData(p => ({ ...p, settings: { ...p.settings, college_name: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Batch Name</label>
                        <input
                          type="text"
                          value={cmsData.settings.batch_name}
                          onChange={e => setCmsData(p => ({ ...p, settings: { ...p.settings, batch_name: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Live Countdown Target (ISO DateTime)
                        </label>
                        <input
                          type="datetime-local"
                          value={cmsData.settings.countdown_target ? cmsData.settings.countdown_target.slice(0, 16) : ''}
                          onChange={e => setCmsData(p => ({ ...p, settings: { ...p.settings, countdown_target: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">
                          Controls the live countdown timer on the Student List page. Synced with Supabase <code className="text-[#FBBF24]">site_settings.countdown_target</code>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. REGISTRATION SETTINGS */}
                {activeTab === 'registration' && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div>
                      <h3 className="text-base font-bold text-white">4. Registration Settings</h3>
                      <p className="text-xs text-gray-400">
                        Registration fee, payment numbers, instructions, and registration status
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Registration Fee (BDT)</label>
                        <input
                          type="number"
                          value={cmsData.registration.registration_fee}
                          onChange={e => setCmsData(p => ({ ...p, registration: { ...p.registration, registration_fee: Number(e.target.value) || 0 } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Extra Charge for 4XL / 5XL (BDT)</label>
                        <input
                          type="number"
                          value={cmsData.registration.extra_charge_4xl}
                          onChange={e => setCmsData(p => ({ ...p, registration: { ...p.registration, extra_charge_4xl: Number(e.target.value) || 0 } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">bKash Payment Number</label>
                        <input
                          type="text"
                          value={cmsData.registration.payment_number}
                          onChange={e => setCmsData(p => ({ ...p, registration: { ...p.registration, payment_number: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Nagad Payment Number</label>
                        <input
                          type="text"
                          value={cmsData.registration.nagad_number}
                          onChange={e => setCmsData(p => ({ ...p, registration: { ...p.registration, nagad_number: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500 font-mono"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Payment Instructions</label>
                        <textarea
                          rows={3}
                          value={cmsData.registration.payment_instructions}
                          onChange={e => setCmsData(p => ({ ...p, registration: { ...p.registration, payment_instructions: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500 leading-relaxed"
                        />
                      </div>

                      <div className="md:col-span-2 flex items-center gap-3 bg-[#181820] p-4 rounded-xl border border-gray-800">
                        <input
                          type="checkbox"
                          id="is_open_toggle"
                          checked={cmsData.registration.is_open}
                          onChange={e => setCmsData(p => ({ ...p, registration: { ...p.registration, is_open: e.target.checked } }))}
                          className="w-4 h-4 rounded text-purple-600 bg-gray-900 border-gray-700"
                        />
                        <label htmlFor="is_open_toggle" className="text-xs font-bold text-white cursor-pointer">
                          Accepting Student Registrations (Turn OFF to temporarily close registration portal)
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. JERSEY MANAGEMENT */}
                {activeTab === 'jersey' && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div>
                      <h3 className="text-base font-bold text-white">5. Jersey Management</h3>
                      <p className="text-xs text-gray-400">
                        Upload and replace Front and Back Jersey images stored in Supabase Storage <code className="text-[#FBBF24]">/public/jersey/</code>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Front Jersey */}
                      <div className="bg-[#181820] border border-gray-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-white">Front Jersey Image</label>
                          <span className="text-[11px] text-gray-400 font-mono">/public/jersey/jersey-front.png</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <img
                            src={cmsData.assets.jersey_front}
                            alt="Front Jersey"
                            className="w-24 h-32 object-contain rounded-lg bg-black/50 border border-gray-700 p-1"
                          />
                          <div className="flex-1 space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              id="upload-jersey-front"
                              className="hidden"
                              onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) handleFileUpload('jersey', f, url => setCmsData(p => ({ ...p, assets: { ...p.assets, jersey_front: url } })), 'jersey-front');
                              }}
                            />
                            <label
                              htmlFor="upload-jersey-front"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold cursor-pointer transition shadow"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload Front Jersey</span>
                            </label>
                            <input
                              type="text"
                              value={cmsData.assets.jersey_front}
                              onChange={e => setCmsData(p => ({ ...p, assets: { ...p.assets, jersey_front: e.target.value } }))}
                              placeholder="Or enter image URL"
                              className="w-full bg-[#0e0e13] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Back Jersey */}
                      <div className="bg-[#181820] border border-gray-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-white">Back Jersey Image</label>
                          <span className="text-[11px] text-gray-400 font-mono">/public/jersey/jersey-back.png</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <img
                            src={cmsData.assets.jersey_back}
                            alt="Back Jersey"
                            className="w-24 h-32 object-contain rounded-lg bg-black/50 border border-gray-700 p-1"
                          />
                          <div className="flex-1 space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              id="upload-jersey-back"
                              className="hidden"
                              onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) handleFileUpload('jersey', f, url => setCmsData(p => ({ ...p, assets: { ...p.assets, jersey_back: url } })), 'jersey-back');
                              }}
                            />
                            <label
                              htmlFor="upload-jersey-back"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold cursor-pointer transition shadow"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload Back Jersey</span>
                            </label>
                            <input
                              type="text"
                              value={cmsData.assets.jersey_back}
                              onChange={e => setCmsData(p => ({ ...p, assets: { ...p.assets, jersey_back: e.target.value } }))}
                              placeholder="Or enter image URL"
                              className="w-full bg-[#0e0e13] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. JERSEY CUSTOM FONT SYSTEM */}
                {activeTab === 'fonts' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-white">6. Jersey Custom Font System</h3>
                        <p className="text-xs text-gray-400">
                          Upload individual font images for digits 0-9. Live jersey previews automatically use these font images across the website.
                        </p>
                      </div>

                      {/* Font Tester */}
                      <div className="bg-[#181820] border border-purple-600/50 rounded-xl px-3 py-2 flex items-center gap-3">
                        <span className="text-xs text-gray-300 font-bold">Test Number:</span>
                        <input
                          type="text"
                          maxLength={3}
                          value={fontTestNumber}
                          onChange={e => setFontTestNumber(e.target.value)}
                          className="w-14 bg-black/60 border border-purple-500/70 rounded px-2 py-1 text-center font-mono font-bold text-white text-sm"
                        />
                        <div className="flex items-center gap-1 bg-black/80 px-2 py-1 rounded border border-gray-700">
                          {fontTestNumber.split('').map((char, i) => {
                            const fontKey = `font_${char}` as keyof typeof cmsData.fonts;
                            const src = cmsData.fonts[fontKey];
                            return src ? (
                              <img key={i} src={src} alt={char} className="h-6 w-auto object-contain" />
                            ) : (
                              <span key={i} className="text-white font-mono font-bold text-sm">{char}</span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* 10 Digit Cards: font_0 to font_9 */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                        const fontKey = `font_${num}` as keyof typeof cmsData.fonts;
                        const currentSrc = cmsData.fonts[fontKey];

                        return (
                          <div
                            key={num}
                            className="bg-[#181820] border border-gray-800 hover:border-purple-600/70 rounded-xl p-3 flex flex-col items-center justify-between gap-2.5 transition"
                          >
                            <div className="flex items-center justify-between w-full text-[11px] font-mono text-gray-400">
                              <span className="font-bold text-[#FBBF24]">font_{num}</span>
                              <span className="bg-purple-950/80 px-1.5 py-0.5 rounded text-purple-300">Digit {num}</span>
                            </div>

                            {/* Preview Thumbnail */}
                            <div className="w-16 h-20 rounded-lg bg-black/70 border border-gray-700 flex items-center justify-center p-1 overflow-hidden shadow-inner">
                              {currentSrc ? (
                                <img src={currentSrc} alt={`font_${num}`} className="w-full h-full object-contain" />
                              ) : (
                                <span className="font-mono text-2xl font-bold text-gray-500">{num}</span>
                              )}
                            </div>

                            {/* Upload Button */}
                            <div className="w-full space-y-1.5">
                              <input
                                type="file"
                                accept="image/*"
                                id={`upload-font-${num}`}
                                className="hidden"
                                onChange={e => {
                                  const f = e.target.files?.[0];
                                  if (f) {
                                    handleFileUpload('fonts', f, url => {
                                      setCmsData(p => ({
                                        ...p,
                                        fonts: { ...p.fonts, [fontKey]: url }
                                      }));
                                    }, `font_${num}`);
                                  }
                                }}
                              />
                              <label
                                htmlFor={`upload-font-${num}`}
                                className="w-full flex items-center justify-center gap-1 py-1 rounded bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-[11px] font-bold cursor-pointer transition"
                              >
                                <Upload className="w-3 h-3" />
                                <span>Upload font_{num}</span>
                              </label>

                              <button
                                type="button"
                                onClick={() => {
                                  const defaultSvg = generateDefaultDigitSvg(String(num));
                                  setCmsData(p => ({
                                    ...p,
                                    fonts: { ...p.fonts, [fontKey]: defaultSvg }
                                  }));
                                }}
                                className="w-full py-0.5 text-[10px] text-gray-400 hover:text-gray-200 transition text-center block"
                              >
                                Reset Default
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 7. BANNER MANAGEMENT */}
                {activeTab === 'banners' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    <div>
                      <h3 className="text-base font-bold text-white">7. Banner Management</h3>
                      <p className="text-xs text-gray-400">
                        Upload and replace banners across the website stored in Supabase Storage <code className="text-[#FBBF24]">/public/banner/</code>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* RAD Day Main Banner */}
                      <div className="bg-[#181820] border border-gray-800 rounded-xl p-4 space-y-3">
                        <label className="text-xs font-bold text-white block">RAD Day Main Banner</label>
                        <img
                          src={cmsData.banners.rad_day_main_banner}
                          alt="Main Banner"
                          className="w-full h-32 object-cover rounded-lg border border-gray-700"
                        />
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            id="banner-main"
                            className="hidden"
                            onChange={e => {
                              const f = e.target.files?.[0];
                              if (f) handleFileUpload('banner', f, url => setCmsData(p => ({ ...p, banners: { ...p.banners, rad_day_main_banner: url } })), 'rad-day-main-banner');
                            }}
                          />
                          <label
                            htmlFor="banner-main"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold cursor-pointer transition shadow"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Replace Main Banner</span>
                          </label>
                          <input
                            type="text"
                            value={cmsData.banners.rad_day_main_banner}
                            onChange={e => setCmsData(p => ({ ...p, banners: { ...p.banners, rad_day_main_banner: e.target.value } }))}
                            placeholder="Banner URL"
                            className="w-full bg-[#0e0e13] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                          />
                        </div>
                      </div>

                      {/* Quote Banner */}
                      <div className="bg-[#181820] border border-gray-800 rounded-xl p-4 space-y-3">
                        <label className="text-xs font-bold text-white block">Quote Banner</label>
                        <img
                          src={cmsData.banners.quote_banner}
                          alt="Quote Banner"
                          className="w-full h-32 object-cover rounded-lg border border-gray-700"
                        />
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            id="banner-quote"
                            className="hidden"
                            onChange={e => {
                              const f = e.target.files?.[0];
                              if (f) handleFileUpload('banner', f, url => setCmsData(p => ({ ...p, banners: { ...p.banners, quote_banner: url } })), 'quote-banner');
                            }}
                          />
                          <label
                            htmlFor="banner-quote"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold cursor-pointer transition shadow"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Replace Quote Banner</span>
                          </label>
                          <input
                            type="text"
                            value={cmsData.banners.quote_banner}
                            onChange={e => setCmsData(p => ({ ...p, banners: { ...p.banners, quote_banner: e.target.value } }))}
                            placeholder="Banner URL"
                            className="w-full bg-[#0e0e13] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                          />
                        </div>
                      </div>

                      {/* Motivation Banner */}
                      <div className="bg-[#181820] border border-gray-800 rounded-xl p-4 space-y-3">
                        <label className="text-xs font-bold text-white block">Motivation Banner</label>
                        <img
                          src={cmsData.banners.motivation_banner}
                          alt="Motivation Banner"
                          className="w-full h-32 object-cover rounded-lg border border-gray-700"
                        />
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            id="banner-motivation"
                            className="hidden"
                            onChange={e => {
                              const f = e.target.files?.[0];
                              if (f) handleFileUpload('banner', f, url => setCmsData(p => ({ ...p, banners: { ...p.banners, motivation_banner: url } })), 'motivation-banner');
                            }}
                          />
                          <label
                            htmlFor="banner-motivation"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold cursor-pointer transition shadow"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Replace Motivation Banner</span>
                          </label>
                          <input
                            type="text"
                            value={cmsData.banners.motivation_banner}
                            onChange={e => setCmsData(p => ({ ...p, banners: { ...p.banners, motivation_banner: e.target.value } }))}
                            placeholder="Banner URL"
                            className="w-full bg-[#0e0e13] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                          />
                        </div>
                      </div>

                      {/* Footer Banner */}
                      <div className="bg-[#181820] border border-gray-800 rounded-xl p-4 space-y-3">
                        <label className="text-xs font-bold text-white block">Footer Banner</label>
                        <img
                          src={cmsData.banners.footer_banner}
                          alt="Footer Banner"
                          className="w-full h-32 object-cover rounded-lg border border-gray-700"
                        />
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            id="banner-footer"
                            className="hidden"
                            onChange={e => {
                              const f = e.target.files?.[0];
                              if (f) handleFileUpload('banner', f, url => setCmsData(p => ({ ...p, banners: { ...p.banners, footer_banner: url } })), 'footer-banner');
                            }}
                          />
                          <label
                            htmlFor="banner-footer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold cursor-pointer transition shadow"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Replace Footer Banner</span>
                          </label>
                          <input
                            type="text"
                            value={cmsData.banners.footer_banner}
                            onChange={e => setCmsData(p => ({ ...p, banners: { ...p.banners, footer_banner: e.target.value } }))}
                            placeholder="Banner URL"
                            className="w-full bg-[#0e0e13] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. FOOTER SETTINGS */}
                {activeTab === 'footer' && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div>
                      <h3 className="text-base font-bold text-white">8. Footer Settings</h3>
                      <p className="text-xs text-gray-400">
                        Footer quotes, copyright notices, and official social media links
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Footer Quote</label>
                        <input
                          type="text"
                          value={cmsData.settings.footer_quote}
                          onChange={e => setCmsData(p => ({ ...p, settings: { ...p.settings, footer_quote: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Copyright Text</label>
                        <input
                          type="text"
                          value={cmsData.settings.copyright_text}
                          onChange={e => setCmsData(p => ({ ...p, settings: { ...p.settings, copyright_text: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Facebook Link</label>
                        <input
                          type="text"
                          value={cmsData.socials.facebook_link}
                          onChange={e => setCmsData(p => ({ ...p, socials: { ...p.socials, facebook_link: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Instagram Link</label>
                        <input
                          type="text"
                          value={cmsData.socials.instagram_link}
                          onChange={e => setCmsData(p => ({ ...p, socials: { ...p.socials, instagram_link: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">YouTube Link</label>
                        <input
                          type="text"
                          value={cmsData.socials.youtube_link}
                          onChange={e => setCmsData(p => ({ ...p, socials: { ...p.socials, youtube_link: e.target.value } }))}
                          className="w-full bg-[#181820] border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. WEBSITE ASSET MANAGER */}
                {activeTab === 'asset_manager' && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-white">9. Website Asset Manager</h3>
                        <p className="text-xs text-gray-400">
                          Centralized Supabase Storage system for all folders: <code className="text-[#FBBF24]">/public/logo/</code>, <code className="text-[#FBBF24]">/public/banner/</code>, <code className="text-[#FBBF24]">/public/jersey/</code>, <code className="text-[#FBBF24]">/public/fonts/</code>, <code className="text-[#FBBF24]">/public/footer/</code>
                        </p>
                      </div>

                      {/* Folder Filter */}
                      <div className="flex items-center gap-1 bg-[#181820] p-1 rounded-lg border border-gray-800 text-xs">
                        {(['all', 'logo', 'banner', 'jersey', 'fonts', 'footer'] as const).map(f => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setAssetFolderFilter(f)}
                            className={`px-2.5 py-1 rounded font-medium capitalize transition ${
                              assetFolderFilter === f
                                ? 'bg-purple-600 text-white shadow'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Central Folder Assets Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {/* Logo Folder */}
                      {(assetFolderFilter === 'all' || assetFolderFilter === 'logo') && (
                        <>
                          <div className="bg-[#181820] border border-gray-800 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-purple-300">/public/logo/</span>
                              <span className="text-[10px] text-gray-400 font-mono">college-logo.png</span>
                            </div>
                            <img src={cmsData.assets.college_logo} alt="" className="w-full h-24 object-contain bg-black/40 rounded p-1" />
                            <p className="text-[11px] text-gray-300 font-semibold truncate">{cmsData.assets.college_logo}</p>
                          </div>

                          <div className="bg-[#181820] border border-gray-800 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-purple-300">/public/logo/</span>
                              <span className="text-[10px] text-gray-400 font-mono">favicon.png</span>
                            </div>
                            <img src={cmsData.assets.favicon} alt="" className="w-full h-24 object-contain bg-black/40 rounded p-1" />
                            <p className="text-[11px] text-gray-300 font-semibold truncate">{cmsData.assets.favicon}</p>
                          </div>
                        </>
                      )}

                      {/* Banner Folder */}
                      {(assetFolderFilter === 'all' || assetFolderFilter === 'banner') && (
                        <>
                          <div className="bg-[#181820] border border-gray-800 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-purple-300">/public/banner/</span>
                              <span className="text-[10px] text-gray-400 font-mono">main-banner.jpg</span>
                            </div>
                            <img src={cmsData.banners.rad_day_main_banner} alt="" className="w-full h-24 object-cover rounded" />
                            <p className="text-[11px] text-gray-300 font-semibold truncate">{cmsData.banners.rad_day_main_banner}</p>
                          </div>

                          <div className="bg-[#181820] border border-gray-800 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-purple-300">/public/banner/</span>
                              <span className="text-[10px] text-gray-400 font-mono">quote-banner.jpg</span>
                            </div>
                            <img src={cmsData.banners.quote_banner} alt="" className="w-full h-24 object-cover rounded" />
                            <p className="text-[11px] text-gray-300 font-semibold truncate">{cmsData.banners.quote_banner}</p>
                          </div>
                        </>
                      )}

                      {/* Jersey Folder */}
                      {(assetFolderFilter === 'all' || assetFolderFilter === 'jersey') && (
                        <>
                          <div className="bg-[#181820] border border-gray-800 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-purple-300">/public/jersey/</span>
                              <span className="text-[10px] text-gray-400 font-mono">jersey-front.png</span>
                            </div>
                            <img src={cmsData.assets.jersey_front} alt="" className="w-full h-24 object-contain bg-black/40 rounded p-1" />
                            <p className="text-[11px] text-gray-300 font-semibold truncate">{cmsData.assets.jersey_front}</p>
                          </div>

                          <div className="bg-[#181820] border border-gray-800 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-purple-300">/public/jersey/</span>
                              <span className="text-[10px] text-gray-400 font-mono">jersey-back.png</span>
                            </div>
                            <img src={cmsData.assets.jersey_back} alt="" className="w-full h-24 object-contain bg-black/40 rounded p-1" />
                            <p className="text-[11px] text-gray-300 font-semibold truncate">{cmsData.assets.jersey_back}</p>
                          </div>
                        </>
                      )}

                      {/* Fonts Folder */}
                      {(assetFolderFilter === 'all' || assetFolderFilter === 'fonts') && (
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
                          <div key={d} className="bg-[#181820] border border-gray-800 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-purple-300">/public/fonts/</span>
                              <span className="text-[10px] text-gray-400 font-mono">font_{d}.png</span>
                            </div>
                            <img src={(cmsData.fonts as any)[`font_${d}`]} alt="" className="w-full h-24 object-contain bg-black/50 rounded p-1" />
                            <p className="text-[11px] text-gray-300 font-semibold truncate">font_{d} digit asset</p>
                          </div>
                        ))
                      )}

                      {/* Footer Folder */}
                      {(assetFolderFilter === 'all' || assetFolderFilter === 'footer') && (
                        <div className="bg-[#181820] border border-gray-800 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono text-purple-300">/public/footer/</span>
                            <span className="text-[10px] text-gray-400 font-mono">footer-banner.jpg</span>
                          </div>
                          <img src={cmsData.banners.footer_banner} alt="" className="w-full h-24 object-cover rounded" />
                          <p className="text-[11px] text-gray-300 font-semibold truncate">{cmsData.banners.footer_banner}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 10. GALLERY CMS MANAGEMENT */}
                {activeTab === 'gallery' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
                      <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-pink-900/40 border border-pink-700/50 text-pink-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                          <ImageIcon className="w-3 h-3 text-pink-400" />
                          <span>Supabase Table: gallery_items</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-white">
                          Gallery & Exhibit Management
                        </h3>
                        <p className="text-xs text-gray-400">
                          Upload event photos, categorize exhibits, reorder display sequence, or toggle visibility.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingGalleryId(null);
                            setGalleryFormData({
                              title: '',
                              description: '',
                              category: 'Memories',
                              image_url: '',
                              is_active: true,
                              sort_order: cmsData.gallery.length + 1
                            });
                            setIsAddingGallery(true);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold transition shadow-lg active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Photo</span>
                        </button>
                      </div>
                    </div>

                    {/* Filter by Category */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                      {['All', 'Jersey', 'Campus', 'Prep', 'Memories', 'Other'].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setGalleryCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                            galleryCategoryFilter === cat
                              ? 'bg-purple-600 text-white'
                              : 'bg-[#181820] text-gray-400 hover:text-white border border-gray-800'
                          }`}
                        >
                          {cat} {cat === 'All' ? `(${cmsData.gallery.length})` : `(${cmsData.gallery.filter(g => g.category === cat).length})`}
                        </button>
                      ))}
                    </div>

                    {/* Add / Edit Form Card */}
                    {(isAddingGallery || editingGalleryId) && (
                      <div className="bg-[#181822] border border-purple-600/50 rounded-2xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-top-2 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#FBBF24]" />
                            <span>{editingGalleryId ? 'Edit Gallery Photo' : 'Add New Exhibit to Gallery'}</span>
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingGallery(false);
                              setEditingGalleryId(null);
                            }}
                            className="text-gray-400 hover:text-white text-xs p-1"
                          >
                            ✕ Cancel
                          </button>
                        </div>

                        <form onSubmit={handleSaveGalleryItem} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-300 mb-1">Photo Title *</label>
                              <input
                                type="text"
                                required
                                value={galleryFormData.title || ''}
                                onChange={e => setGalleryFormData(p => ({ ...p, title: e.target.value }))}
                                placeholder="e.g., Campus Lawn Gathering"
                                className="w-full bg-[#111118] border border-gray-700 focus:border-purple-500 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                              <select
                                value={galleryFormData.category || 'Memories'}
                                onChange={e => setGalleryFormData(p => ({ ...p, category: e.target.value as any }))}
                                className="w-full bg-[#111118] border border-gray-700 focus:border-purple-500 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none"
                              >
                                <option value="Jersey">Jersey Showcase</option>
                                <option value="Campus">Campus Life</option>
                                <option value="Prep">Event Preparation</option>
                                <option value="Memories">Memories & Batch</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-xs font-semibold text-gray-300 mb-1">Photo Description / Caption</label>
                              <textarea
                                rows={2}
                                value={galleryFormData.description || ''}
                                onChange={e => setGalleryFormData(p => ({ ...p, description: e.target.value }))}
                                placeholder="Brief memory or story about this photo..."
                                className="w-full bg-[#111118] border border-gray-700 focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-xs font-semibold text-gray-300 mb-1">Image Asset *</label>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                {galleryFormData.image_url ? (
                                  <img
                                    src={galleryFormData.image_url}
                                    alt="Preview"
                                    className="w-24 h-20 object-cover rounded-lg border border-purple-500 bg-black/60 shrink-0"
                                  />
                                ) : (
                                  <div className="w-24 h-20 rounded-lg border border-dashed border-gray-700 bg-black/40 flex items-center justify-center text-[10px] text-gray-500 shrink-0">
                                    No Image
                                  </div>
                                )}
                                <div className="flex-1 w-full space-y-2">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      id="upload-gallery-file"
                                      className="hidden"
                                      onChange={e => {
                                        const f = e.target.files?.[0];
                                        if (f) {
                                          handleFileUpload('banner', f, url => {
                                            setGalleryFormData(p => ({ ...p, image_url: url }));
                                          }, `gallery-${Date.now()}`);
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor="upload-gallery-file"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold cursor-pointer transition shadow"
                                    >
                                      <Upload className="w-3.5 h-3.5" />
                                      <span>Upload from Computer</span>
                                    </label>
                                  </div>
                                  <input
                                    type="text"
                                    required
                                    value={galleryFormData.image_url || ''}
                                    onChange={e => setGalleryFormData(p => ({ ...p, image_url: e.target.value }))}
                                    placeholder="Or paste Direct Image URL"
                                    className="w-full bg-[#111118] border border-gray-700 focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-300 mb-1">Display Sort Order</label>
                              <input
                                type="number"
                                min={1}
                                value={galleryFormData.sort_order ?? 1}
                                onChange={e => setGalleryFormData(p => ({ ...p, sort_order: parseInt(e.target.value, 10) || 1 }))}
                                className="w-full bg-[#111118] border border-gray-700 focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                              />
                            </div>

                            <div className="flex items-center pt-5">
                              <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={galleryFormData.is_active ?? true}
                                  onChange={e => setGalleryFormData(p => ({ ...p, is_active: e.target.checked }))}
                                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-gray-800 border-gray-700"
                                />
                                <span className="text-xs font-semibold text-gray-200">
                                  Publicly Visible on Website
                                </span>
                              </label>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingGallery(false);
                                setEditingGalleryId(null);
                              }}
                              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{editingGalleryId ? 'Update Item' : 'Save Exhibit'}</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Gallery Items List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-400 font-semibold px-1">
                        <span>
                          Showing {cmsData.gallery.filter(g => galleryCategoryFilter === 'All' || g.category === galleryCategoryFilter).length} exhibits
                        </span>
                        <span className="text-[11px] text-purple-400">
                          (Click eye to toggle live visibility, arrows to reorder)
                        </span>
                      </div>

                      {cmsData.gallery
                        .filter(g => galleryCategoryFilter === 'All' || g.category === galleryCategoryFilter)
                        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                        .map(item => (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                              item.is_active
                                ? 'bg-[#181820] border-gray-800 hover:border-purple-800/60'
                                : 'bg-[#14141a] border-gray-800/40 opacity-60'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-16 h-14 object-cover rounded-lg bg-black border border-gray-800 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                                    {item.title}
                                  </h4>
                                  <span className="px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-700/50 text-[10px] font-bold text-[#FBBF24]">
                                    {item.category}
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-400 bg-black/40">
                                    #{item.sort_order}
                                  </span>
                                </div>
                                {item.description && (
                                  <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                              {/* Reorder Buttons */}
                              <button
                                type="button"
                                title="Move up"
                                onClick={() => handleMoveGalleryOrder(item, 'up')}
                                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Move down"
                                onClick={() => handleMoveGalleryOrder(item, 'down')}
                                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>

                              {/* Toggle Visibility */}
                              <button
                                type="button"
                                title={item.is_active ? 'Hide from public gallery' : 'Make visible in gallery'}
                                onClick={() => handleToggleGalleryActive(item.id)}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                                  item.is_active
                                    ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900'
                                    : 'bg-amber-950/80 border border-amber-700/60 text-amber-300 hover:bg-amber-900'
                                }`}
                              >
                                {item.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                <span>{item.is_active ? 'Active' : 'Hidden'}</span>
                              </button>

                              {/* Edit */}
                              <button
                                type="button"
                                title="Edit"
                                onClick={() => handleStartEditGallery(item)}
                                className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-800/60 text-purple-300 hover:bg-purple-900 hover:text-white transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                title="Delete"
                                onClick={() => handleDeleteGallery(item.id)}
                                className="p-1.5 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 hover:bg-red-900 hover:text-white transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                      {cmsData.gallery.length === 0 && (
                        <div className="p-8 text-center bg-[#14141a] rounded-2xl border border-dashed border-gray-800">
                          <ImageIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-xs text-gray-400 font-semibold">No gallery items yet.</p>
                          <button
                            type="button"
                            onClick={() => setIsAddingGallery(true)}
                            className="mt-3 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                          >
                            Add Your First Photo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 11. SUPABASE SQL SCHEMA & SYNC */}
                {activeTab === 'database' && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-white">Supabase SQL Schema & Sync</h3>
                        <p className="text-xs text-gray-400">
                          Tables: <code className="text-[#FBBF24]">site_settings</code>, <code className="text-[#FBBF24]">site_assets</code>, <code className="text-[#FBBF24]">jersey_fonts</code>, <code className="text-[#FBBF24]">website_banners</code>, <code className="text-[#FBBF24]">social_links</code>, <code className="text-[#FBBF24]">registration_settings</code>, <code className="text-[#FBBF24]">registered_students</code>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSyncFromSupabase}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 text-xs font-semibold transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Fetch from Supabase</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleCopySql}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6D28D9] hover:bg-[#7C3AED] text-white text-xs font-bold transition shadow"
                        >
                          {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                        </button>

                        <a
                          href="https://supabase.com/dashboard/project/eodwqvodokrfnnslppve/sql"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-semibold transition"
                        >
                          <span>SQL Editor</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="p-4 bg-[#0a0a0d] border border-gray-800 rounded-xl space-y-3">
                      <p className="text-xs text-gray-400">
                        Run this script in the Supabase SQL editor to create all CMS and registration tables with proper triggers, sequences, and security rules.
                      </p>
                      <pre className="p-3 bg-[#121218] border border-gray-800 rounded-lg text-[11px] font-mono text-purple-200 max-h-80 overflow-y-auto leading-relaxed whitespace-pre">
                        {SUPABASE_SQL_SCHEMA}
                      </pre>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
