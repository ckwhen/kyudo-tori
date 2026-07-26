import { useFormatter } from 'next-intl';
import { Map } from 'lucide-react';
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
    kyudojo
  }
}: Props) {
  const format = useFormatter();
  const parsedStartAt = startAt ? parse(startAt, 'yyyy-MM-dd HH:mm:ss', new Date()) : null;

  let formatStartAt = '隨時公告';
  if (parsedStartAt) {
    formatStartAt = format.dateTime(parsedStartAt, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
  }

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
    const locationName = kyudojo?.name || location || '指定弓道場';

    return (
      <div className="flex-1 flex flex-col gap-1">
        <div className="font-medium text-ink/90" title={locationName}>
          {locationName}
        </div>
        {kyudojo && mapQuery && (
          <div className="flex justify-end mt-2">
            <a 
              href={`https://www.google.com.tw/maps/search/${locationLink}`}
              target="_blank" 
              rel="noreferrer" 
              className={`
                text-xs text-moss font-bold tracking-wide py-1.5 px-3
                flex items-center justify-center gap-1.5 min-w-20
                border border-moss/20 rounded-md bg-canvas/40
                hover:bg-moss/5 hover:border-moss/40 transition-colors duration-200
              `}
            >
              <Map className="w-3.5 h-3.5 opacity-80" />
              <span>地圖</span>
            </a>
          </div>
        )}
      </div>
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
        <div className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-ink/70">
          <span className="text-moss font-bold font-serif">對象</span>
          <span className="font-mono bg-canvas border border-ink/10 px-2 py-0.5 rounded-md tracking-wider shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
            {ranks.map(rank => rank.name).join(', ')}
          </span>
        </div>
        <div className=" md:text-sm space-y-3.5 pt-5 border-t mb-1 text-xs text-ink/80 border-ink/5">
          <div className="flex items-center">
            <span className="w-14 text-xs text-ink/40 font-bold tracking-wider shrink-0">實施日</span>
            <span className="font-medium text-ink/90">
              {formatStartAt}
            </span>
          </div>
          <div className="flex items-start">
            <span className="w-14 text-xs text-ink/40 font-bold tracking-wider shrink-0 pt-0.5">地點</span>
            {renderLocationMap(kyudojo, location)}
          </div>
        </div>
      </div>
    </li>
  );
}
