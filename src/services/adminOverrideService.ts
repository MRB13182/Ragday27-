import { StudentRegistration, RegistrationStatus } from '../types';

export interface AdminOverride {
  status?: RegistrationStatus;
  dbStatus?: 'pending' | 'approved' | 'rejected';
  invitationCardEnabled?: boolean;
  deleted?: boolean;
  updatedAt: string;
}

const STORAGE_KEY = 'rad27_admin_status_overrides_v1';

export function getAdminOverrides(): Record<string, AdminOverride> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveAdminOverride(
  keys: (string | undefined | null)[],
  override: Partial<AdminOverride>
) {
  if (typeof window === 'undefined') return;
  try {
    const current = getAdminOverrides();
    const entry: AdminOverride = {
      ...override,
      updatedAt: new Date().toISOString()
    };

    keys.filter(Boolean).forEach(k => {
      const trimmed = k!.trim();
      current[trimmed] = entry;
      current[trimmed.toUpperCase()] = entry;
      current[trimmed.toLowerCase()] = entry;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to persist admin override:', err);
  }
}

export function clearAdminOverride(keys: (string | undefined | null)[]) {
  if (typeof window === 'undefined') return;
  try {
    const current = getAdminOverrides();
    keys.filter(Boolean).forEach(k => {
      const trimmed = k!.trim();
      delete current[trimmed];
      delete current[trimmed.toUpperCase()];
      delete current[trimmed.toLowerCase()];
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}

export function applyAdminOverrides(students: StudentRegistration[]): StudentRegistration[] {
  const overrides = getAdminOverrides();
  if (!overrides || Object.keys(overrides).length === 0) {
    return students;
  }

  const result: StudentRegistration[] = [];

  for (const student of students) {
    const override =
      (student.id && overrides[student.id]) ||
      (student.registrationNo && overrides[student.registrationNo]) ||
      (student.registrationNo && overrides[student.registrationNo.toUpperCase()]) ||
      (student.transactionId && overrides[student.transactionId.toUpperCase()]) ||
      (student.roll && overrides[student.roll]);

    if (override) {
      if (override.deleted) {
        // Exclude deleted student
        continue;
      }
      result.push({
        ...student,
        status: override.status || student.status,
        dbStatus: override.dbStatus || student.dbStatus,
        invitationCardEnabled:
          override.invitationCardEnabled !== undefined
            ? override.invitationCardEnabled
            : student.invitationCardEnabled
      });
    } else {
      result.push(student);
    }
  }

  return result;
}
