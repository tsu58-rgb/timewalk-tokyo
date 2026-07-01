import Link from "next/link";

import HtmlLangSetter from "./HtmlLangSetter";
import NavigationLoadingGuard from "./NavigationLoadingGuard";
import SeichiLanguageSwitcher from "./SeichiLanguageSwitcher";
import type { Language, Work } from "@/types/timewalk";
import type { SupportedLanguage } from "../lib/seichiI18nData";
import { htmlLanguageCode } from "../lib/seichiSeo";

export default function SeichiWorksIndex({
  works,
  lang,
  languages,
}: {
  works: Work[];
  lang: SupportedLanguage;
  languages: Language[];
}) {
  const pathCode = lang === "ja" ? "" : lang.toLowerCase();
  const labels = {
    ja: {
      eyebrow: "ANIME・MOVIE・DRAMA LOCATIONS",
      title: "物語の舞台へ、\n歩いていこう。",
      lead: "アニメ、映画、ドラマに登場した場所を地図で探せます。作品を選んで、実際の街をめぐってみましょう。",
      view: "聖地を見る →",
      badge: "聖地巡礼シリーズ",
    },
    en: {
      eyebrow: "ANIME・MOVIE・DRAMA LOCATIONS",
      title: "Walk into the places\nbehind the stories.",
      lead: "Explore real locations featured in anime, films and dramas. Choose a title and start your pilgrimage.",
      view: "View locations →",
      badge: "Pilgrimage Guide",
    },
    "zh-CN": {
      eyebrow: "动漫・电影・电视剧取景地",
      title: "走进故事发生的地方。",
      lead: "在地图上探索动漫、电影和电视剧中的真实取景地。请选择作品并开始巡礼。",
      view: "查看取景地 →",
      badge: "圣地巡礼",
    },
    "zh-TW": {
      eyebrow: "動畫・電影・電視劇取景地",
      title: "走進故事發生的地方。",
      lead: "在地圖上探索動畫、電影和電視劇中的真實取景地。請選擇作品並開始巡禮。",
      view: "查看取景地 →",
      badge: "聖地巡禮",
    },
    ko: {
      eyebrow: "애니메이션・영화・드라마 촬영지",
      title: "이야기의 무대로\n걸어가 보세요.",
      lead: "애니메이션, 영화, 드라마에 등장한 실제 장소를 지도에서 찾아보세요.",
      view: "성지 보기 →",
      badge: "성지순례",
    },
    vn: {
      eyebrow: "ĐỊA ĐIỂM ANIME・PHIM・PHIM TRUYỀN HÌNH",
      title: "Bước vào những nơi\ntrong câu chuyện.",
      lead: "Khám phá các địa điểm có thật xuất hiện trong anime, phim điện ảnh và phim truyền hình.",
      view: "Xem địa điểm →",
      badge: "Hành hương tác phẩm",
    },
  }[lang];

  return (
    <NavigationLoadingGuard>
      <HtmlLangSetter lang={htmlLanguageCode(lang)} />
      <main className="min-h-screen overflow-x-hidden bg-[#fff7df] px-4 py-8 text-[#171717] sm:px-6 lg:px-8">
        <div className="pointer-events-none fixed inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(#ff4f9a 1.5px, transparent 1.5px)", backgroundSize: "18px 18px" }} />
        <div className="relative mx-auto w-full max-w-5xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="rounded-full border-4 border-black bg-white px-5 py-2 font-black shadow-[4px_4px_0_#111]">← TimeWalk</Link>
            <span className="rotate-2 rounded-full border-4 border-black bg-[#57e6d4] px-5 py-2 text-sm font-black shadow-[4px_4px_0_#111]">{labels.badge}</span>
          </div>

          <SeichiLanguageSwitcher currentLanguage={lang} languages={languages} />

          <section className="mb-8 border-4 border-black bg-[#ffd83d] p-6 shadow-[8px_8px_0_#111] md:p-9">
            <p className="mb-2 text-sm font-black tracking-[0.2em]">{labels.eyebrow}</p>
            <h1 className="whitespace-pre-line text-4xl font-black leading-tight md:text-6xl">{labels.title}</h1>
            <p className="mt-4 max-w-2xl font-bold leading-relaxed">{labels.lead}</p>
          </section>

          <div className="grid w-full gap-5 md:grid-cols-2">
            {works.map((work, index) => (
              <Link
                key={work.workId}
                href={pathCode ? `/seichi/${work.workId}/${pathCode}` : `/seichi/${work.workId}`}
                className={`group relative block w-full border-4 border-black p-5 shadow-[6px_6px_0_#111] transition-transform hover:-translate-y-1 ${
                  index % 4 === 0 ? "bg-[#ff6f91]" : index % 4 === 1 ? "bg-[#65d9ff]" : index % 4 === 2 ? "bg-[#a8ef6f]" : "bg-[#caa8ff]"
                }`}
              >
                <p className="mb-3 text-xs font-black uppercase tracking-widest">WORK {String(index + 1).padStart(2, "0")}</p>
                <h2 className="pr-8 text-2xl font-black leading-snug md:text-3xl">{work.workTitle}</h2>
                <p className="mt-4 line-clamp-3 text-sm font-bold leading-relaxed">{work.workDescription}</p>
                <div className="mt-5 inline-flex items-center rounded-full border-2 border-black bg-white px-4 py-2 font-black group-hover:bg-[#ffd83d]">{labels.view}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </NavigationLoadingGuard>
  );
}
