export type StudentGroup = 'Science' | 'Commerce' | 'Humanities';
export type Gender = 'Male' | 'Female';
export type PaymentMethod = 'Bkash' | 'Nagad' | 'Rocket';
export type JerseySize = 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | '4XL';
export type RegistrationStatus = 'Approved' | 'Verified' | 'Pending' | 'Rejected';

export interface StudentRegistration {
  id: string;
  fullName: string;
  roll: string;
  section: string;
  group: StudentGroup;
  className: string;
  gender: Gender;
  contactNumber: string;
  registrationNo: string;
  studentId: string;
  photoUrl: string;
  
  // Payment
  paymentMethod: PaymentMethod;
  sendMoneyNumber: string;
  amount: number;
  transactionId: string;
  senderNumber: string;

  // Jersey
  jerseySize: JerseySize;
  jerseyName: string;
  jerseyNumber: string;

  // Admin & System
  status: RegistrationStatus;
  createdAt: string;
}

export interface EventSettings {
  collegeName: string;
  batchName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  targetCountdownDate: string;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  baseFee: number;
  extraCharge4XL: number;
  bannerTagline: string;
  quoteSpark: string;
  quoteMark: string;
  destinationsQuote: string;
}

export interface AssetUrls {
  collegeLogo: string;
  radDayLogo: string;
  bannerArtwork: string;
  jerseyFront: string;
  jerseyBack: string;
  jerseyMockup: string;
  fontJersey: string;
  fontNumber: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Jersey' | 'Memories' | 'Campus' | 'Prep';
  imageUrl: string;
  caption: string;
  date: string;
}
