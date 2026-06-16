"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { fetchCsvObjects } from "../lib/timewalkData";
import { SPOT_QUIZZES_URL, SPOTS_URL } from "../lib/sheetUrls";
import type {
  GamePhase,
  SugorokuEdge,
  SugorokuQuiz,
  SugorokuSpot,
} from "./types";

const SugorokuMap = dynamic(() => import("./SugorokuMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-2xl bg-slate-800 text-slate-300">
      地図を読み込み中です。
    </div>
  ),
});

const BOARD_SPOT_COUNT = 18;
const MAX_TURNS = 10;
const STARTING_SCORE = 3000;
const CORRECT_REWARD = 1000;
const WRONG_PENALTY = 300;
const TOKYO_STATION = { lat: 35.681236, lng: 139.767125 };

const TOKYO_ANCHORS = [
  TOKYO_STATION,
  { lat: 35.7148, lng: 139.7967 },
  { lat: 35.7138, lng: 139.7773 },
  { lat: 35.7278, lng: 139.7707 },
  { lat: 35.7174, lng: 139.7474 },
  { lat: 35.7295, lng: 139.7109 },
  { lat: 35.6938, lng: 139.7034 },
  { lat: 35.6595, lng: 139.7005 },
  { lat: 35.6764, lng: 139.6993 },
  { lat: 35.6339, lng: 139.7158 },
  { lat: 35.6285, lng: 139.7388 },
  { lat: 35.6272, lng: 139.7768 },
  { lat: 35.6655, lng: 139.7707 },
  { lat: 35.6717, lng: 139.7650 },
  { lat: 35.6966, lng: 139.7930 },
  { lat: 35.6731, lng: 139.8171 },
  { lat: 35.7033, lng: 139.5797 },
  { lat: 35.7512, lng: 139.7092 },
];

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

type CsvRow = Record<string, string>;

type Point = {
  lat: number;
  lng: number;
};

function toNumber(value: string | undefined) {
  const numberValue = Number(value?.trim());
  return Number.isFinite(numberValue) ? numberValue : null;
}

function getFirstValue(row: CsvRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key]?.trim();
    if (value) return value;
  }
  return "";
}

function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function distanceKm(a: Point, b: Point) {
  const radius = 6371;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const deltaLat = ((b.lat - a.lat) * Math.PI) / 180;
  const deltaLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function isTokyoSpot(row: CsvRow, lat: number, lng: number) {
  const prefecture = getFirstValue(row, ["prefecture", "都道府県"]);
  if (prefecture.includes("東京")) return true;

  return lat >= 35.48 && lat <= 35.92 && lng >= 138.9 && lng <= 139.95;
}

function convertSpotRow(row: CsvRow): SugorokuSpot | null {
  const id = row.id?.trim();
  const name = row.name?.trim();
  const lat = toNumber(row.lat);
  const lng = toNumber(row.lng);
  const status = String(row.status || "").trim().toLowerCase();
  const mode = String(row.mode || "");

  if (!id || !name || lat === null || lng === null) return null;
  if (status !== "ready" || mode.includes("除外")) return null;
  if (!isTokyoSpot(row, lat, lng)) return null;

  return {
    id,
    name,
    kana: row.kana?.trim() || "",
    lat,
    lng,
    prefecture: getFirstValue(row, ["prefecture", "都道府県"]),
    city: getFirstValue(row, ["city", "市区町村", "municipality", "ward"]),
    description: row.description?.trim() || "",
    spotsImage: row.spotsImage?.trim() || "",
  };
}

function convertQuizRow(row: CsvRow): SugorokuQuiz | null {
  const quizId = row.quizId?.trim();
  const spotId = row.spotId?.trim();
  const question = row.question?.trim();
  const correctAnswer = row.correctAnswer?.trim();
  const isActiveValue = row.isActive?.trim().toLowerCase();
  const format = row.format?.trim();

  if (!quizId || !spotId || !question || !correctAnswer) return null;
  if (format === "input") return null;
  if (isActiveValue && !["true", "yes", "1"].includes(isActiveValue)) return null;

  const wrongAnswers = [
    row.wrongAnswer1,
    row.wrongAnswer2,
    row.wrongAnswer3,
    row.wrongAnswer4,
    row.wrongAnswer5,
    row.wrongAnswer6,
  ]
    .map((answer) => answer?.trim() || "")
    .filter(Boolean)
    .filter((answer) => answer !== correctAnswer);

  if (wrongAnswers.length === 0) return null;

  return {
    quizId,
    spotId,
    question,
    correctAnswer,
    wrongAnswers,
    explanation: row.explanation?.trim() || "",
    level: Number(row.level) || 1,
  };
}

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function selectBoardSpots(candidates: SugorokuSpot[], count: number) {
  const selected: SugorokuSpot[] = [];
  const usedIds = new Set<string>();

  for (const anchor of TOKYO_ANCHORS) {
    const nearest = candidates
      .filter((spot) => !usedIds.has(spot.id))
      .sort((a, b) => distanceKm(a, anchor) - distanceKm(b, anchor))[0];

    if (!nearest) continue;
    selected.push(nearest);
    usedIds.add(nearest.id);
    if (selected.length >= count) return selected;
  }

  while (selected.length < count) {
    const remaining = candidates.filter((spot) => !usedIds.has(spot.id));
    if (remaining.length === 0) break;

    const next = remaining
      .map((spot) => ({
        spot,
        nearestDistance:
          selected.length === 0
            ? 0
            : Math.min(...selected.map((item) => distanceKm(spot, item))),
      }))
      .sort((a, b) => b.nearestDistance - a.nearestDistance)[0]?.spot;

    if (!next) break;
    selected.push(next);
    usedIds.add(next.id);
  }

  return selected;
}

function edgeKey(from: string, to: string) {
  return [from, to].sort().join("::");
}

function buildBoardEdges(spots: SugorokuSpot[]) {
  if (spots.length < 2) return [];

  const edges: SugorokuEdge[] = [];
  const edgeKeys = new Set<string>();
  const visited = new Set<string>([spots[0].id]);

  const addEdge = (from: string, to: string) => {
    const key = edgeKey(from, to);
    if (from === to || edgeKeys.has(key)) return false;
    edgeKeys.add(key);
    edges.push({ from, to });
    return true;
  };

  while (visited.size < spots.length) {
    let best:
      | { from: SugorokuSpot; to: SugorokuSpot; distance: number }
      | undefined;

    for (const from of spots.filter((spot) => visited.has(spot.id))) {
      for (const to of spots.filter((spot) => !visited.has(spot.id))) {
        const distance = distanceKm(from, to);
        if (!best || distance < best.distance) best = { from, to, distance };
      }
    }

    if (!best) break;
    addEdge(best.from.id, best.to.id);
    visited.add(best.to.id);
  }

  const degree = new Map<string, number>();
  spots.forEach((spot) => degree.set(spot.id, 0));
  edges.forEach((edge) => {
    degree.set(edge.from, (degree.get(edge.from) || 0) + 1);
    degree.set(edge.to, (degree.get(edge.to) || 0) + 1);
  });

  for (const spot of spots) {
    if ((degree.get(spot.id) || 0) >= 3) continue;

    const extra = spots
      .filter((candidate) => candidate.id !== spot.id)
      .filter((candidate) => !edgeKeys.has(edgeKey(spot.id, candidate.id)))
      .filter((candidate) => (degree.get(candidate.id) || 0) < 4)
      .map((candidate) => ({
        candidate,
        distance: distanceKm(spot, candidate),
      }))
      .filter((item) => item.distance <= 6)
      .sort((a, b) => a.distance - b.distance)[0];

    if (!extra) continue;
    if (addEdge(spot.id, extra.candidate.id)) {
      degree.set(spot.id, (degree.get(spot.id) || 0) + 1);
      degree.set(
        extra.candidate.id,
        (degree.get(extra.candidate.id) || 0) + 1
      );
    }
  }

  return edges;
}

function buildAdjacency(spots: SugorokuSpot[], edges: SugorokuEdge[]) {
  const adjacency = new Map<string, string[]>();
  spots.forEach((spot) => adjacency.set(spot.id, []));

  edges.forEach((edge) => {
    adjacency.get(edge.from)?.push(edge.to);
    adjacency.get(edge.to)?.push(edge.from);
  });

  return adjacency;
}

function buildFallbackQuiz(
  spot: SugorokuSpot,
  boardSpots: SugorokuSpot[]
): SugorokuQuiz {
  const plainDescription = stripHtml(spot.description);
  const maskedDescription = spot.name
    ? plainDescription.replace(new RegExp(escapeRegExp(spot.name), "g"), "この場所")
    : plainDescription;
  const excerpt = maskedDescription.slice(0, 180);
  const wrongAnswers = shuffle(
    boardSpots.filter((item) => item.id !== spot.id).map((item) => item.name)
  ).slice(0, 3);

  return {
    quizId: `fallback-${spot.id}`,
    spotId: spot.id,
    question: excerpt
      ? `次の説明に当てはまる歴史スポットはどこでしょう？\n\n${excerpt}${maskedDescription.length > 180 ? "…" : ""}`
      : "現在地として表示されている歴史スポットの名前はどれでしょう？",
    correctAnswer: spot.name,
    wrongAnswers,
    explanation: plainDescription || `${spot.name}に到着しました。`,
    level: 1,
  };
}

function buildChoices(quiz: SugorokuQuiz) {
  return shuffle([
    quiz.correctAnswer,
    ...Array.from(new Set(quiz.wrongAnswers)).slice(0, 3),
  ]);
}

export default function SugorokuGame() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [boardSpots, setBoardSpots] = useState<SugorokuSpot[]>([]);
  const [edges, setEdges] = useState<SugorokuEdge[]>([]);
  const [quizzesBySpot, setQuizzesBySpot] = useState<
    Map<string, SugorokuQuiz[]>
  >(new Map());
  const [gameStarted, setGameStarted] = useState(false);
  const [phase, setPhase] = useState<GamePhase>("ready");
  const [turn, setTurn] = useState(1);
  const [score, setScore] = useState(STARTING_SCORE);
  const [historyPoints, setHistoryPoints] = useState(0);
  const [currentSpotId, setCurrentSpotId] = useState("");
  const [previousSpotId, setPreviousSpotId] = useState<string | null>(null);
  const [dice, setDice] = useState<number | null>(null);
  const [remainingSteps, setRemainingSteps] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState<SugorokuQuiz | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [visitedSpotIds, setVisitedSpotIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [spotRows, quizRows] = await Promise.all([
          fetchCsvObjects(SPOTS_URL, true),
          fetchCsvObjects(SPOT_QUIZZES_URL, true),
        ]);

        const quizzes = quizRows
          .map(convertQuizRow)
          .filter((quiz): quiz is SugorokuQuiz => Boolean(quiz));
        const quizMap = new Map<string, SugorokuQuiz[]>();
        quizzes.forEach((quiz) => {
          const current = quizMap.get(quiz.spotId) || [];
          current.push(quiz);
          quizMap.set(quiz.spotId, current);
        });

        const allTokyoSpots = spotRows
          .map(convertSpotRow)
          .filter((spot): spot is SugorokuSpot => Boolean(spot));
        const candidates = allTokyoSpots.filter(
          (spot) =>
            quizMap.has(spot.id) || stripHtml(spot.description).length >= 40
        );
        const selected = selectBoardSpots(candidates, BOARD_SPOT_COUNT);

        if (selected.length < 6) {
          throw new Error(
            "東京都内の有効なスポットを十分に取得できませんでした。spotsシートのstatus、座標、descriptionを確認してください。"
          );
        }

        const boardEdges = buildBoardEdges(selected);
        const startSpot = [...selected].sort(
          (a, b) => distanceKm(a, TOKYO_STATION) - distanceKm(b, TOKYO_STATION)
        )[0];

        setBoardSpots(selected);
        setEdges(boardEdges);
        setQuizzesBySpot(quizMap);
        setCurrentSpotId(startSpot.id);
        setVisitedSpotIds(new Set([startSpot.id]));
      } catch (loadError) {
        console.error(loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "すごろくデータの読み込みに失敗しました。"
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const spotsById = useMemo(
    () => new Map(boardSpots.map((spot) => [spot.id, spot])),
    [boardSpots]
  );
  const adjacency = useMemo(
    () => buildAdjacency(boardSpots, edges),
    [boardSpots, edges]
  );
  const currentSpot = spotsById.get(currentSpotId);

  const selectableSpotIds = useMemo(() => {
    if (phase !== "moving") return [];
    const neighbors = adjacency.get(currentSpotId) || [];
    const forwardOnly = previousSpotId
      ? neighbors.filter((spotId) => spotId !== previousSpotId)
      : neighbors;
    return forwardOnly.length > 0 ? forwardOnly : neighbors;
  }, [adjacency, currentSpotId, phase, previousSpotId]);

  function resetQuestion() {
    setActiveQuiz(null);
    setChoices([]);
    setSelectedAnswer("");
    setAnswerCorrect(null);
  }

  function startGame() {
    const startSpot = [...boardSpots].sort(
      (a, b) => distanceKm(a, TOKYO_STATION) - distanceKm(b, TOKYO_STATION)
    )[0];
    if (!startSpot) return;

    setGameStarted(true);
    setPhase("ready");
    setTurn(1);
    setScore(STARTING_SCORE);
    setHistoryPoints(0);
    setCurrentSpotId(startSpot.id);
    setPreviousSpotId(null);
    setDice(null);
    setRemainingSteps(0);
    setVisitedSpotIds(new Set([startSpot.id]));
    resetQuestion();
  }

  function rollDice() {
    if (phase !== "ready") return;
    const result = Math.floor(Math.random() * 6) + 1;
    setDice(result);
    setRemainingSteps(result);
    setPreviousSpotId(null);
    setPhase("moving");
  }

  function openQuiz(spotId: string) {
    const spot = spotsById.get(spotId);
    if (!spot) return;

    const registered = quizzesBySpot.get(spotId) || [];
    const quiz =
      registered[Math.floor(Math.random() * registered.length)] ||
      buildFallbackQuiz(spot, boardSpots);

    setActiveQuiz(quiz);
    setChoices(buildChoices(quiz));
    setSelectedAnswer("");
    setAnswerCorrect(null);
    setPhase("quiz");
  }

  function moveToSpot(nextSpotId: string) {
    if (phase !== "moving" || !selectableSpotIds.includes(nextSpotId)) return;

    const oldSpotId = currentSpotId;
    const nextRemaining = remainingSteps - 1;
    setCurrentSpotId(nextSpotId);
    setPreviousSpotId(oldSpotId);
    setRemainingSteps(nextRemaining);
    setVisitedSpotIds((current) => {
      const next = new Set(current);
      next.add(nextSpotId);
      return next;
    });

    if (nextRemaining <= 0) openQuiz(nextSpotId);
  }

  function answerQuiz(answer: string) {
    if (phase !== "quiz" || !activeQuiz) return;

    const correct = answer === activeQuiz.correctAnswer;
    setSelectedAnswer(answer);
    setAnswerCorrect(correct);
    setPhase("answered");

    if (correct) {
      setScore((current) => current + CORRECT_REWARD);
      setHistoryPoints((current) => current + 1);
    } else {
      setScore((current) => Math.max(0, current - WRONG_PENALTY));
    }
  }

  function goToNextTurn() {
    if (phase !== "answered") return;

    if (turn >= MAX_TURNS) {
      setPhase("finished");
      return;
    }

    setTurn((current) => current + 1);
    setPhase("ready");
    setPreviousSpotId(null);
    setDice(null);
    setRemainingSteps(0);
    resetQuestion();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="rounded-2xl bg-slate-900 px-6 py-5 text-center">
          spotsシートとクイズを読み込み中です。
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="w-full max-w-xl rounded-2xl border border-red-500 bg-slate-900 p-6">
          <h1 className="mb-3 text-xl font-bold text-red-300">読み込みエラー</h1>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
            {error}
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-xl bg-white px-4 py-2 font-bold text-slate-950"
          >
            TimeWalkへ戻る
          </Link>
        </div>
      </main>
    );
  }

  if (!gameStarted) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border-4 border-white bg-slate-900 p-6 shadow-2xl sm:p-9">
          <p className="mb-2 text-center text-sm font-bold text-yellow-300">
            TimeWalk 東京都内プロトタイプ
          </p>
          <h1 className="text-center text-3xl font-black sm:text-5xl">
            東京歴史すごろく
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center leading-relaxed text-slate-200">
            spotsシートから選んだ東京都内の歴史スポットを、実際の地図上で巡ります。
            サイコロを振り、分岐では進む場所を選び、止まった地点の歴史クイズに挑戦してください。
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-800 p-4 text-center">
              <div className="text-2xl font-black text-yellow-300">
                {boardSpots.length}
              </div>
              <div className="text-sm text-slate-300">選出スポット</div>
            </div>
            <div className="rounded-2xl bg-slate-800 p-4 text-center">
              <div className="text-2xl font-black text-yellow-300">
                {MAX_TURNS}
              </div>
              <div className="text-sm text-slate-300">ターン</div>
            </div>
            <div className="rounded-2xl bg-slate-800 p-4 text-center">
              <div className="text-2xl font-black text-yellow-300">1人</div>
              <div className="text-sm text-slate-300">プロトタイプ</div>
            </div>
          </div>

          <div className="mt-7 rounded-2xl bg-slate-800 p-5 text-sm leading-relaxed text-slate-200">
            <p className="font-bold text-white">ルール</p>
            <p className="mt-2">
              正解は＋{CORRECT_REWARD.toLocaleString()}点、不正解は－
              {WRONG_PENALTY.toLocaleString()}点です。10ターン終了時の得点と訪問地点数を競います。
            </p>
          </div>

          <button
            type="button"
            onClick={startGame}
            className="mt-7 w-full rounded-2xl bg-yellow-300 px-5 py-4 text-xl font-black text-slate-950 shadow-lg transition hover:bg-yellow-200 active:scale-[0.99]"
          >
            ゲーム開始
          </button>
          <Link
            href="/"
            className="mt-4 block text-center text-sm font-bold text-slate-300 underline"
          >
            TimeWalkへ戻る
          </Link>
        </div>
      </main>
    );
  }

  if (phase === "finished") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
        <div className="w-full max-w-xl rounded-3xl border-4 border-yellow-300 bg-slate-900 p-7 text-center shadow-2xl">
          <p className="text-sm font-bold text-yellow-300">ゲーム終了</p>
          <h1 className="mt-2 text-4xl font-black">東京歴史すごろく</h1>
          <div className="mt-7 rounded-2xl bg-slate-800 p-6">
            <div className="text-sm text-slate-300">最終得点</div>
            <div className="mt-1 text-5xl font-black text-yellow-300">
              {score.toLocaleString()}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-700 p-3">
                <div className="text-slate-300">歴史ポイント</div>
                <div className="text-2xl font-black">{historyPoints}</div>
              </div>
              <div className="rounded-xl bg-slate-700 p-3">
                <div className="text-slate-300">訪問地点</div>
                <div className="text-2xl font-black">{visitedSpotIds.size}</div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={startGame}
            className="mt-6 w-full rounded-2xl bg-yellow-300 px-5 py-4 text-lg font-black text-slate-950"
          >
            もう一度遊ぶ
          </button>
          <Link
            href="/"
            className="mt-4 block text-sm font-bold text-slate-300 underline"
          >
            TimeWalkへ戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-3 text-white sm:p-5">
      <div className="mx-auto max-w-7xl">
        <header className="mb-4 rounded-2xl border border-slate-700 bg-slate-900 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-yellow-300">TimeWalk</p>
              <h1 className="text-xl font-black sm:text-2xl">東京歴史すごろく</h1>
            </div>
            <div className="flex flex-wrap gap-2 text-sm font-bold">
              <span className="rounded-xl bg-slate-800 px-3 py-2">
                ターン {turn}/{MAX_TURNS}
              </span>
              <span className="rounded-xl bg-slate-800 px-3 py-2 text-yellow-300">
                {score.toLocaleString()}点
              </span>
              <span className="rounded-xl bg-slate-800 px-3 py-2">
                歴史 {historyPoints}
              </span>
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            <SugorokuMap
              spots={boardSpots}
              edges={edges}
              currentSpotId={currentSpotId}
              selectableSpotIds={selectableSpotIds}
              onSelectSpot={moveToSpot}
            />

            {phase === "moving" && (
              <div className="mt-3 rounded-2xl border border-yellow-300 bg-slate-900 p-4">
                <p className="font-bold text-yellow-300">
                  残り{remainingSteps}マス：次に進む地点を選んでください
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {selectableSpotIds.map((spotId) => {
                    const spot = spotsById.get(spotId);
                    if (!spot) return null;
                    return (
                      <button
                        type="button"
                        key={spotId}
                        onClick={() => moveToSpot(spotId)}
                        className="rounded-xl bg-yellow-300 px-4 py-3 text-left font-black text-slate-950 hover:bg-yellow-200"
                      >
                        → {spot.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          <aside className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <div className="rounded-2xl bg-slate-800 p-4">
              <p className="text-xs font-bold text-slate-400">現在地</p>
              <h2 className="mt-1 text-xl font-black">
                {currentSpot?.name || "読み込み中"}
              </h2>
              {(currentSpot?.city || currentSpot?.prefecture) && (
                <p className="mt-1 text-sm text-slate-300">
                  {currentSpot.prefecture} {currentSpot.city}
                </p>
              )}
            </div>

            {phase === "ready" && (
              <div className="mt-5 text-center">
                <p className="text-sm text-slate-300">
                  サイコロを振って、地図上を進みます。
                </p>
                <button
                  type="button"
                  onClick={rollDice}
                  className="mt-4 w-full rounded-2xl bg-blue-500 px-5 py-4 text-xl font-black text-white shadow-lg hover:bg-blue-400"
                >
                  サイコロを振る
                </button>
              </div>
            )}

            {phase === "moving" && dice && (
              <div className="mt-5 text-center">
                <div className="text-7xl leading-none">{DICE_FACES[dice - 1]}</div>
                <p className="mt-2 text-2xl font-black">{dice}が出ました</p>
                <p className="mt-2 text-sm text-yellow-300">
                  黄色い地点を押して進んでください。
                </p>
              </div>
            )}

            {(phase === "quiz" || phase === "answered") && activeQuiz && (
              <div className="mt-5">
                <p className="text-xs font-bold text-yellow-300">
                  {currentSpot?.name}の歴史クイズ
                </p>
                <h3 className="mt-2 whitespace-pre-wrap text-lg font-black leading-relaxed">
                  {activeQuiz.question}
                </h3>
                <div className="mt-4 space-y-2">
                  {choices.map((choice, index) => {
                    const isCorrectChoice =
                      phase === "answered" && choice === activeQuiz.correctAnswer;
                    const isWrongSelection =
                      phase === "answered" &&
                      choice === selectedAnswer &&
                      choice !== activeQuiz.correctAnswer;
                    const stateClass = isCorrectChoice
                      ? "border-green-400 bg-green-600 text-white"
                      : isWrongSelection
                        ? "border-red-400 bg-red-600 text-white"
                        : "border-slate-600 bg-slate-800 text-white hover:bg-slate-700";

                    return (
                      <button
                        type="button"
                        key={`${choice}-${index}`}
                        onClick={() => answerQuiz(choice)}
                        disabled={phase === "answered"}
                        className={`w-full rounded-xl border-2 px-4 py-3 text-left font-bold transition ${stateClass}`}
                      >
                        {index + 1}. {choice}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {phase === "answered" && activeQuiz && (
              <div className="mt-5">
                <div
                  className={`rounded-2xl p-4 font-black ${
                    answerCorrect
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {answerCorrect
                    ? `正解！ ＋${CORRECT_REWARD.toLocaleString()}点`
                    : `不正解　－${WRONG_PENALTY.toLocaleString()}点`}
                </div>
                <div className="mt-3 rounded-2xl bg-slate-800 p-4 text-sm leading-relaxed text-slate-200">
                  <p className="font-bold text-white">
                    答え：{activeQuiz.correctAnswer}
                  </p>
                  {activeQuiz.explanation && (
                    <p className="mt-2">{stripHtml(activeQuiz.explanation)}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={goToNextTurn}
                  className="mt-4 w-full rounded-2xl bg-yellow-300 px-5 py-4 text-lg font-black text-slate-950 hover:bg-yellow-200"
                >
                  {turn >= MAX_TURNS ? "結果を見る" : "次のターンへ"}
                </button>
              </div>
            )}

            <div className="mt-5 border-t border-slate-700 pt-4 text-xs leading-relaxed text-slate-400">
              <p>訪問地点：{visitedSpotIds.size}か所</p>
              <p className="mt-1">
                地図上の線は、選出スポットの位置関係からプロトタイプ用に自動生成しています。
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
