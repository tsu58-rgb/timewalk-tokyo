import { notFound } from "next/navigation";

import SeichiSpotDetail from "../SeichiSpotDetail";
import { normalizeLanguage } from "../../../lib/seichiI18nData";

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
