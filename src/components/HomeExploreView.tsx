import React from 'react';
import { 
  Sparkles, Filter, Calendar, Users, ChevronRight, 
  Volume2, Compass, CheckCircle2, RotateCcw 
} from 'lucide-react';
import { LibraryEvent, EventCategory, TargetAudience, EventStatus, LibraryBranchId } from '../types';
import { EventCard } from './EventCard';
import { SEOSAN_LIBRARIES } from '../data/libraries';

interface HomeExploreViewProps {
  events: LibraryEvent[];
  selectedLibrary: LibraryBranchId | 'all';
  onSelectLibrary: (libId: LibraryBranchId | 'all') => void;
  selectedCategory: EventCategory;
  onSelectCategory: (cat: EventCategory) => void;
  selectedTarget: TargetAudience;
  onSelectTarget: (target: TargetAudience) => void;
  statusFilter: EventStatus | 'all';
  onStatusFilterChange: (status: EventStatus | 'all') => void;
  searchQuery: string;
  onClearFilters: () => void;
  onSelectEvent: (event: LibraryEvent) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (eventId: string, e: React.MouseEvent) => void;
  onQuickReserve: (event: LibraryEvent, e: React.MouseEvent) => void;
}

export const HomeExploreView: React.FC<HomeExploreViewProps> = ({
  events,
  selectedLibrary,
  onSelectLibrary,
  selectedCategory,
  onSelectCategory,
  selectedTarget,
  onSelectTarget,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onClearFilters,
  onSelectEvent,
  bookmarkedIds,
  onToggleBookmark,
  onQuickReserve,
}) => {
  const categories: { id: EventCategory; label: string; icon: string }[] = [
    { id: 'all', label: '전체 행사', icon: '📚' },
    { id: 'humanities', label: '인문학 특강', icon: '🏛️' },
    { id: 'kids', label: '어린이·유아', icon: '🧸' },
    { id: 'author', label: '작가와의 만남', icon: '✍️' },
    { id: 'craft', label: '체험·원데이', icon: '🎨' },
    { id: 'club', label: '독서동아리', icon: '📖' },
    { id: 'movie', label: '영화·공연', icon: '🎬' },
    { id: 'maker', label: '디지털·메이커', icon: '💻' },
  ];

  const targetAudiences: { id: TargetAudience; label: string }[] = [
    { id: 'all', label: '전체 연령' },
    { id: 'adult', label: '성인' },
    { id: 'child', label: '어린이(초등)' },
    { id: 'infant', label: '영유아(보호자)' },
    { id: 'family', label: '온가족' },
    { id: 'senior', label: '어르신(실버)' },
    { id: 'teen', label: '청소년' },
  ];

  // Filter logic
  const filteredEvents = events.filter((e) => {
    if (selectedLibrary !== 'all' && e.libraryId !== selectedLibrary) return false;
    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    if (selectedTarget !== 'all' && e.target !== selectedTarget && e.target !== 'family') return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchLib = e.libraryName.toLowerCase().includes(q);
      const matchInst = e.instructor.name.toLowerCase().includes(q);
      const matchDesc = e.description.toLowerCase().includes(q);
      const matchTags = e.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchLib && !matchInst && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  const featuredEvents = events.filter((e) => e.isFeatured);

  const hasActiveFilters =
    selectedLibrary !== 'all' ||
    selectedCategory !== 'all' ||
    selectedTarget !== 'all' ||
    statusFilter !== 'all' ||
    Boolean(searchQuery);

  return (
    <div className="space-y-4 pb-20">
      {/* Live Notice Strip */}
      <div className="bg-emerald-900 text-emerald-100 px-3.5 py-2 rounded-2xl flex items-center justify-between text-xs shadow-xs">
        <div className="flex items-center gap-2 truncate">
          <span className="p-1 rounded-md bg-emerald-800 text-emerald-300 shrink-0">
            <Volume2 className="w-3.5 h-3.5" />
          </span>
          <span className="truncate font-medium">
            [서산시 도서관] 2026 독서의 달 맞이 야외 북크닉 및 인문학 특강 접수 진행 중
          </span>
        </div>
        <span className="text-[10px] text-emerald-300/80 font-bold shrink-0 ml-2">안내</span>
      </div>

      {/* Featured Banner Hero (Shown when not actively searching) */}
      {!searchQuery && selectedCategory === 'all' && selectedLibrary === 'all' && (
        <div>
          <div className="flex items-center justify-between px-1 mb-2">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              서산시 도서관 주목할 주요 행사
            </h2>
            <span className="text-[11px] text-stone-500">인기 추천</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4 snap-x snap-mandatory">
            {featuredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="w-[82vw] max-w-[340px] shrink-0 snap-start bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col"
              >
                <div className="relative h-36 w-full bg-stone-100">
                  <img
                    src={event.bannerImg}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                      {event.status === 'open' ? '접수중' : '접수예정'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 text-white backdrop-blur-xs">
                      {event.categoryLabel}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className="text-[11px] text-emerald-300 font-semibold block">{event.libraryName}</span>
                    <h3 className="text-xs font-bold truncate leading-snug">{event.title}</h3>
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between text-xs bg-stone-50/50">
                  <span className="text-stone-600 font-medium">{event.eventDateStr}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickReserve(event, e);
                    }}
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] shadow-2xs"
                  >
                    예약신청
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Library Branch Quick Pills Carousel */}
      <div>
        <div className="flex items-center justify-between px-1 mb-1.5">
          <span className="text-xs font-bold text-stone-700">도서관별 모아보기</span>
          {selectedLibrary !== 'all' && (
            <button
              onClick={() => onSelectLibrary('all')}
              className="text-[11px] text-emerald-800 font-semibold hover:underline"
            >
              전체 보기
            </button>
          )}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
          <button
            onClick={() => onSelectLibrary('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
              selectedLibrary === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            전체 도서관
          </button>
          {SEOSAN_LIBRARIES.map((lib) => {
            const isSelected = selectedLibrary === lib.id;
            return (
              <button
                key={lib.id}
                onClick={() => onSelectLibrary(lib.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {lib.name.replace(' (본관)', '')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Pills */}
      <div>
        <div className="flex items-center justify-between px-1 mb-1.5">
          <span className="text-xs font-bold text-stone-700">프로그램 분야</span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Audience & Status Row */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/80">
        {/* Target Audience Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-stone-500 shrink-0 font-medium">대상:</span>
          <select
            value={selectedTarget}
            onChange={(e) => onSelectTarget(e.target.value as TargetAudience)}
            className="text-xs bg-white border border-stone-200 rounded-lg px-2 py-1 text-stone-800 font-semibold outline-none"
          >
            {targetAudiences.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-stone-500 shrink-0 font-medium">상태:</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as EventStatus | 'all')}
            className="text-xs bg-white border border-stone-200 rounded-lg px-2 py-1 text-stone-800 font-semibold outline-none"
          >
            <option value="all">전체 상태</option>
            <option value="open">접수중만 보기</option>
            <option value="waitlist">대기접수 포함</option>
            <option value="upcoming">접수예정</option>
            <option value="closed">마감</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-stone-900">
            행사 목록 <span className="text-emerald-700 font-extrabold">{filteredEvents.length}</span>건
          </h3>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-200/70 hover:bg-stone-200 text-[11px] font-medium text-stone-700"
            >
              <RotateCcw className="w-3 h-3" />
              필터 초기화
            </button>
          )}
        </div>
        <span className="text-xs text-stone-500">실시간 접수 가능</span>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-200 p-8 text-center space-y-3">
          <Compass className="w-10 h-10 mx-auto text-stone-300" />
          <div>
            <h4 className="text-sm font-bold text-stone-800">조건에 맞는 행사가 없습니다</h4>
            <p className="text-xs text-stone-500 mt-1">
              선택한 도서관이나 카테고리 필터를 변경하거나 검색어를 지워보세요.
            </p>
          </div>
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs hover:bg-emerald-800 transition-colors"
          >
            모든 행사 보기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={onSelectEvent}
              isBookmarked={bookmarkedIds.includes(event.id)}
              onToggleBookmark={onToggleBookmark}
              onQuickReserve={onQuickReserve}
            />
          ))}
        </div>
      )}
    </div>
  );
};
