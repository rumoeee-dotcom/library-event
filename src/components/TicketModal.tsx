import React, { useState } from 'react';
import { X, QrCode, Calendar, Clock, MapPin, User, Users, AlertTriangle, CheckCircle, Trash2, Share2, Copy } from 'lucide-react';
import { Reservation } from '../types';

interface TicketModalProps {
  reservation: Reservation | null;
  onClose: () => void;
  onCancelReservation: (reservationId: string) => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  reservation,
  onClose,
  onCancelReservation,
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!reservation) return null;

  const handleCopyTicket = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`[서산시 도서관 접수증]\n접수번호: ${reservation.id}\n행사명: ${reservation.eventTitle}\n일시: ${reservation.eventDateTime}\n장소: ${reservation.libraryName} ${reservation.locationRoom}\n신청자: ${reservation.applicantName}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isConfirmed = reservation.status === 'confirmed';
  const isCancelled = reservation.status === 'cancelled';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-emerald-800 text-white p-4 pt-5 pb-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-emerald-900/60 hover:bg-emerald-900 text-white transition-colors"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-semibold text-emerald-200 tracking-wider uppercase block">
            충청남도 서산시립도서관
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">모바일 행사 참여 접수증</h2>

          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs bg-white text-emerald-900">
            {isConfirmed && <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />}
            {reservation.status === 'waitlist' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
            {isCancelled && <Trash2 className="w-3.5 h-3.5 text-rose-600" />}
            <span>
              {isConfirmed && '접수 확정 (참여 가능)'}
              {reservation.status === 'waitlist' && '대기 접수 번호'}
              {isCancelled && '예약 취소됨'}
            </span>
          </div>
        </div>

        {/* Ticket Perforated Cutouts */}
        <div className="relative flex items-center justify-between px-4 bg-emerald-800">
          <div className="w-5 h-5 -ml-6 rounded-full bg-stone-900/70"></div>
          <div className="flex-1 border-t-2 border-dashed border-emerald-600/60 mx-2"></div>
          <div className="w-5 h-5 -mr-6 rounded-full bg-stone-900/70"></div>
        </div>

        {/* Ticket Content */}
        <div className="p-5 space-y-4 text-xs bg-white">
          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center">
            {/* SVG Simulated QR code with authentic styling */}
            <div className="w-36 h-36 p-2 bg-white rounded-xl shadow-xs border border-stone-200 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-stone-900 fill-current">
                {/* Outer Markers */}
                <rect x="5" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="4"/>
                <rect x="11" y="11" width="14" height="14" fill="currentColor"/>
                
                <rect x="69" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="4"/>
                <rect x="75" y="11" width="14" height="14" fill="currentColor"/>

                <rect x="5" y="69" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="4"/>
                <rect x="11" y="75" width="14" height="14" fill="currentColor"/>

                {/* Data Grid Pattern */}
                <rect x="36" y="8" width="6" height="6"/>
                <rect x="48" y="8" width="6" height="6"/>
                <rect x="56" y="18" width="6" height="6"/>
                <rect x="36" y="24" width="8" height="6"/>
                
                <rect x="8" y="38" width="8" height="6"/>
                <rect x="22" y="44" width="8" height="6"/>
                <rect x="38" y="38" width="6" height="6"/>
                <rect x="48" y="44" width="12" height="6"/>
                <rect x="68" y="38" width="8" height="6"/>
                <rect x="82" y="44" width="10" height="6"/>

                <rect x="38" y="58" width="8" height="6"/>
                <rect x="54" y="56" width="6" height="6"/>
                <rect x="68" y="54" width="12" height="6"/>
                <rect x="86" y="64" width="6" height="6"/>

                <rect x="38" y="74" width="6" height="6"/>
                <rect x="48" y="80" width="8" height="6"/>
                <rect x="62" y="74" width="6" height="6"/>
                <rect x="74" y="82" width="12" height="6"/>

                {/* Center Library Emblem */}
                <circle cx="50" cy="50" r="9" fill="#047857"/>
                <text x="50" y="54" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">서산</text>
              </svg>
            </div>

            <div className="mt-2 text-stone-500 text-[11px]">
              접수번호 <strong className="text-stone-900 tracking-wider font-mono text-xs">{reservation.id}</strong>
            </div>
            <span className="text-[10px] text-stone-400">도서관 입장 시 본 QR코드를 스캔해 주세요</span>
          </div>

          {/* Details Table */}
          <div className="space-y-2 border-t border-b border-stone-100 py-3">
            <div className="flex justify-between items-start">
              <span className="text-stone-400 font-medium">행사명</span>
              <span className="font-bold text-stone-900 text-right max-w-[200px] leading-snug">
                {reservation.eventTitle}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-stone-400 font-medium">일시</span>
              <span className="font-semibold text-stone-800">{reservation.eventDateTime}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-stone-400 font-medium">장소</span>
              <span className="font-semibold text-stone-800">
                {reservation.libraryName} {reservation.locationRoom}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-stone-400 font-medium">신청자</span>
              <span className="font-semibold text-stone-800">
                {reservation.applicantName} ({reservation.phoneNumber})
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-stone-400 font-medium">동반 인원</span>
              <span className="font-semibold text-stone-800">
                {reservation.companionCount === 0 ? '본인 1인' : `본인 외 ${reservation.companionCount}명 (총 ${reservation.companionCount + 1}인)`}
              </span>
            </div>

            {reservation.specialRequest && (
              <div className="flex justify-between items-start pt-1">
                <span className="text-stone-400 font-medium">요청사항</span>
                <span className="text-stone-600 text-right max-w-[180px]">{reservation.specialRequest}</span>
              </div>
            )}
          </div>

          {/* Cancel Confirmation Dialog */}
          {showCancelConfirm ? (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-center">
              <p className="font-bold text-rose-900 text-xs">정말 예약을 취소하시겠습니까?</p>
              <p className="text-[11px] text-rose-700">취소 시 대기자에게 순번이 양도되며 되돌릴 수 없습니다.</p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-700 font-semibold text-xs"
                >
                  돌아가기
                </button>
                <button
                  onClick={() => {
                    onCancelReservation(reservation.id);
                    setShowCancelConfirm(false);
                  }}
                  className="flex-1 py-1.5 bg-rose-600 text-white rounded-lg font-bold text-xs hover:bg-rose-700"
                >
                  예약 취소 확정
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyTicket}
                className="flex-1 py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 font-semibold text-stone-700 text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? '복사 완료!' : '접수증 복사'}</span>
              </button>

              {!isCancelled && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="py-2.5 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>예약 취소</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
