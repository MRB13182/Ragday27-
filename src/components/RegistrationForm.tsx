import React, { useState, useEffect } from 'react';
import {
  FileText,
  User,
  CreditCard,
  Shirt,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Image as ImageIcon,
  Trash2,
  Lock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BackJerseySvg } from './JerseyPreview';
import { JerseySize, PaymentMethod, StudentGroup, StudentRegistration } from '../types';
import { formatStudentSection } from '../utils/sectionFormatter';
import { getNextRegistrationNumberFromDb } from '../services/studentService';
import { studentStore } from '../services/studentStore';
import { SUPER_ADMIN } from '../../SuperAdmin';

interface RegistrationFormProps {
  onSubmitSuccess: (newReg: StudentRegistration) => Promise<StudentRegistration> | StudentRegistration | void;
  onNavigateToStudentList: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmitSuccess,
  onNavigateToStudentList
}) => {
  const regConfig = SUPER_ADMIN.registrationSettings;
  const jerseyConfig = SUPER_ADMIN.jerseyManagement;
  const branding = SUPER_ADMIN.websiteBranding;

  // Form State
  const [fullName, setFullName] = useState('');
  const [roll, setRoll] = useState('');
  const [section, setSection] = useState('');
  const [group, setGroup] = useState<StudentGroup>('Science');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [contactNumber, setContactNumber] = useState('');
  const [registrationNo, setRegistrationNo] = useState('RD27-001');
  const [studentId, setStudentId] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bkash');
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Sync next registration number preview directly from database sequence
  useEffect(() => {
    let isMounted = true;
    const fetchNextNo = async () => {
      try {
        const nextNo = await getNextRegistrationNumberFromDb();
        if (isMounted && nextNo) {
          setRegistrationNo(nextNo);
        }
      } catch (e) {
        // silent fallback
      }
    };

    fetchNextNo();
    const unsub = studentStore.subscribe(() => {
      fetchNextNo();
    });
    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  // Jersey
  const [jerseySize, setJerseySize] = useState<JerseySize>('L');
  const [jerseyName, setJerseyName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('27');

  // Submission State
  const [submittedReg, setSubmittedReg] = useState<StudentRegistration | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Calculate dynamic amount based on size & SUPER_ADMIN configuration
  const basePrice = regConfig.txt.baseFee || 1050;
  const extra4XL = regConfig.txt.extraCharge4XL || 100;
  const currencySymbol = regConfig.txt.currency || '৳';
  const calculatedAmount = jerseySize === '4XL' ? basePrice + extra4XL : basePrice;

  // Selected payment target number
  const currentTargetNumber =
    paymentMethod === 'Bkash'
      ? (regConfig.txt.bkashNumber || '01813182885')
      : paymentMethod === 'Nagad'
      ? (regConfig.txt.nagadNumber || '01813182885')
      : (regConfig.txt.rocketNumber || '01813182885');

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size exceeds 2MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(currentTargetNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const validateForm = () => {
    const errs: string[] = [];
    if (!fullName.trim()) errs.push('Full Name is required');
    if (!roll.trim()) errs.push('Roll number is required');
    if (!section.trim()) errs.push('Section is required');
    if (!contactNumber.trim()) errs.push('Contact number is required');
    if (!transactionId.trim()) errs.push('Transaction ID is required');
    if (!senderNumber.trim()) errs.push('Sender number is required');
    if (!jerseyName.trim()) errs.push('Jersey Name is required');
    if (!jerseyNumber.trim()) errs.push('Jersey Number is required');
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3500);
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }
    setErrors([]);
    setIsSubmitting(true);
    setSubmitStatus('loading');

    const formattedSection = formatStudentSection(section, group, gender);

    const newRegistrationData: any = {
      fullName,
      roll,
      section: formattedSection,
      group,
      className: branding.txt.batchName || 'HSC 2027',
      gender,
      contactNumber,
      registrationNo: '', // Assigned atomically by database sequence rd27_registration_seq
      studentId: studentId || `${branding.txt.collegeShortName || 'NIC'}-27-${roll}`,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      paymentMethod,
      sendMoneyNumber: currentTargetNumber,
      amount: calculatedAmount,
      transactionId: transactionId.toUpperCase(),
      senderNumber,
      jerseySize,
      jerseyName: jerseyName.toUpperCase(),
      jerseyNumber,
      status: 'Pending',
      createdAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    };

    try {
      // Save directly into database sequence
      const savedStudent = await onSubmitSuccess(newRegistrationData);
      const studentToShow = savedStudent || newRegistrationData;
      setSubmittedReg(studentToShow);
      setSubmitStatus('success');

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6D28D9', '#FBBF24', '#FFFFFF', '#C084FC']
        });
      } catch (err) {
        console.log(err);
      }

      // Refresh database sequence preview
      getNextRegistrationNumberFromDb().then(nextNo => {
        if (nextNo) setRegistrationNo(nextNo);
      });
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrors([err?.message || 'Submission failed. Please try again.']);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sizeOptions: JerseySize[] = (jerseyConfig.txt.availableSizes as any) || ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

  return (
    <div className="w-full bg-[#111111] rounded-2xl border border-purple-700/40 shadow-[0_0_35px_rgba(109,40,217,0.25)] p-4 sm:p-6 md:p-8 relative">
      
      {/* Registration Form Header */}
      <div className="flex items-start gap-3 sm:gap-3.5 pb-4 sm:pb-6 border-b border-purple-900/30">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-500/10 border border-[#FBBF24]/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(251,191,36,0.3)]">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#FBBF24]" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-wide text-white uppercase">
            {regConfig.txt.formTitle}
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-[#CFCFCF] mt-0.5">
            {regConfig.txt.formSubtitle}
          </p>
        </div>
      </div>

      {/* Validation Errors Notice */}
      {errors.length > 0 && (
        <div className="mt-5 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs sm:text-sm">
          <p className="font-bold text-red-400 mb-1">Please complete the required fields:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        
        {/* ================= 1. STUDENT INFORMATION ================= */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#FBBF24]">
            <User className="w-4 h-4 text-[#FBBF24]" />
            <h3 className="text-sm font-bold tracking-wider uppercase text-[#FBBF24]">
              STUDENT INFORMATION
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Inputs Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              
              {/* Full Name */}
              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Full Name <span className="text-[#FBBF24]">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-[#16161F] border border-purple-900/50 focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition"
                />
              </div>

              {/* Roll */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Roll <span className="text-[#FBBF24]">*</span>
                </label>
                <input
                  type="text"
                  value={roll}
                  onChange={e => setRoll(e.target.value)}
                  placeholder="Roll number"
                  className="w-full bg-[#16161F] border border-purple-900/50 focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition"
                />
              </div>

              {/* Section */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-gray-300">
                    Section <span className="text-[#FBBF24]">*</span>
                  </label>
                  {section && (
                    <span className="text-[10px] font-mono font-bold text-[#FBBF24] bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/40">
                      Format: {formatStudentSection(section, group, gender)}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={section}
                  onChange={e => setSection(e.target.value)}
                  placeholder="e.g. B2, G1, B1"
                  className="w-full bg-[#16161F] border border-purple-900/50 focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition"
                />
              </div>

              {/* Group */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Group <span className="text-[#FBBF24]">*</span>
                </label>
                <select
                  value={group}
                  onChange={e => setGroup(e.target.value as StudentGroup)}
                  className="w-full bg-[#16161F] border border-purple-900/50 focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white outline-none transition"
                >
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Humanities">Humanities</option>
                </select>
              </div>

              {/* Class (Prefilled) */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Class <span className="text-[#FBBF24]">*</span>
                </label>
                <input
                  type="text"
                  value={branding.txt.batchName || 'HSC 2027'}
                  disabled
                  className="w-full bg-[#121218] border border-purple-950/60 text-gray-400 rounded-lg px-3 py-2.5 text-xs sm:text-sm cursor-not-allowed"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Gender <span className="text-[#FBBF24]">*</span>
                </label>
                <div className="flex items-center gap-4 h-[42px] px-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-gray-200">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'Male'}
                      onChange={() => setGender('Male')}
                      className="accent-[#6D28D9] w-4 h-4 cursor-pointer"
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-gray-200">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'Female'}
                      onChange={() => setGender('Female')}
                      className="accent-[#6D28D9] w-4 h-4 cursor-pointer"
                    />
                    <span>Female</span>
                  </label>
                </div>
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Contact Number <span className="text-[#FBBF24]">*</span>
                </label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  placeholder="Enter contact number"
                  className="w-full bg-[#16161F] border border-purple-900/50 focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition"
                />
              </div>

              {/* Registration No. (Database Sequence Allocated) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-gray-300">
                    Registration No. <span className="text-[#FBBF24]">*</span>
                  </label>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/50 text-[#FBBF24] font-semibold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#FBBF24]" />
                    DB Sequence
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={registrationNo ? `Next: ${registrationNo}` : 'Assigned by Database Sequence'}
                    readOnly
                    aria-readonly="true"
                    title="Registration Number is assigned atomically by database sequence rd27_registration_seq upon submit"
                    className="w-full bg-[#12111d] border border-purple-800/60 font-mono font-bold text-[#FBBF24] rounded-lg px-3 py-2.5 text-xs sm:text-sm outline-none cursor-not-allowed select-none shadow-inner"
                  />
                  <div className="absolute right-3 top-2.5 text-purple-400">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Assigned atomically by database sequence <span className="text-[#FBBF24] font-mono">rd27_registration_seq</span>.
                </p>
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Student ID
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  placeholder="Enter your ID"
                  className="w-full bg-[#16161F] border border-purple-900/50 focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition"
                />
              </div>

            </div>

            {/* Right Photo Upload Box */}
            <div className="lg:col-span-4 w-full">
              <label className="block text-xs font-medium text-gray-300 mb-1.5 opacity-0 pointer-events-none lg:block hidden">
                Photo
              </label>
              <div className="relative group w-full h-[140px] sm:h-[170px] lg:h-[190px] border-2 border-dashed border-purple-700/50 hover:border-[#FBBF24] bg-[#161622]/60 hover:bg-[#1a1728]/80 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />

                {photoUrl ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <img
                      src={photoUrl}
                      alt="Student Portrait"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#FBBF24] shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                    />
                    <p className="mt-1.5 sm:mt-2 text-xs text-green-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Photo Attached
                    </p>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setPhotoUrl('');
                      }}
                      className="mt-1 text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 z-20"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-110 group-hover:text-[#FBBF24] transition-all">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#FBBF24] transition-colors">
                      Upload Photo
                    </span>
                    <span className="text-[11px] text-[#CFCFCF] mt-1">
                      JPG, PNG (Max 2MB)
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ================= 2. PAYMENT INFORMATION ================= */}
        <div className="space-y-4 pt-4 border-t border-purple-900/30">
          <div className="flex items-center gap-2 text-[#FBBF24]">
            <CreditCard className="w-4 h-4 text-[#FBBF24]" />
            <h3 className="text-sm font-bold tracking-wider uppercase text-[#FBBF24]">
              PAYMENT INFORMATION
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            
            {/* Payment Method */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Payment Method <span className="text-[#FBBF24]">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-[#16161F] border border-purple-900/50 focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white outline-none transition"
              >
                <option value="Bkash">Bkash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
              </select>
            </div>

            {/* Send Money Number */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-300">
                  Send Money Number <span className="text-[#FBBF24]">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="text-[11px] text-[#FBBF24] hover:underline flex items-center gap-1"
                >
                  {copiedNumber ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedNumber ? 'Copied' : 'Copy'}
                </button>
              </div>
              <input
                type="text"
                value={currentTargetNumber}
                readOnly
                className="w-full bg-[#1a1824] border border-purple-800/40 text-[#FBBF24] font-semibold rounded-lg px-3 py-2.5 text-xs sm:text-sm tracking-wider"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Amount ({currencySymbol}) <span className="text-[#FBBF24]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={`${calculatedAmount} ${currencySymbol}`}
                  readOnly
                  className="w-full bg-[#1a1824] border border-purple-800/40 text-white font-bold rounded-lg px-3 py-2.5 text-xs sm:text-sm"
                />
                {jerseySize === '4XL' && (
                  <span className="absolute right-3 top-2.5 text-[10px] text-[#FBBF24] font-medium">
                    (Includes +{extra4XL} {currencySymbol})
                  </span>
                )}
              </div>
            </div>

            {/* Transaction ID */}
            <div className="sm:col-span-2 md:col-span-2">
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Transaction ID <span className="text-[#FBBF24]">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={e => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
                className="w-full bg-[#16161F] border border-purple-900/50 focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition"
              />
            </div>

            {/* From Which Number */}
            <div className="sm:col-span-2 md:col-span-1">
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                From Which Number <span className="text-[#FBBF24]">*</span>
              </label>
              <input
                type="text"
                value={senderNumber}
                onChange={e => setSenderNumber(e.target.value)}
                placeholder="Enter sender number"
                className="w-full bg-[#16161F] border border-purple-900/50 focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition"
              />
            </div>

          </div>
        </div>

        {/* ================= 3. JERSEY INFORMATION & LIVE PREVIEW ================= */}
        <div className="space-y-4 pt-4 border-t border-purple-900/30">
          <div className="flex items-center gap-2 text-[#FBBF24]">
            <Shirt className="w-4 h-4 text-[#FBBF24]" />
            <h3 className="text-sm font-bold tracking-wider uppercase text-[#FBBF24]">
              JERSEY INFORMATION
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Jersey Input Fields */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Jersey Size Selector */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Jersey Size <span className="text-[#FBBF24]">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {sizeOptions.map(size => {
                    const isSelected = jerseySize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setJerseySize(size)}
                        className={`min-w-[40px] px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                          isSelected
                            ? 'bg-[#16161F] border-2 border-[#FBBF24] text-[#FBBF24] shadow-[0_0_12px_rgba(251,191,36,0.4)] scale-105'
                            : 'bg-[#16161F] border border-purple-900/50 text-gray-300 hover:border-purple-600 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                  <span className="text-xs text-gray-400 italic ml-1">
                    ( + Extra Charge for 4XL )
                  </span>
                </div>
              </div>

              {/* Jersey Name & Jersey Number Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Jersey Name <span className="text-[#FBBF24]">*</span>
                  </label>
                  <input
                    type="text"
                    value={jerseyName}
                    onChange={e => setJerseyName(e.target.value.toUpperCase())}
                    placeholder="Enter jersey name"
                    maxLength={14}
                    className="w-full bg-[#16161F] border border-purple-900/50 focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 uppercase outline-none tracking-wider transition"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Max 14 letters (e.g. YOUR NAME)</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Jersey Number <span className="text-[#FBBF24]">*</span>
                  </label>
                  <input
                    type="text"
                    value={jerseyNumber}
                    onChange={e => setJerseyNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                    placeholder="Enter number"
                    maxLength={3}
                    className="w-full bg-[#16161F] border border-purple-900/50 focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none tracking-wider transition"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Up to 2-3 digits (e.g. 27 or 10)</p>
                </div>
              </div>

            </div>

            {/* Right: Back Jersey Live Preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <span className="text-xs font-semibold text-gray-300 tracking-wide uppercase mb-2">
                Back Jersey Preview
              </span>
              
              <div className="relative w-full max-w-[180px] xs:max-w-[210px] sm:max-w-[240px] aspect-[5/6] bg-[#0c0914] border border-purple-800/50 rounded-xl p-2.5 sm:p-3 flex items-center justify-center shadow-[0_0_20px_rgba(109,40,217,0.3)] hover:shadow-[0_0_25px_rgba(109,40,217,0.5)] transition-all">
                <BackJerseySvg
                  name={jerseyName || jerseyConfig.txt.defaultName || 'YOUR NAME'}
                  number={jerseyNumber || jerseyConfig.txt.defaultNumber || '27'}
                  className="w-full h-full object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]"
                />

                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 border border-purple-500/40 text-[9px] text-[#FBBF24] uppercase tracking-wider font-bold">
                  Size: {jerseySize}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ================= SUBMIT BUTTON & FEEDBACK ================= */}
        <div className="pt-4 space-y-3">
          <button
            type="submit"
            disabled={isSubmitting || submitStatus === 'loading'}
            className={`w-full py-4 px-6 rounded-xl font-black text-base sm:text-lg uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 select-none ${
              submitStatus === 'loading'
                ? 'bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#D97706] text-black cursor-wait shadow-[0_0_30px_rgba(245,158,11,0.5)] scale-[0.99]'
                : submitStatus === 'success'
                ? 'bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 text-black shadow-[0_0_35px_rgba(34,197,94,0.7)] scale-[1.01]'
                : submitStatus === 'error'
                ? 'bg-gradient-to-r from-red-600 via-rose-500 to-red-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-shake'
                : 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] text-black hover:brightness-110 active:scale-[0.99] shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:shadow-[0_0_35px_rgba(251,191,36,0.6)] cursor-pointer'
            } disabled:opacity-85`}
          >
            {submitStatus === 'loading' && (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-black" />
                <span>PROCESSING REGISTRATION...</span>
              </>
            )}

            {submitStatus === 'success' && (
              <>
                <CheckCircle2 className="w-5 h-5 text-black" />
                <span>REGISTRATION CONFIRMED!</span>
              </>
            )}

            {submitStatus === 'error' && (
              <>
                <AlertCircle className="w-5 h-5 text-white" />
                <span>SUBMISSION FAILED • FIX REQUIRED FIELDS</span>
              </>
            )}

            {submitStatus === 'idle' && (
              <>
                <Send className="w-5 h-5 text-black fill-black" />
                <span>SUBMIT REGISTRATION</span>
              </>
            )}
          </button>

          {/* Contextual feedback messages */}
          {submitStatus === 'error' && (
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-red-400 py-2 px-3.5 rounded-lg bg-red-950/50 border border-red-800/60 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>Please complete all mandatory fields marked with an asterisk (*).</span>
            </div>
          )}

          {submitStatus === 'success' && (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-300 py-2 px-3.5 rounded-lg bg-emerald-950/50 border border-emerald-700/60 animate-in fade-in slide-in-from-top-1 duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Registration confirmed! Generating your official entry pass...</span>
            </div>
          )}
        </div>

      </form>

      {/* Submission Success Dialog */}
      {submittedReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#141419] border-2 border-[#FBBF24] rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-[0_0_40px_rgba(251,191,36,0.4)] text-center relative animate-in fade-in zoom-in duration-300 max-h-[92dvh] overflow-y-auto">
            
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-500/10 border border-green-500 flex items-center justify-center text-green-400 mx-auto mb-3 sm:mb-4 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white tracking-wide">
              {regConfig.txt.successTitle}
            </h3>
            
            <p className="text-xs text-gray-300 mt-1.5 sm:mt-2">
              Congratulations <span className="text-[#FBBF24] font-bold">{submittedReg.fullName}</span>! {regConfig.txt.successMessage}
            </p>

            <div className="my-4 sm:my-5 p-3 sm:p-3.5 bg-[#0C0A14] border border-purple-800/50 rounded-xl text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-400">Registration ID:</span>
                <span className="text-[#FBBF24] font-mono font-bold">{submittedReg.registrationNo || submittedReg.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Student Roll:</span>
                <span className="text-white font-semibold">{submittedReg.roll}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Jersey Name & No:</span>
                <span className="text-white font-bold">{submittedReg.jerseyName} #{submittedReg.jerseyNumber} ({submittedReg.jerseySize})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">TxID:</span>
                <span className="text-purple-300 font-mono">{submittedReg.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-amber-400 font-bold">Pending Verification</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => {
                  setSubmittedReg(null);
                  setSubmitStatus('idle');
                  onNavigateToStudentList();
                }}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#6D28D9] hover:bg-[#7C3AED] text-white font-bold text-xs uppercase tracking-wide transition shadow-[0_0_15px_rgba(109,40,217,0.5)]"
              >
                View in Student List
              </button>
              <button
                onClick={() => {
                  setSubmittedReg(null);
                  setSubmitStatus('idle');
                }}
                className="py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 font-semibold text-xs transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
