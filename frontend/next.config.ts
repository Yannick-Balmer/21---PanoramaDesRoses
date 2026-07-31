import type { NextConfig } from 'next'
import dotenv from 'dotenv'

const common = dotenv.config({ path: 'env/.env' });

const specific = dotenv.config({
  path: `env/.env.${process.env.NODE_ENV }`,
  override: true,
});

const isDev = process.env.NODE_ENV == 'development'

if (isDev) {
  console.log('🚀 Running in development mode', isDev, process.env.NODE_ENV);
  console.log('Variables de env/.env :', common.parsed);
  console.log(`Variables de env/.env.${process.env.NODE_ENV } :`,specific.parsed);
}

const ContentSecurityPolicy = isDev
  ? `
    default-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: ws: http: https:;
  `
  : `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https: ws:;
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
    object-src 'none';
    upgrade-insecure-requests;
  `

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ' '),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
]

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}



export default nextConfig
