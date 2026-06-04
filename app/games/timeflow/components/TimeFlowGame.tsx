"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { timeFlowChallenges } from "@/data/games/timeflow/challenges";
import { historyEvents } from "@/data/history/events";
import type { TimeFlowChallenge } from "@/types/games";
import type { HistoryEvent } from "@/types/history";

type AnswerResult = {
  correct: boolean;
  message: string;
};

const difficultyLabels: Record<TimeFlowChallenge["difficulty"], string> = {
  1: "レベル1",
  2: "レベル2",
  3: "レベル3",
  4: "レベル4",
  5: "レベル5",
};

function getEventsByIds(eventIds: string[]) {
  return eventIds
    .map((id) => historyEvents.find((event) => event.id === id))
    .filter((event): event is HistoryEvent => Boolean(event));
}

function rotateEvents(events: HistoryEvent[], offset: number) {
  if (events.length === 0) return events;
  const normalizedOffset = offset % events.length;
  return [...events.slice(normalizedOffset), ...events.slice(0, normalizedOffset)];
}

function getCorrectOrder(events: HistoryEvent[]) {
  return [...events].sort((a, b) => a.year - b.year);
}

export default function TimeFlowGame() {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [clearedChallengeIds, setClearedChallengeIds] = useState<string[]>([]);

  const challenge = timeFlowChallenges[challengeIndex];

  const challengeEvents = useMemo(
    () => getEventsByIds(challenge.eventIds),
    [challenge.eventIds]
  );

  const shuffledEvents = useMemo(
    () => rotateEvents(challengeEvents, challengeIndex + 1),
    [challengeEvents, challengeIndex]
  );

  const selectedEvents = selectedEventIds
    .map((id) => challengeEvents.find((event) => event.id === id))
    .filter((event): event is HistoryEvent => Boolean(event));

  const remainingEvents = shuffledEvents.filter(
    (event) => !selectedEventIds.includes(event.id)
  );

  const isLastChallenge = challengeIndex === timeFlowChallenges.length - 1;

  function selectEvent(eventId: string) {
    if (selectedEventIds.includes(eventId) || result?.correct) return;

    setSelectedEventIds((current) => [...current, eventId]);
    setResult(null);
  }

  function removeSelectedEvent(eventId: string) {
    if (result?.correct) return;

    setSelectedEventIds((current) => current.filter((id) => id !== eventId));
    setResult(null);
  }

  function resetChallenge() {
    setSelectedEventIds([]);
    setShowHint(false);
    setResult(null);
  }

  function checkAnswer() {
    if (selectedEventIds.length !== challengeEvents.length) {
      setResult({
        correct: false,
        message: "まだ歴史の流れが完成していないよ。すべてのカードを選んでね。",
      });
      return;
    }

    const correctIds = getCorrectOrder(challengeEvents).map((event) => event.id);
    const correct = selectedEventIds.every((id, index) => id === correctIds[index]);

    if (correct) {
      setClearedChallengeIds((current) =>
        current.includes(challenge.id) ? current : [...current, challenge.id]
      );
      setResult({
        correct: true,
        message: challenge.clearMessage,
      });
      setShowHint(false);
      return;
    }

    setResult({
      correct: false,
      message: "惜しい！年代の小さい出来事から順番に、歴史の流れを見直してみよう。",
    });
  }

  function goToNextChallenge() {
    setChallengeIndex((current) => Math.min(current + 1, timeFlowChallenges.length - 1));
    resetChallenge();
  }

  function chooseChallenge(index: number) {
    setChallengeIndex(index);
    resetChallenge();
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
      <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link href="/games" className="text-sm text-blue-400 underline font-bold">
            ← ゲーム一覧へ
          </Link>
          <p className="text-xs text-yellow-300 font-bold">
            クリア {clearedChallengeIds.length}/{timeFlowChallenges.length}
          </p>
        </div>

        <header className="text-center mb-5">
          <p className="text-xs text-slate-300 mb-1">ゆる歴史散歩ゲーム</p>
          <h1 className="text-2xl font-bold leading-tight">
            TimeFlow
            <br />
            歴史の流れチャレンジ
          </h1>
        </header>

        <section className="bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-700">
          <div className="flex gap-3 items-start">
            <div className="shrink-0 w-14 h-14 rounded-full bg-yellow-300 text-black flex items-center justify-center text-2xl font-bold border-2 border-white">
              流
            </div>
            <div>
              <p className="text-sm text-yellow-300 font-bold mb-1">TimeFlow</p>
              <p className="text-sm text-slate-100 leading-relaxed">
                100枚の歴史カードから出題。古い順に並べて、時代の流れをつかもう。
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-800 rounded-2xl p-4 mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold">
              {difficultyLabels[challenge.difficulty]}
            </span>
            <span className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded-full font-bold">
              {challengeIndex + 1}/{timeFlowChallenges.length}問目
            </span>
          </div>

          <h2 className="text-xl font-bold mb-2">{challenge.title}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{challenge.description}</p>
        </section>

        <section className="mb-4">
          <h2 className="font-bold mb-2">あなたの歴史の流れ</h2>
          <div className="space-y-2">
            {Array.from({ length: challengeEvents.length }).map((_, index) => {
              const event = selectedEvents[index];

              return (
                <button
                  key={`${challenge.id}-slot-${index}`}
                  type="button"
                  onClick={() => event && removeSelectedEvent(event.id)}
                  className={`w-full text-left rounded-2xl p-3 border ${
                    event
                      ? "bg-blue-500 border-blue-300 text-white"
                      : "bg-slate-800 border-dashed border-slate-600 text-slate-400"
                  }`}
                >
                  <span className="text-xs font-bold mr-2">{index + 1}</span>
                  {event ? (
                    <>
                      <span className="font-bold">{event.title}</span>
                      <span className="block text-xs opacity-90 mt-1">
                        タップで外す
                      </span>
                    </>
                  ) : (
                    <span>カードを選択</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="bg-slate-800 rounded-2xl p-4 mb-4">
          <h2 className="font-bold mb-3">歴史カード</h2>
          {remainingEvents.length === 0 ? (
            <p className="text-sm text-slate-400">すべてのカードを歴史の流れに入れたよ。</p>
          ) : (
            <div className="space-y-2">
              {remainingEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => selectEvent(event.id)}
                  className="w-full text-left bg-slate-950 rounded-2xl p-3 border border-slate-600 active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{event.title}</p>
                      <p className="text-xs text-slate-300 leading-relaxed mt-1">
                        {event.shortText}
                      </p>
                    </div>
                    <span className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold whitespace-nowrap">
                      {event.era}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {showHint && (
          <section className="bg-yellow-100 text-black rounded-2xl p-4 mb-4">
            <h2 className="font-bold mb-2">TimeFlow ヒント</h2>
            <p className="text-sm leading-relaxed">{challenge.hint}</p>
          </section>
        )}

        {result && (
          <section
            className={`rounded-2xl p-4 mb-4 ${
              result.correct ? "bg-green-500 text-white" : "bg-red-900 text-white"
            }`}
          >
            <h2 className="font-bold mb-2">
              {result.correct ? "正解！" : "もう一度チャレンジ"}
            </h2>
            <p className="text-sm leading-relaxed">{result.message}</p>

            {result.correct && (
              <div className="mt-3 bg-white/15 rounded-xl p-3">
                <p className="text-sm font-bold mb-2">正しい歴史の流れ</p>
                <ol className="space-y-1 text-sm">
                  {getCorrectOrder(challengeEvents).map((event) => (
                    <li key={`${event.id}-answer`}>
                      {event.year}年：{event.title}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={checkAnswer}
            className="bg-yellow-300 text-black py-3 rounded-xl font-bold"
          >
            答え合わせ
          </button>
          <button
            type="button"
            onClick={() => setShowHint((current) => !current)}
            className="bg-slate-700 text-white py-3 rounded-xl font-bold"
          >
            {showHint ? "ヒントを隠す" : "ヒント"}
          </button>
          <button
            type="button"
            onClick={resetChallenge}
            className="bg-slate-700 text-white py-3 rounded-xl font-bold"
          >
            リセット
          </button>
          <button
            type="button"
            onClick={goToNextChallenge}
            disabled={!result?.correct || isLastChallenge}
            className={`py-3 rounded-xl font-bold ${
              result?.correct && !isLastChallenge
                ? "bg-blue-500 text-white"
                : "bg-slate-800 text-slate-500"
            }`}
          >
            次へ
          </button>
        </div>

        <section className="bg-slate-800 rounded-2xl p-4">
          <h2 className="font-bold mb-3">チャレンジ選択</h2>
          <div className="space-y-2">
            {timeFlowChallenges.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => chooseChallenge(index)}
                className={`w-full text-left px-3 py-3 rounded-xl font-bold ${
                  index === challengeIndex
                    ? "bg-blue-500 text-white"
                    : "bg-slate-700 text-slate-200"
                }`}
              >
                {clearedChallengeIds.includes(item.id) ? "✅ " : ""}
                {item.title}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
