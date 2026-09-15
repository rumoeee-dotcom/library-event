import React from 'react';
import { BookOpen, MapPin, Search, Bookmark, Ticket, ChevronDown } from 'lucide-react';
import { SEOSAN_LIBRARIES } from '../data/libraries';
import { LibraryBranchId, TabType } from '../types';

interface HeaderProps {
  selectedLibrary: LibraryBranchId | 'all';
  onSelectLibrary: (libId: LibraryBranchId | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  reservationCount: number;
  bookmarkCount: number;
  onNavigateTab: (tab: TabType) => void;
  currentTab: TabType;
}

export const Header: React.FC<HeaderProps> = ({
  selectedLibrary,
  onSelectLibrary,
  searchQuery,
  onSearchChange,
  reservationCount,
  bookmarkCount,
  onNavigateTab,
  currentTab,
}) => {
  const currentLibName =
    selectedLibrary === 'all'
      ? '서산시 전체 도서관'
      : SEOSAN_LIBRARIES.find((lib) => lib.id === selectedLibrary)?.name.replace(' (본관)', '') || '도서관 선택';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Brand Bar */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div 
          onClick={() => onNavigateTab('home')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-emerald-800 tracking-wider uppercase">충청남도 서산시</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h1 className="text-base font-bold text-stone-900 leading-none">서산시 도서관 문화행사</h1>
          </div>
        </div>

        {/* Quick Badges: Reservation & Bookmark */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onNavigateTab('bookmarks')}
            className={`relative p-2 rounded-xl border transition-colors ${
              currentTab === 'bookmarks'
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
            title="관심 행사"
            aria-label="관심 행사 목록"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {bookmarkCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigateTab('my-reservations')}
            className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
              currentTab === 'my-reservations'
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="내 예약 확인"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>내 예약</span>
            {reservationCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                currentTab === 'my-reservations' ? 'bg-white text-emerald-800' : 'bg-emerald-600 text-white'
              }`}>
                {reservationCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Library Filter & Quick Search */}
      <div className="px-4 pb-3 pt-1 flex items-center gap-2">
        {/* Branch Dropdown selector */}
        <div className="relative shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200/80 rounded-xl text-xs font-medium text-stone-800 border border-stone-200 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <select
              value={selectedLibrary}
              onChange={(e) => onSelectLibrary(e.target.value as LibraryBranchId | 'all')}
              className="bg-transparent appearance-none pr-4 outline-none font-semibold cursor-pointer max-w-[120px] truncate"
            >
              <option value="all">전체 도서관 (9곳)</option>
              {SEOSAN_LIBRARIES.map((lib) => (
                <option key={lib.id} value={lib.id}>
                  {lib.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-stone-400 pointer-events-none absolute right-2" />
          </div>
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="행사명, 강사, 작가, 키워드 검색"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-stone-100 focus:bg-white border border-stone-200 focus:border-emerald-600 rounded-xl outline-none transition-all placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 text-xs font-bold"
              aria-label="검색어 지우기"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
