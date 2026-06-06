"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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

const SPOT_QUIZZES_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub?gid=987654321&single=true&output=csv";

const levelLabels: Record<number, string> = {
  1: "レベル1",
  2: "レベル2",
  3: "レベル3",
  4: "レベル4",
  5: "レベル5",
};

function parseCsv(text: string) {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i += 1;
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  return rows.filter((item) => item.some((cell) => cell.trim() !== ""));
}

function csvToObjects(text: string) {
  const rows = parseCsv(text);
  const headers = rows[0] ?? [];

  return rows.slice(1).map((row) =>
    headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = row[index] ?? "";
      return acc;
    }, {})
  );
}

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(/[\s　]/g, "");
}

function isCorrect(question: SpotQuiz, answer: string) {
  return normalizeAnswer(question.correctAnswer) === normalizeAnswer(answer);
}

function stableShuffle(items: string[], seed: string) {
  const next = [...items];
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  for (let i = next.length - 1; i > 0; i -= 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const j = hash % (i + 1);
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
}

function buildChoices(question: SpotQuiz) {
  const wrongAnswers = question.wrongAnswers
    .filter((item) => item.trim())
    .filter((item) => normalizeAnswer(item) !== normalizeAnswer(question.correctAnswer));
  const uniqueWrongAnswers = Array.from(new Set(wrongAnswers));
  const choices = [question.correctAnswer, ...stableShuffle(uniqueWrongAnswers, question.quizId).slice(0, 3)];
  return stableShuffle(choices, `${question.quizId}-choices`);
}

function convertRow(row: Record<string, string>): SpotQuiz | null {
  const quizId = row.quizId?.trim();
  const question = row.question?.trim();
  const correctAnswer = row.correctAnswer?.trim();
  const isActive = row.isActive?.trim().toLowerCase();

  if (!quizId || !question || !correctAnswer) return null;
  if (isActive && !["true", "yes", "1"].includes(isActive)) return null;

  return {
    quizId,
    spotId: row.spotId?.trim() ?? "",
    level: Number(row.level) || 1,
    format: row.format?.trim() === "input" ? "input" : "choice",
    question,
    correctAnswer,
    wrongAnswers: [
      row.wrongAnswer1,
      row.wrongAnswer2,
      row.wrongAnswer3,
      row.wrongAnswer4,
      row.wrongAnswer5,
      row.wrongAnswer6,
    ].filter((item): item is string => Boolean(item?.trim())),
    explanation: row.explanation?.trim() ?? "",
    sourceField: row.sourceField?.trim() ?? "",
    tags: row.tags?.trim() ?? "",
    isActive: true,
  };
}

export default function KenteiQuiz() {
  const [questions, setQuestions] = useState<SpotQuiz[]>([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${SPOT_QUIZZES_URL}&cacheBust=${Date.now()}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`spot_quizzesを取得できませんでした: ${response.status}`);
        }

        const csvText = await response.text();
        const rows = csvToObjects(csvText);
        const nextQuestions = rows
          .map(convertRow)
          .filter((item): item is SpotQuiz => Boolean(item));

        if (nextQuestions.length === 0) {
          throw new Error("spot_quizzesに有効な問題がありません。");
        }

        setQuestions(nextQuestions);
        setSelectedLevel(nextQuestions[0]?.level ?? 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "問題の読み込みに失敗しました。");
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  const availableLevels = useMemo(
    () => Array.from(new Set(questions.map((question) => question.level))).sort((a, b) => a - b),
    [questions]
  );

  const visibleQuestions = useMemo(
    () => questions.filter((question) => question.level === selectedLevel),
    [questions, selectedLevel]
  );

  const question = visibleQuestions[questionIndex];
  const choices = useMemo(() => (question ? buildChoices(question) : []), [question]);
  const currentCorrect = question ? isCorrect(question, answer) : false;
  const finished = questionIndex >= visibleQuestions.length && visibleQuestions.length > 0;
  const scoreRate = visibleQuestions.length > 0 ? Math.round((correctCount / visibleQuestions.length) * 100) : 0;

  function resetForLevel(level: number) {
    setSelectedLevel(level);
    setQuestionIndex(0);
    setAnswer("");
    setChecked(false);
    setCorrectCount(0);
  }

  function checkAnswer(nextAnswer = answer) {
    if (!question || checked || !nextAnswer.trim()) return;

    if (isCorrect(question, nextAnswer)) {
      setCorrectCount((current) => current + 1);
    }

    setChecked(true);
  }

  function selectChoice(choice: string) {
    if (checked) return;
    setAnswer(choice);
    checkAnswer(choice);
  }

  function goToPreviousQuestion() {
    setQuestionIndex((current) => Math.max(current - 1, 0));
    setAnswer("");
    setChecked(false);
  }

  function goToNextQuestion() {
    setQuestionIndex((current) => Math.min(current + 1, visibleQuestions.length));
    setAnswer("");
    setChecked(false);
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
      <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
        <Link href="/" className="text-sm text-blue-400 underline font-bold">
          ← TimeWalkへ
        </Link>

        <header className="text-center my-5">
          <p className="text-xs text-slate-300 mb-1">TimeWalk</p>
          <h1 className="text-2xl font-bold">TimeWalk検定</h1>
          <p className="text-sm text-slate-300 leading-relaxed mt-3">
            TimeWalkに登録されたスポットから出題します。地域や現在地で絞り込む準備を進めています。
          </p>
        </header>

        {loading && (
          <section className="bg-slate-800 rounded-2xl p-4 mb-4 text-sm text-slate-200">
            問題を読み込んでいます。
          </section>
        )}

        {error && (
          <section className="bg-red-900 rounded-2xl p-4 mb-4 text-sm text-white">
            {error}
          </section>
        )}

        {!loading && !error && (
          <>
            <section className="mb-4">
              <div className="flex flex-wrap gap-2">
                {availableLevels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => resetForLevel(level)}
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      selectedLevel === level
                        ? "bg-yellow-300 text-black"
                        : "bg-slate-700 text-slate-200"
                    }`}
                  >
                    {levelLabels[level] ?? `レベル${level}`}
                  </button>
                ))}
              </div>
            </section>

            {finished ? (
              <section className="bg-slate-800 rounded-2xl p-4 mb-4">
                <h2 className="text-xl font-bold mb-2">結果発表</h2>
                <p className="text-3xl font-bold text-yellow-300 mb-2">
                  {correctCount}/{visibleQuestions.length}問 正解
                </p>
                <p className="text-sm text-slate-300 mb-4">正答率 {scoreRate}%</p>
                <button
                  type="button"
                  onClick={() => resetForLevel(selectedLevel)}
                  className="w-full bg-yellow-300 text-black py-3 rounded-xl font-bold"
                >
                  もう一度挑戦
                </button>
              </section>
            ) : question ? (
              <>
                <section className="bg-slate-800 rounded-2xl p-4 mb-4">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold">
                      {levelLabels[question.level] ?? `レベル${question.level}`}
                    </span>
                    <span className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded-full font-bold">
                      {questionIndex + 1}/{visibleQuestions.length}問目
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-2">カテゴリ：{question.tags || question.sourceField}</p>
                  <h2 className="text-lg font-bold leading-relaxed mb-4">{question.question}</h2>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={goToPreviousQuestion}
                      disabled={questionIndex === 0}
                      className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-bold text-white disabled:opacity-30"
                    >
                      前へ
                    </button>
                    <button
                      type="button"
                      onClick={goToNextQuestion}
                      disabled={!checked}
                      className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-bold text-white disabled:opacity-30"
                    >
                      次へ
                    </button>
                  </div>
                </section>

                <section className="bg-slate-800 rounded-2xl p-4 mb-4">
                  {question.format === "choice" ? (
                    <div className="space-y-2">
                      {choices.map((choice) => {
                        const isSelected = answer === choice;
                        const isCorrectChoice = isCorrect(question, choice);

                        return (
                          <button
                            key={choice}
                            type="button"
                            onClick={() => selectChoice(choice)}
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
                        onClick={() => checkAnswer()}
                        disabled={checked || !answer.trim()}
                        className={`mt-3 w-full py-3 rounded-xl font-bold ${
                          checked || !answer.trim()
                            ? "bg-slate-800 text-slate-500"
                            : "bg-yellow-300 text-black"
                        }`}
                      >
                        答え合わせ
                      </button>
                    </>
                  )}
                </section>

                {checked && (
                  <section
                    className={`rounded-2xl p-4 mb-4 ${
                      currentCorrect ? "bg-green-500 text-white" : "bg-red-900 text-white"
                    }`}
                  >
                    <h2 className="font-bold mb-2">{currentCorrect ? "正解！" : "不正解"}</h2>
                    <p className="text-sm leading-relaxed">
                      {question.explanation || `正解は「${question.correctAnswer}」です。`}
                    </p>
                  </section>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousQuestion}
                    disabled={questionIndex === 0}
                    className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-bold text-white disabled:opacity-30"
                  >
                    前へ
                  </button>
                  <button
                    type="button"
                    onClick={goToNextQuestion}
                    disabled={!checked}
                    className="rounded-xl bg-slate-700 px-3 py-3 text-sm font-bold text-white disabled:opacity-30"
                  >
                    次へ
                  </button>
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
