export type RankResponse = {
  id: string;
  code: string;
  name: string;
  weight: number;
  type: number;
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
