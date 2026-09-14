import { StudentRegistration } from '../types';

/**
 * Formats a sequence number into RD27-001, RD27-028, etc.
 * Padded with at least 3 digits.
 */
export function formatRegistrationNumber(sequenceNumber: number): string {
  const safeNumber = Math.max(1, Math.floor(sequenceNumber));
  return `RD27-${String(safeNumber).padStart(3, '0')}`;
}

/**
 * Extracts sequence number from formatted string 'RD27-028' -> 28
 * Filters out invalid/test numbers > 1000 to prevent jumping to 10000+.
 */
export function parseRegistrationNumber(regNo: string): number | null {
  if (!regNo || typeof regNo !== 'string') return null;
  const match = regNo.trim().match(/^RD27-(\d+)$/i);
  if (!match) return null;
  const parsed = parseInt(match[1], 10);
  // Filter out corrupted test numbers > 1000
  if (isNaN(parsed) || parsed > 1000) return null;
  return parsed;
}

/**
 * Finds the highest valid sequential registration number in the database list.
 * Ignores any corrupted numbers > 1000.
 */
export function getCurrentMaxSequence(existingList: StudentRegistration[] = []): number {
  let listMax = 0;
  for (const reg of existingList) {
    const parsed = parseRegistrationNumber(reg.registrationNo);
    if (parsed && parsed > listMax) {
      listMax = parsed;
    }
  }
  return listMax;
}

/**
 * Peeks what the next registration number will likely be for live read-only display in the form.
 * Note: The authoritative assignment happens sequentially inside the Supabase database.
 */
export function peekNextRegistrationNumber(existingList: StudentRegistration[] = []): string {
  const currentMax = getCurrentMaxSequence(existingList);
  return formatRegistrationNumber(currentMax + 1);
}

/**
 * Allocates next registration number based on list.
 * Note: Database trigger 'trigger_generate_registration_number' with 'rd27_reg_seq'
 * is the authoritative source of truth upon insert.
 */
export function allocateNextRegistrationNumber(existingList: StudentRegistration[] = []): string {
  const currentMax = getCurrentMaxSequence(existingList);
  return formatRegistrationNumber(currentMax + 1);
}

