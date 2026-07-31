import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './i18n/request.ts'
);

const envOrigins = process.env.ALLOWED_DEV_ORIGINS || '';

const allowedDevOrigins = envOrigins.split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  allowedDevOrigins,
};

export default withNextIntl(nextConfig);
