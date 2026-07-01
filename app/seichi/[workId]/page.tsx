import Link from "next/link";
import { notFound } from "next/navigation";

import SeichiMapLoader from "../../components/SeichiMapLoader";
import { fetchSpots, fetchWorks } from "../../lib/timewalkData";

export const revalidate = 300;

export default async function SeichiWorkPage({
  params,
}: {
  params: Promise<{ workId: string }>;
}) {
  const { workId } = await params;
  const [works, allSpots] = await Promise.all([
    fetchWorks({ revalidateSeconds: 300 }),
    fetchSpots({ revalidateSeconds: 300, includeWorkSpots: true }),
  ]);

  const work = works.find((item) => item.workId === workId);
  if (!work) notFound();

  const spots = allSpots
    .filter((spot) => spot.workId === workId)
    .sort((a, b) => a.id.localeCompare(b.id));

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff7df] px-4 py-7 text-[#171717]">
      <div className="pointer-events-none fixed inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(45deg, #65d9ff 25%, transparent 25%, transparent 75%, #65d9ff 75%), linear-gradient(45deg, #65d9ff 25%, transparent 25%, transparent 75%, #65d9ff 75%)", backgroundPosition: "0 0, 12px 12px", backgroundSize: "24px 24px" }} />
      <div className="relative mx-auto w-full max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link href="/seichi" className="rounded-full border-4 border-black bg-white px-5 py-2 font-black shadow-[4px_4px_0_#111]">
            ← 作品一覧
          </Link>
          <span className="rounded-full border-4 border-black bg-[#57e6d4] px-5 py-2 text-sm font-black shadow-[4px_4px_0_#111]">
            {spots.length} SPOTS
          </span>
        </div>

        <section className="mb-7 border-4 border-black bg-[#ff6f91] p-6 shadow-[8px_8px_0_#111] md:p-9">
          <p className="mb-2 text-sm font-black tracking-[0.18em]">LOCATION GUIDE</p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">{work.workTitle}</h1>
          <p className="mt-5 max-w-3xl whitespace-pre-wrap font-bold leading-relaxed">{work.workDescription}</p>
        </section>

        <section className="mb-9">
          <div className="mb-3 inline-block -rotate-1 border-4 border-black bg-[#ffd83d] px-5 py-2 text-xl font-black shadow-[4px_4px_0_#111]">
            MAP
          </div>
          {spots.length > 0 ? (
            <SeichiMapLoader spots={spots} />
          ) : (
            <div className="border-4 border-black bg-white p-8 font-black shadow-[6px_6px_0_#111]">スポットはまだ登録されていません。</div>
          )}
        </section>

        <section>
          <div className="mb-4 inline-block rotate-1 border-4 border-black bg-[#a8ef6f] px-5 py-2 text-xl font-black shadow-[4px_4px_0_#111]">
            SPOT LIST
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {spots.map((spot, index) => (
              <Link
                key={spot.id}
                href={`/spot/${spot.id}`}
                className="group overflow-hidden border-4 border-black bg-white shadow-[6px_6px_0_#111] transition-transform hover:-translate-y-1"
              >
                {spot.spotsImage ? (
                  <div className="aspect-[16/10] overflow-hidden border-b-4 border-black bg-[#d9f7ff]">
                    <img src={spot.spotsImage} alt={spot.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center border-b-4 border-black bg-[#d9f7ff] text-5xl font-black">{String(index + 1).padStart(2, "0")}</div>
                )}
                <div className="p-5">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border-3 border-black bg-[#ffd83d] font-black">
                    {index + 1}
                  </div>
                  {spot.kana && <p className="text-xs font-bold text-slate-500">{spot.kana}</p>}
                  <h2 className="text-2xl font-black leading-snug">{spot.name}</h2>
                  <p className="mt-2 text-sm font-bold text-slate-600">{spot.prefecture}{spot.city}{spot.area}</p>
                  <div className="mt-4 inline-flex rounded-full border-3 border-black bg-[#caa8ff] px-4 py-2 font-black">
                    詳細を見る →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
