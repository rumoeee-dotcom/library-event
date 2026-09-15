import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { LibraryEvent } from '../types';

interface CalendarViewProps {
  events: LibraryEvent[];
  onSelectEvent: (event: LibraryEvent) => void;
  onQuickReserve: (event: LibraryEvent, e: React.MouseEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onSelectEvent,
  onQuickReserve,
}) => {
  // We center on September 2026 (the current context time: 2026-09-15)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 1-indexed (9 = September)
  const [selectedDateStr, setSelectedDateStr] = useState('2026-09-26');

  // Days in month
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  // First day of month (0: Sunday, 1: Monday, ...)
  const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Build calendar matrix
  const days = [];
  // Empty slots for padding
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const formatted = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      dayNumber: d,
      dateStr: formatted,
    });
  }

  // Get events on selected date
  const eventsOnSelectedDate = events.filter((e) => e.eventDate === selectedDateStr);

  return (
    <div className="space-y-4 pb-20">
      {/* Calendar Header Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-stone-900">
              {currentYear}년 {currentMonth}월 도서관 행사 일정
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
              aria-label="이전 달"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentYear(2026);
                setCurrentMonth(9);
                setSelectedDateStr('2026-09-20');
              }}
              className="px-2 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
            >
              오늘
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
              aria-label="다음 달"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day of Week Labels */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold mb-2 text-stone-400">
          <span className="text-rose-500">일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span className="text-blue-500">토</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((item, idx) => {
            if (!item) {
              return <div key={`empty-${idx}`} className="h-10 rounded-xl" />;
            }

            const dayEvents = events.filter((e) => e.eventDate === item.dateStr);
            const hasEvents = dayEvents.length > 0;
            const isSelected = selectedDateStr === item.dateStr;
            const isToday = item.dateStr === '2026-09-15';
            const dayOfWeek = (idx) % 7;
            const isSunday = dayOfWeek === 0;
            const isSaturday = dayOfWeek === 6;

            return (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDateStr(item.dateStr)}
                className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white font-bold shadow-xs scale-102'
                    : isToday
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold'
                    : hasEvents
                    ? 'hover:bg-stone-100 font-medium'
                    : 'text-stone-400 hover:bg-stone-50'
                }`}
              >
                <span className={`text-xs ${
                  isSelected 
                    ? 'text-white' 
                    : isSunday 
                    ? 'text-rose-600' 
                    : isSaturday 
                    ? 'text-blue-600' 
                    : 'text-stone-800'
                }`}>
                  {item.dayNumber}
                </span>

                {/* Event indicator dot */}
                {hasEvents && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-emerald-600'}`} />
                    {dayEvents.length > 1 && (
                      <span className={`text-[8px] font-bold ${isSelected ? 'text-emerald-100' : 'text-emerald-800'}`}>
                        +{dayEvents.length - 1}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events List for Selected Day */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <span className="text-emerald-800">{selectedDateStr}</span>
            <span>도서관 행사 ({eventsOnSelectedDate.length}건)</span>
          </h3>
          <span className="text-xs text-stone-500">
            {eventsOnSelectedDate.length === 0 ? '예정된 행사 없음' : '터치하여 상세/예약'}
          </span>
        </div>

        {eventsOnSelectedDate.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-stone-200 p-8 text-center text-stone-400">
            <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-stone-300" />
            <p className="text-xs">선택하신 날짜에는 예정된 행사가 없습니다.</p>
            <p className="text-[11px] text-stone-400 mt-1">달력에서 초록 점이 표시된 날짜를 선택해 보세요.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {eventsOnSelectedDate.map((event) => (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="bg-white rounded-2xl p-3.5 border border-stone-200 hover:border-emerald-300 shadow-xs transition-all cursor-pointer flex gap-3 items-center group"
              >
                <img
                  src={event.bannerImg}
                  alt={event.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 bg-stone-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {event.status === 'open' ? '접수중' : event.status === 'waitlist' ? '대기접수' : '접수예정'}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-600 truncate">
                      {event.libraryName}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-stone-900 group-hover:text-emerald-900 line-clamp-1">
                    {event.title}
                  </h4>

                  <div className="mt-1 flex items-center gap-2 text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {event.eventTimeStr}
                    </span>
                    <span>·</span>
                    <span className="truncate">{event.locationRoom}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-700">
                      정원 {event.capacity}명 (잔여 {Math.max(0, event.capacity - event.currentRegistered)}석)
                    </span>
                    <button
                      onClick={(e) => onQuickReserve(event, e)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold shadow-2xs"
                    >
                      예약하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
