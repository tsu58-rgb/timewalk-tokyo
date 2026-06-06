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

type QuizMode = "idle" | "playing" | "finished";

type AnswerRecord = {
  quizId: string;
  answer: string;
  correct: boolean;
};

const SPOT_QUIZZES_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub?gid=987654321&single=true&output=csv";

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
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
      if (char === "\r" && next === "\n") i += 1;
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

  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
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

  const uniqueWrongAnswers = Array.from(new Set(wrongAnswers));
  return shuffle([question.correctAnswer, ...shuffle(uniqueWrongAnswers).slice(0, 3)]);
}

export default function KenteiQuiz() {
  const [allQuestions, setAllQuestions] = useState<SpotQuiz[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<SpotQuiz[]>([]);
  const [mode, setMode] = useState<QuizMode>("idle");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
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
        const questions = rows
          .map(convertRow)
          .filter((item): item is SpotQuiz => Boolean(item));

        if (questions.length === 0) {
          throw new Error("spot_quizzesに有効な問題がありません。");
        }

        setAllQuestions(questions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "問題の読み込みに失敗しました。");
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  const question = sessionQuestions[questionIndex];
  const choices = useMemo(() => (question ? buildChoices(question) : []), [question]);
  const currentCorrect = question ? isCorrect(question, answer) : false;
  const correctCount = answerRecords.filter((record) => record.correct).length;
  const scoreRate =
    sessionQuestions.length > 0 ? Math.round((correctCount / sessionQuestions.length) * 100) : 0;

  function startQuiz() {
    const selected = shuffle(allQuestions).slice(0, 10);

    setSessionQuestions(selected);
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

  function finishQuiz() {
    setMode("finished");
    setAnswer("");
    setChecked(false);
  }

  function recordAnswer(nextAnswer: string) {
    if (!question || checked || !nextAnswer.trim()) return;

    const correct = isCorrect(question, nextAnswer);

    setAnswerRecords((current) => [
      ...current.filter((record) => record.quizId !== question.quizId),
      {
        quizId: question.quizId,
        answer: nextAnswer,
        correct,
      },
    ]);

    setChecked(true);
  }

  function selectChoice(choice: string) {
    if (checked) return;
    setAnswer(choice);
    recordAnswer(choice);
  }

  function goToPreviousQuestion() {
    setQuestionIndex((current) => Math.max(current - 1, 0));
    setAnswer("");
    setChecked(false);
  }

  function goToNextQuestion() {
    if (!checked) return;

    if (questionIndex >= sessionQuestions.length - 1) {
      finishQuiz();
      return;
    }

    setQuestionIndex((current) => current + 1);
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
            TimeWalkに登録されたスポットから出題します。ランダムに選ばれた10問に挑戦できます。
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

        {!loading && !error && mode === "idle" && (
          <section className="bg-slate-800 rounded-2xl p-4 mb-4">
            <h2 className="text-xl font-bold mb-2">検定を開始</h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              登録済みの問題からランダムに10問を選んで出題します。開始するたびに問題と順番が変わります。
            </p>
            <button
              type="button"
              onClick={startQuiz}
              disabled={allQuestions.length === 0}
              className="w-full bg-yellow-300 text-black py-3 rounded-xl font-bold disabled:opacity-40"
            >
              開始
            </button>
          </section>
        )}

        {!loading && !error && mode === "playing" && question && (
          <>
            <section className="bg-slate-800 rounded-2xl p-4 mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold">
                  レベル{question.level}
                </span>
                <span className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded-full font-bold">
                  10問中{questionIndex + 1}問目
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-2">
                カテゴリ：{question.tags || question.sourceField}
              </p>
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

              <button
                type="button"
                onClick={endQuiz}
                className="mt-2 w-full rounded-xl bg-slate-600 px-3 py-3 text-sm font-bold text-white"
              >
                終了
              </button>
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
                    onClick={() => recordAnswer(answer)}
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
          </>
        )}

        {!loading && !error && mode === "finished" && (
          <section className="bg-slate-800 rounded-2xl p-4 mb-4">
            <h2 className="text-xl font-bold mb-2">結果発表</h2>
            <p className="text-3xl font-bold text-yellow-300 mb-2">
              {correctCount}/{sessionQuestions.length}問 正解
            </p>
            <p className="text-sm text-slate-300 mb-4">正答率 {scoreRate}%</p>
            <button
              type="button"
              onClick={endQuiz}
              className="w-full bg-yellow-300 text-black py-3 rounded-xl font-bold"
            >
              初期画面に戻る
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
