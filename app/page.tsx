import { shinsaService, ShinsaDashboard } from '@/features/shinsa';

export default async function Home() {
  const shinsas = await shinsaService.getFilteredShinsas();

  return (
    <div className="w-full flex flex-col">
      <main className="max-w-6xl w-full mx-auto px-6 py-12 md:py-16">
        <ShinsaDashboard
          data={shinsas}
        />
      </main>
    </div>
  );
}
