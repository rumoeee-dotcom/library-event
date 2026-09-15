import React, { useState, useEffect } from 'react';
import { 
  getStoredEvents, saveStoredEvents, 
  getStoredReservations, saveStoredReservations, 
  getStoredBookmarks, saveStoredBookmarks, 
  getStoredReminders, saveStoredReminders 
} from './utils/storage';
import { 
  LibraryEvent, Reservation, TabType, 
  LibraryBranchId, EventCategory, TargetAudience, EventStatus 
} from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeExploreView } from './components/HomeExploreView';
import { CalendarView } from './components/CalendarView';
import { MyReservationsView } from './components/MyReservationsView';
import { LibraryDirectory } from './components/LibraryDirectory';
import { BookmarksView } from './components/BookmarksView';
import { EventDetailModal } from './components/EventDetailModal';
import { ReservationModal } from './components/ReservationModal';
import { TicketModal } from './components/TicketModal';
import { Toast, ToastMessage } from './components/Toast';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  // Core state
  const [events, setEvents] = useState<LibraryEvent[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [reminders, setReminders] = useState<string[]>([]);

  // Navigation & Filtering
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [selectedLibrary, setSelectedLibrary] = useState<LibraryBranchId | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('all');
  const [selectedTarget, setSelectedTarget] = useState<TargetAudience>('all');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [activeDetailEvent, setActiveDetailEvent] = useState<LibraryEvent | null>(null);
  const [activeReservationEvent, setActiveReservationEvent] = useState<LibraryEvent | null>(null);
  const [activeTicket, setActiveTicket] = useState<Reservation | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Device view mode toggle for desktop preview
  const [isMobileFrameMode, setIsMobileFrameMode] = useState(false);

  // Initialize data from local storage
  useEffect(() => {
    setEvents(getStoredEvents());
    setReservations(getStoredReservations());
    setBookmarks(getStoredBookmarks());
    setReminders(getStoredReminders());
  }, []);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Bookmark toggle
  const handleToggleBookmark = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (bookmarks.includes(eventId)) {
      updated = bookmarks.filter((id) => id !== eventId);
      showToast('info', '관심 행사에서 제거되었습니다.');
    } else {
      updated = [...bookmarks, eventId];
      showToast('success', '관심 행사에 저장되었습니다. 관심행사 탭에서 확인하세요.');
    }
    setBookmarks(updated);
    saveStoredBookmarks(updated);
  };

  // Reminder toggle
  const handleToggleReminder = (eventId: string) => {
    let updated: string[];
    if (reminders.includes(eventId)) {
      updated = reminders.filter((id) => id !== eventId);
      showToast('info', '접수 알림이 취소되었습니다.');
    } else {
      updated = [...reminders, eventId];
      showToast('success', '접수 시작 10분 전 카카오 알림톡 및 푸시 알림이 예약되었습니다.');
    }
    setReminders(updated);
    saveStoredReminders(updated);
  };

  // Make Reservation
  const handleReservationSuccess = (newReservation: Reservation) => {
    const updatedReservations = [newReservation, ...reservations];
    setReservations(updatedReservations);
    saveStoredReservations(updatedReservations);

    // Update seat counts in events
    const updatedEvents = events.map((ev) => {
      if (ev.id === newReservation.eventId) {
        if (newReservation.status === 'confirmed') {
          const totalPeople = 1 + newReservation.companionCount;
          const newRegistered = ev.currentRegistered + totalPeople;
          const newStatus: EventStatus = newRegistered >= ev.capacity ? 'waitlist' : 'open';
          return {
            ...ev,
            currentRegistered: newRegistered,
            status: newStatus,
          };
        } else {
          return {
            ...ev,
            currentWaitlist: ev.currentWaitlist + 1,
          };
        }
      }
      return ev;
    });

    setEvents(updatedEvents);
    saveStoredEvents(updatedEvents);

    setActiveReservationEvent(null);
    setActiveDetailEvent(null);

    // Open ticket modal immediately
    setActiveTicket(newReservation);
    showToast(
      'success',
      newReservation.status === 'confirmed'
        ? `[${newReservation.id}] 행사 예약이 성공적으로 접수되었습니다!`
        : `[${newReservation.id}] 대기자 접수가 완료되었습니다.`
    );
  };

  // Cancel Reservation
  const handleCancelReservation = (reservationId: string) => {
    const targetReservation = reservations.find((r) => r.id === reservationId);
    if (!targetReservation) return;

    const updatedReservations = reservations.map((r) =>
      r.id === reservationId ? { ...r, status: 'cancelled' as const } : r
    );
    setReservations(updatedReservations);
    saveStoredReservations(updatedReservations);

    // If cancelled, restore seats in events
    if (targetReservation.status === 'confirmed') {
      const updatedEvents = events.map((ev) => {
        if (ev.id === targetReservation.eventId) {
          const totalPeople = 1 + targetReservation.companionCount;
          const newRegistered = Math.max(0, ev.currentRegistered - totalPeople);
          return {
            ...ev,
            currentRegistered: newRegistered,
            status: 'open' as EventStatus,
          };
        }
        return ev;
      });
      setEvents(updatedEvents);
      saveStoredEvents(updatedEvents);
    }

    if (activeTicket?.id === reservationId) {
      setActiveTicket({ ...targetReservation, status: 'cancelled' });
    }

    showToast('info', '예약이 취소되었습니다.');
  };

  const handleClearFilters = () => {
    setSelectedLibrary('all');
    setSelectedCategory('all');
    setSelectedTarget('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  const bookmarkedEvents = events.filter((e) => bookmarks.includes(e.id));
  const activeReservationCount = reservations.filter((r) => r.status === 'confirmed' || r.status === 'waitlist').length;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center">
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Desktop Responsive / Device Switcher Bar (Hidden on mobile screens) */}
      <div className="w-full max-w-4xl px-4 py-2 hidden sm:flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-900">서산시 도서관 행사 통합 모바일 포털</span>
          <span className="text-stone-300">|</span>
          <span>충청남도 서산시립도서관 통합문화행사</span>
        </div>
        <div className="flex items-center gap-1.5 bg-stone-200/80 p-1 rounded-xl">
          <button
            onClick={() => setIsMobileFrameMode(false)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
              !isMobileFrameMode ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>반응형 뷰</span>
          </button>
          <button
            onClick={() => setIsMobileFrameMode(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
              isMobileFrameMode ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>스마트폰 프레임</span>
          </button>
        </div>
      </div>

      {/* Main App Container */}
      <div
        className={`w-full bg-stone-50 min-h-screen relative flex flex-col transition-all ${
          isMobileFrameMode
            ? 'sm:max-w-sm sm:my-4 sm:rounded-3xl sm:border-[8px] sm:border-stone-800 sm:shadow-2xl sm:min-h-[844px] overflow-hidden'
            : 'max-w-md shadow-sm'
        }`}
      >
        {/* Mobile Status Bar Simulated in Frame Mode */}
        {isMobileFrameMode && (
          <div className="hidden sm:flex items-center justify-between px-6 py-2 bg-stone-900 text-white text-[11px] font-semibold select-none">
            <span>09:41</span>
            <div className="w-16 h-3 bg-stone-800 rounded-full"></div>
            <div className="flex items-center gap-1">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Global Sticky Header */}
        <Header
          selectedLibrary={selectedLibrary}
          onSelectLibrary={setSelectedLibrary}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          reservationCount={activeReservationCount}
          bookmarkCount={bookmarks.length}
          onNavigateTab={setCurrentTab}
          currentTab={currentTab}
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 overflow-y-auto">
          {currentTab === 'home' && (
            <HomeExploreView
              events={events}
              selectedLibrary={selectedLibrary}
              onSelectLibrary={setSelectedLibrary}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedTarget={selectedTarget}
              onSelectTarget={setSelectedTarget}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              searchQuery={searchQuery}
              onClearFilters={handleClearFilters}
              onSelectEvent={setActiveDetailEvent}
              bookmarkedIds={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onQuickReserve={(ev, e) => {
                e.stopPropagation();
                setActiveReservationEvent(ev);
              }}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarView
              events={events}
              onSelectEvent={setActiveDetailEvent}
              onQuickReserve={(ev, e) => {
                e.stopPropagation();
                setActiveReservationEvent(ev);
              }}
            />
          )}

          {currentTab === 'my-reservations' && (
            <MyReservationsView
              reservations={reservations}
              onOpenTicket={setActiveTicket}
              onCancelReservation={handleCancelReservation}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'libraries' && (
            <LibraryDirectory
              onSelectLibraryEvents={(libId) => {
                setSelectedLibrary(libId);
                setCurrentTab('home');
              }}
            />
          )}

          {currentTab === 'bookmarks' && (
            <BookmarksView
              bookmarkedEvents={bookmarkedEvents}
              onSelectEvent={setActiveDetailEvent}
              onToggleBookmark={handleToggleBookmark}
              onQuickReserve={(ev, e) => {
                e.stopPropagation();
                setActiveReservationEvent(ev);
              }}
              onNavigateTab={setCurrentTab}
            />
          )}
        </main>

        {/* Bottom Mobile Tab Navigation */}
        <Navigation
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          reservationCount={activeReservationCount}
          bookmarkCount={bookmarks.length}
        />
      </div>

      {/* Modals */}
      <EventDetailModal
        event={activeDetailEvent}
        onClose={() => setActiveDetailEvent(null)}
        onOpenReservation={(ev) => {
          setActiveDetailEvent(null);
          setActiveReservationEvent(ev);
        }}
        isBookmarked={activeDetailEvent ? bookmarks.includes(activeDetailEvent.id) : false}
        onToggleBookmark={handleToggleBookmark}
        isReminderSet={activeDetailEvent ? reminders.includes(activeDetailEvent.id) : false}
        onToggleReminder={handleToggleReminder}
      />

      <ReservationModal
        event={activeReservationEvent}
        onClose={() => setActiveReservationEvent(null)}
        onSuccess={handleReservationSuccess}
      />

      <TicketModal
        reservation={activeTicket}
        onClose={() => setActiveTicket(null)}
        onCancelReservation={handleCancelReservation}
      />
    </div>
  );
}
