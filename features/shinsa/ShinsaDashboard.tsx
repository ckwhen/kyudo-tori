'use client';

import { useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Pagination } from '@/shared/components';
import { MONTH_KEYS, FILTER_SEPARATOR } from '@/shared/utils/constants';
import type { RegionOption, Option } from '@/shared/utils/types';
import { ShinsaResponse } from './types';
import ShinsaFiltersModal, { FilterState } from './ShinsaFiltersModal';
import ShinsaCard from './ShinsaCard';

type Props = {
  data: ShinsaResponse[],
  regionOptions: RegionOption[],
  rankOptions: Option[],
  pagination: {
    offset: number,
    limit: number,
    count: number,
  },
}

export default function ShinsaDashboard({
  data,
  regionOptions,
  rankOptions,
  pagination,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('ShinsaDashboard');
  const { limit } = pagination;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const monthOptions = useMemo(() => {
    return MONTH_KEYS.map((month, i) => ({
      value: `${i + 1}`,
      label: t(`monthOptions.${month}`),
    }));
  }, [ t ]);

  const currentFilters: FilterState = {
    prefectures: searchParams.get('prefectures')?.split(FILTER_SEPARATOR)
      .filter(Boolean) || [],
    ranks: searchParams.get('ranks')?.split(FILTER_SEPARATOR)
      .filter(Boolean) || [],
    months: searchParams.get('months')?.split(FILTER_SEPARATOR)
      .filter(Boolean) || [],
  };
  const updateUrl = ({
    prefectures: nextPrefectures,
    ranks: nextRanks,
    months: nextMonths
  }: FilterState) => {
    const params = new URLSearchParams();

    if (nextPrefectures.length > 0) params.set('prefectures', nextPrefectures.join(FILTER_SEPARATOR));
    if (nextRanks.length > 0) params.set('ranks', nextRanks.join(FILTER_SEPARATOR));
    if (nextMonths.length > 0) params.set('months', nextMonths.join(FILTER_SEPARATOR));

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const getAllPrefectures = () => regionOptions.flatMap((r) => r.prefectures);
  const getBadgeLabel = (key: keyof FilterState, value: string) => {
    if (key === 'prefectures') return getAllPrefectures().find((p) => p.value === value)?.label || value;
    if (key === 'ranks') return rankOptions.find((r) => r.value === value)?.label || value;
    if (key === 'months') return monthOptions.find((m) => m.value === value)?.label || value;

    return value;
  };

  const handleRemoveBadge = (key: keyof FilterState, value: string) => {
    const nextFilters = {
      ...currentFilters,
      [key]: currentFilters[key].filter((item) => item !== value),
    };
    updateUrl(nextFilters);
  };
  const handleClearAllBadges = () => {
    router.push(pathname, { scroll: false });
  };

  const hasAnyFilter = Object.values(currentFilters).some((arr) => arr.length > 0);

  const renderFilterBadges = () => {
    if (!hasAnyFilter) {
      return (
        <span className="text-ink/40">
          {t('showingAllInfo')}
        </span>
      );
    }

    return (
      <>
        {(Object.keys(currentFilters) as Array<keyof FilterState>).map((key) =>
          currentFilters[key].map((value) => ((
            <span
              key={`${key}-${value}`}
              className={`
                inline-flex items-center text-ink/40
                hover:text-moss font-medium underline underline-offset-4
                decoration-ink/20 hover:decoration-moss transition-colors select-none
              `}
            >
              <span>{getBadgeLabel(key, value)}</span>
              <button
                type="button"
                onClick={() => handleRemoveBadge(key, value)}
                className="text-ink/30 hover:text-moss p-0.5 cursor-pointer transition-colors active:scale-75"
                aria-label={t('removeCondition', { condition: getBadgeLabel(key, value) })}
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )))
        )}
        <button
          type="button"
          onClick={handleClearAllBadges}
          className="ml-1 text-ink/40 hover:text-moss decoration-ink/20 hover:decoration-moss font-medium underline underline-offset-4 cursor-pointer"
        >
          {t('clearAll')}
        </button>
      </>
    );
  };

  return (
    <div className="text-sm">
      <div className={`
        flex flex-col mb-8 gap-2
        items-center justify-between
      `}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-[#E8F2EC] text-[#2D6A4F] border border-[#2D6A4F]/10 px-2 py-1 rounded-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]"></span>
              <span>{t('shinsaStatus.future')}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#FFF8E7] text-[#D9A013] border border-[#D9A013]/15 px-2 py-1 rounded-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9A013] animate-pulse"></span>
              <span>{t('shinsaStatus.recent')}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F0F1F3] text-[#7A828A] border border-[#7A828A]/15 px-2 py-1 rounded-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A828A]"></span>
              <span>{t('shinsaStatus.history')}</span>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <button
              type="button"
              className={`
                px-3 py-2 rounded-sm
                bg-white border border-ink/10 text-ink/80 text-sm font-medium shadow-2xs
                transition-all duration-200 cursor-pointer select-none
                hover:border-moss/40 hover:text-moss
                active:scale-95
              `}
              onClick={() => setIsFilterOpen(true)}
            >
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-4 h-4 text-moss/70" />
                <span className="tracking-wide">{t('filter')}</span>
              </div>
            </button>
          </div>
        </div>
        <div className="flex justify-end border-t w-full pt-2 mt-2 border-ink/5">
          <div className="flex flex-wrap items-center justify-end w-full sm:max-w-[50%] shrink-0 gap-2">
            {renderFilterBadges()}
          </div>
        </div>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-0 m-0">
        {data.map(shinsa => <ShinsaCard key={shinsa.id} data={shinsa} />)}
      </ul>
      <Pagination
        {...pagination}
        onChange={(nextOffset) => {
          const nextPage = Math.floor(nextOffset / limit) + 1;
          const currentParams = new URLSearchParams(Array.from(searchParams.entries()));

          currentParams.set('page', nextPage + '');

          router.push(`/?${currentParams + ''}`);
          window.scrollTo({ top: 350, behavior: 'smooth' });
        }}
      />
      <ShinsaFiltersModal
        key={JSON.stringify(currentFilters)}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        currentFilters={currentFilters}
        regionOptions={regionOptions}
        rankOptions={rankOptions}
        monthOptions={monthOptions}
        onApply={updateUrl}
      />
    </div>
  )
}
