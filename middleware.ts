import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.includes('/api/')) {
    const origin = request.headers.get('origin');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (origin && siteUrl && origin !== siteUrl) {
      return new NextResponse(
        JSON.stringify({ errorCode: 'UNAUTHORIZED' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/:locale(zh-TW|ja|en)/:path*',
    '/api/:path*',
    '/((?!_next|_vercel|.*\\..*|sitemap\\.xml|robots\\.txt).*)'
  ]
};
