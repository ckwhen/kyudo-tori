export const MAX_VISIBLE_PAGES: number = 5;

export const SHINSA_PAGE_LIMIT: number = 15;

const formatter = new Intl.DateTimeFormat('en', { month: 'long' });

export const MONTH_KEYS = Array.from({ length: 12 }, (_, i) => formatter.format(new Date(0, i)));