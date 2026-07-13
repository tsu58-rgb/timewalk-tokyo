import type { Metadata } from "next";

import SeichiWorksIndex from "../components/SeichiWorksIndex";
import { fetchLanguages, fetchWorkTranslations, localizeWork } from "../lib/seichiI18nData";
import { seichiIndexAlternates, seichiIndexUrl } from "../lib/seichiSeo";
import { getStaticWorks } from "../lib/staticTimewalkData";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "聖地巡礼TimeWalk｜作品の舞台を歩く",
  description: "アニメ、映画、ドラマに登場した場所を地図で探せる聖地巡礼ガイドです。",
  alternates: seichiIndexAlternates("ja"),
  openGraph: {
    title: "聖地巡礼TimeWalk｜作品の舞台を歩く",
    description: "アニメ、映画、ドラマに登場した場所を地図で探せる聖地巡礼ガイドです。",
    url: seichiIndexUrl("ja"),
    locale: "ja_JP",
  },
  other: {
    "content-language": "ja",
  },
};

export default async function SeichiPage() {
  const [languages, translations] = await Promise.all([
    fetchLanguages(),
    fetchWorkTranslations(),
  ]);

  const localizedWorks = getStaticWorks().map((work) => localizeWork(work, "ja", translations));

  return <SeichiWorksIndex works={localizedWorks} lang="ja" languages={languages} />;
}
