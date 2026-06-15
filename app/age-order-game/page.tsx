"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

const CHARACTERS_URL =
  "https://docs.google.com/spreadsheets/d/1n4QdAy6VGmgirzgAPNTFxTsSgjHjin3gxoAAHyVyurY/gviz/tq?tqx=out:csv&sheet=characters";

type Character = {
  characterId: string;
  characterName: string;
  characterKana: string;
  characterDescription: string;
  characterYears: string;
  characterImage: string;
  wikipediaUrl: string;
  shortDescription: string;
  birthYear: number;
};

function parseBirthYear(value: string, years: string) {
  const direct = Number(String(value || "").trim());
  if (Number.isFinite(direct) && direct !== 0) return direct;
  const match = String(years || "").match(/-?\d{3,4}/);
  return match ? Number(match[0]) : NaN;
}

function cleanHtml(value: string) {
  return String(value || "").replace(/<[^>]*>/g, "").trim();
}

function shuffle<T>(items: T[]) {
  const copied = [...items];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

export default function AgeOrderGamePage() {
  const [pool, setPool] = useState<Character[]>([]);
  const [lineup, setLineup] = useState<Character[]>([]);
  const [current, setCurrent] = useState<Character | null>(null);
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${CHARACTERS_URL}&cacheBust=${Date.now()}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`人物データを取得できませんでした: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        const parsed = Papa.parse<Record<string, string>>(text, {
          header: true,
          skipEmptyLines: true,
        });

        const characters = (parsed.data || [])
          .map((row) => ({
            characterId: row.characterId || "",
            characterName: row.characterName || "",
            characterKana: row.characterKana || "",
            characterDescription: row.characterDescription || "",
            characterYears: row.characterYears || "",
            characterImage: row.characterImage || "",
            wikipediaUrl: row.wikipediaUrl || "",
            shortDescription: row.shortDescription || "",
            birthYear: parseBirthYear(row.birthYear || "", row.characterYears || ""),
          }))
          .filter(
            (item) =>
              item.characterId &&
              item.characterName &&
              item.characterImage &&
              Number.isFinite(item.birthYear)
          );

        if (characters.length < 2) {
          throw new Error("ゲームに必要な人物データが足りません。");
        }

        setPool(shuffle(characters));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err instanceof Error ? err.message : "人物データの読み込みに失敗しました。");
        setLoading(false);
      });
  }, []);

  const remaining = useMemo(
    () => pool.filter((item) => !usedIds.has(item.characterId)),
    [pool, usedIds]
  );

  function drawNext(nextUsedIds: Set<string>) {
    const candidates = pool.filter((item) => !nextUsedIds.has(item.characterId));
    if (candidates.length === 0) {
      setCurrent(null);
      setGameOver(true);
      return;
    }
    setCurrent(candidates[Math.floor(Math.random() * candidates.length)]);
    setRevealed(false);
    setLastCorrect(null);
  }

  function startGame() {
    if (pool.length < 2) return;
    const first = pool[Math.floor(Math.random() * pool.length)];
    const nextUsedIds = new Set<string>([first.characterId]);
    setLineup([first]);
    setUsedIds(nextUsedIds);
    setScore(0);
    setGameOver(false);
    setRevealed(false);
    setLastCorrect(null);
    const candidates = pool.filter((item) => item.characterId !== first.characterId);
    setCurrent(candidates[Math.floor(Math.random() * candidates.length)]);
  }

  function choosePosition(index: number) {
    if (!current || revealed || gameOver) return;

    const left = lineup[index - 1];
    const right = lineup[index];
    const correctLeft = !left || left.birthYear <= current.birthYear;
    const correctRight = !right || current.birthYear <= right.birthYear;
    const correct = correctLeft && correctRight;

    setRevealed(true);
    setLastCorrect(correct);

    if (!correct) {
      setGameOver(true);
      return;
    }

    const newLineup = [...lineup];
    newLineup.splice(index, 0, current);
    const nextUsedIds = new Set(usedIds);
    nextUsedIds.add(current.characterId);
    setLineup(newLineup);
    setUsedIds(nextUsedIds);
    setScore((value) => value + 1);

    window.setTimeout(() => drawNext(nextUsedIds), 800);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-4 flex items-center justify-center">
        <p>人物データを読み込んでいます...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-4 flex items-center justify-center">
        <div className="max-w-md rounded-2xl bg-red-950 p-5">{error}</div>
      </main>
    );
  }

  if (lineup.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-4 flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border-4 border-white bg-slate-900 p-6 text-center">
          <p className="mb-2 text-sm text-yellow-300">歴史人物を生まれた順に並べよう</p>
          <h1 className="mb-5 text-3xl font-black">年上年下ゲーム</h1>
          <p className="mb-6 text-sm leading-7 text-slate-300">
            左ほど早く生まれた人物、右ほど遅く生まれた人物になるようにカードを置きます。1回でも間違えると終了です。
          </p>
          <button onClick={startGame} className="w-full rounded-2xl bg-yellow-300 px-5 py-4 text-lg font-black text-black">
            ゲーム開始
          </button>
          <p className="mt-4 text-xs text-slate-500">使用可能人物：{pool.length}名</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-3 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">年上年下ゲーム</h1>
            <p className="text-xs text-slate-400">左＝早く生まれた　右＝遅く生まれた</p>
          </div>
          <div className="rounded-2xl bg-yellow-300 px-4 py-2 text-center text-black">
            <div className="text-xs font-bold">スコア</div>
            <div className="text-2xl font-black">{score}</div>
          </div>
        </header>

        {current && (
          <section className="mb-5 rounded-3xl border-2 border-yellow-300 bg-slate-900 p-4">
            <p className="mb-3 text-center text-sm font-bold text-yellow-300">
              この人物を、下のどこに置きますか？
            </p>
            <div className="mx-auto max-w-sm overflow-hidden rounded-2xl bg-white text-black shadow-xl">
              <img src={current.characterImage} alt={current.characterName} className="h-56 w-full object-contain bg-slate-100" />
              <div className="p-4 text-center">
                <p className="text-xs text-slate-500">{current.characterKana}</p>
                <h2 className="text-2xl font-black">{current.characterName}</h2>
                {!revealed ? (
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {current.shortDescription || cleanHtml(current.characterDescription).slice(0, 70) || "歴史上の人物です。"}
                  </p>
                ) : (
                  <div className="mt-3 rounded-xl bg-slate-900 p-3 text-left text-white">
                    <p className="text-center text-xl font-black text-yellow-300">{current.birthYear}年生まれ</p>
                    {current.characterYears && <p className="mt-1 text-center text-xs text-slate-300">{current.characterYears}</p>}
                    <p className="mt-3 text-sm leading-6">{cleanHtml(current.characterDescription)}</p>
                    {current.wikipediaUrl && (
                      <a href={current.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="mt-3 block text-center text-sm text-blue-300 underline">
                        詳細を見る
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="overflow-x-auto pb-4">
          <div className="flex min-w-max items-stretch gap-2 px-2">
            {Array.from({ length: lineup.length + 1 }).map((_, index) => (
              <div key={`slot-${index}`} className="flex items-center gap-2">
                <button
                  onClick={() => choosePosition(index)}
                  disabled={revealed || gameOver}
                  className="h-36 w-12 shrink-0 rounded-2xl border-2 border-dashed border-yellow-300 bg-yellow-300/10 text-2xl font-black text-yellow-300 disabled:opacity-30"
                  aria-label={`${index + 1}番目に置く`}
                >
                  ＋
                </button>
                {index < lineup.length && (
                  <article className="w-36 shrink-0 overflow-hidden rounded-2xl bg-white text-black shadow-lg">
                    <img src={lineup[index].characterImage} alt={lineup[index].characterName} className="h-28 w-full object-contain bg-slate-100" />
                    <div className="p-3 text-center">
                      <h3 className="font-black leading-tight">{lineup[index].characterName}</h3>
                      <p className="mt-2 text-sm font-black text-red-700">{lineup[index].birthYear}年</p>
                    </div>
                  </article>
                )}
              </div>
            ))}
          </div>
        </section>

        {lastCorrect === true && !gameOver && (
          <p className="mt-2 rounded-2xl bg-green-800 p-3 text-center font-black">正解！ 次の人物へ進みます。</p>
        )}

        {gameOver && (
          <section className="mt-5 rounded-3xl border-2 border-red-400 bg-red-950 p-5 text-center">
            <h2 className="text-3xl font-black">ゲーム終了</h2>
            <p className="mt-2 text-lg">スコア：{score}</p>
            {current && lastCorrect === false && (
              <p className="mt-3 text-sm text-red-100">{current.characterName}は{current.birthYear}年生まれです。</p>
            )}
            {remaining.length === 0 && <p className="mt-3 text-sm">全人物を並べ切りました。</p>}
            <button onClick={startGame} className="mt-5 w-full max-w-sm rounded-2xl bg-white px-5 py-4 font-black text-black">
              もう一度遊ぶ
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
