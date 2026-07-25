import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',
    '/:locale(zh-TW|ja|en)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)',
  ]
};
