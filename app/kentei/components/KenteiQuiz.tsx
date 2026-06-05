"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { kenteiQuestions } from "@/data/kentei/questions";
import type { KenteiLevel, KenteiQuestion } from "@/types/kentei";

const QUESTION_TIME_LIMIT_SECONDS = 30;
const SESSION_QUESTION_COUNT = 10;

const levelLabels: Record<KenteiLevel, string> = {
  1: "レベル1 入門",
  2: "レベル2 基礎",
  3: "レベル3 標準",
  4: "レベル4 発展",
  5: "レベル5 達人",
};

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(/[\s　]/g, "");
}

function isCorrect(question: KenteiQuestion, answer: string) {
  const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
  return answers.some((item) => normalizeAnswer(item) === normalizeAnswer(answer));
}

function getAnswerText(question: KenteiQuestion) {
  return Array.isArray(question.answer) ? question.answer[0] : question.answer;
}

function hashText(value: string) {
  return value.split("").reduce((hash, char) => hash + char.charCodeAt(0), 0);
}

function buildSessionQuestions(
  questions: KenteiQuestion[],
  selectedLevel: KenteiLevel | "all",
  seed: number
) {
  const filtered =
    selectedLevel === "all"
      ? questions
      : questions.filter((question) => question.level === selectedLevel);

  return [...filtered]
    .sort((a, b) => {
      const aScore = (hashText(a.id) * 31 + seed * 17) % 997;
      const bScore = (hashText(b.id) * 31 + seed * 17) % 997;
      return aScore - bScore;
    })
    .slice(0, SESSION_QUESTION_COUNT);
}

export default function KenteiQuiz() {
  const [selectedLevel, setSelectedLevel] = useState<KenteiLevel | "all">("all");
  const [sessionSeed, setSessionSeed] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([]);
  const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  const questions = useMemo(
    () => buildSessionQuestions(kenteiQuestions, selectedLevel, sessionSeed),
    [selectedLevel, sessionSeed]
  );

  const question = questions[questionIndex];
  const currentCorrect = question ? isCorrect(question, answer) : false;
  const finished = questionIndex >= questions.length;
  const progressText = `${Math.min(questionIndex + 1, questions.length)}/${questions.length}`;
  const elapsedSeconds = Math.floor((now - questionStartedAt) / 1000);
  const timeLeft = checked || finished
    ? Math.max(0, QUESTION_TIME_LIMIT_SECONDS - elapsedSeconds)
    : Math.max(0, QUESTION_TIME_LIMIT_SECONDS - elapsedSeconds);
  const scoreRate = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  function resetQuestionState() {
    setAnswer("");
    setChecked(false);
    setTimedOut(false);
    const nextStartedAt = Date.now();
    setQuestionStartedAt(nextStartedAt);
    setNow(nextStartedAt);
  }

  function resetQuiz(nextLevel = selectedLevel) {
    setSelectedLevel(nextLevel);
    setSessionSeed((current) => current + 1);
    setQuestionIndex(0);
    setCorrectCount(0);
    setAnsweredQuestionIds([]);
    resetQuestionState();
  }

  const submitAnswer = useCallback(
    (nextAnswer: string, options?: { timedOut?: boolean }) => {
      if (!question || checked) return;

      const nextCorrect = !options?.timedOut && isCorrect(question, nextAnswer);
      setAnswer(nextAnswer);
      setTimedOut(Boolean(options?.timedOut));

      if (nextCorrect) {
        setCorrectCount((current) => current + 1);
      }

      setAnsweredQuestionIds((current) =>
        current.includes(question.id) ? current : [...current, question.id]
      );
      setChecked(true);
    },
    [checked, question]
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 250);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!question || checked || finished) return;

    const timeoutId = window.setTimeout(() => {
      submitAnswer("", { timedOut: true });
    }, Math.max(0, QUESTION_TIME_LIMIT_SECONDS - elapsedSeconds) * 1000);

    return () => window.clearTimeout(timeoutId);
  }, [checked, elapsedSeconds, finished, question, submitAnswer]);

  function nextQuestion() {
    setQuestionIndex((current) => Math.min(current + 1, questions.length));
    resetQuestionState();
  }

  function submitInputAnswer() {
    if (!answer.trim()) return;
    submitAnswer(answer);
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
      <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
        <Link href="/" className="text-sm text-blue-400 underline font-bold">
          ← TimeWalkへ
        </Link>

        <header className="text-center my-5">
          <p className="text-xs text-slate-300 mb-1">Yuru Rekishi Sanpo</p>
          <h1 className="text-2xl font-bold">ゆる歴史散歩検定</h1>
          <p className="text-sm text-slate-300 leading-relaxed mt-3">
            1回{SESSION_QUESTION_COUNT}問。制限時間内に答えて、歴史知識を確認します。
          </p>
        </header>

        <section className="bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-700">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="font-bold">難易度</h2>
            <span className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold">
              全{kenteiQuestions.length}問
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => resetQuiz("all")}
              className={`py-2 rounded-xl text-sm font-bold ${
                selectedLevel === "all" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-200"
              }`}
            >
              全レベル
            </button>
            {([1, 2, 3, 4, 5] as KenteiLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => resetQuiz(level)}
                className={`py-2 rounded-xl text-sm font-bold ${
                  selectedLevel === level ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-200"
                }`}
              >
                Lv.{level}
              </button>
            ))}
          </div>
        </section>

        {finished ? (
          <section className="bg-slate-800 rounded-2xl p-4 mb-4">
            <h2 className="text-xl font-bold mb-2">結果発表</h2>
            <p className="text-3xl font-bold text-yellow-300 mb-2">
              {correctCount}/{questions.length}問 正解
            </p>
            <p className="text-sm text-slate-300 mb-4">正答率 {scoreRate}%</p>
            <p className="text-sm leading-relaxed mb-4">
              {scoreRate >= 80
                ? "合格！ゆる歴史散歩マスターに近づいています。"
                : "もう一度挑戦して、解説を読みながら復習してみよう。"}
            </p>
            <button
              type="button"
              onClick={() => resetQuiz()}
              className="w-full bg-yellow-300 text-black py-3 rounded-xl font-bold"
            >
              もう一度10問に挑戦
            </button>
          </section>
        ) : question ? (
          <>
            <section className="bg-slate-800 rounded-2xl p-4 mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold">
                  {levelLabels[question.level]}
                </span>
                <span className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded-full font-bold">
                  {question.format === "choice" ? "選択式" : "入力式"}
                </span>
                <span className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded-full font-bold">
                  {progressText}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>制限時間</span>
                  <span className={timeLeft <= 5 && !checked ? "text-red-300" : "text-yellow-300"}>
                    残り{timeLeft}秒
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full ${timeLeft <= 5 && !checked ? "bg-red-400" : "bg-yellow-300"}`}
                    style={{ width: `${(timeLeft / QUESTION_TIME_LIMIT_SECONDS) * 100}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-2">カテゴリ：{question.category}</p>
              <h2 className="text-lg font-bold leading-relaxed">{question.question}</h2>
            </section>

            <section className="bg-slate-800 rounded-2xl p-4 mb-4">
              {question.format === "choice" && question.choices ? (
                <div className="space-y-2">
                  {question.choices.map((choice) => {
                    const selected = answer === choice;
                    const correctChoice = isCorrect(question, choice);
                    const checkedClass = checked
                      ? correctChoice
                        ? "bg-green-500 text-white border-green-300"
                        : selected
                          ? "bg-red-900 text-white border-red-400"
                          : "bg-slate-950 text-slate-500 border-slate-700"
                      : selected
                        ? "bg-blue-500 text-white border-blue-300"
                        : "bg-slate-950 text-slate-200 border-slate-600";

                    return (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => submitAnswer(choice)}
                        disabled={checked}
                        className={`w-full text-left px-4 py-3 rounded-xl font-bold border ${checkedClass}`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") submitInputAnswer();
                    }}
                    disabled={checked}
                    placeholder="答えを入力"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-600 text-white"
                  />
                  <button
                    type="button"
                    onClick={submitInputAnswer}
                    disabled={checked || !answer.trim()}
                    className={`w-full py-3 rounded-xl font-bold ${
                      checked || !answer.trim() ? "bg-slate-800 text-slate-500" : "bg-yellow-300 text-black"
                    }`}
                  >
                    入力式の答えを確定
                  </button>
                </div>
              )}
            </section>

            {checked && (
              <section
                className={`rounded-2xl p-4 mb-4 ${
                  currentCorrect ? "bg-green-500 text-white" : "bg-red-900 text-white"
                }`}
              >
                <h2 className="font-bold mb-2">
                  {timedOut ? "時間切れ" : currentCorrect ? "正解！" : "不正解"}
                </h2>
                {!currentCorrect && (
                  <p className="text-sm font-bold mb-2">正解：{getAnswerText(question)}</p>
                )}
                <p className="text-sm leading-relaxed">{question.explanation}</p>
              </section>
            )}

            <button
              type="button"
              onClick={nextQuestion}
              disabled={!checked}
              className={`w-full py-3 rounded-xl font-bold mb-4 ${
                checked ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-500"
              }`}
            >
              次へ
            </button>
          </>
        ) : null}

        <p className="text-xs text-slate-500 text-center">
          回答済み：{answeredQuestionIds.length}問 / 今回の出題：{questions.length}問
        </p>
      </div>
    </main>
  );
}
