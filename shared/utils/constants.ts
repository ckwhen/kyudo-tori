export const MAX_VISIBLE_PAGES: number = 5;

export const SHINSA_PAGE_LIMIT: number = 15;

const formatter = new Intl.DateTimeFormat('en', { month: 'long' });

export const MONTH_KEYS = Array.from({ length: 12 }, (_, i) => formatter.format(new Date(0, i)));

export const FILTER_SEPARATOR = ',';

export const NOTIFICATION_CODES = {
  COPY_SUCCESS: "NOTIFY_COPY_SUCCESS",
  DB_OPERATION_FAILED: "ERR_DB_OPERATION_FAILED",
  COPY_OPERATION_FAILED: "ERR_COPY_OPERATION_FAILED",
} as const;
