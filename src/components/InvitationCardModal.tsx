import React, { useState } from 'react';
import { X, Download, Printer, Loader2, Check } from 'lucide-react';
import { StudentRegistration } from '../types';
import { SUPER_ADMIN } from '../../SuperAdmin';
import { downloadInvitationCard } from '../services/invitationCardService';

interface InvitationCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRegistration | null;
}

export const InvitationCardModal: React.FC<InvitationCardModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !student) return null;

  const eventDate = SUPER_ADMIN.eventDetails.txt.eventDate || '01 February 2027';
  const eventVenue = SUPER_ADMIN.eventDetails.txt.eventVenue || 'NIC Campus';
  const studentIdDisplay = student.studentId || `NIC-27-${student.roll}`;
  const regNoDisplay = student.registrationNo || 'RD27-001';

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadInvitationCard(student);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error downloading card:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-[#050505] border border-[#00E5FF]/40 rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-[0_0_50px_rgba(0,229,255,0.25)] relative max-h-[96dvh] flex flex-col my-auto"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#00E5FF]/20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse shadow-[0_0_8px_#00E5FF]" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase">
              Official Invitation Card
            </h3>
            <span className="text-[11px] font-mono text-[#D4AF37] bg-[#00E5FF]/15 px-2 py-0.5 rounded border border-[#00E5FF]/30">
              {regNoDisplay}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isDownloading}
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#00C8A8] text-black font-bold text-xs transition shadow-[0_0_15px_rgba(0,229,255,0.4)] active:scale-95 disabled:opacity-50"
              title="Download High-Res Card"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Download Card</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white transition"
              title="Print Card"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= INVITATION CARD VISUAL (MATCHING SKETCH) ================= */}
        <div className="py-4 overflow-x-auto flex items-center justify-center">
          <div className="relative w-full max-w-[800px] aspect-[16/9] bg-[#050505] rounded-xl border-2 border-[#00E5FF]/80 shadow-[0_0_35px_rgba(0,229,255,0.25)] p-4 sm:p-6 flex flex-col justify-between select-none overflow-hidden shrink-0">
            
            {/* Background subtle radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.06)_0%,transparent_70%)] pointer-events-none" />

            {/* Corner Accent Marks (Matching Sketch) */}
            {/* Top-Left */}
            <div className="absolute top-2 left-2 pointer-events-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#00E5FF]">
                <path d="M4 14L14 4M2 9L9 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            {/* Top-Right */}
            <div className="absolute top-2 right-2 pointer-events-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#00E5FF]">
                <path d="M10 4L20 14M15 2L22 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            {/* Bottom-Left */}
            <div className="absolute bottom-2 left-2 pointer-events-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#00E5FF]">
                <path d="M4 10L14 20M2 15L9 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            {/* Bottom-Right */}
            <div className="absolute bottom-2 right-2 pointer-events-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#00E5FF]">
                <path d="M10 20L20 10M15 22L22 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* ================= 1. HEADER SECTION ================= */}
            <div className="flex items-center justify-between pb-3 border-b border-[#00E5FF]/30 relative z-10">
              
              {/* Top-Left: Circular Seal "NIC27 Rag Day" */}
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#00E5FF] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                  <div className="w-full h-full rounded-full border border-[#00C8A8]/60 flex flex-col items-center justify-center text-center p-1 bg-black/60">
                    <span className="text-[11px] sm:text-xs font-black text-white leading-none tracking-tight">
                      NIC27
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-bold text-[#00C8A8] uppercase leading-none mt-0.5">
                      Rag Day
                    </span>
                  </div>
                </div>

                {/* Horizontal Accent Lines */}
                <div className="hidden sm:flex flex-col gap-1 w-28 md:w-36 opacity-60">
                  <div className="h-[1.5px] w-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                  <div className="h-[1.5px] w-3/4 bg-[#00C8A8]/70" />
                </div>
              </div>

              {/* Top-Right: Reg. No Box */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  Reg. No :
                </span>
                <div className="relative px-3 sm:px-4 py-1 sm:py-1.5 rounded bg-black/60 border-2 border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.3)]">
                  {/* Corner marks inside reg box */}
                  <span className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-[#D4AF37]" />
                  <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-[#D4AF37]" />
                  <span className="font-mono font-black text-xs sm:text-base text-[#D4AF37] tracking-wider">
                    {regNoDisplay}
                  </span>
                </div>
              </div>

            </div>

            {/* ================= 2. MIDDLE BODY SECTION ================= */}
            <div className="grid grid-cols-12 gap-3 sm:gap-4 my-auto relative z-10 py-2">
              
              {/* Left Side: Information Boxes (8 cols) */}
              <div className="col-span-8 flex flex-col justify-between space-y-1.5 sm:space-y-2">
                
                {/* Row 1: Name */}
                <div className="flex items-center text-[10px] sm:text-xs md:text-sm">
                  <span className="w-14 sm:w-18 font-medium text-white shrink-0">Name</span>
                  <span className="mr-1.5 text-white">:</span>
                  <div className="flex-1 px-2.5 py-1 rounded bg-black/60 border border-[#00E5FF]/40 shadow-[0_0_8px_rgba(0,229,255,0.15)] text-white font-bold truncate">
                    {student.fullName}
                  </div>
                </div>

                {/* Row 2: Group & Class */}
                <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs md:text-sm">
                  <div className="flex items-center min-w-0">
                    <span className="w-14 sm:w-18 font-medium text-white shrink-0">Group</span>
                    <span className="mr-1.5 text-white">:</span>
                    <div className="flex-1 px-2 py-1 rounded bg-black/60 border border-[#00E5FF]/40 shadow-[0_0_8px_rgba(0,229,255,0.15)] text-white font-bold truncate">
                      {student.group}
                    </div>
                  </div>
                  <div className="flex items-center min-w-0">
                    <span className="w-12 sm:w-14 font-medium text-white shrink-0">Class</span>
                    <span className="mr-1.5 text-white">:</span>
                    <div className="flex-1 px-2 py-1 rounded bg-black/60 border border-[#00E5FF]/40 shadow-[0_0_8px_rgba(0,229,255,0.15)] text-white font-bold truncate">
                      {student.className || 'HSC 2027'}
                    </div>
                  </div>
                </div>

                {/* Row 3: Section & Roll */}
                <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs md:text-sm">
                  <div className="flex items-center min-w-0">
                    <span className="w-14 sm:w-18 font-medium text-white shrink-0">Section</span>
                    <span className="mr-1.5 text-white">:</span>
                    <div className="flex-1 px-2 py-1 rounded bg-black/60 border border-[#00E5FF]/40 shadow-[0_0_8px_rgba(0,229,255,0.15)] text-white font-bold truncate">
                      {student.section}
                    </div>
                  </div>
                  <div className="flex items-center min-w-0">
                    <span className="w-12 sm:w-14 font-medium text-white shrink-0">Roll</span>
                    <span className="mr-1.5 text-white">:</span>
                    <div className="flex-1 px-2 py-1 rounded bg-black/60 border border-[#00E5FF]/40 shadow-[0_0_8px_rgba(0,229,255,0.15)] text-white font-bold truncate">
                      {student.roll}
                    </div>
                  </div>
                </div>

                {/* Row 4: ID */}
                <div className="flex items-center text-[10px] sm:text-xs md:text-sm">
                  <span className="w-14 sm:w-18 font-medium text-white shrink-0">ID</span>
                  <span className="mr-1.5 text-white">:</span>
                  <div className="flex-1 px-2.5 py-1 rounded bg-black/60 border border-[#00E5FF]/40 shadow-[0_0_8px_rgba(0,229,255,0.15)] text-white font-mono font-bold truncate">
                    {studentIdDisplay}
                  </div>
                </div>

                {/* Row 5: Date */}
                <div className="flex items-center text-[10px] sm:text-xs md:text-sm">
                  <span className="w-14 sm:w-18 font-medium text-white shrink-0">Date</span>
                  <span className="mr-1.5 text-white">:</span>
                  <div className="flex-1 px-2.5 py-1 rounded bg-black/60 border border-[#00E5FF]/40 shadow-[0_0_8px_rgba(0,229,255,0.15)] text-[#00E5FF] font-bold truncate">
                    {eventDate}
                  </div>
                </div>

                {/* Row 6: Venue */}
                <div className="flex items-center text-[10px] sm:text-xs md:text-sm">
                  <span className="w-14 sm:w-18 font-medium text-white shrink-0">Venue</span>
                  <span className="mr-1.5 text-white">:</span>
                  <div className="flex-1 px-2.5 py-1 rounded bg-black/60 border border-[#00E5FF]/40 shadow-[0_0_8px_rgba(0,229,255,0.15)] text-white font-bold truncate">
                    {eventVenue}
                  </div>
                </div>

              </div>

              {/* Right Side: Student Photo (4 cols) */}
              <div className="col-span-4 flex items-center justify-end">
                <div className="relative w-full max-w-[190px] aspect-[3/4] rounded-lg border-2 border-[#00E5FF]/90 p-1 bg-black/60 shadow-[0_0_20px_rgba(0,229,255,0.25)] flex items-center justify-center overflow-hidden">
                  {/* Photo Corner marks (┌, ┘) matching sketch */}
                  <span className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#00E5FF] z-10" />
                  <span className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#00E5FF] z-10" />

                  {student.photoUrl ? (
                    <img
                      src={student.photoUrl}
                      alt={student.fullName}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#00E5FF]/60">
                      <span className="text-xl sm:text-2xl font-light">Photo</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* ================= 3. BOTTOM SECTION ================= */}
            <div className="pt-2 border-t border-[#00E5FF]/30 text-center relative z-10 space-y-0.5 sm:space-y-1">
              
              {/* Bottom corner ticks */}
              <div className="absolute bottom-0 left-1 pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-[#00E5FF]">
                  <path d="M2 8L10 16M2 13L8 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <div className="absolute bottom-0 right-1 pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-[#00E5FF]">
                  <path d="M8 16L16 8M10 16L16 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>

              <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white tracking-wide">
                We are welcoming you to our last part of college life
              </p>
              
              <div className="flex items-center justify-center gap-3">
                <span className="h-[1px] w-8 sm:w-14 bg-[#00E5FF]/60" />
                <p className="text-[11px] sm:text-xs md:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#00C8A8] to-[#D4AF37] tracking-wider uppercase">
                  Batch 2K27 • DU
                </p>
                <span className="h-[1px] w-8 sm:w-14 bg-[#00E5FF]/60" />
              </div>

            </div>

          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="pt-3 border-t border-[#00E5FF]/20 flex items-center justify-between text-[11px] text-gray-400 shrink-0">
          <span>Official pass for NIC27 Rag Day Entry & Festivities.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
