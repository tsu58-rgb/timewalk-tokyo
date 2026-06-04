import type { Metadata } from "next";
import Link from "next/link";

import { timeFlowChallenges } from "@/data/games/timeflow/challenges";
import { historyEvents } from "@/data/history/events";
import { kenteiQuestions } from "@/data/kentei/questions";

export const metadata: Metadata = {
  title: "ゆる歴史散歩ゲーム | TimeWalk",
  description:
    "ゆる歴史散歩ゲームは、歴史をカード・クイズ・物語でゆるく楽しめるTimeWalkのゲームポータルです。",
};

const plannedGames = [
  {
    title: "歴史ミニRPG",
    description: "歴史人物やスポットをめぐる物語ゲーム。",
  },
  {
    title: "歴史カード図鑑",
    description: "TimeFlowのカードを集めて眺めるコレクション機能。",
  },
  {
    title: "街歩きミッション",
    description: "TimeWalkのスポット訪問と連動するチャレンジ。",
  },
];

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
            歴史をカード・クイズ・物語でゆるく楽しむゲームポータルです。
          </p>
        </header>

        <section className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-slate-800 rounded-2xl p-3">
            <p className="text-xl font-bold text-yellow-300">{historyEvents.length}</p>
            <p className="text-xs text-slate-300">歴史カード</p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-3">
            <p className="text-xl font-bold text-yellow-300">{timeFlowChallenges.length}</p>
            <p className="text-xs text-slate-300">TimeFlow</p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-3">
            <p className="text-xl font-bold text-yellow-300">{kenteiQuestions.length}</p>
            <p className="text-xs text-slate-300">検定問題</p>
          </div>
        </section>

        <section className="bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-700">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs text-yellow-300 font-bold mb-1">公開中</p>
              <h2 className="text-xl font-bold">TimeFlow</h2>
            </div>
            <span className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold">
              5段階
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {historyEvents.length}枚の歴史カードから出題。カードを古い順に並べて、時代の流れをつかむゲームです。
          </p>

          <Link
            href="/games/timeflow"
            className="block w-full bg-yellow-300 text-black text-center py-3 rounded-xl font-bold"
          >
            TimeFlowで遊ぶ
          </Link>
        </section>

        <section className="bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-700">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs text-purple-300 font-bold mb-1">検定</p>
              <h2 className="text-xl font-bold">ゆる歴史散歩検定</h2>
            </div>
            <span className="text-xs bg-purple-300 text-black px-2 py-1 rounded-full font-bold">
              {kenteiQuestions.length}問
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            選択式・入力式の問題で、歴史知識を5段階の難易度でチェックできます。
          </p>

          <Link
            href="/kentei"
            className="block w-full bg-purple-500 text-white text-center py-3 rounded-xl font-bold"
          >
            検定に挑戦する
          </Link>
        </section>

        <section className="bg-slate-800 rounded-2xl p-4">
          <h2 className="font-bold mb-3">今後追加予定</h2>
          <div className="space-y-2 text-sm text-slate-300">
            {plannedGames.map((game) => (
              <div key={game.title} className="bg-slate-950 rounded-xl p-3">
                <p className="font-bold text-slate-100">{game.title}</p>
                <p className="text-xs text-slate-400 mt-1">{game.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
