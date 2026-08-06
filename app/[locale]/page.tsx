import { services as shinsaServices, ShinsaDashboard } from '@/features/shinsa';
import { constants } from '@/shared/utils';

const { SHINSA_PAGE_LIMIT, FILTER_SEPARATOR } = constants;

export const revalidate = 0;

type Props = {
  searchParams: Promise<{
    page?: string,
    prefectures?: string,
    ranks?: string,
    months?: string,
  }>,
};

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const computedOffset = (currentPage - 1) * SHINSA_PAGE_LIMIT;

  const [ shinsasRes, optionsGroupRes ] = await Promise.all([
    shinsaServices.getFilteredShinsas({
      offset: computedOffset,
      limit: SHINSA_PAGE_LIMIT,
      prefectures: params.prefectures?.split(FILTER_SEPARATOR).filter(Boolean) || [],
      ranks: params.ranks?.split(FILTER_SEPARATOR).filter(Boolean) || [],
      months: params.months?.split(FILTER_SEPARATOR).filter(Boolean) || [],
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
