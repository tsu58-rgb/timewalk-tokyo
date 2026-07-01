import type { Metadata } from "next";

import SeichiSpotDetail from "./SeichiSpotDetail";
import SpotPageClient from "./SpotPageClient";
import { spotAlternates, spotDetailUrl } from "../../lib/seichiSeo";
import { fetchSpots } from "../../lib/timewalkData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!id.startsWith("se_")) return {};

  const spots = await fetchSpots({
    revalidateSeconds: 300,
    includeWorkSpots: true,
  });
  const spot = spots.find((item) => item.id === id);
  if (!spot) return {};

  const title = `${spot.name}｜TimeWalk`;
  const description = spot.description || `${spot.name}の聖地巡礼スポット情報です。`;

  return {
    title,
    description,
    alternates: spotAlternates(id, "ja"),
    openGraph: {
      title,
      description,
      url: spotDetailUrl(id, "ja"),
      locale: "ja_JP",
      type: "article",
    },
    other: {
      "content-language": "ja",
    },
  };
}

export default async function SpotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const special = id.substring(0, 2) === "se" && id.charAt(2) === "_";

  if (special) return <SeichiSpotDetail id={id} />;
  return <SpotPageClient id={id} />;
}
