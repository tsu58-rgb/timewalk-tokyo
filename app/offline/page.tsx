import Link from "next/link";

export const metadata = {
  title: "オフライン｜TimeWalk",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-yellow-300 text-2xl font-black text-yellow-300">
          TW
        </div>
        <h1 className="text-2xl font-black">現在オフラインです</h1>
        <p className="mt-4 leading-7 text-slate-300">
          通信状況を確認してから、もう一度読み込んでください。一度表示したページは端末に残っている場合があります。
        </p>
        <div className="mt-8 grid gap-3">
          <Link
            href="/"
            className="rounded-xl bg-yellow-300 px-5 py-3 font-black text-slate-950"
          >
            TimeWalkトップへ
          </Link>
          <Link
            href="/courses"
            className="rounded-xl border border-slate-500 px-5 py-3 font-bold text-white"
          >
            散歩コース一覧へ
          </Link>
        </div>
      </div>
    </main>
  );
}
