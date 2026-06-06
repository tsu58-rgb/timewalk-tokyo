"use client";

import { useState } from "react";
import Link from "next/link";

import { kenteiQuestions } from "@/data/kentei/questions";
import type { KenteiLevel, KenteiQuestion } from "@/types/kentei";

const SESSION_QUESTION_COUNT = 10;

const levelLabels: Record<KenteiLevel, string> = {
  1: "レベル1 入門",
  2: "レベル2 基礎",
  3: "レベル3 標準",
  4: "レベル4 発展",
  5: "レベル5 達人",
};

type QuizPhase = "start" | "quiz" | "results";

type QuestionResponse = {
  answer: string;
  correct: boolean;
};

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(/[\s　]/g, "");
}

function isCorrect(question: KenteiQuestion, answer: string) {
  const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
  return answers.some((item) => normalizeAnswer(item) === normalizeAnswer(answer));
}

function shuffle<T>(items: readonly T[]) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function createSessionQuestions(allQuestions: KenteiQuestion[]) {
  return shuffle(allQuestions)
    .slice(0, SESSION_QUESTION_COUNT)
    .map((question) => ({
      ...question,
      choices: question.choices ? shuffle(question.choices) : undefined,
    }));
}

export default function KenteiQuiz() {
  const [phase, setPhase] = useState<QuizPhase>("start");
  const [sessionQuestions, setSessionQuestions] = useState<KenteiQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [responses, setResponses] = useState<Record<string, QuestionResponse>>({});

  const question = sessionQuestions[questionIndex];
  const answer = question ? (draftAnswers[question.id] ?? "") : "";
  const response = question ? responses[question.id] : undefined;
  const checked = response !== undefined;
  const correctCount = Object.values(responses).filter((item) => item.correct).length;
  const scoreRate =
    sessionQuestions.length > 0
      ? Math.round((correctCount / sessionQuestions.length) * 100)
      : 0;

  function startQuiz() {
    const questions = createSessionQuestions(kenteiQuestions);
    setSessionQuestions(questions);
    setQuestionIndex(0);
    setDraftAnswers({});
    setResponses({});
    setPhase(questions.length > 0 ? "quiz" : "start");
  }

  function endQuiz() {
    setPhase("start");
    setSessionQuestions([]);
    setQuestionIndex(0);
    setDraftAnswers({});
    setResponses({});
  }

  function updateDraftAnswer(value: string) {
    if (!question || checked) return;

    setDraftAnswers((current) => ({
      ...current,
      [question.id]: value,
    }));
  }

  function checkAnswer(nextAnswer = answer) {
    if (!question || checked || !nextAnswer.trim()) return;

    setDraftAnswers((current) => ({
      ...current,
      [question.id]: nextAnswer,
    }));
    setResponses((current) => ({
      ...current,
      [question.id]: {
        answer: nextAnswer,
        correct: isCorrect(question, nextAnswer),
      },
    }));
  }

  function selectChoice(choice: string) {
    if (checked) return;
    checkAnswer(choice);
  }

  function previousQuestion() {
    setQuestionIndex((current) => Math.max(current - 1, 0));
  }

  function nextQuestion() {
    if (!checked) return;

    if (questionIndex >= sessionQuestions.length - 1) {
      setPhase("results");
      return;
    }

    setQuestionIndex((current) => current + 1);
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
            全{kenteiQuestions.length}問からランダムに選ばれた10問に挑戦しよう。
          </p>
        </header>

        {phase === "start" ? (
          <section className="bg-slate-800 rounded-2xl p-5 border border-slate-700 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-300 text-3xl">
              問
            </div>
            <h2 className="text-xl font-bold mb-2">10問検定に挑戦</h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              開始するたびに、読み込んだ全問題から新しく10問を選んで出題する。
            </p>
            <button
              type="button"
              onClick={startQuiz}
              disabled={kenteiQuestions.length === 0}
              className="w-full bg-yellow-300 text-black py-3 rounded-xl font-bold disabled:bg-slate-700 disabled:text-slate-400"
            >
              開始
            </button>
          </section>
        ) : phase === "results" ? (
          <section className="bg-slate-800 rounded-2xl p-5 mb-4 text-center">
            <h2 className="text-xl font-bold mb-4">結果発表</h2>
            <p className="text-sm text-slate-300 mb-1">正解数</p>
            <p className="text-4xl font-bold text-yellow-300 mb-3">{correctCount}問</p>
            <p className="text-lg font-bold mb-1">
              {sessionQuestions.length}問中{correctCount}問正解
            </p>
            <p className="text-sm text-slate-300 mb-4">正答率 {scoreRate}%</p>
            <p className="text-sm leading-relaxed mb-5">
              {scoreRate >= 80
                ? "合格！ゆる歴史散歩マスターに近づいています。"
                : "もう一度挑戦して、解説を読みながら復習してみよう。"}
            </p>
            <button
              type="button"
              onClick={endQuiz}
              className="w-full bg-yellow-300 text-black py-3 rounded-xl font-bold"
            >
              初期画面へ
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
                  {sessionQuestions.length}問中{questionIndex + 1}問目
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-2">カテゴリ：{question.category}</p>
              <h2 className="text-lg font-bold leading-relaxed">{question.question}</h2>
            </section>

            <section className="bg-slate-800 rounded-2xl p-4 mb-4">
              {question.format === "choice" && question.choices ? (
                <div className="space-y-2">
                  {question.choices.map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => selectChoice(choice)}
                      disabled={checked}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold border disabled:cursor-default ${
                        answer === choice
                          ? "bg-blue-500 text-white border-blue-300"
                          : "bg-slate-950 text-slate-200 border-slate-600"
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  value={answer}
                  onChange={(event) => updateDraftAnswer(event.target.value)}
                  disabled={checked}
                  placeholder="答えを入力"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-600 text-white"
                />
              )}
            </section>

            {checked && (
              <section
                className={`rounded-2xl p-4 mb-4 ${
                  response.correct ? "bg-green-500 text-white" : "bg-red-900 text-white"
                }`}
              >
                <h2 className="font-bold mb-2">{response.correct ? "正解！" : "不正解"}</h2>
                <p className="text-sm leading-relaxed">{question.explanation}</p>
              </section>
            )}

            {question.format === "input" && (
              <button
                type="button"
                onClick={() => checkAnswer()}
                disabled={checked || !answer.trim()}
                className={`w-full py-3 rounded-xl font-bold mb-2 ${
                  checked || !answer.trim()
                    ? "bg-slate-800 text-slate-500"
                    : "bg-yellow-300 text-black"
                }`}
              >
                答え合わせ
              </button>
            )}

            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={previousQuestion}
                disabled={questionIndex === 0}
                className="py-3 rounded-xl bg-slate-700 font-bold disabled:bg-slate-800 disabled:text-slate-500"
              >
                前へ
              </button>
              <button
                type="button"
                onClick={nextQuestion}
                disabled={!checked}
                className={`py-3 rounded-xl font-bold ${
                  checked ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-500"
                }`}
              >
                {questionIndex === sessionQuestions.length - 1 ? "結果を見る" : "次へ"}
              </button>
            </div>

            <button
              type="button"
              onClick={endQuiz}
              className="w-full py-3 rounded-xl border border-red-400 text-red-300 font-bold mb-4"
            >
              終了
            </button>

            <p className="text-xs text-slate-500 text-center">
              回答済み：{Object.keys(responses).length}問 / 全{sessionQuestions.length}問
            </p>
          </>
        ) : null}
      </div>
    </main>
  );
}
