import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const UTC_TIMEZONE = 'Etc/UTC';
export const JST_TIMEZONE = 'Asia/Tokyo';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const TWO_MONTHS_IN_DAYS = 60;

export function getCurrentUTCDate(): dayjs.Dayjs {
  return dayjs.utc();
}

export function getDateByTimezone(
  date: dayjs.ConfigType,
  timezone: string,
  format: string = DATETIME_FORMAT,
): dayjs.Dayjs {
  return dayjs.utc(date, format).tz(timezone);
}
