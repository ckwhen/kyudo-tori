'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import { SlidersHorizontal } from 'lucide-react';
import { Pagination } from '@/shared/components';
import { ShinsaResponse } from './types';
import ShinsaFilterModal from './ShinsaFiltersModal'; 
import ShinsaCard from './ShinsaCard';

type Props = {
  data: ShinsaResponse[],
  pagination: {
    offset: number,
    limit: number,
    count: number,
  },
}

export default function ShinsaDashboard({
  data,
  pagination,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { limit } = pagination;

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="w-full flex flex-col">
      <div className="mb-8 text-right">
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
      />
    </div>
  )
}
