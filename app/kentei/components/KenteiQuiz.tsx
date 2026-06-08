"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Papa from "papaparse";

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

type SpotInfo = { id: string; name: string };
type QuizMode = "idle" | "playing" | "finished";
type AnswerRecord = { quizId: string; answer: string; correct: boolean };
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

const BASE_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub";
const SPOT_QUIZZES_URL = `${BASE_URL}?gid=987654321&single=true&output=csv`;
const SPOTS_URL = `${BASE_URL}?gid=1242477641&single=true&output=csv`;

function parseCsvObjects(text: string) {
  const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
  return parsed.data;
}

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(/[\s　]/g, "");
}

function normalizeSearchText(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s　「」『』（）()・･,、。\.]/g, "");
}

function isCorrect(question: SpotQuiz, answer: string) {
  return normalizeAnswer(question.correctAnswer) === normalizeAnswer(answer);
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
  return id && name ? { id, name } : null;
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

function findRelatedSpot(question: SpotQuiz, spotsById: Record<string, SpotInfo>, spots: SpotInfo[]) {
  const text = normalizeSearchText(`${question.question} ${question.explanation} ${question.tags}`);
  const textMatch = spots
    .filter((spot) => {
      const name = normalizeSearchText(spot.name);
      return name.length >= 2 && text.includes(name);
    })
    .sort((a, b) => normalizeSearchText(b.name).length - normalizeSearchText(a.name).length)[0];
  return textMatch ?? (question.spotId ? spotsById[question.spotId] : undefined);
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

export default function KenteiQuiz() {
  const [allQuestions, setAllQuestions] = useState<SpotQuiz[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<SpotQuiz[]>([]);
  const [spots, setSpots] = useState<SpotInfo[]>([]);
  const [spotMap, setSpotMap] = useState<Record<string, SpotInfo>>({});
  const [mode, setMode] = useState<QuizMode>("idle");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const [quizResponse, spotsResponse] = await Promise.all([
          fetch(`${SPOT_QUIZZES_URL}&cacheBust=${Date.now()}`, { cache: "no-store" }),
          fetch(`${SPOTS_URL}&cacheBust=${Date.now()}`, { cache: "no-store" }),
        ]);
        if (!quizResponse.ok) throw new Error(`spot_quizzesを取得できませんでした: ${quizResponse.status}`);

        const questions = parseCsvObjects(await quizResponse.text()).map(convertRow).filter((item): item is SpotQuiz => Boolean(item));
        if (questions.length === 0) throw new Error("spot_quizzesに有効な問題がありません。");
        setAllQuestions(questions);

        if (spotsResponse.ok) {
          const loadedSpots = parseCsvObjects(await spotsResponse.text()).map(convertSpotRow).filter((item): item is SpotInfo => Boolean(item));
          setSpots(loadedSpots);
          setSpotMap(Object.fromEntries(loadedSpots.map((spot) => [spot.id, spot])));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "問題の読み込みに失敗しました。");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const question = sessionQuestions[questionIndex];
  const choices = useMemo(() => (question ? buildChoices(question) : []), [question]);
  const currentCorrect = question ? isCorrect(question, answer) : false;
  const correctCount = answerRecords.filter((record) => record.correct).length;
  const scoreRate = sessionQuestions.length > 0 ? Math.round((correctCount / sessionQuestions.length) * 100) : 0;
  const relatedSpot = question ? findRelatedSpot(question, spotMap, spots) : undefined;
  const category = question ? getQuestionCategory(question) : "地域史・史跡";

  function startQuiz() {
    setSessionQuestions(shuffle(allQuestions).slice(0, 10));
    setMode("playing");
    setQuestionIndex(0);
    setAnswer("");
    setChecked(false);
    setAnswerRecords([]);
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
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => { setQuestionIndex((current) => Math.max(current - 1, 0)); setAnswer(""); setChecked(false); }} disabled={questionIndex === 0} className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-bold text-white disabled:opacity-30">前へ</button>
        <button type="button" onClick={goToNextQuestion} disabled={!checked} className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-bold text-white disabled:opacity-30">次へ</button>
      </div>
      <button type="button" onClick={endQuiz} className="mt-2 w-full rounded-xl bg-slate-600 px-3 py-3 text-sm font-bold text-white">終了</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
      <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
        <Link href="/" className="text-sm text-blue-400 underline font-bold">← TimeWalkへ</Link>
        <header className="text-center my-5">
          <p className="text-xs text-slate-300 mb-1">TimeWalk</p>
          <h1 className="text-2xl font-bold">TimeWalk検定</h1>
          <p className="text-sm text-slate-300 leading-relaxed mt-3">TimeWalkに登録されたスポットから出題します。ランダムに選ばれた10問に挑戦できます。</p>
        </header>

        {loading && <section className="bg-slate-800 rounded-2xl p-4 mb-4 text-sm text-slate-200">問題を読み込んでいます。</section>}
        {error && <section className="bg-red-900 rounded-2xl p-4 mb-4 text-sm text-white">{error}</section>}

        {!loading && !error && mode === "idle" && (
          <section className="bg-slate-800 rounded-2xl p-4 mb-4">
            <h2 className="text-xl font-bold mb-2">検定を開始</h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">登録済みの問題からランダムに10問を選んで出題します。開始するたびに問題と順番が変わります。</p>
            <button type="button" onClick={startQuiz} disabled={allQuestions.length === 0} className="w-full bg-yellow-300 text-black py-3 rounded-xl font-bold disabled:opacity-40">開始</button>
          </section>
        )}

        {!loading && !error && mode === "playing" && question && (
          <>
            <section className="bg-slate-800 rounded-2xl p-4 mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold">レベル{question.level}</span>
                <span className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded-full font-bold">10問中{questionIndex + 1}問目</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">カテゴリ：{category}</p>
              <h2 className="text-lg font-bold leading-relaxed">{question.question}</h2>
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
            <button type="button" onClick={endQuiz} className="w-full bg-yellow-300 text-black py-3 rounded-xl font-bold">初期画面に戻る</button>
          </section>
        )}
      </div>
    </main>
  );
}
