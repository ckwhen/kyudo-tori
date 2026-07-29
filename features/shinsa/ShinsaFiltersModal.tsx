'use client';

import { useState } from 'react';
import { SlidersHorizontal, X, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { types } from '@/shared/utils';
import { FilterButton } from '@/shared/components';

export interface FilterState {
  prefectures: string[];
  ranks: string[];
  months: string[];
}

type Props = {
  isOpen: boolean;
  regionOptions: types.RegionOption[],
  rankOptions: types.Option[],
  monthOptions: types.Option[],
  currentFilters: FilterState;
  onApply: (nextFilters: FilterState) => void;
  onClose: () => void;
};

export default function ShinsaFilterModal({
  isOpen,
  regionOptions,
  rankOptions,
  monthOptions,
  currentFilters,
  onApply,
  onClose,
}: Props) {
  const t = useTranslations('ShinsaFilterModal');
  const [ tempFilters, setTempFilters ] = useState<FilterState>({
    prefectures: [...currentFilters.prefectures],
    ranks: [...currentFilters.ranks],
    months: [...currentFilters.months],
  });
  const [ clickedRegion, setClickedRegion ] = useState<string>('');

  if (!isOpen) return null;

  const defaultRegion = regionOptions.length > 0 ? regionOptions[0].value : '';
  const activeRegion = clickedRegion || defaultRegion;
  const currentActiveRegionData = regionOptions.find(region => region.value === activeRegion);

  const toggleSelection = (key: keyof FilterState, value: string) => {
    setTempFilters((prev) => {
      const currentItems = prev[key];
      const nextItems = currentItems.includes(value)
        ? currentItems.filter((item) => item !== value)
        : [...currentItems, value];
      return { ...prev, [key]: nextItems };
    });
  };
  const resetFilter = () => {
    setTempFilters({
      prefectures: [],
      ranks: [],
      months: [],
    });
    setClickedRegion('');
  };

  const renderRegionsBlock = (regionOptions: types.RegionOption[]) => {
    return (
      <div className="space-y-4">
        <h4 className="font-serif font-bold text-ink/60 tracking-wider mb-3">
          {t('regionAndPref')}
        </h4>
        <div className="grid grid-cols-3 gap-2 mb-0">
          {regionOptions.map(region => {
            const regVal = region.value;
            const isActive = regVal === activeRegion;
            const selectedCount = region.prefectures.filter(p => tempFilters.prefectures.includes(p.value)).length;

            return (
              <button
                key={regVal}
                type="button"
                onClick={() => setClickedRegion(regVal)}
                className={`
                  whitespace-nowrap px-3 py-2 rounded-xl
                  font-medium transition-all cursor-pointer
                  ${isActive ? 'bg-moss text-canvas font-bold' : 'bg-ink/5 text-ink/70'}
                `}
              >
                <span>{region.label}</span>
                {selectedCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-moss text-canvas text-[10px] rounded-full">
                    {selectedCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {currentActiveRegionData && (
          <div className="flex justify-end my-2 shrink-0">
            {(() => {
              const currentPrefValues = currentActiveRegionData.prefectures.map(p => p.value);
              const isAllSelected = currentPrefValues.every(value => tempFilters.prefectures.includes(value));

              const handleToggleSelectAll = () => {
                setTempFilters((prev) => {
                  let nextPrefs = [...prev.prefectures];
                  if (isAllSelected) {
                    nextPrefs = nextPrefs.filter(value => !currentPrefValues.includes(value));
                  } else {
                    const filteredOtherRegions = nextPrefs.filter(value => !currentPrefValues.includes(value));
                    nextPrefs = [...filteredOtherRegions, ...currentPrefValues];
                  }
                  return { ...prev, prefectures: nextPrefs };
                });
              };

              let selectLabel = (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  <span>{t('selectAll')}</span>
                </>
              );
              if (isAllSelected) {
                selectLabel = (
                  <>
                    <X className="w-3 h-3 mr-1" />
                    <span>{t('deselectAll')}</span>
                  </>
                );
              }

              return (
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="flex items-center justify-center px-2 py-1 text-xs font-medium text-ink/50 hover:text-moss transition-colors cursor-pointer select-none underline underline-offset-2"
                >
                  {selectLabel}
                </button>
              );
            })()}
          </div>
        )}
        {currentActiveRegionData && (
          <div className="grid grid-cols-3 gap-2 min-h-33 content-start animate-in fade-in duration-200">
            {currentActiveRegionData.prefectures.map((pref) => {
              const valStr = String(pref.value);
              const isSelected = tempFilters.prefectures.includes(valStr);

              return (
                <FilterButton
                  key={valStr}
                  isSelected={isSelected}
                  onClick={() => toggleSelection('prefectures', valStr)}
                >
                  {pref.label}
                </FilterButton>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderRankOption = (rank: types.Option) => {
    const isSelected = tempFilters.ranks.includes(rank.value);

    return (
      <FilterButton
        key={rank.value}
        isSelected={isSelected}
        onClick={() => toggleSelection('ranks', rank.value)}
      >
        {rank.label}
      </FilterButton>
    );
  };

  const renderMonthOption = (month: types.Option) => {
    const isSelected = tempFilters.months.includes(month.value);
  
    return (
      <FilterButton
        key={month.value}
        isSelected={isSelected}
        onClick={() => toggleSelection('months', month.value)}
      >
        {month.label}
      </FilterButton>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-sm">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in" 
        onClick={() => {
          resetFilter();
          onClose();
        }}
      />
      <div className={`
        relative z-10 flex flex-col max-h-[85vh] w-full max-w-lg border rounded-sm overflow-hidden
        border-ink/10 text-ink bg-canvas shadow-2xl
        transform transition-all duration-200 animate-in fade-in zoom-in-95
      `}>
        <div className="flex justify-between items-center px-6 pt-6 pb-3 border-b border-ink/10 shrink-0">
          <h3 className="text-lg font-serif font-bold flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-moss" />
            <span>{t('filter')}</span>
          </h3>
          <button 
            type="button"
            onClick={() => {
              resetFilter();
              onClose();
            }}
            className="text-ink/40 hover:text-ink hover:bg-ink/5 p-1.5 rounded-full transition-colors cursor-pointer active:scale-95"
            aria-label={t('closeWindow')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {renderRegionsBlock(regionOptions)}
          <div>
            <h4 className="font-serif font-bold text-ink/60 tracking-wider mb-3">
              {t('reviewRank')}
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {rankOptions.map(rank => renderRankOption(rank))}
            </div>
          </div>
          <div>
            <h4 className="font-serif font-bold text-ink/60 tracking-wider mb-3">
              {t('holdingMonth')}
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {monthOptions.map(month => renderMonthOption(month))}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center px-6 pt-3 pb-6 border-t border-ink/10 shrink-0">
          <button
            type="button"
            onClick={resetFilter}
            className="font-bold text-ink/50 hover:text-ink transition-colors cursor-pointer select-none active:scale-98"
          >
            {t('clearAll')}
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(tempFilters);
              onClose();
            }}
            className="bg-moss hover:bg-ink text-canvas font-bold px-7 py-2 rounded-md tracking-wider transition-colors cursor-pointer active:scale-[0.97] transform shadow-xs"
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}