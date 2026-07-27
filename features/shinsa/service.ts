import { eq, sql } from "drizzle-orm";
import { addMonths, formatISO } from "date-fns";
import { db } from "@/shared/database";
import { ShinsaResponse, ShinsaRequest } from './types';
import {
  shinsas, ranksShinsas, ranks,
  regions, prefectures, federations, kyudojos
} from "./schema";

export async function getFilteredShinsas({
  offset,
  limit,
}: ShinsaRequest): Promise<Array<ShinsaResponse>> {
  const baseQuery = db
    .select({
      shinsa: shinsas,
      federation: federations,
      kyudojo: kyudojos,
      region: regions,
      prefecture: prefectures,
    })
    .from(shinsas)
    .leftJoin(federations, eq(shinsas.federationId, federations.id))
    .leftJoin(regions, eq(federations.regionId, regions.id))
    .leftJoin(prefectures, eq(federations.prefectureCode, prefectures.code))
    .leftJoin(kyudojos, eq(shinsas.kyudojoId, kyudojos.id));

  const now = new Date();
  const twoMonthsLater = addMonths(now, 2);

  const nowStr = formatISO(now, { representation: 'complete' })
    .replace('T', ' ').substring(0, 19);
  const twoMonthsStr = formatISO(twoMonthsLater, { representation: 'complete' })
    .replace('T', ' ').substring(0, 19);

  const rows = await baseQuery
    .limit(limit)
    .offset(offset)
    .orderBy(
      sql`
        CASE
        WHEN ${shinsas.startAt} > ${twoMonthsStr} THEN 0
        WHEN ${shinsas.startAt} >= ${nowStr} AND ${shinsas.startAt} <= ${twoMonthsStr} THEN 1
        ELSE 2
        END
      `,
      sql`
        CASE
        WHEN ${shinsas.startAt} >= ${nowStr} THEN ${shinsas.startAt}
        ELSE NULL
        END ASC NULLS LAST
      `,
      sql`
        CASE
        WHEN ${shinsas.startAt} < ${nowStr} THEN ${shinsas.startAt}
        ELSE NULL
        END DESC NULLS LAST
      `
    );

  if (rows.length === 0) return [];
  const shinsaIds = rows.map((r) => r.shinsa.id);

  const allRanks = await db
    .select({
      shinsaId: ranksShinsas.shinsaId,
      rank: ranks,
    })
    .from(ranksShinsas)
    .innerJoin(ranks, eq(ranksShinsas.rankId, ranks.id))
    .where(sql`${ranksShinsas.shinsaId} IN ${shinsaIds}`);

  return rows.map(({ shinsa, region, prefecture, federation, kyudojo }) => {
    const extractedRanks = allRanks
      .filter((r) => r.shinsaId === shinsa.id)
      .map((r) => r.rank)
      .sort((a, b) => a.weight - b.weight);

    return {
      ...shinsa,
      kyudojo,
      ranks: extractedRanks,
      federation: federation ? {
        ...federation,
        region,
        prefecture,
      } : null,
    };
  });
}

export async function getShinsasCount(): Promise<number> {
  const result = await db.query.shinsas.findMany({
    columns: { id: true },
  });
  return result.length;
};
