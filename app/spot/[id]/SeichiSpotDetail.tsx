import Link from "next/link";
import { notFound } from "next/navigation";

import NavigationLoadingGuard from "../../components/NavigationLoadingGuard";
import {
  fetchSpotTranslations,
  fetchWorkTranslations,
  localizeSpot,
  localizeWork,
  normalizeLanguage,
} from "../../lib/seichiI18nData";
import { fetchSpots, fetchWorks } from "../../lib/timewalkData";

export default async function SeichiSpotDetail({
  id,
  language,
}: {
  id: string;
  language?: string;
}) {
  const lang = normalizeLanguage(language);
  const [spots, works, spotTranslations, workTranslations] = await Promise.all([
    fetchSpots({ revalidateSeconds: 300, includeWorkSpots: true }),
    fetchWorks({ revalidateSeconds: 300 }),
    fetchSpotTranslations(300),
    fetchWorkTranslations(300),
  ]);

  const baseSpot = spots.find((item) => item.id === id && item.workId);
  if (!baseSpot) notFound();

  const baseWork = works.find((item) => item.workId === baseSpot.workId);
  if (!baseWork) notFound();

  const spot = localizeSpot(baseSpot, lang, spotTranslations);
  const work = localizeWork(baseWork, lang, workTranslations);
  const address = `${spot.prefecture}${spot.city}${spot.area}`;
  const code = lang === "ja" ? "" : lang.toLowerCase();
  const backHref = code ? `/seichi/${spot.workId}/${code}` : `/seichi/${spot.workId}`;
  const labels = {
    ja: { back: "の地図へ", map: "Googleマップで開く" },
    en: { back: " map", map: "Open in Google Maps" },
    "zh-CN": { back: "地图", map: "在Google地图中打开" },
    "zh-TW": { back: "地圖", map: "在Google地圖中開啟" },
    ko: { back: " 지도", map: "Google 지도에서 열기" },
    vn: { back: " - bản đồ", map: "Mở trong Google Maps" },
  }[lang];

  return (
    <NavigationLoadingGuard>
      <main className="min-h-screen overflow-x-hidden bg-[#fff7df] px-4 py-7 text-[#171717] sm:px-6">
        <div className="pointer-events-none fixed inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(#ff4f9a 1.5px, transparent 1.5px)", backgroundSize: "18px 18px" }} />
        <article className="relative mx-auto w-full max-w-2xl">
          <Link href={backHref} className="mb-5 inline-flex rounded-full border-4 border-black bg-white px-5 py-2 font-black shadow-[4px_4px_0_#111]">
            ← {work.workTitle}{labels.back}
          </Link>

          <div className="border-4 border-black bg-white shadow-[8px_8px_0_#111]">
            <div className="border-b-4 border-black bg-[#ff6f91] p-5 md:p-7">
              <p className="text-sm font-black tracking-[0.14em]">{work.workTitle}</p>
            </div>

            <div className="p-5 md:p-8">
              <h1 className="text-3xl font-black leading-tight md:text-5xl">{spot.name}</h1>
              {spot.kana && <p className="mt-2 text-sm font-bold text-slate-500">{spot.kana}</p>}
              {address && <p className="mt-4 inline-block border-2 border-black bg-[#ffd83d] px-4 py-2 font-black">{address}</p>}

              {spot.spotsImage && (
                <div className="mt-6 overflow-hidden border-4 border-black bg-[#d9f7ff]">
                  <img src={spot.spotsImage} alt={spot.name} className="h-auto w-full object-cover" />
                </div>
              )}

              {spot.description && (
                <div className="mt-6 whitespace-pre-wrap text-base font-bold leading-8" dangerouslySetInnerHTML={{ __html: spot.description }} />
              )}

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 block border-4 border-black bg-[#57e6d4] px-5 py-3 text-center font-black shadow-[4px_4px_0_#111]"
              >
                {labels.map}
              </a>
            </div>
          </div>
        </article>
      </main>
    </NavigationLoadingGuard>
  );
}
