import { ErrorCode } from "./error-handler";

export type Option = {
  value: string,
  label: string
}

export type RegionOption = Option & {
  prefectures: Option[];
};

export type ActionResponse<T, M = Record<string, unknown>> =
  | { data: T; meta: M; errorCode?: never }
  | { errorCode: ErrorCode; data?: never; meta?: never };
