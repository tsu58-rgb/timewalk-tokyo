"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { UKIYOE_SPOTS_URL, parseUkiyoeCsv, type UkiyoeSpot } from "../data";

const UkiyoeMap = dynamic(() => import("../UkiyoeMap"), { ssr: false });

export default function UkiyoeMapPage() {
  const [spots, setSpots] = useState<UkiyoeSpot[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(UKIYOE_SPOTS_URL)
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.text();
      })
      .then((text) => setSpots(parseUkiyoeCsv(text)))
      .catch(() => setError("浮世絵データを取得できませんでした。スプレッドシートの共有または公開設定を確認してください。"));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-amber-300">TimeWalk 浮世絵</p>
            <h1 className="text-2xl font-bold">浮世絵マップ</h1>
            <p className="mt-1 text-sm text-slate-300">ピンを選択すると作品詳細を開けます。</p>
          </div>
          <Link className="rounded-xl border border-amber-300 px-4 py-2 text-sm font-bold text-amber-100" href="/ukiyoe">
            一覧へ戻る
          </Link>
        </div>
        {error ? <p className="rounded-xl bg-red-900 p-4">{error}</p> : <UkiyoeMap spots={spots} />}
      </div>
    </main>
  );
}
