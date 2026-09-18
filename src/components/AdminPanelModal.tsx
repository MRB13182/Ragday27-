import React, { useState } from 'react';
import { X, Search, Download, FileText, Eye, Check, Trash2, CheckCircle2, XCircle, AlertCircle, Phone, CreditCard, Hash, Shirt, User, Calendar } from 'lucide-react';
import { StudentRegistration } from '../types';
import { generateStudentReportPdf } from '../services/pdfExportService';
import { InvitationCardModal } from './InvitationCardModal';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: StudentRegistration[];
  onUpdateRegistration: (id: string, updated: Partial<StudentRegistration>) => void;
  onDeleteRegistration?: (id: string, student: StudentRegistration) => Promise<void> | void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  registrations,
  onUpdateRegistration,
  onDeleteRegistration
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminIdInput, setAdminIdInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Dashboard states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [selectedStudent, setSelectedStudent] = useState<StudentRegistration | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentRegistration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [invitationStudentAdmin, setInvitationStudentAdmin] = useState<StudentRegistration | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const input = adminIdInput.trim();
    if (input === 'admin.rdnic27' || input.toLowerCase() === 'admin.rdnic27') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Admin ID. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminIdInput('');
    setErrorMsg('');
    setSelectedStudent(null);
    setStudentToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      if (onDeleteRegistration) {
        await onDeleteRegistration(studentToDelete.id, studentToDelete);
      }
      if (selectedStudent && (selectedStudent.id === studentToDelete.id || selectedStudent.registrationNo === studentToDelete.registrationNo)) {
        setSelectedStudent(null);
      }
    } finally {
      setIsDeleting(false);
      setStudentToDelete(null);
    }
  };

  // Counters
  const pendingCount = registrations.filter(r => r.status === 'Pending').length;
  const approvedCount = registrations.filter(r => r.status === 'Approved' || r.status === 'Verified').length;
  const rejectedCount = registrations.filter(r => r.status === 'Rejected').length;
  const totalCount = registrations.length;

  // Filter and Search logic (Search by Name, Roll, Student ID, Reg No, TxID, Contact)
  const filteredList = registrations.filter(student => {
    if (statusFilter === 'Pending' && student.status !== 'Pending') return false;
    if (statusFilter === 'Approved' && (student.status !== 'Approved' && student.status !== 'Verified')) return false;
    if (statusFilter === 'Rejected' && student.status !== 'Rejected') return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = (student.fullName || '').toLowerCase().includes(q);
    const rollMatch = (student.roll || '').toLowerCase().includes(q);
    const idMatch = (student.studentId || '').toLowerCase().includes(q);
    const regNoMatch = (student.registrationNo || '').toLowerCase().includes(q);
    const txMatch = (student.transactionId || '').toLowerCase().includes(q);
    const contactMatch = (student.contactNumber || '').toLowerCase().includes(q);

    return nameMatch || rollMatch || idMatch || regNoMatch || txMatch || contactMatch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-5">
      <div className="bg-[#050505] border border-[#00E5FF]/30 rounded-xl max-w-6xl w-full max-h-[94dvh] flex flex-col text-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Admin Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#050505] border-b border-[#00E5FF]/20">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-white tracking-wide">
              Admin Panel — Registration Management
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-white underline transition"
              >
                Logout
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {!isAuthenticated ? (
            /* ================= ADMIN LOGIN ================= */
            <div className="max-w-sm mx-auto py-16">
              <div className="bg-[#050505] border border-[#00E5FF]/30 rounded-xl p-6 sm:p-8 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                <h3 className="text-lg font-bold text-white text-center mb-1">
                  Admin Login
                </h3>
                <p className="text-xs text-gray-400 text-center mb-6">
                  Enter Admin Login ID to manage student registrations
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Admin ID
                    </label>
                    <input
                      type="password"
                      value={adminIdInput}
                      onChange={e => {
                        setAdminIdInput(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="Enter Admin ID"
                      autoFocus
                      className="w-full bg-[#050505] border border-[#00E5FF]/30 focus:border-[#00E5FF] rounded-lg px-3.5 py-2.5 text-sm text-white outline-none transition"
                    />
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-2 text-xs text-red-400 font-medium bg-red-950/40 border border-red-800/40 p-2.5 rounded-lg">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#00C8A8] text-black font-bold text-sm transition shadow-[0_0_15px_rgba(0,229,255,0.4)] active:scale-98"
                  >
                    Login to Admin Panel
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* ================= REGISTRATION MANAGEMENT DASHBOARD ================= */
            <div className="space-y-5">
              
              {/* COUNTER BOXES */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#050505] border border-[#00E5FF]/20 rounded-lg p-3.5 text-center shadow-sm">
                  <p className="text-xs text-gray-400 font-medium">Total Registrations</p>
                  <p className="text-2xl font-black text-white mt-0.5">{totalCount}</p>
                </div>
                <div className="bg-[#050505] border border-amber-800/40 rounded-lg p-3.5 text-center shadow-sm">
                  <p className="text-xs text-amber-300 font-medium">Pending</p>
                  <p className="text-2xl font-black text-amber-400 mt-0.5">{pendingCount}</p>
                </div>
                <div className="bg-[#050505] border border-green-800/40 rounded-lg p-3.5 text-center shadow-sm">
                  <p className="text-xs text-green-300 font-medium">Approved</p>
                  <p className="text-2xl font-black text-green-400 mt-0.5">{approvedCount}</p>
                </div>
                <div className="bg-[#050505] border border-red-800/40 rounded-lg p-3.5 text-center shadow-sm">
                  <p className="text-xs text-red-300 font-medium">Rejected</p>
                  <p className="text-2xl font-black text-red-400 mt-0.5">{rejectedCount}</p>
                </div>
              </div>

              {/* SEARCH & FILTER CONTROLS */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by Name, Roll, ID, Reg No, Contact, Transaction ID..."
                    className="w-full bg-[#050505] border border-[#00E5FF]/30 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-[#00E5FF]"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs flex-wrap">
                  {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setStatusFilter(f)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition ${
                        statusFilter === f
                          ? 'bg-gradient-to-r from-[#00E5FF] to-[#00C8A8] text-black font-bold shadow-md'
                          : 'bg-[#050505] text-gray-300 hover:bg-[#00E5FF]/10 border border-[#00E5FF]/20'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

              </div>

              {/* PDF EXPORT SYSTEM */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-[#00E5FF]/15 text-xs">
                <span className="text-gray-400 font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>PDF Export:</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => generateStudentReportPdf({ type: 'approved', students: registrations })}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#00C8A8] text-black font-bold transition active:scale-95 text-xs whitespace-nowrap shadow-[0_0_12px_rgba(0,229,255,0.3)]"
                    title="Export Approved Registrations PDF Report"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Approved PDF</span>
                  </button>
                </div>
              </div>

              {/* TABLE */}
              <div className="border border-[#00E5FF]/20 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300 border-collapse">
                    <thead className="bg-[#050505] text-gray-300 border-b border-[#00E5FF]/20 font-semibold">
                      <tr>
                        <th className="py-3 px-3">SL</th>
                        <th className="py-3 px-3">Photo</th>
                        <th className="py-3 px-3">Name</th>
                        <th className="py-3 px-3">Section</th>
                        <th className="py-3 px-3">Roll</th>
                        <th className="py-3 px-3">Student ID</th>
                        <th className="py-3 px-3">Reg No</th>
                        <th className="py-3 px-3">Jersey</th>
                        <th className="py-3 px-3">TxID</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#00E5FF]/10">
                      {filteredList.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="py-10 text-center text-gray-400">
                            No student registrations match your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredList.map((student, idx) => {
                          const isApproved = student.status === 'Approved' || student.status === 'Verified';
                          const isPending = student.status === 'Pending';
                          const isRejected = student.status === 'Rejected';

                          return (
                            <tr key={student.id} className="hover:bg-[#00E5FF]/5 transition-colors">
                              {/* SL */}
                              <td className="py-2.5 px-3 font-mono text-gray-400">
                                {idx + 1}
                              </td>

                              {/* Photo */}
                              <td className="py-2.5 px-3">
                                <img
                                  src={student.photoUrl}
                                  alt=""
                                  className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]/50 bg-black cursor-pointer hover:scale-110 transition-transform"
                                  onClick={() => setSelectedStudent(student)}
                                />
                              </td>

                              {/* Name */}
                              <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setSelectedStudent(student)}
                                  className="hover:text-[#00E5FF] transition text-left"
                                >
                                  {student.fullName}
                                </button>
                              </td>

                              {/* Section */}
                              <td className="py-2.5 px-3 text-gray-300">
                                {student.section}
                              </td>

                              {/* Roll */}
                              <td className="py-2.5 px-3 font-mono text-gray-200">
                                {student.roll}
                              </td>

                              {/* Student ID */}
                              <td className="py-2.5 px-3 font-mono text-gray-300 whitespace-nowrap">
                                {student.studentId || '-'}
                              </td>

                              {/* Reg No */}
                              <td className="py-2.5 px-3 font-mono text-[#D4AF37] font-semibold whitespace-nowrap">
                                {student.registrationNo}
                              </td>

                              {/* Jersey */}
                              <td className="py-2.5 px-3 text-gray-300 whitespace-nowrap">
                                <span className="font-semibold text-white">{student.jerseyName}</span>
                                <span className="text-gray-400 ml-1">#{student.jerseyNumber} ({student.jerseySize})</span>
                              </td>

                              {/* Transaction ID */}
                              <td className="py-2.5 px-3 font-mono text-gray-200 whitespace-nowrap">
                                {student.transactionId}
                              </td>

                              {/* Status */}
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                {isApproved ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    Approved
                                  </span>
                                ) : isPending ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/60">
                                    Pending
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-700/60">
                                    <XCircle className="w-3 h-3 text-rose-400" />
                                    Rejected
                                  </span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                <div className="inline-flex items-center justify-end gap-1.5 sm:gap-2">
                                  {/* 👁 View */}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedStudent(student)}
                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#00E5FF]/20 text-gray-300 hover:text-white border border-[#00E5FF]/20 transition active:scale-95 flex items-center justify-center shadow-sm"
                                    title="View"
                                    aria-label="View"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {/* ✔ Approve */}
                                  <button
                                    type="button"
                                    onClick={() => onUpdateRegistration(student.id, { status: 'Approved', invitationCardEnabled: true })}
                                    className={`w-8 h-8 rounded-lg border transition active:scale-95 flex items-center justify-center shadow-sm ${
                                      isApproved
                                        ? 'bg-emerald-800/80 border-emerald-500 text-white shadow-emerald-950/40 cursor-default'
                                        : 'bg-emerald-950/70 hover:bg-emerald-900 border-emerald-700/60 text-emerald-400 hover:text-emerald-200'
                                    }`}
                                    title="Approve"
                                    aria-label="Approve"
                                  >
                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                  </button>

                                  {/* ✘ Reject */}
                                  <button
                                    type="button"
                                    onClick={() => onUpdateRegistration(student.id, { status: 'Rejected', invitationCardEnabled: false, invitationCardUrl: null })}
                                    className={`w-8 h-8 rounded-lg border transition active:scale-95 flex items-center justify-center shadow-sm ${
                                      isRejected
                                        ? 'bg-rose-800/80 border-rose-500 text-white shadow-rose-950/40 cursor-default'
                                        : 'bg-rose-950/70 hover:bg-rose-900 border-rose-700/60 text-rose-400 hover:text-rose-200'
                                    }`}
                                    title="Reject"
                                    aria-label="Reject"
                                  >
                                    <X className="w-4 h-4 stroke-[2.5]" />
                                  </button>

                                  {/* 🗑 Delete */}
                                  <button
                                    type="button"
                                    onClick={() => setStudentToDelete(student)}
                                    className="w-8 h-8 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-800/60 text-red-400 hover:text-red-200 transition active:scale-95 flex items-center justify-center shadow-sm"
                                    title="Delete"
                                    aria-label="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ================= STUDENT DETAILS MODAL ================= */}
        {selectedStudent && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-5">
            <div className="bg-[#050505] border border-[#00E5FF]/50 rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-[0_0_50px_rgba(0,229,255,0.25)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92dvh] overflow-y-auto">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-3 sm:gap-4 pb-4 border-b border-[#00E5FF]/20">
                <img
                  src={selectedStudent.photoUrl}
                  alt={selectedStudent.fullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-[#D4AF37] shadow-md bg-black shrink-0"
                />
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-white truncate">
                      {selectedStudent.fullName}
                    </h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#D4AF37] font-bold">
                      {selectedStudent.registrationNo}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    NIC HSC Batch 2027 • {selectedStudent.group}
                  </p>
                  <div className="mt-2">
                    {selectedStudent.status === 'Approved' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    ) : selectedStudent.status === 'Pending' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-600">
                        Pending Verification
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-600">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 py-3.5 sm:py-4 text-xs">
                <div className="bg-[#050505] p-3 rounded-lg border border-[#00E5FF]/20">
                  <p className="text-gray-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#00E5FF]" /> Academic Info
                  </p>
                  <p className="text-white font-semibold mt-1">Section: {selectedStudent.section}</p>
                  <p className="text-white font-semibold">Roll: {selectedStudent.roll}</p>
                  <p className="text-gray-300 font-mono">ID: {selectedStudent.studentId || '-'}</p>
                </div>

                <div className="bg-[#050505] p-3 rounded-lg border border-[#00E5FF]/20">
                  <p className="text-gray-400 flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-[#D4AF37]" /> Jersey Details
                  </p>
                  <p className="text-white font-semibold mt-1">Name: {selectedStudent.jerseyName}</p>
                  <p className="text-[#D4AF37] font-bold text-sm">Number: #{selectedStudent.jerseyNumber}</p>
                  <p className="text-[#00E5FF] font-semibold">Size: {selectedStudent.jerseySize}</p>
                </div>

                <div className="bg-[#050505] p-3 rounded-lg border border-[#00E5FF]/20">
                  <p className="text-gray-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#00E5FF]" /> Contact
                  </p>
                  <p className="text-white font-mono font-semibold mt-1">{selectedStudent.contactNumber}</p>
                  <p className="text-gray-400 text-[11px]">Sender: {selectedStudent.senderNumber || '-'}</p>
                </div>

                <div className="bg-[#050505] p-3 rounded-lg border border-[#00E5FF]/20">
                  <p className="text-gray-400 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#00C8A8]" /> Payment
                  </p>
                  <p className="text-white font-mono font-semibold mt-1">TxID: {selectedStudent.transactionId}</p>
                  <p className="text-[#00C8A8] font-bold">{selectedStudent.paymentMethod} • ৳{selectedStudent.amount || 1050}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 sm:gap-3 pt-3 border-t border-[#00E5FF]/20">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* ✔ Approve */}
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateRegistration(selectedStudent.id, { status: 'Approved', invitationCardEnabled: true });
                      setSelectedStudent(prev => prev ? { ...prev, status: 'Approved', invitationCardEnabled: true } : null);
                    }}
                    className={`w-9 h-9 rounded-lg border transition active:scale-95 flex items-center justify-center shadow-sm ${
                      selectedStudent.status === 'Approved'
                        ? 'bg-emerald-800 border-emerald-500 text-white cursor-default'
                        : 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-700/60 text-emerald-400 hover:text-emerald-200'
                    }`}
                    title="Approve"
                    aria-label="Approve"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  {/* ✘ Reject */}
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateRegistration(selectedStudent.id, { status: 'Rejected', invitationCardEnabled: false, invitationCardUrl: null });
                      setSelectedStudent(prev => prev ? { ...prev, status: 'Rejected', invitationCardEnabled: false, invitationCardUrl: null } : null);
                    }}
                    className={`w-9 h-9 rounded-lg border transition active:scale-95 flex items-center justify-center shadow-sm ${
                      selectedStudent.status === 'Rejected'
                        ? 'bg-rose-800 border-rose-500 text-white cursor-default'
                        : 'bg-rose-950/80 hover:bg-rose-900 border-rose-700/60 text-rose-400 hover:text-rose-200'
                    }`}
                    title="Reject"
                    aria-label="Reject"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  {/* 🗑 Delete */}
                  <button
                    type="button"
                    onClick={() => setStudentToDelete(selectedStudent)}
                    className="w-9 h-9 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800/60 text-red-400 hover:text-red-200 transition active:scale-95 flex items-center justify-center shadow-sm"
                    title="Delete"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Invitation Card (if Approved) */}
                  {(selectedStudent.status === 'Approved' || Boolean(selectedStudent.invitationCardEnabled)) && selectedStudent.status !== 'Rejected' && (
                    <button
                      type="button"
                      onClick={() => setInvitationStudentAdmin(selectedStudent)}
                      className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#00C8A8] text-black font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-[0_0_10px_rgba(0,229,255,0.4)] ml-1"
                      title="View & Download Invitation Card"
                    >
                      <Download className="w-3.5 h-3.5 text-black" />
                      <span>Card</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= INVITATION CARD MODAL FOR ADMIN ================= */}
        <InvitationCardModal
          isOpen={!!invitationStudentAdmin}
          onClose={() => setInvitationStudentAdmin(null)}
          student={invitationStudentAdmin}
        />

        {/* ================= DELETE CONFIRMATION MODAL ================= */}
        {studentToDelete && (
          <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
            <div className="bg-[#18181f] border border-red-700/60 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative text-center">
              <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-600/70 text-red-400 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white">
                Delete this registration permanently?
              </h3>

              <div className="my-3.5 p-3 rounded-lg bg-black/40 border border-gray-800 text-left text-xs space-y-1">
                <p className="text-white font-semibold text-sm">{studentToDelete.fullName}</p>
                <p className="text-gray-400 font-mono">Roll: <span className="text-gray-200 font-bold">{studentToDelete.roll}</span> • Reg: <span className="text-[#FBBF24] font-bold">{studentToDelete.registrationNo}</span></p>
                <p className="text-gray-400">
                  Status: <span className={studentToDelete.status === 'Approved' ? 'text-emerald-400 font-bold' : studentToDelete.status === 'Rejected' ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>{studentToDelete.status}</span>
                </p>
              </div>

              <p className="text-xs text-gray-400 mb-5">
                This action cannot be undone. The registration will be removed permanently from Supabase and the system.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setStudentToDelete(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs sm:text-sm transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-red-900/40 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
