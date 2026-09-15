import React from 'react';
import { Compass, CalendarDays, Ticket, Building2, Bookmark } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  reservationCount: number;
  bookmarkCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  reservationCount,
  bookmarkCount,
}) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: '행사탐색',
      icon: Compass,
    },
    {
      id: 'calendar' as TabType,
      label: '행사일정',
      icon: CalendarDays,
    },
    {
      id: 'my-reservations' as TabType,
      label: '내 예약',
      icon: Ticket,
      badge: reservationCount,
    },
    {
      id: 'libraries' as TabType,
      label: '도서관안내',
      icon: Building2,
    },
    {
      id: 'bookmarks' as TabType,
      label: '관심행사',
      icon: Bookmark,
      badge: bookmarkCount,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-800 font-bold scale-102'
                  : 'text-stone-400 hover:text-stone-600 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-emerald-700 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
