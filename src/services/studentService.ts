import { supabase, isSupabaseConfigured } from './supabaseClient';
import { StudentRegistration, RegistrationStatus } from '../types';
import { formatStudentSection } from '../utils/sectionFormatter';

export interface SupabaseStudentRecord {
  id?: string;
  full_name: string;
  section: string;
  roll: string;
  student_id: string;
  contact_number: string;
  jersey_name: string;
  jersey_number: string;
  jersey_size: string;
  transaction_id: string;
  registration_number: string;
  photo_url?: string;
  payment_method?: string;
  group_name?: string;
  payment_status: 'pending' | 'verified' | 'rejected';
  registration_status: 'pending' | 'approved' | 'rejected';
  invitation_card_url?: string | null;
  invitation_card_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Convert Supabase record to frontend StudentRegistration
export function mapSupabaseToStudent(record: any): StudentRegistration {
  const dbStatus: 'pending' | 'approved' | 'rejected' =
    record.registration_status === 'approved'
      ? 'approved'
      : record.registration_status === 'rejected'
      ? 'rejected'
      : 'pending';

  let mappedStatus: RegistrationStatus = 'Pending';
  if (dbStatus === 'approved') mappedStatus = 'Approved';
  else if (dbStatus === 'rejected') mappedStatus = 'Rejected';

  const invitationEnabled = record.invitation_card_enabled !== undefined 
    ? Boolean(record.invitation_card_enabled) 
    : (dbStatus === 'approved');

  return {
    id: record.id || record.registration_number || `REG-${record.roll}`,
    fullName: record.full_name || '',
    roll: record.roll || '',
    section: record.section || '',
    group: (record.group_name as any) || 'Science',
    className: 'HSC 2027',
    gender: 'Male', // Default, can be derived if needed
    contactNumber: record.contact_number || '',
    registrationNo: record.registration_number || '',
    studentId: record.student_id || '',
    photoUrl: record.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    paymentMethod: (record.payment_method as any) || 'Bkash',
    sendMoneyNumber: '01712345678',
    amount: 1050,
    transactionId: record.transaction_id || '',
    senderNumber: record.contact_number || '',
    jerseySize: record.jersey_size as any,
    jerseyName: record.jersey_name || '',
    jerseyNumber: record.jersey_number || '',
    status: mappedStatus,
    dbStatus: dbStatus,
    invitationCardUrl: record.invitation_card_url || null,
    invitationCardEnabled: invitationEnabled,
    createdAt: record.created_at || new Date().toISOString()
  };
}

// Convert frontend StudentRegistration to Supabase record
export function mapStudentToSupabase(student: StudentRegistration): SupabaseStudentRecord {
  const regStatus =
    student.status === 'Approved' || student.status === 'Verified'
      ? 'approved'
      : student.status === 'Rejected'
      ? 'rejected'
      : 'pending';

  const payStatus =
    regStatus === 'approved' ? 'verified' : regStatus === 'rejected' ? 'rejected' : 'pending';

  const regNo =
    !student.registrationNo ||
    student.registrationNo.toLowerCase().includes('auto') ||
    student.registrationNo === 'RD27-' ||
    student.registrationNo.trim() === ''
      ? null
      : student.registrationNo.trim();

  return {
    full_name: student.fullName,
    section: formatStudentSection(student.section, student.group, student.gender),
    roll: student.roll,
    student_id: student.studentId || `NIC-27-${student.roll}`,
    contact_number: student.contactNumber,
    jersey_name: student.jerseyName.toUpperCase(),
    jersey_number: student.jerseyNumber,
    jersey_size: student.jerseySize,
    transaction_id: student.transactionId.toUpperCase(),
    registration_number: regNo as any,
    photo_url: student.photoUrl,
    payment_method: student.paymentMethod,
    group_name: student.group,
    payment_status: payStatus,
    registration_status: regStatus,
    invitation_card_enabled: regStatus === 'approved',
    invitation_card_url: student.invitationCardUrl || null
  };
}

// Query next sequential registration number from Supabase sequence or table
export async function getNextRegistrationNumberFromDb(): Promise<string> {
  if (!isSupabaseConfigured) {
    return 'RD27-001';
  }

  // 1. Try PostgreSQL RPC using sequence rd27_registration_seq
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_next_registration_number');
    if (!rpcError && rpcData && typeof rpcData === 'string' && rpcData.startsWith('RD27-')) {
      return rpcData;
    }
  } catch (err) {
    // proceed to table query
  }

  // 2. Query registered_students table for highest registration_number
  try {
    const { data, error } = await supabase
      .from('registered_students')
      .select('registration_number')
      .order('registration_number', { ascending: false })
      .limit(1);

    if (!error && data && data.length > 0 && data[0]?.registration_number) {
      const match = String(data[0].registration_number).match(/^RD27-(\d+)$/i);
      if (match) {
        const nextVal = parseInt(match[1], 10) + 1;
        return `RD27-${String(nextVal).padStart(3, '0')}`;
      }
    }
  } catch (err) {
    console.warn('Fallback sequence check notice:', err);
  }

  return 'RD27-001';
}

// Fetch approved registrations from Supabase (authoritative function for public Student List)
export async function fetchApprovedStudentsFromSupabase(): Promise<StudentRegistration[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('registered_students')
      .select('*')
      .eq('registration_status', 'approved')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Supabase fetchApprovedStudents error:', error.message);
      return [];
    }

    if (data && Array.isArray(data)) {
      return data.map(mapSupabaseToStudent);
    }
    return [];
  } catch (err) {
    console.warn('Failed to query approved students from Supabase:', err);
    return [];
  }
}

// Fetch all registrations from Supabase (for Admin Panel and full state)
export async function fetchStudentsFromSupabase(): Promise<StudentRegistration[] | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('registered_students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error (table may not be created yet):', error.message);
      return null;
    }

    if (data && Array.isArray(data)) {
      return data.map(mapSupabaseToStudent);
    }
    return null;
  } catch (err) {
    console.warn('Failed to query Supabase registered_students:', err);
    return null;
  }
}

// Insert student registration into Supabase with guaranteed sequence numbering
export async function insertStudentToSupabase(student: StudentRegistration): Promise<{ success: boolean; data?: StudentRegistration; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const payload = mapStudentToSupabase(student);
    
    // Attempt 1: Let the database trigger assign registration_number from rd27_registration_seq
    payload.registration_number = null as any;

    let { data, error } = await supabase
      .from('registered_students')
      .insert([payload])
      .select()
      .single();

    // If trigger not present or NOT NULL constraint enforced before trigger, assign from DB sequence helper
    if (error && (error.message?.includes('null value') || error.message?.includes('registration_number'))) {
      const nextReg = await getNextRegistrationNumberFromDb();
      payload.registration_number = nextReg;
      const retryResult = await supabase
        .from('registered_students')
        .insert([payload])
        .select()
        .single();
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      console.error('Supabase insert error:', error);
      let userFriendlyMsg = error.message;
      if (error.code === '23505' || error.message?.toLowerCase().includes('unique') || error.message?.toLowerCase().includes('duplicate')) {
        if (error.message?.includes('transaction_id') || (error as any).details?.includes('transaction_id')) {
          userFriendlyMsg = 'This Transaction ID has already been registered. Please verify your payment details.';
        } else if (error.message?.includes('roll') || (error as any).details?.includes('roll')) {
          userFriendlyMsg = 'This Roll number is already registered.';
        } else if (error.message?.includes('registration_number') || (error as any).details?.includes('registration_number')) {
          userFriendlyMsg = 'Registration number collision detected. Please try again.';
        } else {
          userFriendlyMsg = 'A student registration with these unique details already exists.';
        }
      }
      return { success: false, error: userFriendlyMsg };
    }

    const mappedStudent = mapSupabaseToStudent(data);
    return { success: true, data: mappedStudent };
  } catch (err: any) {
    console.error('Supabase insert exception:', err);
    return { success: false, error: err.message || 'Network error' };
  }
}

// Helper to test if string is a valid UUID format (8-4-4-4-12 hex representation)
export function isValidUuid(id?: string | null): boolean {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.trim());
}

const ADMIN_EMAIL = 'admin.rdnic27@gmail.com';
const ADMIN_PASS = 'AdminPassword2027!';

// Ensure the client has an authenticated admin session for Supabase RPC & RLS mutations
export async function ensureAdminAuth(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session?.user) {
      return true;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASS
    });
    if (error) {
      if (
        error.message.toLowerCase().includes('invalid login credentials') ||
        error.message.toLowerCase().includes('user not found')
      ) {
        await supabase.auth.signUp({
          email: ADMIN_EMAIL,
          password: ADMIN_PASS
        });
        const retry = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASS
        });
        return !retry.error;
      }
      console.warn('Admin sign-in notice:', error.message);
      return false;
    }
    return Boolean(data?.session);
  } catch (err) {
    console.error('ensureAdminAuth exception:', err);
    return false;
  }
}

// Admin Workflow: Approve Student
// When Admin clicks ✔:
// Use database UUID: registered_students.id
// Run:
// UPDATE registered_students
// SET registration_status = 'approved', payment_status = 'verified', invitation_card_enabled = true
// WHERE id = actual UUID
export async function approveStudentInSupabase(
  studentUuidOrId: string,
  recordId?: string,
  studentObj?: Partial<StudentRegistration>
): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not configured' };
  }

  const rawId = isValidUuid(studentUuidOrId)
    ? studentUuidOrId
    : isValidUuid(recordId)
    ? recordId
    : isValidUuid(studentObj?.id)
    ? studentObj?.id
    : '';

  let cleanId = (rawId || '').trim();

  // If cleanId is not a UUID, attempt to look it up in Supabase using registration number, roll, or tx ID
  if (!cleanId || !isValidUuid(cleanId)) {
    try {
      if (studentObj?.registrationNo || studentObj?.roll || studentObj?.transactionId) {
        let query = supabase.from('registered_students').select('id');
        if (studentObj.registrationNo) query = query.eq('registration_number', studentObj.registrationNo);
        else if (studentObj.roll) query = query.eq('roll', studentObj.roll);
        else if (studentObj.transactionId) query = query.eq('transaction_id', studentObj.transactionId);
        const { data: matched } = await query.limit(1);
        if (matched && matched.length > 0 && matched[0].id) {
          cleanId = matched[0].id;
        }
      }
    } catch {
      // ignore lookup error
    }
  }

  if (!cleanId || !isValidUuid(cleanId)) {
    return {
      success: false,
      error: 'Student database UUID is required for approval. Local mock records cannot be updated in Supabase.'
    };
  }

  try {
    // 1. Ensure authenticated admin session for Supabase RPC & RLS execution
    await ensureAdminAuth();

    // Strategy 1: Call SECURITY DEFINER RPC function 'approve_student'
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('approve_student', {
        student_record_id: cleanId
      });
      if (!rpcError && rpcData) {
        return { success: true, data: Array.isArray(rpcData) ? rpcData[0] : rpcData };
      }
      if (rpcError) {
        console.warn('RPC approve_student warning:', rpcError.message);
      }
    } catch (e) {
      console.warn('RPC approve exception:', e);
    }

    // Strategy 2: Direct UPDATE via Supabase client
    const { data, error } = await supabase
      .from('registered_students')
      .update({
        registration_status: 'approved',
        payment_status: 'verified',
        invitation_card_enabled: true
      })
      .eq('id', cleanId)
      .select();

    if (error) {
      console.error('Supabase approve error:', error.message);
      const isPermError = error.message.includes('permission denied') || error.code === '42501';
      return { 
        success: false, 
        error: isPermError
          ? 'Database permission denied (42501): Run the SQL in supabase/schema.sql in your Supabase SQL Editor to grant UPDATE privileges to the anon role.'
          : error.message 
      };
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'Student record could not be updated in Supabase. Check database RLS policies or privileges.'
      };
    }

    return { success: true, data: data[0] };
  } catch (err: any) {
    console.error('Supabase approve exception:', err);
    return { success: false, error: err?.message || 'Database update failed' };
  }
}

// Admin Workflow: Reject Student
// When Admin clicks ✘:
// Use database UUID.
// Update:
// registration_status = 'rejected'
// payment_status = 'rejected'
// invitation_card_enabled = false
export async function rejectStudentInSupabase(
  studentUuidOrId: string,
  recordId?: string,
  studentObj?: Partial<StudentRegistration>
): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not configured' };
  }

  const rawId = isValidUuid(studentUuidOrId)
    ? studentUuidOrId
    : isValidUuid(recordId)
    ? recordId
    : isValidUuid(studentObj?.id)
    ? studentObj?.id
    : '';

  let cleanId = (rawId || '').trim();

  // If cleanId is not a UUID, attempt to look it up in Supabase using registration number, roll, or tx ID
  if (!cleanId || !isValidUuid(cleanId)) {
    try {
      if (studentObj?.registrationNo || studentObj?.roll || studentObj?.transactionId) {
        let query = supabase.from('registered_students').select('id');
        if (studentObj.registrationNo) query = query.eq('registration_number', studentObj.registrationNo);
        else if (studentObj.roll) query = query.eq('roll', studentObj.roll);
        else if (studentObj.transactionId) query = query.eq('transaction_id', studentObj.transactionId);
        const { data: matched } = await query.limit(1);
        if (matched && matched.length > 0 && matched[0].id) {
          cleanId = matched[0].id;
        }
      }
    } catch {
      // ignore lookup error
    }
  }

  if (!cleanId || !isValidUuid(cleanId)) {
    return {
      success: false,
      error: 'Student database UUID is required for rejection. Local mock records cannot be updated in Supabase.'
    };
  }

  try {
    // 1. Ensure authenticated admin session for Supabase RPC & RLS execution
    await ensureAdminAuth();

    // Strategy 1: Call SECURITY DEFINER RPC function 'reject_student'
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('reject_student', {
        student_record_id: cleanId
      });
      if (!rpcError && rpcData) {
        return { success: true, data: Array.isArray(rpcData) ? rpcData[0] : rpcData };
      }
      if (rpcError) {
        console.warn('RPC reject_student warning:', rpcError.message);
      }
    } catch (e) {
      console.warn('RPC reject exception:', e);
    }

    // Strategy 2: Direct UPDATE via Supabase client
    const { data, error } = await supabase
      .from('registered_students')
      .update({
        registration_status: 'rejected',
        payment_status: 'rejected',
        invitation_card_enabled: false
      })
      .eq('id', cleanId)
      .select();

    if (error) {
      console.error('Supabase reject error:', error.message);
      const isPermError = error.message.includes('permission denied') || error.code === '42501';
      return { 
        success: false, 
        error: isPermError
          ? 'Database permission denied (42501): Run the SQL in supabase/schema.sql in your Supabase SQL Editor to grant UPDATE privileges to the anon role.'
          : error.message 
      };
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'Student record could not be updated in Supabase. Check database RLS policies or privileges.'
      };
    }

    return { success: true, data: data[0] };
  } catch (err: any) {
    console.error('Supabase reject exception:', err);
    return { success: false, error: err?.message || 'Database update failed' };
  }
}

// Admin Workflow: Delete Student from Supabase
// When admin deletes:
// Use actual UUID.
// Delete from Supabase.
// After success: refetch from Supabase.
export async function deleteStudentFromSupabase(
  studentUuidOrId: string,
  recordId?: string,
  studentObj?: Partial<StudentRegistration>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not configured' };
  }

  const rawId = isValidUuid(studentUuidOrId)
    ? studentUuidOrId
    : isValidUuid(recordId)
    ? recordId
    : isValidUuid(studentObj?.id)
    ? studentObj?.id
    : '';

  let cleanId = (rawId || '').trim();

  // If cleanId is not a UUID, attempt to look it up in Supabase
  if (!cleanId || !isValidUuid(cleanId)) {
    try {
      if (studentObj?.registrationNo || studentObj?.roll || studentObj?.transactionId) {
        let query = supabase.from('registered_students').select('id');
        if (studentObj.registrationNo) query = query.eq('registration_number', studentObj.registrationNo);
        else if (studentObj.roll) query = query.eq('roll', studentObj.roll);
        else if (studentObj.transactionId) query = query.eq('transaction_id', studentObj.transactionId);
        const { data: matched } = await query.limit(1);
        if (matched && matched.length > 0 && matched[0].id) {
          cleanId = matched[0].id;
        }
      }
    } catch {
      // ignore lookup error
    }
  }

  if (!cleanId || !isValidUuid(cleanId)) {
    return {
      success: false,
      error: 'Student database UUID is required for deletion. Local mock records cannot be deleted in Supabase.'
    };
  }

  try {
    // 1. Ensure authenticated admin session for Supabase RPC & RLS execution
    await ensureAdminAuth();

    // Strategy 1: Check if delete_student RPC exists
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('delete_student', {
        student_record_id: cleanId
      });
      if (!rpcError && rpcData) {
        return { success: true };
      }
    } catch {
      // Fall through to direct table DELETE
    }

    // Strategy 2: Direct table DELETE
    const { data, error } = await supabase
      .from('registered_students')
      .delete()
      .eq('id', cleanId)
      .select();

    if (error) {
      console.error('Supabase delete error:', error.message);
      const isPermError = error.message.includes('permission denied') || error.code === '42501';
      return { 
        success: false, 
        error: isPermError
          ? 'Database permission denied (42501): Run the SQL in supabase/schema.sql in your Supabase SQL Editor to grant DELETE privileges to the anon role.'
          : error.message 
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Supabase delete exception:', err);
    return { success: false, error: err?.message || 'Delete operation failed' };
  }
}

// Re-export PDF Export functionality
export { generateStudentReportPdf } from './pdfExportService';
export type { PdfExportType } from './pdfExportService';
