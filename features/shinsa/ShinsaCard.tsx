import dayjs from 'dayjs';
import { useFormatter, useTranslations } from 'next-intl';
import { MapPinned, Feather } from 'lucide-react';
import {
  getCurrentUTCDate,
  getDateByTimezone,
  JST_TIMEZONE,
  TWO_MONTHS_IN_DAYS,
  DEFAULT_DATE_TEXT,
} from '@/shared/utils/date';
import { ShinsaData } from './types';

const SHINSA_STATUSES = {
  FUTURE: "FUTURE",
  RECENT: "RECENT",
  HISTORY: "HISTORY"
} as const;
const statusColorMap = {
  [SHINSA_STATUSES.FUTURE]: 'text-[#2D6A4F]/30',
  [SHINSA_STATUSES.RECENT]: 'text-[#D9A013]/20',
  [SHINSA_STATUSES.HISTORY]: 'text-[#7A828A]/20',
};

type ShinsaStatusType = (typeof SHINSA_STATUSES)[keyof typeof SHINSA_STATUSES];

type Props = {
  data: ShinsaData;
}

function getShinsaStatus(startAtJSTObj: dayjs.Dayjs | null): ShinsaStatusType {
  const now = getCurrentUTCDate().tz(JST_TIMEZONE);

  let status: ShinsaStatusType = SHINSA_STATUSES.FUTURE;

  if (!startAtJSTObj || !startAtJSTObj.isValid()) {
    return SHINSA_STATUSES.FUTURE;
  }

  const diffDays = startAtJSTObj.diff(now, 'day');

  if (diffDays < 0) {
    status = SHINSA_STATUSES.HISTORY;
  } else if (diffDays <= TWO_MONTHS_IN_DAYS) {
    status = SHINSA_STATUSES.RECENT;
  } else {
    status = SHINSA_STATUSES.FUTURE;
  }

  return status;
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
  const tCard = useTranslations('ShinsaCard');
  const tParams = useTranslations('parameters');
  const startAtJSTObj = startAt
    ? getDateByTimezone(startAt, JST_TIMEZONE)
    : null;

  let formatStartAt = DEFAULT_DATE_TEXT;
  if (startAtJSTObj && startAtJSTObj.isValid()) {
    formatStartAt = format.dateTime(startAtJSTObj.toDate(), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: JST_TIMEZONE,
        timeZoneName: 'short',
      });
  }

  const status = getShinsaStatus(startAtJSTObj);

  const renderRankGrid = () => {
    return (
      <div className="grid grid-cols-4 gap-0 w-full">
        {ranks.map((rank) => (
          <div 
            key={rank.id} 
            className={`
              px-1 py-1 border border-ink/10
              text-xs font-mono font-bold text-ink/80 text-center
              tracking-wide leading-none flex items-center justify-center
            `}
          >
            {tParams(`ranks.${rank.code}`)}
          </div>
        ))}
      </div>
    );
  };

  const renderLocationMap = (
    kyudojo: ShinsaData['kyudojo'],
    location: string | null
  ) => {
    const mapQuery = kyudojo
      ? (kyudojo.latitude && kyudojo.longitude
          ? `${kyudojo.latitude},${kyudojo.longitude}`
          : (kyudojo.address || kyudojo.name || ''))
      : '';
    const locationLink = encodeURIComponent(mapQuery);
    const displayName = kyudojo?.name || location || tCard('defaultKyudojo');

    if (kyudojo && mapQuery) {
      return (
        <a
          href={`https://www.google.com.tw/maps/search/${locationLink}`}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-moss hover:underline inline-flex items-center gap-1 w-full max-w-full min-w-0"
          title={`${displayName} | ${tCard('openInMaps')}`}
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
      <div className="absolute left-0 top-0 z-20 bottom-0 w-1 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center bg-current/70" />
      <div className="absolute right-4 top-4 z-0 pointer-events-none transition-colors duration-300">
        <Feather
          strokeWidth={1.5}
          className={`w-16 h-16 ${statusColorMap[status]}`}
        />
      </div>

      <div className="relative z-10">
        <div className="mb-3">
          {federation ? (
            <>
              <span>{tParams(`prefectures.${federation.prefecture?.code}`) || tCard('unknownPrefecture')}</span>
              <span className="text-ink mx-2">|</span>
              <span className="truncate">
                {tCard(`federations.${federation.code}`)}
              </span>
            </>
          ) : (
            <span>{tCard('unknownFederation')}</span>
          )}
        </div>
        <h4 className="text-base md:text-lg font-serif font-bold text-ink mb-2 leading-snug group-hover:text-moss transition-colors line-clamp-2 min-h-14">
          {name}
        </h4>
        <div className="space-y-4 text-xs md:text-sm text-ink/80 border-t border-ink/5 pt-5">
          {ranks && ranks.length > 0 && renderRankGrid()}
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-ink/40 font-bold tracking-wider">{tCard('startDate')}</span>
            <span className="font-medium text-ink/90">
              {formatStartAt}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-ink/40 font-bold tracking-wider">{tCard('locationName')}</span>
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
