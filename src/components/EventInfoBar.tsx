import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { EventSettings } from '../types';
import { cmsStore, CompleteCmsState } from '../services/cmsService';

interface EventInfoBarProps {
  settings?: EventSettings;
}

export const EventInfoBar: React.FC<EventInfoBarProps> = () => {
  const [cmsData, setCmsData] = useState<CompleteCmsState>(cmsStore.getState());

  useEffect(() => {
    const unsub = cmsStore.subscribe(() => {
      setCmsData({ ...cmsStore.getState() });
    });
    return unsub;
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-5 sm:-mt-8 relative z-20">
      <div className="bg-[#111111]/95 backdrop-blur-md rounded-2xl border border-purple-600/40 shadow-[0_0_25px_rgba(109,40,217,0.3)] px-3.5 sm:px-6 py-3 sm:py-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-purple-900/40 gap-3 sm:gap-0">
          
          {/* Card 1: Date */}
          <div className="flex items-center gap-3 sm:gap-4 px-1 sm:px-4 md:px-6 py-1.5 sm:py-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-950/40 border border-purple-800/50 flex items-center justify-center text-[#FBBF24] shadow-[0_0_12px_rgba(251,191,36,0.2)] shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#FBBF24]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-[#CFCFCF] font-medium tracking-wider uppercase">Date</p>
              <p className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide truncate">
                {cmsData.settings.event_date}
              </p>
            </div>
          </div>

          {/* Card 2: Time */}
          <div className="flex items-center gap-3 sm:gap-4 px-1 sm:px-4 md:px-6 py-2.5 sm:py-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-950/40 border border-purple-800/50 flex items-center justify-center text-[#FBBF24] shadow-[0_0_12px_rgba(251,191,36,0.2)] shrink-0">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#FBBF24]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-[#CFCFCF] font-medium tracking-wider uppercase">Time</p>
              <p className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide truncate">
                {cmsData.settings.event_time}
              </p>
            </div>
          </div>

          {/* Card 3: Venue */}
          <div className="flex items-center gap-3 sm:gap-4 px-1 sm:px-4 md:px-6 py-2.5 sm:py-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-950/40 border border-purple-800/50 flex items-center justify-center text-[#FBBF24] shadow-[0_0_12px_rgba(251,191,36,0.2)] shrink-0">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#FBBF24]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-[#CFCFCF] font-medium tracking-wider uppercase">Venue</p>
              <p className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide truncate" title={cmsData.settings.event_venue}>
                {cmsData.settings.event_venue}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
