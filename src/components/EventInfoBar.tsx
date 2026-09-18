import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { SUPER_ADMIN } from '../../SuperAdmin';

export const EventInfoBar: React.FC = () => {
  const event = SUPER_ADMIN.eventDetails;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-5 sm:-mt-8 relative z-20">
      <div className="bg-[#050505]/95 backdrop-blur-md rounded-2xl border border-[#00E5FF]/30 shadow-[0_0_25px_rgba(0,229,255,0.18)] px-3.5 sm:px-6 py-3 sm:py-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#00E5FF]/20 gap-3 sm:gap-0">
          
          {/* Card 1: Date */}
          <div className="flex items-center gap-3 sm:gap-4 px-1 sm:px-4 md:px-6 py-1.5 sm:py-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#050505] border border-[#00E5FF]/30 flex items-center justify-center text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.25)] shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-[#CFCFCF] font-medium tracking-wider uppercase">
                {event.txt.dateLabel}
              </p>
              <p className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide truncate">
                {event.txt.eventDate}
              </p>
            </div>
          </div>

          {/* Card 2: Time */}
          <div className="flex items-center gap-3 sm:gap-4 px-1 sm:px-4 md:px-6 py-2.5 sm:py-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#050505] border border-[#00E5FF]/30 flex items-center justify-center text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.25)] shrink-0">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-[#CFCFCF] font-medium tracking-wider uppercase">
                {event.txt.timeLabel}
              </p>
              <p className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide truncate">
                {event.txt.eventTime}
              </p>
            </div>
          </div>

          {/* Card 3: Venue */}
          <div className="flex items-center gap-3 sm:gap-4 px-1 sm:px-4 md:px-6 py-2.5 sm:py-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#050505] border border-[#00E5FF]/30 flex items-center justify-center text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.25)] shrink-0">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-[#CFCFCF] font-medium tracking-wider uppercase">
                {event.txt.venueLabel}
              </p>
              <p className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide truncate" title={event.txt.eventVenue}>
                {event.txt.eventVenue}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
