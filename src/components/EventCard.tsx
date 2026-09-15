import React from 'react';
import { Calendar, Clock, MapPin, Users, Bookmark, Sparkles, AlertCircle } from 'lucide-react';
import { LibraryEvent, EventStatus } from '../types';

interface EventCardProps {
  event: LibraryEvent;
  onSelect: (event: LibraryEvent) => void;
  isBookmarked: boolean;
  onToggleBookmark: (eventId: string, e: React.MouseEvent) => void;
  onQuickReserve?: (event: LibraryEvent, e: React.MouseEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  onQuickReserve,
}) => {
  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'open':
        return {
          label: '접수중',
          className: 'bg-emerald-600 text-white shadow-xs',
        };
      case 'waitlist':
        return {
          label: '대기접수',
          className: 'bg-amber-600 text-white shadow-xs',
        };
      case 'upcoming':
        return {
          label: '접수예정',
          className: 'bg-sky-600 text-white shadow-xs',
        };
      case 'closed':
      default:
        return {
          label: '마감',
          className: 'bg-stone-500 text-white shadow-xs',
        };
    }
  };

  const statusInfo = getStatusBadge(event.status);
  const remainingSeats = Math.max(0, event.capacity - event.currentRegistered);
  const percentFilled = Math.min(100, Math.round((event.currentRegistered / event.capacity) * 100));

  return (
    <div
      onClick={() => onSelect(event)}
      className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer overflow-hidden flex flex-col group"
    >
      {/* Card Image Banner */}
      <div className="relative h-40 w-full overflow-hidden bg-stone-100">
        <img
          src={event.bannerImg}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold tracking-tight ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/50 text-white backdrop-blur-xs">
              {event.categoryLabel}
            </span>
          </div>

          <button
            onClick={(e) => onToggleBookmark(event.id, e)}
            className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
              isBookmarked
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white/80 text-stone-700 hover:bg-white'
            }`}
            aria-label="관심 행사 등록"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom target chip & hot badge on image */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white">
          <span className="px-2 py-0.5 rounded-full bg-stone-900/70 backdrop-blur-xs text-[11px] font-medium">
            대상: {event.targetLabel}
          </span>
          {event.isHot && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-600/90 text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-amber-200" />
              마감임박
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Library Name & Room */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 mb-1">
            <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
            <span className="truncate">{event.libraryName}</span>
            <span className="text-stone-300">|</span>
            <span className="text-stone-500 font-normal truncate">{event.locationRoom}</span>
          </div>

          {/* Event Title */}
          <h3 className="text-sm font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-emerald-900 transition-colors">
            {event.title}
          </h3>

          {/* Event Date & Time */}
          <div className="mt-2.5 space-y-1 text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="font-medium text-stone-800">{event.eventDateStr}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{event.eventTimeStr}</span>
            </div>
          </div>
        </div>

        {/* Seat Availability & Quick Action */}
        <div className="mt-3 pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <div className="flex items-center gap-1 text-stone-600">
              <Users className="w-3 h-3 text-stone-400" />
              <span>
                모집정원 <strong className="text-stone-900">{event.capacity}명</strong>
              </span>
            </div>
            <div>
              {event.status === 'open' && (
                <span className="font-bold text-emerald-700">
                  잔여 {remainingSeats}석
                </span>
              )}
              {event.status === 'waitlist' && (
                <span className="font-bold text-amber-700">
                  대기 {event.currentWaitlist}/{event.waitlistCapacity}명
                </span>
              )}
              {event.status === 'upcoming' && (
                <span className="text-sky-700 font-medium">
                  {event.applyStartDate.split(' ')[0]} 오픈
                </span>
              )}
              {event.status === 'closed' && (
                <span className="text-stone-400 font-medium">접수 마감</span>
              )}
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all ${
                event.status === 'open'
                  ? percentFilled > 85 ? 'bg-rose-500' : 'bg-emerald-600'
                  : event.status === 'waitlist'
                  ? 'bg-amber-500'
                  : 'bg-stone-300'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(event)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 text-center transition-colors"
            >
              상세보기
            </button>

            {onQuickReserve && (event.status === 'open' || event.status === 'waitlist') && (
              <button
                onClick={(e) => onQuickReserve(event, e)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold text-white transition-colors shrink-0 shadow-xs ${
                  event.status === 'open'
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {event.status === 'open' ? '바로 예약' : '대기 신청'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
