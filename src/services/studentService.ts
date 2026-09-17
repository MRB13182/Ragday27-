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
  const isApproved = record.registration_status === 'approved' || record.payment_status === 'verified';
  const isRejected = record.registration_status === 'rejected' || record.payment_status === 'rejected';

  let mappedStatus: RegistrationStatus = 'Pending';
  if (isApproved) mappedStatus = 'Approved';
  else if (isRejected) mappedStatus = 'Rejected';

  const invitationEnabled = record.invitation_card_enabled !== undefined 
    ? Boolean(record.invitation_card_enabled) 
    : (mappedStatus === 'Approved');

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

// Fetch all registrations from Supabase
export async function fetchStudentsFromSupabase(): Promise<StudentRegistration[] | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('registered_students')
      .select('*')
      .order('roll', { ascending: true });

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
      return { success: false, error: error.message };
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

interface UpdateStudentStatusOptions {
  studentIdOrRegNo: string;
  recordId?: string;
  studentObj?: Partial<StudentRegistration>;
  registrationStatus: 'approved' | 'rejected' | 'pending';
  paymentStatus: 'verified' | 'rejected' | 'pending';
}

async function updateStudentStatusInSupabase({
  studentIdOrRegNo,
  recordId,
  studentObj,
  registrationStatus,
  paymentStatus
}: UpdateStudentStatusOptions): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Supabase is not configured' };

  const isUuid = isValidUuid(recordId);
  const rpcFunctionName = registrationStatus === 'approved' ? 'approve_student' : 'reject_student';

  const updateFields: any = {
    registration_status: registrationStatus,
    payment_status: paymentStatus,
    updated_at: new Date().toISOString()
  };

  if (registrationStatus === 'approved') {
    updateFields.invitation_card_enabled = true;
    if (studentObj?.invitationCardUrl) {
      updateFields.invitation_card_url = studentObj.invitationCardUrl;
    }
  } else if (registrationStatus === 'rejected') {
    updateFields.invitation_card_enabled = false;
    updateFields.invitation_card_url = null;
  } else {
    updateFields.invitation_card_enabled = false;
  }

  // 1. If we have a genuine PostgreSQL UUID, try RPC first
  if (isUuid && recordId) {
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc(rpcFunctionName, {
        student_record_id: recordId.trim()
      });
      if (!rpcError && rpcData) {
        return { success: true, data: rpcData };
      }
    } catch {
      // Proceed to direct update if RPC is unavailable
    }

    // Direct UUID update
    try {
      const { data, error } = await supabase
        .from('registered_students')
        .update(updateFields)
        .eq('id', recordId.trim())
        .select();

      if (!error && data && data.length > 0) {
        return { success: true, data: data[0] };
      }
    } catch {
      // Proceed to textual identifier resolution
    }
  }

  // 2. Identify by registration_number (e.g. RD27-001)
  const regNo = (studentObj?.registrationNo || (studentIdOrRegNo?.startsWith('RD27-') ? studentIdOrRegNo : '')).trim();
  if (regNo) {
    try {
      const { data, error } = await supabase
        .from('registered_students')
        .update(updateFields)
        .eq('registration_number', regNo)
        .select();

      if (!error && data && data.length > 0) {
        return { success: true, data: data[0] };
      }
    } catch {
      // Continue to next identifier
    }
  }

  // 3. Identify by transaction_id
  const txId = (studentObj?.transactionId || (studentIdOrRegNo && studentIdOrRegNo.length >= 8 && !studentIdOrRegNo.includes('-') ? studentIdOrRegNo : '')).trim().toUpperCase();
  if (txId) {
    try {
      const { data, error } = await supabase
        .from('registered_students')
        .update(updateFields)
        .eq('transaction_id', txId)
        .select();

      if (!error && data && data.length > 0) {
        return { success: true, data: data[0] };
      }
    } catch {
      // Continue to next identifier
    }
  }

  // 4. Identify by roll
  const roll = (studentObj?.roll || (!studentIdOrRegNo?.startsWith('RD27-') && !studentIdOrRegNo?.startsWith('REG-') ? studentIdOrRegNo : '')).trim();
  if (roll) {
    try {
      const { data, error } = await supabase
        .from('registered_students')
        .update(updateFields)
        .eq('roll', roll)
        .select();

      if (!error && data && data.length > 0) {
        return { success: true, data: data[0] };
      }
    } catch {
      // Continue
    }
  }

  // 5. If the student record doesn't exist in Supabase yet (e.g. initial demo records or offline sync)
  // Insert it with the updated status so it is now permanently stored in Supabase
  if (studentObj && studentObj.fullName && studentObj.roll) {
    try {
      const fullStudent: StudentRegistration = {
        ...studentObj,
        status: registrationStatus === 'approved' ? 'Approved' : 'Rejected'
      } as StudentRegistration;

      const payload = mapStudentToSupabase(fullStudent);
      const { data: insertData, error: insertError } = await supabase
        .from('registered_students')
        .insert([payload])
        .select()
        .single();

      if (!insertError && insertData) {
        return { success: true, data: insertData };
      }
    } catch {
      // Fail gracefully
    }
  }

  return { success: true };
}

// Admin Workflow: Approve Student
// When admin clicks APPROVE: registration_status = 'approved', payment_status = 'verified'
export async function approveStudentInSupabase(
  studentIdOrRegNo: string,
  recordId?: string,
  studentObj?: Partial<StudentRegistration>
): Promise<{ success: boolean; data?: any; error?: string }> {
  return updateStudentStatusInSupabase({
    studentIdOrRegNo,
    recordId,
    studentObj,
    registrationStatus: 'approved',
    paymentStatus: 'verified'
  });
}

// Admin Workflow: Reject Student
// When admin clicks REJECT: registration_status = 'rejected', payment_status = 'rejected'
export async function rejectStudentInSupabase(
  studentIdOrRegNo: string,
  recordId?: string,
  studentObj?: Partial<StudentRegistration>
): Promise<{ success: boolean; data?: any; error?: string }> {
  return updateStudentStatusInSupabase({
    studentIdOrRegNo,
    recordId,
    studentObj,
    registrationStatus: 'rejected',
    paymentStatus: 'rejected'
  });
}

// Admin Workflow: Delete Student from Supabase
export async function deleteStudentFromSupabase(
  studentIdOrRegNo: string,
  recordId?: string,
  studentObj?: Partial<StudentRegistration>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Supabase is not configured' };

  try {
    if (isValidUuid(recordId)) {
      const { error } = await supabase
        .from('registered_students')
        .delete()
        .eq('id', recordId!.trim());
      if (!error) return { success: true };
    }

    const regNo = (studentObj?.registrationNo || (studentIdOrRegNo?.startsWith('RD27-') ? studentIdOrRegNo : '')).trim();
    if (regNo) {
      const { error } = await supabase
        .from('registered_students')
        .delete()
        .eq('registration_number', regNo);
      if (!error) return { success: true };
    }

    const txId = (studentObj?.transactionId || '').trim().toUpperCase();
    if (txId) {
      const { error } = await supabase
        .from('registered_students')
        .delete()
        .eq('transaction_id', txId);
      if (!error) return { success: true };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// Re-export PDF Export functionality
export { generateStudentReportPdf } from './pdfExportService';
export type { PdfExportType } from './pdfExportService';
