import Link from "next/link";
import HtmlLangSetter from "./HtmlLangSetter";
import NavigationLoadingGuard from "./NavigationLoadingGuard";
import SeichiLanguageSwitcher from "./SeichiLanguageSwitcher";
import SeichiMapSection from "./SeichiMapSection";
import type { Language, Spot, Work } from "@/types/timewalk";
import type { SupportedLanguage } from "../lib/seichiI18nData";
import { htmlLanguageCode } from "../lib/seichiSeo";

const textByLanguage = {
  ja: ["作品一覧", "MAP", "SPOT LIST", "詳細を見る ↗"],
  en: ["Works", "MAP", "SPOT LIST", "View details ↗"],
  "zh-CN": ["作品列表", "地图", "地点列表", "查看详情 ↗"],
  "zh-TW": ["作品列表", "地圖", "地點列表", "查看詳情 ↗"],
  ko: ["작품 목록", "지도", "장소 목록", "상세 보기 ↗"],
  vn: ["Danh sách tác phẩm", "BẢN ĐỒ", "DANH SÁCH ĐỊA ĐIỂM", "Xem chi tiết ↗"],
};

export default function SeichiWorkPageView({ work, spots, lang, languages }: {
  work: Work & { h1?: string; leadText?: string };
  spots: Spot[];
  lang: SupportedLanguage;
  languages: Language[];
}) {
  const labels = textByLanguage[lang];
  const code = lang === "ja" ? "" : lang.toLowerCase();
  const detailHref = (spotId: string) => code ? `/spot/${spotId}/${code}` : `/spot/${spotId}`;

  return (
    <NavigationLoadingGuard>
      <HtmlLangSetter lang={htmlLanguageCode(lang)} />
      <main className="min-h-screen bg-[#fff7df] px-4 py-7 text-[#171717] sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <Link href={code ? `/seichi/${code}` : "/seichi"} className="rounded-full border-4 border-black bg-white px-5 py-2 font-black shadow-[4px_4px_0_#111]">← {labels[0]}</Link>
            <span className="rounded-full border-4 border-black bg-[#57e6d4] px-5 py-2 text-sm font-black shadow-[4px_4px_0_#111]">{spots.length} SPOTS</span>
          </div>

          <SeichiLanguageSwitcher currentLanguage={lang} workId={work.workId} languages={languages} />

          <section className="mb-7 border-4 border-black bg-[#ff6f91] p-6 shadow-[8px_8px_0_#111] md:p-9">
            <p className="mb-2 text-sm font-black tracking-[0.18em]">LOCATION GUIDE</p>
            <h1 className="text-4xl font-black md:text-6xl">{work.h1 || work.workTitle}</h1>
            <p className="mt-5 whitespace-pre-wrap font-bold leading-relaxed">{work.leadText || work.workDescription}</p>
          </section>

          <SeichiMapSection spots={spots} lang={lang} label={labels[1]} />

          <section>
            <div className="mb-4 inline-block border-4 border-black bg-[#a8ef6f] px-5 py-2 text-xl font-black shadow-[4px_4px_0_#111]">{labels[2]}</div>
            <div className="grid gap-4 md:grid-cols-2">
              {spots.map((spot, index) => (
                <Link
                  key={spot.id}
                  href={detailHref(spot.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid min-h-0 grid-cols-[minmax(0,1fr)_104px] overflow-hidden border-4 border-black bg-white shadow-[5px_5px_0_#111] sm:grid-cols-[minmax(0,1fr)_128px]"
                >
                  <div className="flex min-w-0 flex-col p-3 sm:p-4">
                    {spot.kana && <p className="truncate text-[11px] font-bold leading-tight text-slate-500">{spot.kana}</p>}
                    <h2 className="line-clamp-2 text-base font-black leading-snug sm:text-lg">{spot.name}</h2>
                    <p className="mt-1 line-clamp-1 text-[11px] font-bold leading-tight text-slate-600 sm:text-xs">{spot.prefecture}{spot.city}{spot.area}</p>
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <span className="text-[11px] font-black leading-none sm:text-xs">{labels[3]}</span>
                      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-black bg-[#ffd83d] text-sm font-black">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  <div className="border-l-4 border-black bg-[#d9f7ff]">
                    {spot.spotsImage ? (
                      <img src={spot.spotsImage} alt={spot.name} className="h-full min-h-28 w-full object-cover" />
                    ) : (
                      <div className="flex h-full min-h-28 items-center justify-center text-3xl font-black">{index + 1}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </NavigationLoadingGuard>
  );
}
