export type RankResponse = {
  id: string;
  code: string;
  name: string;
  weight: number;
  type: string;
}

export type ShinsaRequest = {
  offset: number,
  limit: number
}

export type ShinsaResponse = {
  id: string;
  name: string;
  type: number | null;
  location: string | null;
  startAt: string | null;
  deliveryMethodType: number | null;
  note: string | null;
  ranks: RankResponse[];
}
