import React, { useState } from 'react';
import { X, Calendar, MapPin, CheckCircle2, User, Phone, Users, MessageSquare, AlertCircle, ShieldCheck } from 'lucide-react';
import { LibraryEvent, Reservation } from '../types';
import { generateTicketId } from '../utils/storage';

interface ReservationModalProps {
  event: LibraryEvent | null;
  onClose: () => void;
  onSuccess: (reservation: Reservation) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  event,
  onClose,
  onSuccess,
}) => {
  if (!event) return null;

  const [applicantName, setApplicantName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [companionCount, setCompanionCount] = useState<number>(0);
  const [specialRequest, setSpecialRequest] = useState('');
  const [isCitizen, setIsCitizen] = useState(true);
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle phone format
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    let formatted = raw;
    if (raw.length > 3 && raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else if (raw.length > 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }
    setPhoneNumber(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!applicantName.trim()) {
      setErrorMessage('신청자 성함을 입력해 주세요.');
      return;
    }
    if (phoneNumber.length < 12) {
      setErrorMessage('휴대폰 번호를 올바르게 입력해 주세요 (예: 010-1234-5678).');
      return;
    }
    if (!birthDate) {
      setErrorMessage('생년월일을 선택해 주세요.');
      return;
    }
    if (!agreePrivacy) {
      setErrorMessage('개인정보 수집 및 이용에 동의해야 신청이 가능합니다.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const ticketId = generateTicketId();
      const status = event.status === 'open' ? 'confirmed' : 'waitlist';

      const newReservation: Reservation = {
        id: ticketId,
        eventId: event.id,
        eventTitle: event.title,
        libraryId: event.libraryId,
        libraryName: event.libraryName,
        locationRoom: event.locationRoom,
        eventDateTime: `${event.eventDateStr} ${event.eventTimeStr}`,
        applicantName: applicantName.trim(),
        phoneNumber,
        birthDate,
        companionCount,
        specialRequest: specialRequest.trim() || undefined,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status,
        qrCodeData: `SEOSAN-LIB-${ticketId}-${event.id}-${applicantName.trim()}`,
        reminderOptIn: true,
      };

      setIsSubmitting(false);
      onSuccess(newReservation);
    }, 600);
  };

  const isWaitlist = event.status === 'waitlist';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white w-full sm:max-w-md max-h-[94vh] rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
              isWaitlist ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isWaitlist ? '대기자 접수' : '도서관 행사 예약'}
            </span>
            <h2 className="text-base font-bold text-stone-900 mt-1">참가 신청서 작성</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Target Event Brief Box */}
          <div className="p-3 bg-stone-100/80 rounded-xl border border-stone-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              {event.libraryName}
            </span>
            <h3 className="text-xs font-bold text-stone-900 line-clamp-1 mt-0.5">{event.title}</h3>
            <div className="mt-1.5 flex items-center gap-3 text-stone-600 text-[11px]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-stone-400" />
                {event.eventDateStr}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-stone-400" />
                {event.locationRoom}
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Applicant Name */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-stone-500" />
              신청자 성명 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="홍길동"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none text-xs text-stone-900"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-stone-500" />
              휴대전화 번호 <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="010-1234-5678"
              maxLength={13}
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none text-xs text-stone-900"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              ※ 접수 확인 및 행사 안내 문자(SMS/알림톡)가 발송됩니다.
            </p>
          </div>

          {/* Birth Date */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              생년월일 <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none text-xs text-stone-900"
            />
          </div>

          {/* Companion Count */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-stone-500" />
                동반 인원 (신청자 본인 외)
              </span>
              <span className="text-stone-400 text-[11px]">최대 2명</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCompanionCount(num)}
                  className={`py-2 rounded-xl font-medium border text-center transition-colors ${
                    companionCount === num
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {num === 0 ? '본인만 (0명)' : `+${num}명 (${num + 1}인)`}
                </button>
              ))}
            </div>
          </div>

          {/* Special Request */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
              사전 질문 또는 요청사항 (선택)
            </label>
            <textarea
              rows={2}
              placeholder="강사님께 궁금한 점이나 휠체어 이용 등 도서관 요청사항을 적어주세요."
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none text-xs text-stone-900 resize-none"
            />
          </div>

          {/* Agreements */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isCitizen}
                onChange={(e) => setIsCitizen(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span className="font-medium text-stone-800">서산시민 또는 서산시 소재 직장·학교 재직/재학자입니다.</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span className="font-medium text-stone-800">
                [필수] 행사 운영을 위한 개인정보 수집 및 초상권 이용에 동의합니다.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-stone-400 cursor-wait'
                  : isWaitlist
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-950/20'
                  : 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-950/20'
              }`}
            >
              {isSubmitting ? (
                <span>접수 처리 중...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isWaitlist ? '대기자 접수 완료하기' : '예약 접수 확정하기'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
