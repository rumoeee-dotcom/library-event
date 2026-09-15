export type LibraryBranchId = 
  | 'main' 
  | 'children' 
  | 'daesan' 
  | 'seongyeon' 
  | 'buseok' 
  | 'inji' 
  | 'haemi' 
  | 'unsan' 
  | 'gobuk';

export interface LibraryBranch {
  id: LibraryBranchId;
  name: string;
  type: 'main' | 'children' | 'sub' | 'small';
  address: string;
  tel: string;
  closedDays: string;
  openingHours: string;
  latitude: number;
  longitude: number;
  description: string;
  image: string;
  eventCount: number;
  features: string[];
}

export type EventCategory = 
  | 'all' 
  | 'humanities' 
  | 'kids' 
  | 'author' 
  | 'craft' 
  | 'club' 
  | 'movie' 
  | 'maker';

export type TargetAudience = 
  | 'all' 
  | 'infant' 
  | 'child' 
  | 'teen' 
  | 'adult' 
  | 'family' 
  | 'senior';

export type EventStatus = 'open' | 'upcoming' | 'closed' | 'waitlist';

export interface LibraryEvent {
  id: string;
  title: string;
  subtitle: string;
  libraryId: LibraryBranchId;
  libraryName: string;
  category: EventCategory;
  categoryLabel: string;
  target: TargetAudience;
  targetLabel: string;
  eventDate: string; // YYYY-MM-DD
  eventEndDate?: string;
  eventDateStr: string; // e.g. "2026.09.26 (토)"
  eventTimeStr: string; // e.g. "14:00 ~ 16:00"
  applyStartDate: string; // e.g. "2026.09.16 09:00"
  applyEndDate: string;   // e.g. "2026.09.24 18:00"
  locationRoom: string;   // e.g. "시립도서관 2층 다목적실"
  instructor: {
    name: string;
    title: string;
    organization?: string;
  };
  capacity: number;
  currentRegistered: number;
  waitlistCapacity: number;
  currentWaitlist: number;
  fee: string;
  description: string;
  curriculum: string[];
  preparationNotes: string[];
  notice: string[];
  bannerImg: string;
  tags: string[];
  status: EventStatus;
  isFeatured?: boolean;
  isHot?: boolean;
}

export interface Reservation {
  id: string; // Ticket code e.g. "SS-2026-8921"
  eventId: string;
  eventTitle: string;
  libraryId: LibraryBranchId;
  libraryName: string;
  locationRoom: string;
  eventDateTime: string;
  applicantName: string;
  phoneNumber: string;
  birthDate: string;
  companionCount: number;
  specialRequest?: string;
  createdAt: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  qrCodeData: string;
  reminderOptIn: boolean;
}

export type TabType = 'home' | 'calendar' | 'my-reservations' | 'libraries' | 'bookmarks';
