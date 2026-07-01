'use client';

import { ShinsaResponse } from './types';

interface ShinsaDashboardProps {
  data: ShinsaResponse[];
}

export default function ShinsaDashboard({ data }: ShinsaDashboardProps) {
  const renderItem = ({
    id,
    name,
    location,
    startAt,
    ranks,
  }: ShinsaResponse) => {
    const locationLink = encodeURIComponent(location || '');

    return (
      <li
        key={id}
        className={`
          group relative flex flex-col justify-between
          border-ink/10 border p-6 rounded-md
          bg-white text-sm shadow-xs hover:border-moss/40 hover:shadow-md
          transition-all duration-300 overflow-hidden
        `}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-moss scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/50 flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              受理中
            </span>
            <span className="text-xs text-ink/40 font-mono font-medium">
              連盟名稱
            </span>
          </div>
          <h4 className="text-base md:text-lg font-serif font-bold text-ink mb-2 leading-snug group-hover:text-moss transition-colors line-clamp-2 min-h-[56px]">
            {name}
          </h4>
          <div className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-ink/70">
            <span className="text-moss font-bold font-serif">對象</span>
            <span className="font-mono bg-canvas border border-ink/10 px-2 py-0.5 rounded-md tracking-wider shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
              {ranks.map(rank => rank.name).join(', ')}
            </span>
          </div>
          <div className="space-y-3.5 text-xs md:text-sm text-ink/80 border-t border-ink/5 pt-5 mb-2">
            <div className="flex items-center">
              <span className="w-14 text-xs text-ink/40 font-bold tracking-wider shrink-0">實施日</span>
              <span className="font-medium text-ink/90">
                {startAt 
                  ? new Date(startAt).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' }) 
                  : '隨時公告'}
              </span>
            </div>
            <div className="flex items-start">
              <span className="w-14 text-xs text-ink/40 font-bold tracking-wider shrink-0 pt-0.5">地點</span>
              <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                <span className="block truncate font-medium text-ink/90">{location || '指定弓道場'}</span>
                {location && (
                  <a 
                    href={`https://www.google.com.tw/maps/search/${locationLink}`}
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[10px] text-moss font-bold hover:underline shrink-0 border border-moss/20 px-1.5 py-0.5 rounded bg-canvas/30"
                  >
                    地圖
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="w-full flex flex-col">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-0 m-0">
        {data.map(renderItem)}
      </ul>
    </div>
  )
}
