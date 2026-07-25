import { db } from "@/shared/database";
import { ShinsaResponse, ShinsaRequest } from './types';

export const shinsaService = {
  async getFilteredShinsas({
    offset,
    limit,
  }: ShinsaRequest): Promise<Array<ShinsaResponse>> {
    const rawShinsas = await db.query.shinsas.findMany({
      offset,
      limit,
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
      const {
        ranksShinsas: _ranksShinsas,
        ...shinsaData
      } = shinsa;

      console.log(shinsa);

      return {
        ...shinsaData,
        ranks: extractedRanks,
      };
    });
  },

  async getShinsasCount(): Promise<number> {
    const result = await db.query.shinsas.findMany({
      columns: { id: true },
    });
    return result.length;
  },
};
