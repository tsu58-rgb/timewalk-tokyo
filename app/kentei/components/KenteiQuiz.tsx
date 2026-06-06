"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { kenteiQuestions } from "@/data/kentei/questions";
import type { KenteiLevel, KenteiQuestion } from "@/types/kentei";

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

export default function KenteiQuiz() {
  const [selectedLevel, setSelectedLevel] = useState<KenteiLevel | "all">("all");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([]);

  const questions = useMemo(() => {
    const filtered =
      selectedLevel === "all"
        ? kenteiQuestions
        : kenteiQuestions.filter((question) => question.level === selectedLevel);
    return filtered;
  }, [selectedLevel]);

  const question = questions[questionIndex];
  const currentCorrect = question ? isCorrect(question, answer) : false;
  const progressText = `${Math.min(questionIndex + 1, questions.length)}/${questions.length}`;

  function resetQuiz(nextLevel = selectedLevel) {
    setSelectedLevel(nextLevel);
    setQuestionIndex(0);
    setAnswer("");
    setChecked(false);
    setCorrectCount(0);
    setAnsweredQuestionIds([]);
  }

  function checkAnswer() {
    if (!question || checked || !answer.trim()) return;

    if (isCorrect(question, answer)) {
      setCorrectCount((current) => current + 1);
    }

    setAnsweredQuestionIds((current) =>
      current.includes(question.id) ? current : [...current, question.id]
    );
    setChecked(true);
  }

  function nextQuestion() {
    setQuestionIndex((current) => Math.min(current + 1, questions.length));
    setAnswer("");
    setChecked(false);
  }

  const finished = questionIndex >= questions.length;
  const scoreRate = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

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
            {kenteiQuestions.length}問の歴史問題に挑戦できます。難易度を選ぶとレベル別に練習できます。
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
              もう一度挑戦
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
                      onClick={() => !checked && setAnswer(choice)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold border ${
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
                  onChange={(event) => setAnswer(event.target.value)}
                  disabled={checked}
                  placeholder="答えを入力"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-600 text-white"
                />
              )}
            </section>

            {checked && (
              <section
                className={`rounded-2xl p-4 mb-4 ${
                  currentCorrect ? "bg-green-500 text-white" : "bg-red-900 text-white"
                }`}
              >
                <h2 className="font-bold mb-2">{currentCorrect ? "正解！" : "不正解"}</h2>
                <p className="text-sm leading-relaxed">{question.explanation}</p>
              </section>
            )}

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={checkAnswer}
                disabled={checked || !answer.trim()}
                className={`py-3 rounded-xl font-bold ${
                  checked || !answer.trim()
                    ? "bg-slate-800 text-slate-500"
                    : "bg-yellow-300 text-black"
                }`}
              >
                答え合わせ
              </button>
              <button
                type="button"
                onClick={nextQuestion}
                disabled={!checked}
                className={`py-3 rounded-xl font-bold ${
                  checked ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-500"
                }`}
              >
                次へ
              </button>
            </div>
          </>
        ) : null}

        <p className="text-xs text-slate-500 text-center">
          回答済み：{answeredQuestionIds.length}問 / 表示中：{questions.length}問
        </p>
      </div>
    </main>
  );
}
