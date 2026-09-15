import React, { useState } from 'react';
import { Building2, Phone, MapPin, Clock, CalendarX, ExternalLink, ChevronRight, Copy, Check } from 'lucide-react';
import { SEOSAN_LIBRARIES } from '../data/libraries';
import { LibraryBranchId } from '../types';

interface LibraryDirectoryProps {
  onSelectLibraryEvents: (libId: LibraryBranchId) => void;
}

export const LibraryDirectory: React.FC<LibraryDirectoryProps> = ({ onSelectLibraryEvents }) => {
  const [filterType, setFilterType] = useState<'all' | 'main' | 'small'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLibraries = SEOSAN_LIBRARIES.filter((lib) => {
    if (filterType === 'all') return true;
    if (filterType === 'main') return lib.type === 'main' || lib.type === 'children' || lib.type === 'sub';
    if (filterType === 'small') return lib.type === 'small';
    return true;
  });

  const handleCopyAddress = (libId: string, address: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address);
      setCopiedId(libId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold mb-1">
          <Building2 className="w-4 h-4" />
          <span>서산시 공공 및 작은도서관 안내</span>
        </div>
        <h2 className="text-base font-bold leading-snug">
          시민과 함께 숨쉬는 서산시 도서관
        </h2>
        <p className="text-xs text-emerald-100/90 mt-1">
          본관, 어린이도서관, 대산도서관 및 6개 읍면 작은도서관에서 풍성한 문화행사가 열립니다.
        </p>

        {/* Filter Type Pills */}
        <div className="flex gap-1.5 mt-3">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-950'
            }`}
          >
            전체 도서관 (9곳)
          </button>
          <button
            onClick={() => setFilterType('main')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'main'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-950'
            }`}
          >
            시립·분관 (3곳)
          </button>
          <button
            onClick={() => setFilterType('small')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'small'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-950'
            }`}
          >
            읍면 작은도서관 (6곳)
          </button>
        </div>
      </div>

      {/* Library Cards List */}
      <div className="space-y-3.5">
        {filteredLibraries.map((lib) => {
          const isCopied = copiedId === lib.id;
          return (
            <div
              key={lib.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-all"
            >
              <div className="relative h-36 w-full bg-stone-100">
                <img
                  src={lib.image}
                  alt={lib.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-black/60 text-emerald-200 backdrop-blur-xs">
                    {lib.type === 'main' ? '대표 시립본관' : lib.type === 'children' ? '어린이 특화' : lib.type === 'sub' ? '분관 도서관' : '작은도서관'}
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="text-base font-bold drop-shadow-xs">{lib.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-200 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{lib.address}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 text-xs">
                <p className="text-stone-600 leading-relaxed">
                  {lib.description}
                </p>

                {/* Facility Tags */}
                <div className="flex flex-wrap gap-1">
                  {lib.features.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md text-[10px] font-medium"
                    >
                      #{f}
                    </span>
                  ))}
                </div>

                {/* Info List */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100 text-stone-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>운영시간: {lib.openingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarX className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>휴관일: {lib.closedDays}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>문의전화: <strong className="text-stone-900">{lib.tel}</strong></span>
                    </div>
                    <a
                      href={`tel:${lib.tel.replace(/[^0-9]/g, '')}`}
                      className="text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      전화걸기
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleCopyAddress(lib.id, lib.address)}
                    className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? '주소 복사됨' : '주소 복사'}</span>
                  </button>

                  <button
                    onClick={() => onSelectLibraryEvents(lib.id)}
                    className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-colors"
                  >
                    <span>이 도서관 행사 확인 ({lib.eventCount}건)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
