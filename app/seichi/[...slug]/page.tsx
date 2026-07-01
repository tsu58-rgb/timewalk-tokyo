import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SeichiWorksIndex from "../../components/SeichiWorksIndex";
import SeichiWorkPageView from "../../components/SeichiWorkPageView";
import {
  fetchLanguages,
  fetchSpotTranslations,
  fetchWorkTranslations,
  localizeSpot,
  localizeWork,
  normalizeLanguage,
  type SupportedLanguage,
} from "../../lib/seichiI18nData";
import { fetchSpots, fetchWorks } from "../../lib/timewalkData";

export const revalidate = 300;

type RouteInfo =
  | { mode: "index"; lang: SupportedLanguage }
  | { mode: "work"; lang: SupportedLanguage; workId: string };

function parseRoute(slug: string[]): RouteInfo | null {
  if (slug.length === 1) {
    const lang = normalizeLanguage(slug[0]);
    if (lang !== "ja") return { mode: "index", lang };
    return { mode: "work", lang: "ja", workId: slug[0] };
  }

  if (slug.length === 2) {
    const lang = normalizeLanguage(slug[1]);
    if (lang === "ja") return null;
    return { mode: "work", lang, workId: slug[0] };
  }

  return null;
}

function genericMetadata(lang: SupportedLanguage): Metadata {
  const values = {
    ja: ["聖地巡礼TimeWalk｜作品の舞台を歩く", "アニメ、映画、ドラマに登場した場所を地図で探せる聖地巡礼ガイドです。"],
    en: ["Anime Pilgrimage Guide｜TimeWalk", "Explore real-life locations featured in anime, films and dramas."],
    "zh-CN": ["动漫圣地巡礼｜TimeWalk", "通过地图探索动漫、电影和电视剧中的真实取景地。"],
    "zh-TW": ["動畫聖地巡禮｜TimeWalk", "透過地圖探索動畫、電影和電視劇中的真實取景地。"],
    ko: ["애니메이션 성지순례｜TimeWalk", "애니메이션, 영화, 드라마에 등장한 실제 장소를 지도에서 찾아보세요."],
    vn: ["Hành hương anime｜TimeWalk", "Khám phá các địa điểm có thật xuất hiện trong anime, phim và phim truyền hình."],
  }[lang];

  return {
    title: values[0],
    description: values[1],
    openGraph: { title: values[0], description: values[1] },
  };
}

export async function generateMetadata({ params }: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = parseRoute(slug);
  if (!route) return {};
  if (route.mode === "index") return genericMetadata(route.lang);

  const [works, translations] = await Promise.all([
    fetchWorks({ revalidateSeconds: 300 }),
    fetchWorkTranslations(300),
  ]);
  const work = works.find((item) => item.workId === route.workId);
  if (!work) return {};

  const localized = localizeWork(work, route.lang, translations) as typeof work & {
    metaTitle?: string;
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
  };
  const title = localized.metaTitle || `${localized.workTitle}｜TimeWalk`;
  const description = localized.metaDescription || localized.workDescription;

  return {
    title,
    description,
    openGraph: {
      title: localized.ogTitle || title,
      description: localized.ogDescription || description,
    },
  };
}

export default async function SeichiMultilingualPage({ params }: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const route = parseRoute(slug);
  if (!route) notFound();

  const [works, languages, workTranslations] = await Promise.all([
    fetchWorks({ revalidateSeconds: 300 }),
    fetchLanguages(300),
    fetchWorkTranslations(300),
  ]);

  if (route.mode === "index") {
    const localizedWorks = works.map((work) => localizeWork(work, route.lang, workTranslations));
    return <SeichiWorksIndex works={localizedWorks} lang={route.lang} languages={languages} />;
  }

  const work = works.find((item) => item.workId === route.workId);
  if (!work) notFound();

  const [allSpots, spotTranslations] = await Promise.all([
    fetchSpots({ revalidateSeconds: 300, includeWorkSpots: true }),
    fetchSpotTranslations(300),
  ]);
  const localizedWork = localizeWork(work, route.lang, workTranslations);
  const localizedSpots = allSpots
    .filter((spot) => spot.workId === route.workId)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((spot) => localizeSpot(spot, route.lang, spotTranslations));

  return (
    <SeichiWorkPageView
      work={localizedWork}
      spots={localizedSpots}
      lang={route.lang}
      languages={languages}
    />
  );
}
