import { StudentRegistration } from '../types';

const STORAGE_KEY = 'nic_rad27_max_reg_seq';

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
 */
export function parseRegistrationNumber(regNo: string): number | null {
  if (!regNo || typeof regNo !== 'string') return null;
  const match = regNo.trim().match(/^RD27-(\d+)$/i);
  if (!match) return null;
  const parsed = parseInt(match[1], 10);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Gets the current highest assigned sequence number.
 * Persistent in localStorage so deleted records never decrease this number.
 */
export function getCurrentMaxSequence(existingList: StudentRegistration[] = []): number {
  let storedMax = 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      storedMax = parseInt(raw, 10) || 0;
    }
  } catch {
    storedMax = 0;
  }

  // Also check existing list to guarantee max is at least what exists
  let listMax = 0;
  for (const reg of existingList) {
    const parsed = parseRegistrationNumber(reg.registrationNo);
    if (parsed && parsed > listMax) {
      listMax = parsed;
    }
  }

  const effectiveMax = Math.max(storedMax, listMax);

  // Sync back to storage if list has a higher number
  if (effectiveMax > storedMax) {
    try {
      localStorage.setItem(STORAGE_KEY, String(effectiveMax));
    } catch {
      // ignore
    }
  }

  return effectiveMax;
}

/**
 * Peeks what the next registration number will be without incrementing the persistent sequence.
 * Used for live read-only display in the registration form.
 */
export function peekNextRegistrationNumber(existingList: StudentRegistration[] = []): string {
  const currentMax = getCurrentMaxSequence(existingList);
  return formatRegistrationNumber(currentMax + 1);
}

/**
 * Allocates and locks the next registration number.
 * Ensures numbers are monotonically strictly increasing, never repeat,
 * and deletion of prior records never causes reuse.
 */
export function allocateNextRegistrationNumber(existingList: StudentRegistration[] = []): string {
  const currentMax = getCurrentMaxSequence(existingList);
  const nextSeq = currentMax + 1;

  try {
    localStorage.setItem(STORAGE_KEY, String(nextSeq));
  } catch {
    // ignore
  }

  return formatRegistrationNumber(nextSeq);
}
