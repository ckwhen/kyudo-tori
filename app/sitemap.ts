import { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const routes = [ '', '/contact', '/about' ];
  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${siteUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1.0 : 0.8,

        alternates: {
          languages: {
            "zh-tw": `${siteUrl}/zh-tw${route}`,
            "ja": `${siteUrl}/ja${route}`,
            "en": `${siteUrl}/en${route}`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}
