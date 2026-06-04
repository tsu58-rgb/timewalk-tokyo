import type { Metadata } from "next";
import Link from "next/link";

import { timeFlowChallenges } from "@/data/games/timeflow/challenges";

export const metadata: Metadata = {
  title: "ゆる歴史散歩ゲーム | TimeWalk",
  description:
    "ゆる歴史散歩ゲームは、歴史を遊びながら学べるTimeWalkのゲーム一覧ページです。",
};

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
      <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
        <Link href="/" className="text-sm text-blue-400 underline font-bold">
          ← TimeWalkへ
        </Link>

        <header className="text-center my-5">
          <p className="text-xs text-slate-300 mb-1">Yuru Rekishi Sanpo</p>
          <h1 className="text-2xl font-bold">ゆる歴史散歩ゲーム</h1>
          <p className="text-sm text-slate-300 leading-relaxed mt-3">
            歴史をカード・クイズ・物語でゆるく楽しむゲーム集です。
          </p>
        </header>

        <section className="bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-700">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs text-yellow-300 font-bold mb-1">公開中</p>
              <h2 className="text-xl font-bold">TimeFlow</h2>
            </div>
            <span className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold">
              {timeFlowChallenges.length}問
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            歴史カードを古い順に並べて、時代の流れをつかむゲームです。
          </p>

          <Link
            href="/games/timeflow"
            className="block w-full bg-yellow-300 text-black text-center py-3 rounded-xl font-bold"
          >
            TimeFlowで遊ぶ
          </Link>
        </section>

        <section className="bg-slate-800 rounded-2xl p-4">
          <h2 className="font-bold mb-3">今後追加予定</h2>
          <div className="space-y-2 text-sm text-slate-300">
            <p className="bg-slate-950 rounded-xl p-3">ミニRPG：歴史人物やスポットをめぐる物語ゲーム</p>
            <p className="bg-slate-950 rounded-xl p-3">カードゲーム：歴史カードを集めて遊ぶモード</p>
            <p className="bg-slate-950 rounded-xl p-3">クイズゲーム：検定より軽く楽しめる歴史クイズ</p>
          </div>
        </section>
      </div>
    </main>
  );
}
