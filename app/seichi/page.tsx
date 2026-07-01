import Link from "next/link";

import NavigationLoadingGuard from "../components/NavigationLoadingGuard";
import { fetchWorks } from "../lib/timewalkData";

export const revalidate = 300;

export default async function SeichiPage() {
  const works = await fetchWorks({ revalidateSeconds: 300 });

  return (
    <NavigationLoadingGuard>
      <main className="min-h-screen overflow-x-hidden bg-[#fff7df] px-4 py-8 text-[#171717] sm:px-6 lg:px-8">
        <div className="pointer-events-none fixed inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(#ff4f9a 1.5px, transparent 1.5px)", backgroundSize: "18px 18px" }} />
        <div className="relative mx-auto w-full max-w-5xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="rounded-full border-4 border-black bg-white px-5 py-2 font-black shadow-[4px_4px_0_#111]">
              ← TimeWalk
            </Link>
            <span className="rotate-2 rounded-full border-4 border-black bg-[#57e6d4] px-5 py-2 text-sm font-black shadow-[4px_4px_0_#111]">
              聖地巡礼シリーズ
            </span>
          </div>

          <section className="mb-8 border-4 border-black bg-[#ffd83d] p-6 shadow-[8px_8px_0_#111] md:p-9">
            <p className="mb-2 text-sm font-black tracking-[0.2em]">ANIME・MOVIE・DRAMA LOCATIONS</p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">物語の舞台へ、<br />歩いていこう。</h1>
            <p className="mt-4 max-w-2xl font-bold leading-relaxed">
              アニメ、映画、ドラマに登場した場所を地図で探せます。作品を選んで、実際の街をめぐってみましょう。
            </p>
          </section>

          <div className="grid w-full gap-5 md:grid-cols-2">
            {works.map((work, index) => (
              <Link
                key={work.workId}
                href={`/seichi/${work.workId}`}
                className={`group relative block w-full border-4 border-black p-5 shadow-[6px_6px_0_#111] transition-transform hover:-translate-y-1 ${
                  index % 4 === 0
                    ? "bg-[#ff6f91]"
                    : index % 4 === 1
                      ? "bg-[#65d9ff]"
                      : index % 4 === 2
                        ? "bg-[#a8ef6f]"
                        : "bg-[#caa8ff]"
                }`}
              >
                <span className="absolute right-3 top-3 rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-black">
                  VIEW
                </span>
                <p className="mb-3 text-xs font-black uppercase tracking-widest">WORK {String(index + 1).padStart(2, "0")}</p>
                <h2 className="pr-16 text-2xl font-black leading-snug md:text-3xl">{work.workTitle}</h2>
                <p className="mt-4 line-clamp-3 text-sm font-bold leading-relaxed">{work.workDescription}</p>
                <div className="mt-5 inline-flex items-center rounded-full border-2 border-black bg-white px-4 py-2 font-black group-hover:bg-[#ffd83d]">
                  聖地を見る →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </NavigationLoadingGuard>
  );
}
