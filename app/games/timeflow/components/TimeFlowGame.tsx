"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { timeFlowChallenges } from "@/data/games/timeflow/challenges";
import { historyEvents } from "@/data/history/events";
import { getHistoryCardImage } from "@/lib/historyCards";
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

function HistoryCardImage({ event }: { event: HistoryEvent }) {
  const image = getHistoryCardImage(event);

  return (
    <div
      role="img"
      aria-label={image.alt}
      className="h-24 w-full rounded-xl border border-white/20 bg-slate-900 bg-cover bg-center"
      style={{ backgroundImage: `url("${image.src}")` }}
    />
  );
}

function HistoryCardFront({ event }: { event: HistoryEvent }) {
  return (
    <div className="space-y-2">
      <HistoryCardImage event={event} />
      <div>
        <p className="font-bold leading-tight">{event.title}</p>
        <p className="text-xs text-slate-300 leading-relaxed mt-1">{event.shortText}</p>
      </div>
    </div>
  );
}

function HistoryCardBack({ event }: { event: HistoryEvent }) {
  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-yellow-300/50 bg-yellow-300 text-black p-3 text-center">
        <p className="text-xs font-bold">カード裏面</p>
        <p className="text-2xl font-black">{event.year}年</p>
      </div>
      <div>
        <p className="font-bold leading-tight">{event.title}</p>
        <p className="text-xs text-slate-200 leading-relaxed mt-1">{event.description}</p>
      </div>
    </div>
  );
}

function HistoryCard({
  event,
  side,
  onClick,
  disabled,
  label,
}: {
  event: HistoryEvent;
  side: "front" | "back";
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !onClick}
      className={`w-full text-left rounded-2xl p-3 border transition active:scale-[0.99] ${
        side === "back"
          ? "bg-slate-900 border-yellow-300/70 text-white"
          : "bg-slate-950 border-slate-600 text-white"
      } ${onClick ? "hover:border-blue-300" : "cursor-default"}`}
    >
      {label && <p className="text-xs font-bold text-blue-200 mb-2">{label}</p>}
      {side === "back" ? <HistoryCardBack event={event} /> : <HistoryCardFront event={event} />}
    </button>
  );
}

export default function TimeFlowGame() {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [clearedChallengeIds, setClearedChallengeIds] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<TimeFlowChallenge["difficulty"] | "all">(
    "all"
  );

  const challenge = timeFlowChallenges[challengeIndex];

  const challengeEvents = useMemo(
    () => getEventsByIds(challenge.eventIds),
    [challenge.eventIds]
  );

  const shuffledEvents = useMemo(
    () => rotateEvents(challengeEvents, challengeIndex + 1),
    [challengeEvents, challengeIndex]
  );

  const filteredChallenges = useMemo(
    () =>
      selectedDifficulty === "all"
        ? timeFlowChallenges
        : timeFlowChallenges.filter((item) => item.difficulty === selectedDifficulty),
    [selectedDifficulty]
  );

  const selectedEvents = selectedEventIds
    .map((id) => challengeEvents.find((event) => event.id === id))
    .filter((event): event is HistoryEvent => Boolean(event));

  const remainingEvents = shuffledEvents.filter(
    (event) => !selectedEventIds.includes(event.id)
  );

  const isLastChallenge = challengeIndex === timeFlowChallenges.length - 1;
  const answerRevealed = Boolean(result);

  function selectEvent(eventId: string) {
    if (selectedEventIds.includes(eventId) || result) return;

    setSelectedEventIds((current) => [...current, eventId]);
    setResult(null);
  }

  function removeSelectedEvent(eventId: string) {
    if (result) return;

    setSelectedEventIds((current) => current.filter((id) => id !== eventId));
    setResult(null);
  }

  function resetChallenge() {
    setSelectedEventIds([]);
    setResult(null);
  }

  function checkAnswer() {
    if (selectedEventIds.length !== challengeEvents.length) {
      setResult({
        correct: false,
        message: "まだ歴史の流れが完成していません。すべてのカードを選んでください。",
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
      return;
    }

    setResult({
      correct: false,
      message: "不正解です。カード裏面で年号と解説を確認して、もう一度挑戦してください。",
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

  function chooseRandomChallenge() {
    const nextIndex = (challengeIndex * 7 + clearedChallengeIds.length + 3) % timeFlowChallenges.length;
    chooseChallenge(nextIndex === challengeIndex ? (nextIndex + 1) % timeFlowChallenges.length : nextIndex);
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
                表面の説明と画像だけを見て、歴史カードを古い順に並べます。答え合わせ後に裏面の年号と解説を確認できます。
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
            <span className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded-full font-bold">
              年号非表示
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

              return event ? (
                <HistoryCard
                  key={`${challenge.id}-slot-${event.id}`}
                  event={event}
                  side={answerRevealed ? "back" : "front"}
                  onClick={() => removeSelectedEvent(event.id)}
                  disabled={answerRevealed}
                  label={`${index + 1}番目${answerRevealed ? "・裏面" : "・タップで外す"}`}
                />
              ) : (
                <div
                  key={`${challenge.id}-slot-${index}`}
                  className="w-full rounded-2xl p-4 border border-dashed border-slate-600 bg-slate-800 text-slate-400"
                >
                  <span className="text-xs font-bold mr-2">{index + 1}</span>
                  カードを選択
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-slate-800 rounded-2xl p-4 mb-4">
          <h2 className="font-bold mb-3">歴史カード</h2>
          {remainingEvents.length === 0 ? (
            <p className="text-sm text-slate-400">すべてのカードを歴史の流れに入れました。</p>
          ) : (
            <div className="space-y-2">
              {remainingEvents.map((event) => (
                <HistoryCard
                  key={event.id}
                  event={event}
                  side="front"
                  onClick={() => selectEvent(event.id)}
                  disabled={answerRevealed}
                />
              ))}
            </div>
          )}
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

            <div className="mt-3 bg-white/15 rounded-xl p-3">
              <p className="text-sm font-bold mb-2">正しい歴史の流れ</p>
              <div className="space-y-2">
                {getCorrectOrder(challengeEvents).map((event, index) => (
                  <HistoryCard
                    key={`${event.id}-answer`}
                    event={event}
                    side="back"
                    label={`${index + 1}番目`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={checkAnswer}
            disabled={selectedEventIds.length !== challengeEvents.length || answerRevealed}
            className={`py-3 rounded-xl font-bold ${
              selectedEventIds.length === challengeEvents.length && !answerRevealed
                ? "bg-yellow-300 text-black"
                : "bg-slate-800 text-slate-500"
            }`}
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
            onClick={chooseRandomChallenge}
            className="bg-slate-700 text-white py-3 rounded-xl font-bold"
          >
            ランダム
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
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              type="button"
              onClick={() => setSelectedDifficulty("all")}
              className={`py-2 rounded-xl text-xs font-bold ${
                selectedDifficulty === "all" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-200"
              }`}
            >
              全部
            </button>
            {([1, 2, 3, 4, 5] as TimeFlowChallenge["difficulty"][]).map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`py-2 rounded-xl text-xs font-bold ${
                  selectedDifficulty === difficulty
                    ? "bg-blue-500 text-white"
                    : "bg-slate-700 text-slate-200"
                }`}
              >
                Lv.{difficulty}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {filteredChallenges.map((item) => {
              const index = timeFlowChallenges.findIndex((challengeItem) => challengeItem.id === item.id);
              return (
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
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
