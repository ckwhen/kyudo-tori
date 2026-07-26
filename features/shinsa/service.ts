import { eq, sql } from "drizzle-orm";
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

  const rows = await baseQuery
    .limit(limit)
    .offset(offset)
    .orderBy(shinsas.startAt);

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
        region,     // 自帶來自 DB 的大區域欄位（如 id, code, name_ja 等）
        prefecture, // 自帶來自 DB 的都道府縣欄位（如 code, name_ja, name_zh 等）
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
