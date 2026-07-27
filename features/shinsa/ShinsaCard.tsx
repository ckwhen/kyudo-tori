import { useFormatter } from 'next-intl';
import { MapPinned } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { parse } from 'date-fns';
import { ShinsaResponse } from './types';

type Props = {
  data: ShinsaResponse;
}

export default function ShinsaCard({
  data: {
    name,
    location,
    startAt,
    ranks,
    federation,
    kyudojo,
    note
  }
}: Props) {
  const format = useFormatter();
  const t = useTranslations('ShinsaCard');
  const parsedStartAt = startAt ? parse(startAt, 'yyyy-MM-dd HH:mm:ss', new Date()) : null;

  let formatStartAt = '隨時公告';
  if (parsedStartAt) {
    formatStartAt = format.dateTime(parsedStartAt, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
  }

  const renderRankGrid = () => {
    return (
      <div className="grid grid-cols-5 gap-0 w-full">
        {ranks.map((rank) => (
          <div 
            key={rank.id} 
            className={`
              px-1 py-1 border border-ink/10
              text-xs font-mono font-bold text-ink/80 text-center
              tracking-wide leading-none flex items-center justify-center
            `}
          >
            {rank.name}
          </div>
        ))}
      </div>
    );
  };

  const renderLocationMap = (
    kyudojo: ShinsaResponse['kyudojo'],
    location: string | null
  ) => {
    const mapQuery = kyudojo
      ? (kyudojo.latitude && kyudojo.longitude
          ? `${kyudojo.latitude},${kyudojo.longitude}`
          : (kyudojo.address || kyudojo.name || ''))
      : '';
    const locationLink = encodeURIComponent(mapQuery);
    const displayName = kyudojo?.name || location || '指定弓道場';

    if (kyudojo && mapQuery) {
      return (
        <a
          href={`https://www.google.com.tw/maps/search/${locationLink}`}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-moss hover:underline inline-flex items-center gap-1 w-full max-w-full min-w-0"
          title={`${displayName} | ${t('openInMaps')}`}
        >
          <MapPinned className="w-4 h-4 shrink-0 opacity-80" />
          <span className="truncate">{displayName}</span>
        </a>
      );
    }

    return (
      <span className="font-medium text-ink/90 block truncate" title={displayName}>
        {displayName}
      </span>
    );
  };

  return (
    <li
      className={`
        group relative flex flex-col justify-between
        border-ink/10 border p-6 rounded-md
        bg-white text-sm shadow-xs hover:border-moss/40 hover:shadow-md
        transition-all duration-300 overflow-hidden
      `}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-moss scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

      <div>
        <div className="mb-3">
          {federation ? (
            <>
              <span>{federation.prefecture?.nameJa || '未知縣市'}</span>
              <span className="text-ink mx-2">|</span>
              <span className="truncate">{federation.name}</span>
            </>
          ) : (
            <span>未知連盟</span>
          )}
        </div>
        <h4 className="text-base md:text-lg font-serif font-bold text-ink mb-2 leading-snug group-hover:text-moss transition-colors line-clamp-2 min-h-14">
          {name}
        </h4>
        <div className="md:text-sm space-y-3.5 pt-4 border-t mb-1 text-sm text-ink/80 border-ink/5">
          {ranks && renderRankGrid()}
          <div className="flex items-center">
            <span className="w-14 text-sm text-ink/40 font-bold tracking-wider shrink-0">實施日</span>
            <span className="font-medium text-ink/90">
              {formatStartAt}
            </span>
          </div>
          <div className="flex items-start min-h-7">
            <span className="w-14 text-sm text-ink/40 font-bold tracking-wider shrink-0">地點</span>
            <div className="flex-1 min-w-0">
              {renderLocationMap(kyudojo, location)}
            </div>
          </div>
          {note && note.trim() !== "" && (
            <div className="mt-4 border-t border-dashed border-ink/10 pt-4">
              <div className={`
                bg-canvas/60 border border-ink/5 rounded-sm p-3
                text-xs text-ink/70 leading-relaxed font-mono tracking-wide
              `}>
                {note}
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
