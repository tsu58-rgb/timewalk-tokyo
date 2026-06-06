"use client";

import { useEffect, useMemo, useState, type TouchEvent } from "react";
import Link from "next/link";

import { timeFlowChallenges } from "@/data/games/timeflow/challenges";
import { timeFlowEventDetails } from "@/data/games/timeflow/eventDetails";
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

  const availableDifficulties = useMemo(
    () =>
      Array.from(new Set(timeFlowChallenges.map((item) => item.difficulty))).sort(
        (a, b) => a - b
      ),
    []
  );

  const isLastChallenge = challengeIndex === timeFlowChallenges.length - 1;

  useEffect(() => {
    setOrderedEventIds(shuffledEvents.map((event) => event.id));
    setDraggingEventId(null);
    setResult(null);
  }, [shuffledEvents]);

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

  function chooseLevel(difficulty: TimeFlowChallenge["difficulty"]) {
    const firstIndex = timeFlowChallenges.findIndex((item) => item.difficulty === difficulty);
    if (firstIndex >= 0) setChallengeIndex(firstIndex);
  }

  function reorderCard(sourceEventId: string, targetEventId: string) {
    if (sourceEventId === targetEventId || result?.correct) return;

    setOrderedEventIds((current) =>
      moveItem(
        current,
        current.indexOf(sourceEventId),
        current.indexOf(targetEventId)
      )
    );
    setResult(null);
  }

  function reorderByDrag(targetEventId: string) {
    if (!draggingEventId) return;
    reorderCard(draggingEventId, targetEventId);
  }

  function reorderByTouch(event: TouchEvent<HTMLElement>, sourceEventId: string) {
    if (result?.correct) return;

    const touch = event.touches[0];
    if (!touch) return;

    const target = document
      .elementFromPoint(touch.clientX, touch.clientY)
      ?.closest<HTMLElement>("[data-event-id]");
    const targetEventId = target?.dataset.eventId;

    if (!targetEventId || targetEventId === sourceEventId) return;

    event.preventDefault();
    reorderCard(sourceEventId, targetEventId);
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

  function renderTopicCard() {
    return (
      <section className="rounded-2xl bg-slate-800 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold">
            {difficultyLabels[challenge.difficulty]}
          </span>
          <span className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded-full font-bold">
            {challengeIndex + 1}/{timeFlowChallenges.length}問目
          </span>
        </div>

        <h2 className="text-xl font-bold mb-2">{challenge.title}</h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">{challenge.description}</p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={goToPreviousChallenge}
            disabled={challengeIndex === 0}
            className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-bold text-white disabled:opacity-30"
          >
            前のお題
          </button>
          <button
            type="button"
            onClick={goToNextChallenge}
            disabled={isLastChallenge}
            className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-bold text-white disabled:opacity-30"
          >
            次のお題
          </button>
        </div>
      </section>
    );
  }

  function renderBottomTopicButtons() {
    return (
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={goToPreviousChallenge}
          disabled={challengeIndex === 0}
          className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-bold text-white disabled:opacity-30"
        >
          前のお題
        </button>
        <button
          type="button"
          onClick={goToNextChallenge}
          disabled={isLastChallenge}
          className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-bold text-white disabled:opacity-30"
        >
          次のお題
        </button>
      </div>
    );
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

        <section className="mb-4">
          <div className="flex flex-wrap gap-2">
            {availableDifficulties.map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                onClick={() => chooseLevel(difficulty)}
                className={`rounded-full px-3 py-2 text-xs font-bold ${
                  challenge.difficulty === difficulty
                    ? "bg-yellow-300 text-black"
                    : "bg-slate-700 text-slate-200"
                }`}
              >
                {difficultyLabels[difficulty]}
              </button>
            ))}
          </div>
        </section>

        {renderTopicCard()}

        <section className="bg-slate-800 rounded-2xl p-4 mb-4">
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            カードを1秒ほど押したままにすると上下に動かせます。動かしにくい場合は、カード右上の上下ボタンでも調整できます。
          </p>

          <div className="space-y-3">
            {orderedEvents.map((event, index) => {
              const eventDetail = timeFlowEventDetails[event.id];
              const imageUrl = eventDetail?.imageUrl ?? event.imageUrl;
              const imageAlt = eventDetail?.imageAlt ?? event.imageAlt ?? event.title;
              const detailText = eventDetail?.detailText ?? event.detailText ?? event.description;

              return (
                <article
                  key={event.id}
                  data-event-id={event.id}
                  draggable={!result?.correct}
                  onDragStart={() => setDraggingEventId(event.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => reorderByDrag(event.id)}
                  onDragEnd={() => setDraggingEventId(null)}
                  onTouchStart={() => setDraggingEventId(event.id)}
                  onTouchMove={(e) => reorderByTouch(e, event.id)}
                  onTouchEnd={() => setDraggingEventId(null)}
                  className={`relative rounded-2xl p-3 border select-none transition-transform duration-150 ${
                    draggingEventId === event.id
                      ? "z-10 scale-[1.03] shadow-2xl shadow-black/70 ring-2 ring-yellow-300"
                      : "active:scale-[0.99]"
                  } ${getCardResultClass(event.id, index)}`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex items-baseline gap-2">
                      <span className="shrink-0 text-xs font-bold text-slate-300">{index + 1}</span>
                      <h3 className="font-bold leading-snug">{event.title}</h3>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {result && (
                        <span className="rounded-full bg-yellow-300 px-2 py-1 text-xs font-bold text-black">
                          {event.year}年
                        </span>
                      )}

                      {!result && (
                        <>
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
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={imageAlt}
                        className="h-16 w-16 shrink-0 rounded-xl border border-slate-600 bg-white/10 object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-400 bg-white/10 text-[10px] font-bold text-slate-200">
                        画像枠
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-relaxed opacity-90">{event.shortText}</p>

                      {result && (
                        <div className="mt-3 rounded-xl bg-white/15 p-3 text-xs leading-relaxed">
                          <p className="font-bold mb-1">詳しい説明</p>
                          <p>{detailText}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <button
          type="button"
          onClick={checkAnswer}
          className="w-full bg-yellow-300 text-black py-3 rounded-xl font-bold mb-4"
        >
          答え合わせ
        </button>

        {renderBottomTopicButtons()}
      </div>
    </main>
  );
}
