'use client';

import { useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Pagination } from '@/shared/components';
import { types, constants } from '@/shared/utils';
import { ShinsaResponse } from './types';
import ShinsaFilterModal, { FilterState } from './ShinsaFiltersModal';
import ShinsaCard from './ShinsaCard';

const { MONTH_KEYS } = constants;

type Props = {
  data: ShinsaResponse[],
  regionOptions: types.RegionOption[],
  rankOptions: types.Option[],
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
    prefectures: searchParams.get('prefectures')?.split(',').filter(Boolean) || [],
    ranks: searchParams.get('ranks')?.split(',').filter(Boolean) || [],
    months: searchParams.get('months')?.split(',').filter(Boolean) || [],
  };
  const updateUrl = (nextFilters: FilterState) => {
    const params = new URLSearchParams();

    if (nextFilters.prefectures.length > 0) params.set('prefectures', nextFilters.prefectures.join(','));
    if (nextFilters.ranks.length > 0) params.set('ranks', nextFilters.ranks.join(','));
    if (nextFilters.months.length > 0) params.set('months', nextFilters.months.join(','));

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full flex flex-col">
      <div className="mb-8 text-right  flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ink/5 pb-5">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 bg-[#E8F2EC] text-[#2D6A4F] border border-[#2D6A4F]/10 px-2 py-1 rounded-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]"></span>
            <span>{t('future')}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FFF8E7] text-[#D9A013] border border-[#D9A013]/15 px-2 py-1 rounded-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A013] animate-pulse"></span>
            <span>{t('recent')}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#F0F1F3] text-[#7A828A] border border-[#7A828A]/15 px-2 py-1 rounded-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7A828A]"></span>
            <span>{t('history')}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
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
              <span className="tracking-wide">篩選條件</span>
            </div>
          </button>
        </div>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-0 m-0">
        {data.map((shinsa) => (
          <ShinsaCard key={shinsa.id} data={shinsa} />
        ))}
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
      <ShinsaFilterModal
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
