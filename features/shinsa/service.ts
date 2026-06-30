import { db } from "@/shared/database";

type ShinsaResponse = {
  id: string;
  name: string;
  type: number | null;
  location: string | null;
  startAt: Date | null;
  deliveryMethodType: number | null;
  note: string | null;
  ranks: {
    id: string;
    code: string;
    name: string;
    weight: number;
    type: number;
  }[];
}

export const shinsaService = {
  async getFilteredShinsas(): Promise<Array<ShinsaResponse>> {
    const rawShinsas = await db.query.shinsas.findMany({
      with: {
        ranksShinsas: {
          with: {
            rank: true
          }
        }
      },
      orderBy: (shinsa, { asc }) => [asc(shinsa.startAt)],
    });

    return rawShinsas.map((shinsa) => {
      const extractedRanks = shinsa.ranksShinsas?.map((item) => item.rank) || [];
      const { ranksShinsas, ...shinsaData } = shinsa;

      return {
        ...shinsaData,
        ranks: extractedRanks,
      };
    });
  }
};
