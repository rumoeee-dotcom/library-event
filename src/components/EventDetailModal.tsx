import React from 'react';
import { 
  X, Calendar, Clock, MapPin, Users, Bookmark, Share2, 
  CheckCircle2, AlertCircle, Sparkles, BookOpen, UserCheck, 
  CreditCard, CalendarCheck, ArrowRight, Bell
} from 'lucide-react';
import { LibraryEvent } from '../types';

interface EventDetailModalProps {
  event: LibraryEvent | null;
  onClose: () => void;
  onOpenReservation: (event: LibraryEvent) => void;
  isBookmarked: boolean;
  onToggleBookmark: (eventId: string, e: React.MouseEvent) => void;
  isReminderSet: boolean;
  onToggleReminder: (eventId: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onOpenReservation,
  isBookmarked,
  onToggleBookmark,
  isReminderSet,
  onToggleReminder,
}) => {
  if (!event) return null;

  const remainingSeats = Math.max(0, event.capacity - event.currentRegistered);
  const percentFilled = Math.min(100, Math.round((event.currentRegistered / event.capacity) * 100));

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('행사 안내 링크가 클립보드에 복사되었습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white w-full sm:max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Cover */}
        <div className="relative h-52 sm:h-56 w-full shrink-0 bg-stone-900">
          <img
            src={event.bannerImg}
            alt={event.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-black/30" />

          {/* Navigation Controls */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => onToggleBookmark(event.id, e)}
                className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                  isBookmarked
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-black/50 hover:bg-black/70 text-white'
                }`}
                aria-label="관심 행사 등록"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
                aria-label="공유하기"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                event.status === 'open'
                  ? 'bg-emerald-600 text-white'
                  : event.status === 'waitlist'
                  ? 'bg-amber-600 text-white'
                  : event.status === 'upcoming'
                  ? 'bg-sky-600 text-white'
                  : 'bg-stone-500 text-white'
              }`}>
                {event.status === 'open' && '접수중'}
                {event.status === 'waitlist' && '대기접수중'}
                {event.status === 'upcoming' && '접수예정'}
                {event.status === 'closed' && '마감'}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-white/20 backdrop-blur-xs">
                {event.categoryLabel}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-950/80 text-emerald-200 border border-emerald-700/50">
                {event.libraryName}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold leading-snug drop-shadow-xs">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-sm text-stone-700">
          {/* Subtitle / Catchphrase */}
          {event.subtitle && (
            <p className="text-xs sm:text-sm text-stone-600 font-medium bg-stone-50 p-3 rounded-xl border border-stone-200/80">
              💡 {event.subtitle}
            </p>
          )}

          {/* Key Facts Grid */}
          <div className="bg-stone-50/80 rounded-2xl p-4 border border-stone-200/80 space-y-2.5">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-stone-500 font-medium block">행사 일시</span>
                <span className="font-semibold text-stone-900">{event.eventDateStr} {event.eventTimeStr}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-stone-500 font-medium block">장소</span>
                <span className="font-semibold text-stone-900">{event.libraryName} · {event.locationRoom}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-stone-500 font-medium block">참여 대상 및 정원</span>
                <span className="font-semibold text-stone-900">
                  {event.targetLabel} / 정원 {event.capacity}명 (대기 {event.waitlistCapacity}명)
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-stone-500 font-medium block">접수 기간</span>
                <span className="font-semibold text-stone-900">{event.applyStartDate} ~ {event.applyEndDate}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-stone-500 font-medium block">수강료 / 참가비</span>
                <span className="font-semibold text-emerald-800">{event.fee}</span>
              </div>
            </div>
          </div>

          {/* Seat Status Meter */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-emerald-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                실시간 예약 현황
              </span>
              <span className="text-emerald-800">
                {event.status === 'open' ? (
                  <><strong>{event.currentRegistered}명</strong> / {event.capacity}명 (잔여 <strong className="text-emerald-950">{remainingSeats}석</strong>)</>
                ) : event.status === 'waitlist' ? (
                  <>정원 마감 (대기 신청 <strong>{event.currentWaitlist}명</strong>)</>
                ) : event.status === 'upcoming' ? (
                  <>접수 시작 대기중</>
                ) : (
                  <>신청 마감</>
                )}
              </span>
            </div>

            <div className="w-full h-2 bg-emerald-200/70 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  event.status === 'open' ? 'bg-emerald-700' : 'bg-amber-600'
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>

          {/* Program Description */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              프로그램 소개
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Instructor Box */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <h3 className="text-xs font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              강사 / 진행자 안내
            </h3>
            <div className="text-xs">
              <p className="font-bold text-stone-900">{event.instructor.name}</p>
              <p className="text-stone-600">{event.instructor.title}</p>
              {event.instructor.organization && (
                <p className="text-stone-500 mt-0.5">{event.instructor.organization}</p>
              )}
            </div>
          </div>

          {/* Curriculum */}
          {event.curriculum.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-2">세부 진행 일정 및 커리큘럼</h3>
              <ul className="space-y-1.5 text-xs text-stone-600">
                {event.curriculum.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 bg-stone-50 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preparation & Notices */}
          {event.preparationNotes.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900">
              <span className="font-bold block mb-1">📌 준비물 및 지참사항</span>
              <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                {event.preparationNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {event.notice.length > 0 && (
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
              <span className="font-bold text-stone-800 block mb-1">⚠️ 신청자 필독 유의사항</span>
              <ul className="list-disc list-inside space-y-0.5">
                {event.notice.map((notice, idx) => (
                  <li key={idx}>{notice}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sticky Action Footer */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2.5 shrink-0">
          {event.status === 'upcoming' ? (
            <button
              onClick={() => onToggleReminder(event.id)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                isReminderSet
                  ? 'bg-sky-50 text-sky-800 border border-sky-300'
                  : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{isReminderSet ? '오픈 알림 등록 완료' : '접수 시작 알림 신청'}</span>
            </button>
          ) : event.status === 'closed' ? (
            <button
              disabled
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-stone-200 text-stone-400 cursor-not-allowed text-center"
            >
              접수가 마감된 행사입니다
            </button>
          ) : (
            <button
              onClick={() => onOpenReservation(event)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 ${
                event.status === 'open'
                  ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-950/20'
                  : 'bg-amber-600 hover:bg-amber-700 shadow-amber-950/20'
              }`}
            >
              <span>{event.status === 'open' ? '간편 예약 신청하기' : '대기자 접수하기'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
