import React, { useState } from 'react';
import { X, Search, Download, FileText, Eye, CheckCircle2, XCircle, AlertCircle, Phone, CreditCard, Hash, Shirt, User, Calendar } from 'lucide-react';
import { StudentRegistration } from '../types';
import { generateStudentReportPdf } from '../services/pdfExportService';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: StudentRegistration[];
  onUpdateRegistration: (id: string, updated: Partial<StudentRegistration>) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  registrations,
  onUpdateRegistration
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminIdInput, setAdminIdInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Dashboard states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [selectedStudent, setSelectedStudent] = useState<StudentRegistration | null>(null);

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
      <div className="bg-[#141416] border border-gray-700 rounded-xl max-w-6xl w-full max-h-[94dvh] flex flex-col text-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Admin Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1b1b1f] border-b border-gray-700">
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
              className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition"
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
              <div className="bg-[#1a1a1f] border border-gray-700/80 rounded-xl p-6 sm:p-8 shadow-xl">
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
                      className="w-full bg-[#0d0d0f] border border-gray-600 focus:border-purple-500 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none transition"
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
                    className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-md active:scale-98"
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
                <div className="bg-[#1b1b1f] border border-gray-700 rounded-lg p-3.5 text-center shadow-sm">
                  <p className="text-xs text-gray-400 font-medium">Total Registrations</p>
                  <p className="text-2xl font-black text-white mt-0.5">{totalCount}</p>
                </div>
                <div className="bg-[#1b1b1f] border border-amber-800/40 rounded-lg p-3.5 text-center shadow-sm">
                  <p className="text-xs text-amber-300 font-medium">Pending</p>
                  <p className="text-2xl font-black text-amber-400 mt-0.5">{pendingCount}</p>
                </div>
                <div className="bg-[#1b1b1f] border border-green-800/40 rounded-lg p-3.5 text-center shadow-sm">
                  <p className="text-xs text-green-300 font-medium">Approved</p>
                  <p className="text-2xl font-black text-green-400 mt-0.5">{approvedCount}</p>
                </div>
                <div className="bg-[#1b1b1f] border border-red-800/40 rounded-lg p-3.5 text-center shadow-sm">
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
                    className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-purple-500"
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
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-[#1b1b1f] text-gray-300 hover:bg-gray-800 border border-gray-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

              </div>

              {/* PDF EXPORT SYSTEM */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-gray-800 text-xs">
                <span className="text-gray-400 font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>PDF Export:</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => generateStudentReportPdf({ type: 'approved', students: registrations })}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 font-semibold transition active:scale-95 text-xs whitespace-nowrap shadow-sm"
                    title="Export Approved Registrations PDF Report"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Approved PDF</span>
                  </button>
                </div>
              </div>

              {/* TABLE */}
              <div className="border border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300 border-collapse">
                    <thead className="bg-[#1b1b1f] text-gray-300 border-b border-gray-700 font-semibold">
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
                    <tbody className="divide-y divide-gray-800">
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
                            <tr key={student.id} className="hover:bg-gray-900/50 transition-colors">
                              {/* SL */}
                              <td className="py-2.5 px-3 font-mono text-gray-400">
                                {idx + 1}
                              </td>

                              {/* Photo */}
                              <td className="py-2.5 px-3">
                                <img
                                  src={student.photoUrl}
                                  alt=""
                                  className="w-8 h-8 rounded-full object-cover border border-gray-700 bg-gray-900 cursor-pointer hover:scale-110 transition-transform"
                                  onClick={() => setSelectedStudent(student)}
                                />
                              </td>

                              {/* Name */}
                              <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setSelectedStudent(student)}
                                  className="hover:text-purple-400 transition text-left"
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
                              <td className="py-2.5 px-3 font-mono text-[#FBBF24] font-semibold whitespace-nowrap">
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
                                <div className="inline-flex items-center gap-1.5">
                                  {/* View Student Details */}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedStudent(student)}
                                    className="p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
                                    title="View Student Details"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Approve */}
                                  <button
                                    type="button"
                                    onClick={() => onUpdateRegistration(student.id, { status: 'Approved' })}
                                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                                      isApproved
                                        ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40 cursor-default'
                                        : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm'
                                    }`}
                                    title="Approve Registration"
                                  >
                                    ✓ Approve
                                  </button>

                                  {/* Reject */}
                                  <button
                                    type="button"
                                    onClick={() => onUpdateRegistration(student.id, { status: 'Rejected' })}
                                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                                      isRejected
                                        ? 'bg-rose-900/40 text-rose-300 border border-rose-700/40 cursor-default'
                                        : 'bg-rose-700 hover:bg-rose-600 text-white shadow-sm'
                                    }`}
                                    title="Reject Registration"
                                  >
                                    ✕ Reject
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
            <div className="bg-[#18181e] border border-purple-600/70 rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92dvh] overflow-y-auto">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-3 sm:gap-4 pb-4 border-b border-gray-800">
                <img
                  src={selectedStudent.photoUrl}
                  alt={selectedStudent.fullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-purple-500 shadow-md bg-gray-900 shrink-0"
                />
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-white truncate">
                      {selectedStudent.fullName}
                    </h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-[#FBBF24] font-bold">
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
                <div className="bg-[#121216] p-3 rounded-lg border border-gray-800">
                  <p className="text-gray-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-400" /> Academic Info
                  </p>
                  <p className="text-white font-semibold mt-1">Section: {selectedStudent.section}</p>
                  <p className="text-white font-semibold">Roll: {selectedStudent.roll}</p>
                  <p className="text-gray-300 font-mono">ID: {selectedStudent.studentId || '-'}</p>
                </div>

                <div className="bg-[#121216] p-3 rounded-lg border border-gray-800">
                  <p className="text-gray-400 flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-[#FBBF24]" /> Jersey Details
                  </p>
                  <p className="text-white font-semibold mt-1">Name: {selectedStudent.jerseyName}</p>
                  <p className="text-[#FBBF24] font-bold text-sm">Number: #{selectedStudent.jerseyNumber}</p>
                  <p className="text-purple-300 font-semibold">Size: {selectedStudent.jerseySize}</p>
                </div>

                <div className="bg-[#121216] p-3 rounded-lg border border-gray-800">
                  <p className="text-gray-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-400" /> Contact
                  </p>
                  <p className="text-white font-mono font-semibold mt-1">{selectedStudent.contactNumber}</p>
                  <p className="text-gray-400 text-[11px]">Sender: {selectedStudent.senderNumber || '-'}</p>
                </div>

                <div className="bg-[#121216] p-3 rounded-lg border border-gray-800">
                  <p className="text-gray-400 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Payment
                  </p>
                  <p className="text-white font-mono font-semibold mt-1">TxID: {selectedStudent.transactionId}</p>
                  <p className="text-emerald-400 font-bold">{selectedStudent.paymentMethod} • ৳{selectedStudent.amount || 1050}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateRegistration(selectedStudent.id, { status: 'Approved' });
                      setSelectedStudent(prev => prev ? { ...prev, status: 'Approved' } : null);
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
                  >
                    ✓ Approve Registration
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateRegistration(selectedStudent.id, { status: 'Rejected' });
                      setSelectedStudent(prev => prev ? { ...prev, status: 'Rejected' } : null);
                    }}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow"
                  >
                    ✕ Reject Registration
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-3.5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
