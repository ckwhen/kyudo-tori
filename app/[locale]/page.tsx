import { services as shinsaServices, ShinsaDashboard } from '@/features/shinsa';
import { constants } from '@/shared/utils';

const { SHINSA_PAGE_LIMIT } = constants;

export const revalidate = 0;

type Props = {
  searchParams: Promise<{ page?: string }>,
};

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const computedOffset = (currentPage - 1) * SHINSA_PAGE_LIMIT;

  const [ shinsas, totalCount, optionsGroup ] = await Promise.all([
    shinsaServices.getFilteredShinsas({
      offset: computedOffset,
      limit: SHINSA_PAGE_LIMIT,
    }),
    shinsaServices.getShinsasCount(),
    shinsaServices.getFilterOptionsGroup(),
  ]);

  return (
    <div className="w-full flex flex-col">
      <main className="max-w-6xl w-full mx-auto px-6 py-12 md:py-16">
        <ShinsaDashboard
          data={shinsas}
          regionOptions={optionsGroup?.regions}
          rankOptions={optionsGroup?.ranks}
          pagination={{
            offset: computedOffset,
            limit: SHINSA_PAGE_LIMIT,
            count: totalCount,
          }}
        />
      </main>
    </div>
  );
}
