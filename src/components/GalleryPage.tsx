import React, { useState } from 'react';
import { Sparkles, Calendar, Maximize2, X } from 'lucide-react';
import { GalleryItem } from '../types';
import { SUPER_ADMIN } from '../../SuperAdmin';

interface GalleryPageProps {
  gallery?: GalleryItem[];
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const galleryCms = SUPER_ADMIN.galleryCMS;
  const categories = galleryCms.txt.categories || ['All', 'Jersey', 'Campus', 'Prep', 'Memories'];

  const itemsList: GalleryItem[] =
    Array.isArray(gallery) && gallery.length > 0
      ? gallery
      : (galleryCms.pic.items as GalleryItem[]) || [];

  const safeGallery = Array.isArray(itemsList) ? itemsList : [];

  const filteredItems = selectedCategory === 'All'
    ? safeGallery
    : safeGallery.filter(item => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Gallery Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{galleryCms.txt.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-wide drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]">
          {galleryCms.txt.title}
        </h2>
        <p className="text-sm text-[#CFCFCF] max-w-xl mx-auto font-medium">
          {galleryCms.txt.subtitle}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-[#00E5FF] to-[#00C8A8] text-black font-extrabold shadow-[0_0_15px_rgba(0,229,255,0.6)] scale-105 border border-[#00E5FF]'
                  : 'bg-[#050505] text-gray-400 hover:text-white border border-[#00E5FF]/20 hover:border-[#00E5FF]/60'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => setLightboxItem(item)}
            className="group relative bg-[#050505] rounded-2xl border border-[#00E5FF]/25 hover:border-[#D4AF37] overflow-hidden shadow-[0_0_25px_rgba(0,229,255,0.12)] hover:shadow-[0_0_35px_rgba(212,175,55,0.3)] transition-all duration-300 cursor-pointer flex flex-col"
          >
            {/* Image Box */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-black">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Category Tag */}
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-sm border border-[#00E5FF]/50 text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                {item.category}
              </div>

              {/* Hover Zoom Icon */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-[#00E5FF]" />
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-[#00E5FF] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#CFCFCF] mt-1 line-clamp-2">
                  {item.caption}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#00E5FF]/15 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#00E5FF]" />
                  {item.date}
                </span>
                <span className="text-[#00E5FF] font-semibold group-hover:underline">
                  View Full →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#050505] border-2 border-[#00E5FF]/50 rounded-2xl max-w-3xl w-full overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.4)] relative cursor-default animate-in fade-in zoom-in duration-300"
          >
            <div className="relative w-full max-h-[65vh] bg-black flex items-center justify-center">
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                className="w-full h-full object-contain max-h-[65vh]"
              />
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[10px] font-bold text-[#D4AF37] uppercase">
                  {lightboxItem.category}
                </span>
                <span className="text-xs text-gray-400">• {lightboxItem.date}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{lightboxItem.title}</h3>
              <p className="text-sm text-gray-300">{lightboxItem.caption}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
