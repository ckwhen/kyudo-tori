import type {
  Pager,
  RegionOptionData,
  RankOptionData
} from '@/shared/utils/types';

export type PrefectureResponse = {
  id: string;
  code: string;
  nameJa: string;
  nameEn: string;
};

export type RegionResponse = {
  id: string;
  code: string;
  nameJa: string;
  weight: number;
};

export type FederationResponse = {
  id: string;
  name: string;
  prefectureCode: string | null;
  regionId: string | null;
  region: RegionResponse | null;
  prefecture: PrefectureResponse | null;
};

export type KyudojoResponse = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  prefectureCode: string | null;
  latitude: string | null;
  longitude: string | null;
};

export type RankResponse = {
  id: string;
  code: string;
  name: string;
  weight: number;
  type: string;
}

export type ShinsaRequest = Pager & {
  prefectures?: string[],
  ranks?: string[],
  months?: string[],
}

export type ShinsaData = {
  id: string,
  name: string,
  type: number | null,
  location: string | null,
  startAt: string | null,
  deliveryMethodType: number | null,
  note: string | null,
  ranks: RankResponse[],
  createdAt: Date,
  federationId: string | null,
  kyudojoId: string | null,
  federation: FederationResponse | null,
  kyudojo: KyudojoResponse | null,
}

export type ShinsaMetaData = {
  total: number,
}

export type FilterOptionsGroupData = {
  regions: RegionOptionData[];
  ranks: RankOptionData[];
}
