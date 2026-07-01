import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const cspValue = isDev
  ? [
      "default-src 'self'",
      // Dev-friendly: allow inline scripts/styles and eval for Next.js fast refresh
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000 http://localhost:3001 http://127.0.0.1:3000 http://127.0.0.1:3001",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com http://localhost:3000 http://localhost:3001 http://127.0.0.1:3000 http://127.0.0.1:3001",
      "font-src 'self' https://fonts.gstatic.com data: http://localhost:3000 http://localhost:3001 http://127.0.0.1:3000 http://127.0.0.1:3001",
      "img-src 'self' blob: data: https: http:",
      "media-src 'self'",
      `connect-src 'self' http://localhost:3000 http://localhost:3001 ws://localhost:3000 ws://localhost:3001 http://127.0.0.1:3000 http://127.0.0.1:3001 ws://127.0.0.1:3000 ws://127.0.0.1:3001 ${process.env.NEXT_PUBLIC_API_URL || "https://ld-naturals-api-production.up.railway.app"} https://*.supabase.co wss://*.supabase.co https://api.advansistechnologies.com`,
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  : [
      "default-src 'self'",
      // Next.js requires 'self' + its own chunks; no unsafe-inline for scripts
      "script-src 'self'",
      // No unsafe-inline — nonce is injected per-request by src/proxy.ts
      "style-src 'self' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' blob: data: https: http:",
      "media-src 'self'",
      // API, Supabase, Advansis
      `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || "https://ld-naturals-api-production.up.railway.app"} https://*.supabase.co wss://*.supabase.co https://api.advansistechnologies.com`,
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: cspValue,
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
