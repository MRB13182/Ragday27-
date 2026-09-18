import { StudentRegistration } from '../types';

// Clear legacy cached registrations so stale records never override live Supabase data
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('nic_rad_registrations_v3');
    localStorage.removeItem('nic_rad_registrations_v2');
    localStorage.removeItem('nic_rad_registrations');
    localStorage.removeItem('rad27_admin_status_overrides_v1');
  } catch {
    // ignore
  }
}

class StudentStore {
  private registrations: StudentRegistration[] = [];
  private listeners: Set<() => void> = new Set();
  private hasLoadedFromRemote = false;

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public getRegistrations(): StudentRegistration[] {
    return [...this.registrations];
  }

  public isLoaded(): boolean {
    return this.hasLoadedFromRemote;
  }

  public setRegistrations(regs: StudentRegistration[]) {
    this.registrations = [...regs];
    this.hasLoadedFromRemote = true;
    this.notify();
  }

  public addRegistration(reg: Omit<StudentRegistration, 'id' | 'createdAt' | 'status'> & { id?: string; createdAt?: string; status?: StudentRegistration['status'] }) {
    const fullRecord: StudentRegistration = {
      ...reg,
      id: reg.id || `REG-${Date.now()}`,
      status: reg.status || 'Pending',
      createdAt: reg.createdAt || new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    };
    // Avoid duplicate if already exists
    const exists = this.registrations.some(r => r.id === fullRecord.id || (fullRecord.registrationNo && r.registrationNo === fullRecord.registrationNo));
    if (!exists) {
      this.registrations.unshift(fullRecord);
    }
    this.notify();
    return fullRecord;
  }

  public updateRegistration(id: string, updated: Partial<StudentRegistration>) {
    this.registrations = this.registrations.map(r => {
      if (r.id === id || r.registrationNo === id) {
        return { ...r, ...updated };
      }
      return r;
    });
    this.notify();
  }

  public deleteRegistration(id: string) {
    this.registrations = this.registrations.filter(r => r.id !== id && r.registrationNo !== id);
    this.notify();
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const studentStore = new StudentStore();

