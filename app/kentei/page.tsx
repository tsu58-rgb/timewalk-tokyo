import type { Metadata } from "next";
import Link from "next/link";

import { kenteiQuestions } from "@/data/kentei/questions";

export const metadata: Metadata = {
  title: "ゆる歴史散歩検定 | TimeWalk",
  description:
    "ゆる歴史散歩検定は、選択式・入力式の問題で歴史知識を確認できる検定ページです。",
};

const formats = [
  { label: "選択式", description: "4択などから正解を選ぶ形式" },
  { label: "入力式", description: "人物名・年号・できごと名を入力する形式" },
  { label: "混合式", description: "選択式と入力式を組み合わせた本番形式" },
];

const categories = ["入門", "江戸", "東京歴史", "人物", "文化史", "スポット"];

export default function KenteiPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
      <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
        <Link href="/" className="text-sm text-blue-400 underline font-bold">
          ← TimeWalkへ
        </Link>

        <header className="text-center my-5">
          <p className="text-xs text-slate-300 mb-1">Yuru Rekishi Sanpo</p>
          <h1 className="text-2xl font-bold">ゆる歴史散歩検定</h1>
          <p className="text-sm text-slate-300 leading-relaxed mt-3">
            歴史の知識を、選択式・入力式の問題で確認できる検定ページです。
          </p>
        </header>

        <section className="bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-700">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h2 className="font-bold">現在の準備状況</h2>
            <span className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold">
              {kenteiQuestions.length}問準備中
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            まずは入門問題から整備し、江戸・東京歴史・人物・文化史・スポットへ広げていきます。
          </p>
        </section>

        <section className="bg-slate-800 rounded-2xl p-4 mb-4">
          <h2 className="font-bold mb-3">出題形式</h2>
          <div className="space-y-2">
            {formats.map((format) => (
              <div key={format.label} className="bg-slate-950 rounded-xl p-3">
                <p className="font-bold text-yellow-300">{format.label}</p>
                <p className="text-sm text-slate-300 mt-1">{format.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-800 rounded-2xl p-4">
          <h2 className="font-bold mb-3">検定カテゴリ案</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="text-xs bg-yellow-300 text-black px-3 py-2 rounded-full font-bold"
              >
                {category}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mt-4">
            将来はカテゴリ別の検定ページを追加し、合格ライン・結果表示・解説を実装します。
          </p>
        </section>
      </div>
    </main>
  );
}
