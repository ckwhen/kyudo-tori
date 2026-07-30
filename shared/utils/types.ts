export type Option = {
  value: string,
  label: string
}

export type RegionOption = Option & {
  prefectures: Option[];
};
