import { INITIAL_EVENTS } from '../data/events';
import { LibraryEvent, Reservation } from '../types';

const STORAGE_KEYS = {
  EVENTS: 'seosan_library_events_v1',
  RESERVATIONS: 'seosan_library_reservations_v1',
  BOOKMARKS: 'seosan_library_bookmarks_v1',
  REMINDERS: 'seosan_library_reminders_v1',
};

const DEFAULT_SAMPLE_RESERVATION: Reservation = {
  id: 'SS-2026-4829',
  eventId: 'evt-1',
  eventTitle: "2026 서산 가을 '길 위의 인문학' - 마애삼존불과 내포 문화유산 인문기행",
  libraryId: 'main',
  libraryName: '서산시립도서관 (본관)',
  locationRoom: '본관 2층 시청각실 및 마애삼존불 현장 탐방',
  eventDateTime: '2026.09.26 (토) 10:00 ~ 13:00',
  applicantName: '김서산',
  phoneNumber: '010-3849-5921',
  birthDate: '1988-04-12',
  companionCount: 1,
  specialRequest: '서산시민 무료 셔틀버스 탑승 희망합니다.',
  createdAt: '2026-09-14 15:30',
  status: 'confirmed',
  qrCodeData: 'SEOSAN-LIB-RESERVE-SS-2026-4829-EVT1-CONFIRMED',
  reminderOptIn: true,
};

export function getStoredEvents(): LibraryEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_EVENTS;
  }
}

export function saveStoredEvents(events: LibraryEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save events to storage', e);
  }
}

export function getStoredReservations(): Reservation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (!raw) {
      const initial = [DEFAULT_SAMPLE_RESERVATION];
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [DEFAULT_SAMPLE_RESERVATION];
  }
}

export function saveStoredReservations(reservations: Reservation[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  } catch (e) {
    console.error('Failed to save reservations to storage', e);
  }
}

export function getStoredBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (!raw) {
      const initial = ['evt-1', 'evt-3'];
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return ['evt-1', 'evt-3'];
  }
}

export function saveStoredBookmarks(bookmarks: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save bookmarks to storage', e);
  }
}

export function getStoredReminders(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (!raw) return ['evt-8'];
    return JSON.parse(raw);
  } catch {
    return ['evt-8'];
  }
}

export function saveStoredReminders(reminders: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (e) {
    console.error('Failed to save reminders to storage', e);
  }
}

export function generateTicketId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `SS-2026-${randomNum}`;
}
