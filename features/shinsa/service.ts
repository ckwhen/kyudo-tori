import { db } from "@/shared/database";
import { ShinsaResponse } from './types';

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
