import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SeichiSpotDetail from "../SeichiSpotDetail";
import {
  fetchSpotTranslations,
  normalizeLanguage,
} from "../../../lib/seichiI18nData";
import {
  htmlLanguageCode,
  spotAlternates,
  spotDetailUrl,
} from "../../../lib/seichiSeo";
import { fetchSpots } from "../../../lib/timewalkData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}): Promise<Metadata> {
  const { id, lang } = await params;
  const normalized = normalizeLanguage(lang);

  if (!id.startsWith("se_") || normalized === "ja") return {};

  const [spots, translations] = await Promise.all([
    fetchSpots({ revalidateSeconds: 300, includeWorkSpots: true }),
    fetchSpotTranslations(300),
  ]);
  const spot = spots.find((item) => item.id === id);
  if (!spot) return {};

  const translated = translations.find(
    (item) => item.spotId === id && item.lang === normalized
  );
  const title = translated?.metaTitle || translated?.name || `${spot.name}｜TimeWalk`;
  const description =
    translated?.metaDescription ||
    translated?.description ||
    translated?.sceneDescription ||
    spot.description;

  return {
    title,
    description,
    alternates: spotAlternates(id, normalized),
    openGraph: {
      title,
      description,
      url: spotDetailUrl(id, normalized),
      locale: htmlLanguageCode(normalized),
      type: "article",
    },
    other: {
      "content-language": htmlLanguageCode(normalized),
    },
  };
}

export default async function LocalizedSpotPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = await params;
  const normalized = normalizeLanguage(lang);

  if (!id.startsWith("se_") || normalized === "ja") {
    notFound();
  }

  return <SeichiSpotDetail id={id} language={lang} />;
}
