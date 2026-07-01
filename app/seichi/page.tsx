import type { Metadata } from "next";

import SeichiWorksIndex from "../components/SeichiWorksIndex";
import { fetchLanguages, fetchWorkTranslations, localizeWork } from "../lib/seichiI18nData";
import { seichiIndexAlternates, seichiIndexUrl } from "../lib/seichiSeo";
import { fetchWorks } from "../lib/timewalkData";

export const revalidate = 300;

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
  const [works, languages, translations] = await Promise.all([
    fetchWorks({ revalidateSeconds: 300 }),
    fetchLanguages(300),
    fetchWorkTranslations(300),
  ]);

  const localizedWorks = works.map((work) => localizeWork(work, "ja", translations));

  return <SeichiWorksIndex works={localizedWorks} lang="ja" languages={languages} />;
}
