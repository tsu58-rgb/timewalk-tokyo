"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { UKIYOE_SPOTS_URL, accuracyLabel, parseUkiyoeCsv, type UkiyoeSpot } from "../data";

const QUESTION_COUNT = 10;

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function hasImage(spot: UkiyoeSpot) {
  return Boolean(String(spot.imageUrl || spot.thumbnailUrl || "").trim());
}

export default function UkiyoeGamePage() {
  const [spots, setSpots] = useState<UkiyoeSpot[]>([]);
  const [questions, setQuestions] = useState<UkiyoeSpot[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(UKIYOE_SPOTS_URL)
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.text();
      })
      .then((text) => setSpots(parseUkiyoeCsv(text).filter(hasImage)))
      .catch(() => setError("浮世絵データを取得できませんでした。スプレッドシートの共有または公開設定を確認してください。"));
  }, []);

  const canPlay = spots.length >= 4;
  const current = questions[questionIndex] || null;
  const isLastQuestion = questionIndex >= questions.length - 1;

  function makeChoices(answer: UkiyoeSpot, source = spots) {
    const wrong = shuffle(source.filter((spot) => spot.id !== answer.id))
      .slice(0, 3)
      .map((spot) => spot.placeName);

    setChoices(shuffle([answer.placeName, ...wrong]));
    setSelected(null);
  }

  function startGame(source = spots) {
    if (source.length < 4) return;

    const selectedQuestions = shuffle(source).slice(0, Math.min(QUESTION_COUNT, source.length));
    setQuestions(selectedQuestions);
    setQuestionIndex(0);
    makeChoices(selectedQuestions[0], source);
  }

  function nextQuestion() {
    const nextIndex = questionIndex + 1;
    const next = questions[nextIndex];

    if (!next) return;

    setQuestionIndex(nextIndex);
    makeChoices(next);
  }

  useEffect(() => {
    if (spots.length >= 4 && questions.length === 0) startGame(spots);
  }, [spots]);

  const isCorrect = useMemo(
    () => selected !== null && current !== null && selected === current.placeName,
    [selected, current]
  );

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex flex-wrap gap-3">
          <Link className="rounded-xl border border-amber-300 px-4 py-2 text-sm font-bold text-amber-100" href="/ukiyoe">
            一覧へ
          </Link>
          <Link className="rounded-xl border border-amber-300 px-4 py-2 text-sm font-bold text-amber-100" href="/ukiyoe/map">
            マップへ
          </Link>
        </div>

        <section className="rounded-3xl border border-amber-300/30 bg-slate-900 p-5">
          <p className="text-sm text-amber-300">浮世絵ロケーションクイズ</p>
          <h1 className="mb-2 text-2xl font-bold">この浮世絵、どこ？</h1>
          {current && <p className="mb-4 text-sm text-slate-400">{questionIndex + 1} / {questions.length}問</p>}

          {error && <p className="rounded-xl bg-red-900 p-4">{error}</p>}
          {!error && !canPlay && <p>ゲームには画像付きのデータが4件以上必要です。</p>}

          {current && (
            <>
              <div className="mb-4 rounded-2xl bg-black p-3">
                <img src={current.imageUrl || current.thumbnailUrl} alt="この浮世絵はどこ？" className="max-h-[52vh] w-full object-contain" />
              </div>

              <div className="grid gap-3">
                {choices.map((choice) => {
                  const answered = selected !== null;
                  const correct = choice === current.placeName;
                  return (
                    <button
                      key={choice}
                      onClick={() => setSelected(choice)}
                      disabled={answered}
                      className={`rounded-2xl px-4 py-3 text-left font-bold ${
                        !answered
                          ? "bg-white text-black"
                          : correct
                          ? "bg-green-500 text-white"
                          : selected === choice
                          ? "bg-red-500 text-white"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {selected && (
                <section className="mt-5 rounded-2xl bg-white p-4 text-black">
                  <h2 className="mb-2 text-xl font-bold">{isCorrect ? "正解！" : "不正解"}</h2>
                  <p className="font-bold">正解：{current.placeName} {accuracyLabel(current.accuracy)}</p>
                  <p className="mt-3 leading-7">{current.highlight || current.description}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link className="rounded-xl bg-amber-300 px-4 py-2 font-bold text-black" href={`/ukiyoe/${current.id}`} target="_blank">
                      詳細を見る
                    </Link>
                    {isLastQuestion ? (
                      <button className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white" onClick={() => startGame()}>
                        もう一度10問で遊ぶ
                      </button>
                    ) : (
                      <button className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white" onClick={nextQuestion}>
                        次の問題
                      </button>
                    )}
                  </div>
                </section>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
