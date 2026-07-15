import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://ld-naturals-api-production.up.railway.app';

  const isDev = process.env.NODE_ENV !== 'production';

  const csp = isDev
    ? [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' http://localhost:3000 http://localhost:3001 http://127.0.0.1:3000 http://127.0.0.1:3001`,
        `style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://fonts.googleapis.com http://localhost:3000 http://localhost:3001 http://127.0.0.1:3000 http://127.0.0.1:3001`,
        "font-src 'self' https://fonts.gstatic.com data: http://localhost:3000 http://localhost:3001 http://127.0.0.1:3000 http://127.0.0.1:3001",
        "img-src 'self' blob: data: https: http:",
        "media-src 'self'",
        `connect-src 'self' http://localhost:3000 http://localhost:3001 ws://localhost:3000 ws://localhost:3001 http://127.0.0.1:3000 http://127.0.0.1:3001 ws://127.0.0.1:3000 ws://127.0.0.1:3001 ${apiUrl} https://*.supabase.co wss://*.supabase.co https://api.advansistechnologies.com`,
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; ')
    : [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}'`,
        `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' blob: data: https: http:",
        "media-src 'self'",
        `connect-src 'self' ${apiUrl} https://*.supabase.co wss://*.supabase.co https://api.advansistechnologies.com`,
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
      ].join('; ');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
  );

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
