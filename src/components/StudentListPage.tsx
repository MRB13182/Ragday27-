import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  Sparkles,
  X,
  QrCode,
  Printer,
  Download
} from 'lucide-react';
import { StudentRegistration } from '../types';
import { formatStudentSection } from '../utils/sectionFormatter';
import { SUPER_ADMIN } from '../../SuperAdmin';
import { InvitationCardModal } from './InvitationCardModal';

interface StudentListPageProps {
  registrations: StudentRegistration[];
  onRefresh?: () => Promise<void> | void;
}

export const StudentListPage: React.FC<StudentListPageProps> = ({
  registrations,
  onRefresh
}) => {
  const event = SUPER_ADMIN.eventDetails;
  const branding = SUPER_ADMIN.websiteBranding;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('All');

  // Modal State for viewing student pass/slip
  const [selectedStudent, setSelectedStudent] = useState<StudentRegistration | null>(null);

  // Modal State for Invitation Card
  const [invitationStudent, setInvitationStudent] = useState<StudentRegistration | null>(null);

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const target = new Date(event.txt.targetCountdownDate || '2026-11-20T09:00:00').getTime();
      const now = new Date().getTime();
      const difference = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event.txt.targetCountdownDate]);

  // 1. Visible Students: ONLY registration_status = 'approved' from Supabase
  // Strict Supabase source of truth: NEVER show pending or rejected
  const visibleStudents = registrations.filter(item => item.dbStatus === 'approved');

  // 2. Total Count: Approved students count
  const totalCount = visibleStudents.length;

  // 3. Filtered List by search query and group filter
  const filteredList = visibleStudents
    .filter(item => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.fullName.toLowerCase().includes(query) ||
        item.roll.toLowerCase().includes(query) ||
        item.registrationNo.toLowerCase().includes(query) ||
        item.contactNumber.toLowerCase().includes(query) ||
        item.jerseyName.toLowerCase().includes(query) ||
        formatStudentSection(item.section, item.group, item.gender).toLowerCase().includes(query);

      const matchesGroup = filterGroup === 'All' || item.group === filterGroup;

      return matchesSearch && matchesGroup;
    })
    .sort((a, b) => {
      return parseInt(a.roll, 10) - parseInt(b.roll, 10) || a.roll.localeCompare(b.roll);
    });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* ================= COUNTDOWN TIMER ================= */}
      <div className="w-full bg-gradient-to-r from-[#050505] via-[#08171f] to-[#050505] rounded-2xl border border-[#00E5FF]/40 p-4 sm:p-6 md:p-8 shadow-[0_0_35px_rgba(0,229,255,0.2)] text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            <span>COUNTDOWN TO {branding.txt.eventTitle}</span>
          </div>

          <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-wide uppercase">
            {event.txt.countdownTitle}
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-[#CFCFCF] mt-1">
            {event.txt.eventDate} • {event.txt.eventVenue}
          </p>

          {/* Glowing Timer Blocks - Scales on narrow screens */}
          <div className="grid grid-cols-4 max-w-xl mx-auto gap-2 sm:gap-4 mt-4 sm:mt-6">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINS', value: timeLeft.minutes },
              { label: 'SECS', value: timeLeft.seconds }
            ].map(box => (
              <div
                key={box.label}
                className="bg-[#050505]/95 border-2 border-[#00E5FF]/40 rounded-xl p-2 xs:p-2.5 sm:p-4 shadow-[0_0_20px_rgba(0,229,255,0.25)] flex flex-col items-center justify-center group hover:border-[#D4AF37] transition-all"
              >
                <span className="font-teko text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-wider leading-none group-hover:text-[#00E5FF] transition-colors">
                  {String(box.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-xs font-extrabold text-[#CFCFCF] tracking-wider uppercase mt-1">
                  {box.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= STATS OVERVIEW (ONLY TOTAL STUDENTS) ================= */}
      <div className="flex items-center">
        <div className="bg-[#050505] border border-[#00E5FF]/25 rounded-xl p-3.5 sm:p-5 shadow-[0_0_20px_rgba(0,229,255,0.12)] flex items-center gap-3 sm:gap-4 min-w-[200px] sm:min-w-[240px]">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-[#CFCFCF] uppercase tracking-wider font-semibold">Total Students</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-white">{totalCount}</p>
          </div>
        </div>
      </div>

      {/* ================= CONTROLS: SEARCH & GROUP FILTER ================= */}
      <div className="bg-[#050505] border border-[#00E5FF]/30 rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(0,229,255,0.12)] space-y-3 sm:space-y-4">
        
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll, section, reg no, contact..."
            className="w-full bg-[#050505] border border-[#00E5FF]/30 focus:border-[#00E5FF] rounded-xl pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition"
          />
        </div>

        {/* Filter: ONLY GROUP */}
        <div className="flex items-center justify-between pt-2 border-t border-[#00E5FF]/15">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-gray-400 font-medium">Group:</span>
            <select
              value={filterGroup}
              onChange={e => setFilterGroup(e.target.value)}
              className="bg-[#050505] border border-[#00E5FF]/30 text-white rounded-md px-2.5 sm:px-3 py-1 sm:py-1.5 outline-none font-semibold focus:border-[#00E5FF] transition text-xs sm:text-sm"
            >
              <option value="All">All Groups</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Humanities">Humanities</option>
            </select>
          </div>

          <div className="text-xs text-gray-400">
            Showing <span className="text-white font-bold">{filteredList.length}</span> of {totalCount}
          </div>
        </div>

      </div>

      {/* ================= STUDENT LIST (RESPONSIVE: MOBILE CARDS & DESKTOP TABLE) ================= */}
      {/* 1. Mobile Card View: Optimized for mobile screen ratios */}
      <div className="block md:hidden space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-[#050505] rounded-2xl border border-[#00E5FF]/25 p-8 text-center text-gray-400 text-xs">
            No registered students found matching your criteria.
          </div>
        ) : (
          filteredList.map(student => {
            const formattedSection = formatStudentSection(student.section, student.group, student.gender);
            const isApproved = (student.status === 'Approved' || student.status === 'Verified' || Boolean(student.invitationCardEnabled)) && student.status !== 'Rejected';

            return (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className="bg-[#050505] rounded-xl border border-[#00E5FF]/25 p-3.5 shadow-md active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={student.photoUrl}
                    alt={student.fullName}
                    className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/60 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-sm text-white truncate">{student.fullName}</h4>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isApproved && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setInvitationStudent(student);
                            }}
                            className="p-1.5 rounded-lg bg-[#00E5FF]/15 border border-[#00E5FF]/50 text-[#00E5FF] hover:text-white hover:bg-[#00E5FF]/30 shadow-[0_0_10px_rgba(0,229,255,0.3)] transition active:scale-95"
                            title="Download Invitation Card"
                            aria-label="Download Invitation Card"
                          >
                            <Download className="w-3.5 h-3.5 stroke-[2.2]" />
                          </button>
                        )}
                        <span className="font-mono text-[11px] font-bold text-white bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30 shrink-0">
                          Roll: {student.roll}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-gray-400 font-mono">
                        Reg: {student.registrationNo}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="font-mono text-[10px] font-bold text-[#D4AF37] bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                        {formattedSection}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        student.group === 'Science'
                          ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                          : student.group === 'Commerce'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                          : 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                      }`}>
                        {student.group}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#050505] text-[#D4AF37] font-bold text-[10px] border border-[#00E5FF]/30">
                        {student.jerseySize} • "{student.jerseyName}" #{student.jerseyNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2. Desktop Table View: Shown on md: screens and larger */}
      <div className="hidden md:block bg-[#050505] rounded-2xl border border-[#00E5FF]/25 shadow-[0_0_35px_rgba(0,229,255,0.12)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#050505] border-b border-[#00E5FF]/20 text-gray-300 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 text-left">Student</th>
                <th className="py-3.5 px-4 text-left">Roll</th>
                <th className="py-3.5 px-4 text-left">Section</th>
                <th className="py-3.5 px-4 text-left">Group</th>
                <th className="py-3.5 px-4 text-left">Contact</th>
                <th className="py-3.5 px-4 text-left">Jersey Specs</th>
                <th className="py-3.5 px-4 text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00E5FF]/10">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No registered students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredList.map(student => {
                  const formattedSection = formatStudentSection(student.section, student.group, student.gender);
                  const isApproved = (student.status === 'Approved' || student.status === 'Verified' || Boolean(student.invitationCardEnabled)) && student.status !== 'Rejected';

                  return (
                    <tr
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className="hover:bg-[#00E5FF]/5 transition-colors cursor-pointer group"
                    >
                      {/* 1. Student Photo & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.photoUrl}
                            alt={student.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/50 group-hover:scale-105 transition-transform shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white group-hover:text-[#00E5FF] transition-colors whitespace-nowrap">
                              {student.fullName}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] text-gray-400 font-mono">
                                Reg: {student.registrationNo}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Roll */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-white bg-[#00E5FF]/10 px-2.5 py-1 rounded border border-[#00E5FF]/30">
                          {student.roll}
                        </span>
                      </td>

                      {/* 3. Section */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-[#D4AF37] bg-amber-950/30 px-2.5 py-1 rounded border border-amber-500/30">
                          {formattedSection}
                        </span>
                      </td>

                      {/* 4. Group */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium">
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                          student.group === 'Science'
                            ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                            : student.group === 'Commerce'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                            : 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                        }`}>
                          {student.group}
                        </span>
                      </td>

                      {/* 5. Contact */}
                      <td className="py-3.5 px-4 font-mono text-gray-300 whitespace-nowrap">
                        {student.contactNumber}
                      </td>

                      {/* 6. Jersey Specs */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#050505] text-[#D4AF37] font-bold text-xs border border-[#00E5FF]/30">
                            {student.jerseySize}
                          </span>
                          <span className="font-bold text-white">
                            "{student.jerseyName}" #{student.jerseyNumber}
                          </span>
                        </div>
                      </td>

                      {/* 7. Invitation Card Download Icon (Only on Approved, on the right side) */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {isApproved && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setInvitationStudent(student);
                            }}
                            className="inline-flex items-center justify-center p-2 rounded-lg bg-[#00E5FF]/15 border border-[#00E5FF]/50 text-[#00E5FF] hover:text-white hover:bg-[#00E5FF]/30 shadow-[0_0_12px_rgba(0,229,255,0.3)] transition active:scale-95"
                            title="Download Invitation Card"
                            aria-label="Download Invitation Card"
                          >
                            <Download className="w-4 h-4 stroke-[2.2]" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= STUDENT DETAILS / DIGITAL SLIP MODAL ================= */}
      {selectedStudent && (
        <div
          onClick={() => setSelectedStudent(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 cursor-pointer"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#050505] border-2 border-[#D4AF37] rounded-2xl max-w-lg w-full p-4 sm:p-6 text-left shadow-[0_0_50px_rgba(212,175,55,0.4)] relative cursor-default animate-in fade-in zoom-in duration-300 max-h-[92dvh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-start pb-3 border-b border-[#00E5FF]/20">
              <div>
                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest block">
                  Official Entry Pass & Registration Voucher
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white uppercase">
                  {branding.txt.collegeName} - {branding.txt.eventTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-white p-1 rounded-md bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pass Body */}
            <div className="my-4 sm:my-5 p-3.5 sm:p-4 rounded-xl bg-[#050505] border border-[#00E5FF]/30 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={selectedStudent.photoUrl}
                  alt={selectedStudent.fullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-base sm:text-lg font-black text-white truncate">{selectedStudent.fullName}</h4>
                  <p className="text-xs text-gray-400 truncate">
                    Roll: <span className="text-white font-bold">{selectedStudent.roll}</span> • Sec: <span className="text-[#D4AF37] font-bold">{formatStudentSection(selectedStudent.section, selectedStudent.group, selectedStudent.gender)}</span>
                  </p>
                  <p className="text-xs text-[#D4AF37] font-semibold">{selectedStudent.group} • {selectedStudent.className}</p>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">Reg ID: {selectedStudent.registrationNo || selectedStudent.id}</p>
                </div>
              </div>

              {/* Jersey Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-[#050505] p-3 rounded-lg border border-[#00E5FF]/20">
                <div>
                  <p className="text-gray-400 uppercase text-[10px]">Jersey Back Print</p>
                  <p className="text-white font-black text-sm">{selectedStudent.jerseyName} #{selectedStudent.jerseyNumber}</p>
                  <p className="text-[#D4AF37] font-bold">Size: {selectedStudent.jerseySize}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase text-[10px]">Contact Number</p>
                  <p className="text-white font-bold font-mono">{selectedStudent.contactNumber}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">Gender: {selectedStudent.gender}</p>
                </div>
              </div>

              {/* Barcode / QR Section */}
              <div className="pt-2 flex items-center justify-between border-t border-[#00E5FF]/20">
                <div className="flex items-center gap-2 text-gray-300 text-xs font-mono">
                  <QrCode className="w-6 h-6 sm:w-7 sm:h-7 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="block text-[10px] text-gray-400">VERIFICATION HASH</span>
                    <span className="text-xs">{selectedStudent.registrationNo}</span>
                  </div>
                </div>
                <div>
                  {selectedStudent.status === 'Rejected' ? (
                    <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-black bg-red-950 border border-red-600 text-red-400">
                      REJECTED
                    </span>
                  ) : (
                    <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-black bg-green-950 border border-green-500 text-green-400">
                      APPROVED
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2.5">
              {(selectedStudent.status === 'Approved' || selectedStudent.status === 'Verified' || Boolean(selectedStudent.invitationCardEnabled)) && selectedStudent.status !== 'Rejected' && (
                <button
                  onClick={() => {
                    setInvitationStudent(selectedStudent);
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#00C8A8] text-black font-bold text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(0,229,255,0.4)] transition active:scale-95"
                >
                  <Download className="w-4 h-4 text-black" />
                  Invitation Card
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-[#050505] hover:bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-white font-bold text-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-[#D4AF37]" />
                Print Pass
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= INVITATION CARD PREVIEW / DOWNLOAD MODAL ================= */}
      <InvitationCardModal
        isOpen={!!invitationStudent}
        onClose={() => setInvitationStudent(null)}
        student={invitationStudent}
      />

    </div>
  );
};
