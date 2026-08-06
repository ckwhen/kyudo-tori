import { NOTIFICATION_CODES } from "./constants";
import { ErrorCode } from "./error-handler";

export type Option = {
  value: string,
  label: string
}

export type RegionOption = Option & {
  prefectures: Option[],
}

export type Pager = {
  offset: number,
  limit: number,
}

type PrefectureOptionData = {
  code: string,
};
export type RegionOptionData = {
  code: string,
  prefectures: PrefectureOptionData[],
}

export type RankOptionData = {
  code: string,
}

export type ActionResponse<T, M = Record<string, unknown>> =
  | { data: T; meta: M; errorCode?: never }
  | { errorCode: ErrorCode; data?: never; meta?: never };

export type NotificationCode = (typeof NOTIFICATION_CODES)[keyof typeof NOTIFICATION_CODES];
