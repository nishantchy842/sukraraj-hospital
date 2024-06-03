import { NextResponse, type NextRequest } from 'next/server';

import { i18n } from './i18n';

// import { match as matchLocale } from '@formatjs/intl-localematcher';
// import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
   // Negotiator expects plain object so we need to transform headers
   const negotiatorHeaders: Record<string, string> = {};
   request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

   // const locales = i18n.locales;

   // Use negotiator and intl-localematcher to get best locale
   // const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
   //    locales as unknown as string[]
   // );

   // const locale = matchLocale(languages, locales, i18n.defaultLocale);

   return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
   const pathname = request.nextUrl.pathname;

   if (pathname.startsWith(`/robots.txt`)) {
      return NextResponse.next();
   }

   const token = request.cookies.get('token');

   const isAdminPath = i18n.locales.some((locale) =>
      pathname.startsWith(`/${locale}/admin/`)
   );

   if (!token && isAdminPath)
      return NextResponse.redirect(new URL('/auth/login', request.url));

   const pathnameIsMissingLocale = i18n.locales.every(
      (locale) =>
         !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
   );

   // Redirect if there is no locale
   if (pathnameIsMissingLocale) {
      const locale = getLocale(request);

      // e.g. incoming request is /products
      // The new URL is now /en-US/products
      return NextResponse.redirect(
         new URL(
            `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${request.nextUrl.search}`,
            request.url
         )
      );
   }
   return NextResponse.next();
}

export const config = {
   // Matcher ignoring `/_next/` and `/api/`
   matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
      '/admin/:path*',
   ],
};
