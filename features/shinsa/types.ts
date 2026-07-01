export type RankResponse = {
  id: string;
  code: string;
  name: string;
  weight: number;
  type: number;
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
  startAt: Date | null;
  deliveryMethodType: number | null;
  note: string | null;
  ranks: RankResponse[];
}
