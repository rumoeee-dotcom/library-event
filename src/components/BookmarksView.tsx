import React from 'react';
import { Bookmark, ArrowRight } from 'lucide-react';
import { LibraryEvent, TabType } from '../types';
import { EventCard } from './EventCard';

interface BookmarksViewProps {
  bookmarkedEvents: LibraryEvent[];
  onSelectEvent: (event: LibraryEvent) => void;
  onToggleBookmark: (eventId: string, e: React.MouseEvent) => void;
  onQuickReserve: (event: LibraryEvent, e: React.MouseEvent) => void;
  onNavigateTab: (tab: TabType) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarkedEvents,
  onSelectEvent,
  onToggleBookmark,
  onQuickReserve,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-800 tracking-wider block">
              내가 찜한 도서관 프로그램
            </span>
            <h2 className="text-base font-bold text-stone-900 mt-0.5">관심 행사 보관함</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Bookmark className="w-5 h-5 fill-current" />
          </div>
        </div>
        <p className="text-xs text-stone-500 mt-2">
          총 <strong>{bookmarkedEvents.length}개</strong>의 관심 행사가 저장되어 있습니다. 신청 기간을 놓치지 말고 예약해 보세요.
        </p>
      </div>

      {/* Bookmarked Events List */}
      {bookmarkedEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-800">보관된 관심 행사가 없습니다</h3>
            <p className="text-xs text-stone-500 mt-1">
              마음에 드는 행사 카드의 북마크(리본) 아이콘을 눌러 관심 목록에 담아보세요.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('home')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
          >
            <span>도서관 행사 둘러보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {bookmarkedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={onSelectEvent}
              isBookmarked={true}
              onToggleBookmark={onToggleBookmark}
              onQuickReserve={onQuickReserve}
            />
          ))}
        </div>
      )}
    </div>
  );
};
