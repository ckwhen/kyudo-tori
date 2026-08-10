import { setRequestLocale } from 'next-intl/server';
import {
  ShinsaDashboard,
  ShinsaSchema,
  services as shinsaServices,
} from '@/features/shinsa';
import { SHINSA_PAGE_LIMIT, FILTER_SEPARATOR } from '@/shared/utils/constants';
import { type PageLocaleParams } from '@/shared/utils/types';

export const revalidate = 0;

type Props = PageLocaleParams & {
  searchParams: Promise<{
    page?: string,
    prefectures?: string,
    ranks?: string,
    months?: string,
  }>,
};

export default async function Home({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { locale } = resolvedParams;
  const {
    page,
    prefectures,
    ranks,
    months
  } = resolvedSearchParams;

  const currentPage = Math.max(1, parseInt(page || '1', 10));
  const computedOffset = (currentPage - 1) * SHINSA_PAGE_LIMIT;

  setRequestLocale(locale);

  const [ shinsasRes, optionsGroupRes ] = await Promise.all([
    shinsaServices.getFilteredShinsas({
      offset: computedOffset,
      limit: SHINSA_PAGE_LIMIT,
      prefectures: prefectures?.split(FILTER_SEPARATOR).filter(Boolean) || [],
      ranks: ranks?.split(FILTER_SEPARATOR).filter(Boolean) || [],
      months: months?.split(FILTER_SEPARATOR).filter(Boolean) || [],
    }),
    shinsaServices.getFilterOptionsGroup(),
  ]);
  const {
    meta,
    errorCode: shinsaErrorCode,
    data: shinsas = [],
  } = shinsasRes;
  const optionsGroup = optionsGroupRes.data ?? { regions: [], ranks: [] };

  return (
    <div className="w-full flex flex-col">
      <main className="max-w-6xl w-full mx-auto px-6 py-12 md:py-16">
        <ShinsaSchema data={shinsas} />
        <ShinsaDashboard
          data={shinsas}
          errorCode={shinsaErrorCode}
          regionOptionData={optionsGroup.regions}
          rankOptionData={optionsGroup.ranks}
          pagination={{
            offset: computedOffset,
            limit: SHINSA_PAGE_LIMIT,
            count: meta?.total ?? 0,
          }}
        />
      </main>
    </div>
  );
}
