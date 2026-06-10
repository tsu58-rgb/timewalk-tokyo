"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import Link from "next/link";

import { fetchCsvObjects } from "../../lib/timewalkData";
import { SPOT_QUIZZES_URL, SPOTS_URL } from "../../lib/sheetUrls";

type SpotQuiz = {
  quizId: string;
  spotId: string;
  level: number;
  format: "choice" | "input";
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  explanation: string;
  sourceField: string;
  tags: string;
  isActive: boolean;
};

type SpotInfo = {
  id: string;
  name: string;
  lat: number | null;
  lng: number | null;
  country: string;
  prefecture: string;
  city: string;
};

type QuizMode = "idle" | "playing" | "finished";
type AnswerRecord = { quizId: string; answer: string; correct: boolean };
type QuizFilterMode = "current" | "map" | "address" | "all";
type Point = { lat: number; lng: number };
type QuizCategory =
  | "建築・文化施設"
  | "寺社・信仰"
  | "人物・文化"
  | "江戸・東京史"
  | "近代史"
  | "産業・交通"
  | "自然・地形"
  | "考古・遺跡"
  | "地名・地域史"
  | "年中行事・祭礼"
  | "地域史・史跡";

const QUIZ_COUNT = 10;
const MAP_DEFAULT_CENTER: Point = { lat: 35.681236, lng: 139.767125 };

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(/[\s　]/g, "");
}

function isCorrect(question: SpotQuiz, answer: string) {
  return normalizeAnswer(question.correctAnswer) === normalizeAnswer(answer);
}

function toNumber(value: string | undefined) {
  const numberValue = Number(value?.trim());
  return Number.isFinite(numberValue) ? numberValue : null;
}

function getFirstValue(row: Record<string, string>, keys: string[]) {
  for (const key of keys) {
    const value = row[key]?.trim();
    if (value) return value;
  }
  return "";
}

function convertRow(row: Record<string, string>): SpotQuiz | null {
  const quizId = row.quizId?.trim();
  const question = row.question?.trim();
  const correctAnswer = row.correctAnswer?.trim();
  const isActiveValue = row.isActive?.trim().toLowerCase();
  if (!quizId || !question || !correctAnswer) return null;
  if (isActiveValue && !["true", "yes", "1"].includes(isActiveValue)) return null;

  return {
    quizId,
    spotId: row.spotId?.trim() ?? "",
    level: Number(row.level) || 1,
    format: row.format?.trim() === "input" ? "input" : "choice",
    question,
    correctAnswer,
    wrongAnswers: [row.wrongAnswer1, row.wrongAnswer2, row.wrongAnswer3, row.wrongAnswer4, row.wrongAnswer5, row.wrongAnswer6].filter(
      (item): item is string => Boolean(item?.trim())
    ),
    explanation: row.explanation?.trim() ?? "",
    sourceField: row.sourceField?.trim() ?? "",
    tags: row.tags?.trim() ?? "",
    isActive: true,
  };
}

function convertSpotRow(row: Record<string, string>): SpotInfo | null {
  const id = row.id?.trim();
  const name = row.name?.trim();
  if (!id || !name) return null;

  return {
    id,
    name,
    lat: toNumber(row.lat),
    lng: toNumber(row.lng),
    country: getFirstValue(row, ["country", "国"]),
    prefecture: getFirstValue(row, ["prefecture", "都道府県"]),
    city: getFirstValue(row, ["city", "市区町村", "municipality", "ward"]),
  };
}

function getQuestionCategory(question: SpotQuiz): QuizCategory {
  const text = `${question.question} ${question.sourceField} ${question.tags}`;
  if (/寺|神社|社|宮|不動|稲荷|観音|地蔵|墓|霊園|信仰|祭神|本尊/.test(text)) return "寺社・信仰";
  if (/竣工|建築|建物|館|博物館|美術館|邸|住宅|庁舎|橋|塔|重要文化財/.test(text)) return "建築・文化施設";
  if (/人物|作家|歌人|俳人|学者|武将|藩主|将軍|銅像|生誕|終焉|ゆかり/.test(text)) return "人物・文化";
  if (/江戸|幕府|徳川|大名|藩|宿場|街道|見附|御門|屋敷/.test(text)) return "江戸・東京史";
  if (/明治|大正|昭和|近代|戦争|震災|復興|軍|師団|空襲/.test(text)) return "近代史";
  if (/鉄道|駅|線路|橋梁|工場|産業|会社|創業|発祥|市場|水道|運河/.test(text)) return "産業・交通";
  if (/川|池|山|谷|坂|崖|台地|湧水|樹|桜|梅|自然|庭園/.test(text)) return "自然・地形";
  if (/古墳|遺跡|貝塚|土器|縄文|弥生|中世|城跡/.test(text)) return "考古・遺跡";
  if (/地名|町名|村|由来|地域|丁目/.test(text)) return "地名・地域史";
  if (/祭|祭礼|行事|年中行事|盆踊り|七夕|例大祭/.test(text)) return "年中行事・祭礼";
  return "地域史・史跡";
}

function findRelatedSpot(question: SpotQuiz, spotsById: Map<string, SpotInfo>) {
  return spotsById.get(question.spotId);
}

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function buildChoices(question: SpotQuiz) {
  const wrongAnswers = question.wrongAnswers
    .filter((item) => item.trim())
    .filter((item) => normalizeAnswer(item) !== normalizeAnswer(question.correctAnswer));
  return shuffle([question.correctAnswer, ...shuffle(Array.from(new Set(wrongAnswers))).slice(0, 3)]);
}

function calculateDistanceKm(a: Point, b: Point) {
  const radius = 6371;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const deltaLat = ((b.lat - a.lat) * Math.PI) / 180;
  const deltaLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function getUniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, "ja"));
}

export default function KenteiQuiz() {
  const [allQuestions, setAllQuestions] = useState<SpotQuiz[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<SpotQuiz[]>([]);
  const [spots, setSpots] = useState<SpotInfo[]>([]);
  const [mode, setMode] = useState<QuizMode>("idle");
  const [filterMode, setFilterMode] = useState<QuizFilterMode>("current");
  const [sessionSourceLabel, setSessionSourceLabel] = useState("現在地付近から出題");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentLocation, setCurrentLocation] = useState<Point | null>(null);
  const [mapPoint, setMapPoint] = useState<Point | null>(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<Leaflet.Map | null>(null);
  const leafletMarkerRef = useRef<Leaflet.Marker | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [quizRows, spotRows] = await Promise.all([
          fetchCsvObjects(SPOT_QUIZZES_URL, true),
          fetchCsvObjects(SPOTS_URL, true),
        ]);

        const questions = quizRows.map(convertRow).filter((item): item is SpotQuiz => Boolean(item));
        if (questions.length === 0) throw new Error("spot_quizzesに有効な問題がありません。");
        setAllQuestions(questions);

        const loadedSpots = spotRows.map(convertSpotRow).filter((item): item is SpotInfo => Boolean(item));
        setSpots(loadedSpots);
      } catch (err) {
        setError(err instanceof Error ? err.message : "問題の読み込みに失敗しました。");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (filterMode !== "map" || !mapRef.current || leafletMapRef.current) return;
    let disposed = false;

    async function setupMap() {
      const L = await import("leaflet");
      if (disposed || !mapRef.current) return;

      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const map = L.map(mapRef.current).setView([MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng], 12);
      leafletMapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
      map.on("click", (event: Leaflet.LeafletMouseEvent) => {
        const point = { lat: event.latlng.lat, lng: event.latlng.lng };
        setMapPoint(point);
        if (leafletMarkerRef.current) {
          leafletMarkerRef.current.setLatLng(event.latlng);
        } else {
          leafletMarkerRef.current = L.marker(event.latlng).addTo(map);
        }
      });
    }

    setupMap();
    return () => {
      disposed = true;
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
      leafletMarkerRef.current = null;
    };
  }, [filterMode]);

  const jpSpots = useMemo(() => spots.filter((spot) => spot.country.toUpperCase() === "JP"), [spots]);
  const jpSpotIds = useMemo(() => new Set(jpSpots.map((spot) => spot.id)), [jpSpots]);
  const jpQuestions = useMemo(() => allQuestions.filter((questionItem) => jpSpotIds.has(questionItem.spotId)), [allQuestions, jpSpotIds]);
  const spotsById = useMemo(() => new Map(jpSpots.map((spot) => [spot.id, spot])), [jpSpots]);
  const questionSpotIds = useMemo(() => new Set(jpQuestions.map((questionItem) => questionItem.spotId).filter(Boolean)), [jpQuestions]);
  const quizSpots = useMemo(() => jpSpots.filter((spot) => questionSpotIds.has(spot.id)), [questionSpotIds, jpSpots]);
  const prefectures = useMemo(() => getUniqueSorted(quizSpots.map((spot) => spot.prefecture)), [quizSpots]);
  const cities = useMemo(
    () => getUniqueSorted(quizSpots.filter((spot) => spot.prefecture === selectedPrefecture).map((spot) => spot.city)),
    [quizSpots, selectedPrefecture]
  );

  const question = sessionQuestions[questionIndex];
  const choices = useMemo(() => (question ? buildChoices(question) : []), [question]);
  const currentCorrect = question ? isCorrect(question, answer) : false;
  const correctCount = answerRecords.filter((record) => record.correct).length;
  const scoreRate = sessionQuestions.length > 0 ? Math.round((correctCount / sessionQuestions.length) * 100) : 0;
  const relatedSpot = question ? findRelatedSpot(question, spotsById) : undefined;
  const category = question ? getQuestionCategory(question) : "地域史・史跡";

  function getQuestionsBySpotIds(spotIds: Set<string>) {
    return jpQuestions.filter((questionItem) => spotIds.has(questionItem.spotId));
  }

  function getPointSourceLabel(center: Point) {
    const nearestSpot = quizSpots
      .filter((spot) => spot.lat !== null && spot.lng !== null)
      .map((spot) => ({
        spot,
        distance: calculateDistanceKm(center, { lat: spot.lat as number, lng: spot.lng as number }),
      }))
      .sort((a, b) => a.distance - b.distance)[0]?.spot;

    if (nearestSpot?.prefecture || nearestSpot?.city) {
      return `${nearestSpot.prefecture}${nearestSpot.city}付近から出題`;
    }
    return "選択地点付近から出題";
  }

  function getPointFilteredQuestions(center: Point) {
    const spotDistances = quizSpots
      .filter((spot) => spot.lat !== null && spot.lng !== null)
      .map((spot) => ({
        spot,
        distance: calculateDistanceKm(center, { lat: spot.lat as number, lng: spot.lng as number }),
      }))
      .sort((a, b) => a.distance - b.distance);

    const maxRadius = Math.max(1, Math.ceil(spotDistances[spotDistances.length - 1]?.distance ?? 1));
    let lastQuestions: SpotQuiz[] = [];
    let lastRadius = 1;

    for (let radius = 1; radius <= maxRadius; radius += 1) {
      const targetSpotIds = new Set(
        spotDistances.filter((item) => item.distance <= radius).map((item) => item.spot.id)
      );
      const questions = getQuestionsBySpotIds(targetSpotIds);
      lastQuestions = questions;
      lastRadius = radius;
      if (questions.length >= QUIZ_COUNT) return { questions, radius };
    }

    return { questions: lastQuestions, radius: lastRadius };
  }

  function startQuiz() {
    setFilterStatus("");
    let candidates: SpotQuiz[] = [];
    let statusMessage = "";
    let sourceLabel = "全問題から出題";

    if (filterMode === "all") {
      candidates = jpQuestions;
      sourceLabel = "全問題から出題";
      statusMessage = `${sourceLabel}。対象：${candidates.length}問`;
    }

    if (filterMode === "current") {
      if (!currentLocation) {
        setFilterStatus("現在地を取得してください。");
        return;
      }
      const result = getPointFilteredQuestions(currentLocation);
      candidates = result.questions;
      sourceLabel = getPointSourceLabel(currentLocation);
      statusMessage = `${sourceLabel}。半径${result.radius}km、対象：${candidates.length}問`;
    }

    if (filterMode === "map") {
      if (!mapPoint) {
        setFilterStatus("マップ上で基準点を選択してください。");
        return;
      }
      const result = getPointFilteredQuestions(mapPoint);
      candidates = result.questions;
      sourceLabel = getPointSourceLabel(mapPoint);
      statusMessage = `${sourceLabel}。半径${result.radius}km、対象：${candidates.length}問`;
    }

    if (filterMode === "address") {
      if (!selectedPrefecture || !selectedCity) {
        setFilterStatus("都道府県と市区町村を選択してください。");
        return;
      }
      const targetSpotIds = new Set(
        quizSpots.filter((spot) => spot.prefecture === selectedPrefecture && spot.city === selectedCity).map((spot) => spot.id)
      );
      candidates = getQuestionsBySpotIds(targetSpotIds);
      sourceLabel = `${selectedPrefecture}${selectedCity}から出題`;
      statusMessage = `${sourceLabel}。対象：${candidates.length}問`;
    }

    if (candidates.length === 0) {
      setFilterStatus(`${statusMessage}。出題できる問題がありません。`);
      return;
    }

    if (filterMode !== "address" && candidates.length < QUIZ_COUNT) {
      setFilterStatus(`${statusMessage}。${QUIZ_COUNT}問未満のため開始できません。`);
      return;
    }

    const nextQuestions = shuffle(candidates).slice(0, Math.min(QUIZ_COUNT, candidates.length));

    setSessionSourceLabel(sourceLabel);
    setFilterStatus(statusMessage);
    setSessionQuestions(nextQuestions);
    setMode("playing");
    setQuestionIndex(0);
    setAnswer("");
    setChecked(false);
    setAnswerRecords([]);
  }

  function getCurrentLocation() {
    setFilterStatus("現在地を取得しています。");
    if (!navigator.geolocation) {
      setFilterStatus("このブラウザでは現在地取得を利用できません。");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setFilterStatus("現在地を取得しました。開始できます。");
      },
      () => setFilterStatus("現在地を取得できませんでした。ブラウザの位置情報許可を確認してください。"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function endQuiz() {
    setMode("idle");
    setSessionQuestions([]);
    setQuestionIndex(0);
    setAnswer("");
    setChecked(false);
    setAnswerRecords([]);
  }

  function recordAnswer(nextAnswer: string) {
    if (!question || checked || !nextAnswer.trim()) return;
    setAnswerRecords((current) => [
      ...current.filter((record) => record.quizId !== question.quizId),
      { quizId: question.quizId, answer: nextAnswer, correct: isCorrect(question, nextAnswer) },
    ]);
    setChecked(true);
  }

  function goToNextQuestion() {
    if (!checked) return;
    if (questionIndex >= sessionQuestions.length - 1) {
      setMode("finished");
      setAnswer("");
      setChecked(false);
      return;
    }
    setQuestionIndex((current) => current + 1);
    setAnswer("");
    setChecked(false);
  }

  const answerArea = question && (
    <div className="mt-5">
      {question.format === "choice" ? (
        <div className="space-y-2">
          {choices.map((choice) => {
            const isSelected = answer === choice;
            const isCorrectChoice = isCorrect(question, choice);
            return (
              <button
                key={choice}
                type="button"
                onClick={() => {
                  if (!checked) {
                    setAnswer(choice);
                    recordAnswer(choice);
                  }
                }}
                disabled={checked}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold border ${
                  checked && isCorrectChoice
                    ? "bg-green-500 text-white border-green-300"
                    : checked && isSelected
                      ? "bg-red-900 text-white border-red-500"
                      : "bg-slate-950 text-slate-200 border-slate-600"
                }`}
              >
                {choice}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <input
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            disabled={checked}
            placeholder="答えを入力"
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-600 text-white"
          />
          <button
            type="button"
            onClick={() => recordAnswer(answer)}
            disabled={checked || !answer.trim()}
            className={`mt-3 w-full py-3 rounded-xl font-bold ${checked || !answer.trim() ? "bg-slate-800 text-slate-500" : "bg-yellow-300 text-black"}`}
          >
            答え合わせ
          </button>
        </>
      )}
    </div>
  );

  const navigationArea = (
    <div className="mb-4">
      <p className="mb-2 text-center text-sm font-bold text-slate-300">({questionIndex + 1}/{sessionQuestions.length || QUIZ_COUNT})</p>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => { setQuestionIndex((current) => Math.max(current - 1, 0)); setAnswer(""); setChecked(false); }} disabled={questionIndex === 0} className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-bold text-white disabled:opacity-30">前へ</button>
        <button type="button" onClick={goToNextQuestion} disabled={!checked} className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-bold text-white disabled:opacity-30">次へ</button>
      </div>
      <button type="button" onClick={endQuiz} className="mt-2 w-full rounded-xl bg-slate-600 px-3 py-3 text-sm font-bold text-white">検定トップに戻る</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
      <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
        <Link href="/" className="text-sm text-blue-400 underline font-bold">← TimeWalkへ</Link>
        <header className="text-center my-5">
          <p className="text-xs text-slate-300 mb-1">TimeWalk</p>
          <h1 className="text-2xl font-bold">TimeWalk検定</h1>
          <p className="text-sm text-slate-300 leading-relaxed mt-3">TimeWalkに登録されたスポットから出題します。条件に応じて最大10問に挑戦できます。</p>
        </header>

        {loading && <section className="bg-slate-800 rounded-2xl p-4 mb-4 text-sm text-slate-200">問題を読み込んでいます。</section>}
        {error && <section className="bg-red-900 rounded-2xl p-4 mb-4 text-sm text-white">{error}</section>}

        {!loading && !error && mode === "idle" && (
          <section className="bg-slate-800 rounded-2xl p-4 mb-4">
            <h2 className="text-xl font-bold mb-2">モードを選択してください</h2>
            <div className="grid grid-cols-1 gap-2 mb-4">
              {[
                ["current", "1. 現在地から出題"],
                ["map", "2. 任意の地点から出題"],
                ["address", "3. 市区町村別に出題"],
                ["all", "4. 全問題から出題"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setFilterMode(value as QuizFilterMode);
                    setFilterStatus("");
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold border ${
                    filterMode === value ? "bg-yellow-300 text-black border-yellow-200" : "bg-slate-950 text-white border-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {filterMode === "current" && (
              <div className="mb-4 rounded-xl bg-slate-900 p-3">
                <button type="button" onClick={getCurrentLocation} className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold">現在地を取得</button>
                {currentLocation && <p className="text-xs text-slate-300 mt-2">取得済み：{currentLocation.lat.toFixed(5)}, {currentLocation.lng.toFixed(5)}</p>}
              </div>
            )}

            {filterMode === "map" && (
              <div className="mb-4 rounded-xl bg-slate-900 p-3">
                <p className="text-xs text-slate-300 mb-2">マップをクリックして基準点を選択してください。</p>
                <div ref={mapRef} className="h-64 w-full rounded-xl overflow-hidden bg-slate-700" />
                {mapPoint && <p className="text-xs text-slate-300 mt-2">選択地点：{mapPoint.lat.toFixed(5)}, {mapPoint.lng.toFixed(5)}</p>}
              </div>
            )}

            {filterMode === "address" && (
              <div className="mb-4 rounded-xl bg-slate-900 p-3 space-y-3">
                <select
                  value={selectedPrefecture}
                  onChange={(event) => {
                    setSelectedPrefecture(event.target.value);
                    setSelectedCity("");
                    setFilterStatus("");
                  }}
                  className="w-full rounded-xl bg-slate-950 border border-slate-600 px-3 py-3 text-white"
                >
                  <option value="">都道府県を選択</option>
                  {prefectures.map((prefecture) => <option key={prefecture} value={prefecture}>{prefecture}</option>)}
                </select>
                <select
                  value={selectedCity}
                  onChange={(event) => {
                    setSelectedCity(event.target.value);
                    setFilterStatus("");
                  }}
                  disabled={!selectedPrefecture}
                  className="w-full rounded-xl bg-slate-950 border border-slate-600 px-3 py-3 text-white disabled:opacity-40"
                >
                  <option value="">市区町村を選択</option>
                  {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
            )}

            <p className="text-sm text-slate-300 leading-relaxed mb-4">1と2は10問に達するまで半径を1kmずつ広げます。3は10問未満でも開始できます。</p>
            {filterStatus && <p className="text-sm text-yellow-200 leading-relaxed mb-4">{filterStatus}</p>}
            <button type="button" onClick={startQuiz} disabled={jpQuestions.length === 0} className="w-full bg-yellow-300 text-black py-3 rounded-xl font-bold disabled:opacity-40">開始</button>
          </section>
        )}

        {!loading && !error && mode === "playing" && question && (
          <>
            <section className="bg-slate-800 rounded-2xl p-4 mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold">{sessionSourceLabel}</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">カテゴリ：{category}</p>
              <h2 className="text-lg font-bold leading-relaxed">Q. {question.question}</h2>
              {answerArea}
            </section>

            {checked && (
              <section className={`rounded-2xl p-4 mb-4 ${currentCorrect ? "bg-green-500 text-white" : "bg-red-900 text-white"}`}>
                <h2 className="font-bold mb-2">{currentCorrect ? "正解！" : "不正解"}</h2>
                <p className="text-sm leading-relaxed">{question.explanation || `正解は「${question.correctAnswer}」です。`}</p>
                {relatedSpot && (
                  <p className="text-sm leading-relaxed mt-3">
                    関連スポット：
                    <Link href={`/spot/${encodeURIComponent(relatedSpot.id)}`} target="_blank" rel="noopener noreferrer" className="font-bold underline">{relatedSpot.name}</Link>
                  </p>
                )}
              </section>
            )}

            {navigationArea}
          </>
        )}

        {!loading && !error && mode === "finished" && (
          <section className="bg-slate-800 rounded-2xl p-4 mb-4">
            <h2 className="text-xl font-bold mb-2">結果発表</h2>
            <p className="text-3xl font-bold text-yellow-300 mb-2">{correctCount}/{sessionQuestions.length}問 正解</p>
            <p className="text-sm text-slate-300 mb-4">正答率 {scoreRate}%</p>
            <button type="button" onClick={endQuiz} className="w-full bg-yellow-300 text-black py-3 rounded-xl font-bold">検定トップに戻る</button>
          </section>
        )}
      </div>
    </main>
  );
}
