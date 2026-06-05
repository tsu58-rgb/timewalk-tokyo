"use client";

import { useEffect, useMemo, useState } from "react";
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

function moveItem(items: string[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return items;
  if (fromIndex >= items.length || toIndex >= items.length) return items;

  const next = [...items];
  const [movedItem] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, movedItem);
  return next;
}

export default function TimeFlowGame() {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [orderedEventIds, setOrderedEventIds] = useState<string[]>([]);
  const [draggingEventId, setDraggingEventId] = useState<string | null>(null);
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

  const orderedEvents = orderedEventIds
    .map((id) => challengeEvents.find((event) => event.id === id))
    .filter((event): event is HistoryEvent => Boolean(event));

  const correctIds = useMemo(
    () => getCorrectOrder(challengeEvents).map((event) => event.id),
    [challengeEvents]
  );

  const isLastChallenge = challengeIndex === timeFlowChallenges.length - 1;

  useEffect(() => {
    setOrderedEventIds(shuffledEvents.map((event) => event.id));
    setDraggingEventId(null);
    setResult(null);
  }, [shuffledEvents]);

  function resetChallenge() {
    setOrderedEventIds(shuffledEvents.map((event) => event.id));
    setDraggingEventId(null);
    setResult(null);
  }

  function checkAnswer() {
    const correct = orderedEventIds.every((id, index) => id === correctIds[index]);

    if (correct) {
      setClearedChallengeIds((current) =>
        current.includes(challenge.id) ? current : [...current, challenge.id]
      );
      setResult({
        correct: true,
        message: challenge.clearMessage,
      });
      return;
    }

    setResult({
      correct: false,
      message: "惜しい！赤いカードの位置を見直して、古い出来事から順番に並べ直してみよう。",
    });
  }

  function goToNextChallenge() {
    setChallengeIndex((current) => Math.min(current + 1, timeFlowChallenges.length - 1));
  }

  function goToPreviousChallenge() {
    setChallengeIndex((current) => Math.max(current - 1, 0));
  }

  function chooseChallenge(index: number) {
    setChallengeIndex(index);
  }

  function reorderByDrag(targetEventId: string) {
    if (!draggingEventId || draggingEventId === targetEventId || result?.correct) return;

    setOrderedEventIds((current) =>
      moveItem(
        current,
        current.indexOf(draggingEventId),
        current.indexOf(targetEventId)
      )
    );
    setResult(null);
  }

  function moveCard(eventId: string, direction: -1 | 1) {
    if (result?.correct) return;

    setOrderedEventIds((current) => {
      const currentIndex = current.indexOf(eventId);
      const nextIndex = currentIndex + direction;
      return moveItem(current, currentIndex, nextIndex);
    });
    setResult(null);
  }

  function getCardResultClass(eventId: string, index: number) {
    if (!result) return "bg-slate-950 border-slate-600 text-white";
    return correctIds[index] === eventId
      ? "bg-green-500 border-green-300 text-white"
      : "bg-red-900 border-red-500 text-white";
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
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            {historyEvents.length}枚の歴史カードから出題。古い順に並べて、時代の流れをつかもう。
          </p>
        </header>

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

        <section className="bg-slate-800 rounded-2xl p-4 mb-4">
          <h2 className="font-bold mb-2">歴史カードを並び替え</h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            カードをドラッグして、古い出来事から順番に並べてください。スマホで動かしにくい場合は、カード右下の上下ボタンでも調整できます。
          </p>

          <div className="space-y-3">
            {orderedEvents.map((event, index) => (
              <article
                key={event.id}
                draggable={!result?.correct}
                onDragStart={() => setDraggingEventId(event.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => reorderByDrag(event.id)}
                onDragEnd={() => setDraggingEventId(null)}
                className={`rounded-2xl p-3 border active:scale-[0.99] ${getCardResultClass(
                  event.id,
                  index
                )}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-400 bg-white/10 text-[10px] font-bold text-slate-200">
                    画像枠
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-300">{index + 1}</p>
                        <h3 className="font-bold leading-snug">{event.title}</h3>
                      </div>

                      {result && (
                        <span className="shrink-0 rounded-full bg-yellow-300 px-2 py-1 text-xs font-bold text-black">
                          {event.year}年
                        </span>
                      )}
                    </div>

                    <p className="text-xs leading-relaxed opacity-90 mt-1">{event.shortText}</p>

                    {result && (
                      <div className="mt-3 rounded-xl bg-white/15 p-3 text-xs leading-relaxed">
                        <p className="font-bold mb-1">解説枠</p>
                        <p>
                          解説サンプル：{event.title}は、時代の流れを考えるうえで重要な出来事です。ここに各カードごとの解説を追加できます。
                        </p>
                      </div>
                    )}

                    {!result?.correct && (
                      <div className="mt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => moveCard(event.id, -1)}
                          disabled={index === 0}
                          className="rounded-lg bg-slate-700 px-3 py-1 text-xs font-bold text-white disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveCard(event.id, 1)}
                          disabled={index === orderedEvents.length - 1}
                          className="rounded-lg bg-slate-700 px-3 py-1 text-xs font-bold text-white disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

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
            onClick={resetChallenge}
            className="bg-slate-700 text-white py-3 rounded-xl font-bold"
          >
            リセット
          </button>
          <button
            type="button"
            onClick={goToPreviousChallenge}
            disabled={challengeIndex === 0}
            className="bg-slate-700 text-white py-3 rounded-xl font-bold disabled:opacity-30"
          >
            前へ
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
          <h2 className="font-bold mb-3">チャレンジ移動</h2>
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-950 p-3 border border-slate-600">
            <button
              type="button"
              onClick={goToPreviousChallenge}
              disabled={challengeIndex === 0}
              className="rounded-xl bg-slate-700 px-3 py-2 text-sm font-bold disabled:opacity-30"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => chooseChallenge((challengeIndex + 1) % timeFlowChallenges.length)}
              className="min-w-0 flex-1 text-center"
            >
              <span className="block text-xs text-slate-400">現在のチャレンジ</span>
              <span className="block text-lg font-bold text-white">
                {challengeIndex + 1}/{timeFlowChallenges.length}
              </span>
              <span className="block truncate text-sm text-slate-300">{challenge.title}</span>
            </button>
            <button
              type="button"
              onClick={goToNextChallenge}
              disabled={isLastChallenge}
              className="rounded-xl bg-slate-700 px-3 py-2 text-sm font-bold disabled:opacity-30"
            >
              ＋
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
