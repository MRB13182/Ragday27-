import { StudentRegistration } from '../types';

export const INITIAL_STUDENTS: StudentRegistration[] = [
  {
    id: 'REG-1001',
    fullName: 'Arifur Rahman Tanvir',
    roll: '10214',
    section: 'ScB2',
    group: 'Science',
    className: 'HSC 2027',
    gender: 'Male',
    contactNumber: '01711223344',
    registrationNo: 'RD27-001',
    studentId: 'NIC-27-014',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    paymentMethod: 'Bkash',
    sendMoneyNumber: '01813182885',
    amount: 1050,
    transactionId: 'BKS98741253',
    senderNumber: '01711223344',
    jerseySize: 'L',
    jerseyName: 'TANVIR',
    jerseyNumber: '07',
    status: 'Verified',
    createdAt: '2024-02-01 11:24 AM'
  },
  {
    id: 'REG-1002',
    fullName: 'Nusrat Jahan Borshon',
    roll: '10105',
    section: 'ScG1',
    group: 'Science',
    className: 'HSC 2027',
    gender: 'Female',
    contactNumber: '01899887766',
    registrationNo: 'RD27-002',
    studentId: 'NIC-27-005',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    paymentMethod: 'Bkash',
    sendMoneyNumber: '01813182885',
    amount: 1050,
    transactionId: 'BKS45812904',
    senderNumber: '01899887766',
    jerseySize: 'M',
    jerseyName: 'BORSHON',
    jerseyNumber: '10',
    status: 'Approved',
    createdAt: '2024-02-02 02:40 PM'
  },
  {
    id: 'REG-1003',
    fullName: 'Siam Ahmed',
    roll: '10352',
    section: 'BsB1',
    group: 'Commerce',
    className: 'HSC 2027',
    gender: 'Male',
    contactNumber: '01911445566',
    registrationNo: 'RD27-003',
    studentId: 'NIC-27-152',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    paymentMethod: 'Nagad',
    sendMoneyNumber: '01813182885',
    amount: 1150,
    transactionId: 'NGD39485712',
    senderNumber: '01911445566',
    jerseySize: '4XL',
    jerseyName: 'SIAM',
    jerseyNumber: '99',
    status: 'Pending',
    createdAt: '2024-02-04 05:15 PM'
  },
  {
    id: 'REG-1004',
    fullName: 'Tahmid Hasan Mahir',
    roll: '10419',
    section: 'HuB1',
    group: 'Humanities',
    className: 'HSC 2027',
    gender: 'Male',
    contactNumber: '01622334455',
    registrationNo: 'RD27-004',
    studentId: 'NIC-27-219',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    paymentMethod: 'Bkash',
    sendMoneyNumber: '01813182885',
    amount: 1050,
    transactionId: 'BKS67123490',
    senderNumber: '01622334455',
    jerseySize: 'XL',
    jerseyName: 'MAHIR',
    jerseyNumber: '11',
    status: 'Approved',
    createdAt: '2024-02-05 09:30 AM'
  },
  {
    id: 'REG-1005',
    fullName: 'Sadia Afreen Ritu',
    roll: '10288',
    section: 'ScG2',
    group: 'Science',
    className: 'HSC 2027',
    gender: 'Female',
    contactNumber: '01533445566',
    registrationNo: 'RD27-005',
    studentId: 'NIC-27-088',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    paymentMethod: 'Bkash',
    sendMoneyNumber: '01813182885',
    amount: 1050,
    transactionId: 'BKS12498765',
    senderNumber: '01533445566',
    jerseySize: 'S',
    jerseyName: 'RITU',
    jerseyNumber: '03',
    status: 'Approved',
    createdAt: '2024-02-06 01:10 PM'
  }
];

class StudentStore {
  private registrations: StudentRegistration[];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.registrations = this.loadFromStorage();
  }

  private loadFromStorage(): StudentRegistration[] {
    try {
      const saved = localStorage.getItem('nic_rad_registrations_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_STUDENTS;
  }

  private saveToStorage() {
    try {
      localStorage.setItem('nic_rad_registrations_v3', JSON.stringify(this.registrations));
    } catch {
      // ignore
    }
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach(fn => fn());
  }

  public getRegistrations(): StudentRegistration[] {
    return [...this.registrations];
  }

  public setRegistrations(regs: StudentRegistration[]) {
    this.registrations = [...regs];
    this.notify();
  }

  public addRegistration(reg: Omit<StudentRegistration, 'id' | 'createdAt' | 'status'> & { id?: string; createdAt?: string; status?: StudentRegistration['status'] }) {
    const fullRecord: StudentRegistration = {
      ...reg,
      id: reg.id || `REG-${Date.now()}`,
      status: reg.status || 'Pending',
      createdAt: reg.createdAt || new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    };
    this.registrations.unshift(fullRecord);
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
