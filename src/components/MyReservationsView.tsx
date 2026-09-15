import React, { useState } from 'react';
import { Ticket, Calendar, MapPin, User, CheckCircle, Clock, AlertTriangle, Trash2, ArrowRight, QrCode } from 'lucide-react';
import { Reservation, TabType } from '../types';

interface MyReservationsViewProps {
  reservations: Reservation[];
  onOpenTicket: (reservation: Reservation) => void;
  onCancelReservation: (reservationId: string) => void;
  onNavigateTab: (tab: TabType) => void;
}

export const MyReservationsView: React.FC<MyReservationsViewProps> = ({
  reservations,
  onOpenTicket,
  onCancelReservation,
  onNavigateTab,
}) => {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'waitlist' | 'cancelled'>('all');

  const filteredReservations = reservations.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const confirmedCount = reservations.filter((r) => r.status === 'confirmed').length;
  const waitlistCount = reservations.filter((r) => r.status === 'waitlist').length;

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-800 tracking-wider block">
              서산시 도서관 행사 통합 신청 현황
            </span>
            <h2 className="text-base font-bold text-stone-900 mt-0.5">나의 예약 및 접수증</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Ticket className="w-5 h-5" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-100 text-center">
          <div className="bg-stone-50 rounded-xl py-2 px-1">
            <span className="text-[10px] text-stone-400 font-medium block">전체 내역</span>
            <span className="text-sm font-bold text-stone-800">{reservations.length}건</span>
          </div>
          <div className="bg-emerald-50/80 rounded-xl py-2 px-1">
            <span className="text-[10px] text-emerald-700 font-medium block">접수 확정</span>
            <span className="text-sm font-bold text-emerald-900">{confirmedCount}건</span>
          </div>
          <div className="bg-amber-50/80 rounded-xl py-2 px-1">
            <span className="text-[10px] text-amber-700 font-medium block">대기 접수</span>
            <span className="text-sm font-bold text-amber-900">{waitlistCount}건</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 mt-3">
          {(['all', 'confirmed', 'waitlist', 'cancelled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {f === 'all' && '전체'}
              {f === 'confirmed' && '접수확정'}
              {f === 'waitlist' && '대기신청'}
              {f === 'cancelled' && '취소내역'}
            </button>
          ))}
        </div>
      </div>

      {/* Reservation List */}
      {filteredReservations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-800">신청된 예약 내역이 없습니다</h3>
            <p className="text-xs text-stone-500 mt-1">
              서산시 도서관의 다채로운 인문학 및 문화 행사를 둘러보고 신청해 보세요.
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
        <div className="space-y-3">
          {filteredReservations.map((item) => {
            const isConfirmed = item.status === 'confirmed';
            const isWaitlist = item.status === 'waitlist';
            const isCancelled = item.status === 'cancelled';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-4 shadow-xs transition-all ${
                  isCancelled ? 'opacity-60 border-stone-200' : 'border-stone-200 hover:border-emerald-300'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        isConfirmed
                          ? 'bg-emerald-100 text-emerald-800'
                          : isWaitlist
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {isConfirmed && '접수 확정'}
                      {isWaitlist && '대기 순번 등록'}
                      {isCancelled && '예약 취소됨'}
                    </span>
                    <span className="font-mono text-[11px] text-stone-400 font-semibold">
                      {item.id}
                    </span>
                  </div>

                  <span className="text-[10px] text-stone-400">
                    신청일시: {item.createdAt}
                  </span>
                </div>

                {/* Event Title & Library */}
                <h3 className="text-sm font-bold text-stone-900 leading-snug">
                  {item.eventTitle}
                </h3>

                <div className="mt-2.5 space-y-1 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-medium text-stone-800">{item.eventDateTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{item.libraryName} · {item.locationRoom}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>
                      신청자: <strong>{item.applicantName}</strong> (동반 {item.companionCount}명)
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenTicket(item)}
                    className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>모바일 접수증(QR) 보기</span>
                  </button>

                  {!isCancelled && (
                    <button
                      onClick={() => onCancelReservation(item.id)}
                      className="py-2 px-3 border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-600 hover:text-rose-600 rounded-xl font-medium text-xs transition-colors"
                    >
                      취소
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
