import type { MetadataRoute } from "next";

import { fetchSpots, fetchWorks } from "./lib/timewalkData";
import { supportedLanguages } from "./lib/seichiI18nData";
import {
  seichiIndexUrl,
  spotDetailUrl,
  TIMEWALK_BASE_URL,
  workUrl,
} from "./lib/seichiSeo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [works, spots] = await Promise.all([
    fetchWorks({ revalidateSeconds: 300 }),
    fetchSpots({ revalidateSeconds: 300, includeWorkSpots: true }),
  ]);

  const entries: MetadataRoute.Sitemap = [
    {
      url: TIMEWALK_BASE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${TIMEWALK_BASE_URL}/courses`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  supportedLanguages.forEach((lang) => {
    entries.push({
      url: seichiIndexUrl(lang),
      changeFrequency: "weekly",
      priority: lang === "ja" ? 0.9 : 0.8,
    });
  });

  works.forEach((work) => {
    supportedLanguages.forEach((lang) => {
      entries.push({
        url: workUrl(work.workId, lang),
        changeFrequency: "weekly",
        priority: lang === "ja" ? 0.85 : 0.75,
      });
    });
  });

  spots.forEach((spot) => {
    if (spot.workId) {
      supportedLanguages.forEach((lang) => {
        entries.push({
          url: spotDetailUrl(spot.id, lang),
          changeFrequency: "monthly",
          priority: lang === "ja" ? 0.8 : 0.7,
        });
      });
      return;
    }

    entries.push({
      url: `${TIMEWALK_BASE_URL}/spot/${spot.id}`,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  });

  return entries;
}
