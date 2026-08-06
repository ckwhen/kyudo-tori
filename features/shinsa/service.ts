import {
  sql, asc, inArray,
  eq, lt, and, gte, desc
} from "drizzle-orm";
import { db } from "@/database";
import {
  shinsas, ranksShinsas, ranks,
  regions, prefectures, federations, kyudojos
} from '@/database/schema';
import type { ActionResponse } from "@/shared/utils/types";
import { safeDatabaseCall } from "@/shared/utils/error-handler";
import {
  getCurrentUTCDate,
  JST_TIMEZONE,
  TWO_MONTHS_IN_DAYS,
  DATETIME_FORMAT,
} from '@/shared/utils/date';
import type {
  ShinsaRequest,
  ShinsaData,
  ShinsaMetaData,
  FilterOptionsGroupData
} from './types';

export async function getFilteredShinsas({
  offset,
  limit,
  ...filters
}: ShinsaRequest): Promise<ActionResponse<ShinsaData[], ShinsaMetaData>> {
  return safeDatabaseCall(async () => {
    const whereConditions = [];

    if (filters.prefectures && filters.prefectures.length > 0) {
      whereConditions.push(inArray(federations.prefectureCode, filters.prefectures));
    }

    if (filters.ranks && filters.ranks.length > 0) {
      whereConditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${ranksShinsas}
          INNER JOIN ${ranks} ON ${ranksShinsas.rankId} = ${ranks.id}
          WHERE ${ranksShinsas.shinsaId} = ${shinsas.id}
            AND ${ranks.code} IN ${filters.ranks}
        )`
      );
    }

    if (filters.months && filters.months.length > 0) {
      const monthNumbers = filters.months.map(Number);
      whereConditions.push(
        sql`EXTRACT(MONTH FROM ${shinsas.startAt}) IN ${monthNumbers}`
      );
    }

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
      .leftJoin(kyudojos, eq(shinsas.kyudojoId, kyudojos.id))
      .where(and(...whereConditions));

    const now = getCurrentUTCDate().tz(JST_TIMEZONE);
    const twoMonthsLater = now.add(TWO_MONTHS_IN_DAYS, 'day');

    const nowStr = now.format(DATETIME_FORMAT);
    const twoMonthsStr = twoMonthsLater.format(DATETIME_FORMAT);

    const [ rows, countResult ] = await Promise.all([
      baseQuery
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
        ),
      db
        .select({ count: sql<number>`count(*)` })
        .from(shinsas)
        .leftJoin(federations, eq(shinsas.federationId, federations.id))
        .where(and(...whereConditions))
    ]);

    if (rows.length === 0) {
      return { data: [], meta: { total: 0 } };
    }

    const total = countResult[0]?.count ? Number(countResult[0].count) : 0;
    const shinsaIds = rows.map((r) => r.shinsa.id);

    const allRanks = await db
      .select({
        shinsaId: ranksShinsas.shinsaId,
        rank: ranks,
      })
      .from(ranksShinsas)
      .innerJoin(ranks, eq(ranksShinsas.rankId, ranks.id))
      .where(sql`${ranksShinsas.shinsaId} IN ${shinsaIds}`);

    const data = rows.map(({ shinsa, region, prefecture, federation, kyudojo }) => {
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

    return {
      data,
      meta: { total }
    };
  });
}

export async function getFilterOptionsGroup(): Promise<ActionResponse<FilterOptionsGroupData>> {
  return safeDatabaseCall(async () => {
    const [ rawRegions, rawRanks ] = await Promise.all([
      db.query.regions.findMany({
        orderBy: [ asc(regions.weight) ],
        with: {
          prefectures: {
            columns: {
              code: true
            }
          }
        }
      }),
      db.select({
          value: ranks.code,
          label: ranks.name,
        })
        .from(ranks)
        .where(and(
          gte(ranks.weight, 10),
          lt(ranks.weight, 50)
        ))
        .orderBy(asc(ranks.weight))
    ]);

    const extractedRegions = rawRegions.map((r) => ({
      code: r.code,
      prefectures: r.prefectures.map((p) => ({
        code: p.code
      }))
    }));

    return {
      data: {
        regions: extractedRegions,
        ranks: rawRanks
      },
      meta: {}
    };
  });
}

export async function getLatestSyncAt(): Promise<ActionResponse<string | null>> {
  return safeDatabaseCall(async () => {
    const [ latestShinsa ] = await db
      .select({ updatedAt: shinsas.updatedAt })
      .from(shinsas)
      .orderBy(desc(shinsas.updatedAt))
      .limit(1);

    return {
      data: latestShinsa?.updatedAt ? latestShinsa.updatedAt.toISOString() : null,
      meta: {}
    };
  });
}
