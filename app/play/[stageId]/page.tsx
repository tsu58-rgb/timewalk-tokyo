"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import asakusa from "../../../data/stages/asakusa_001.json";
import ueno from "../../../data/stages/ueno_001.json";
import ginza from "../../../data/stages/ginza_001.json";

const stages: Record<string, any> = {
  asakusa_001: asakusa,
  ueno_001: ueno,
  ginza_001: ginza,
};

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(/\s/g, "").replace(/[　]/g, "");
}

export default function PuzzlePage() {
  const params = useParams();
  const stageId = params.stageId as string;
  const stage = stages[stageId];

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [hintCount, setHintCount] = useState(0);
  const [cleared, setCleared] = useState(false);

  if (!stage) {
    return (
      <main style={{ padding: 24 }}>
        <h1>ステージが見つかりません</h1>
        <Link href="/">トップに戻る</Link>
      </main>
    );
  }

  const puzzle = stage.puzzles[index];

  function checkAnswer() {
    const userAnswer = normalizeAnswer(answer);
    const correct = puzzle.answer.some(
      (a: string) => normalizeAnswer(a) === userAnswer
    );

    if (correct) {
      if (index + 1 >= stage.puzzles.length) {
        setCleared(true);
      } else {
        setMessage("正解！");
      }
    } else {
      setMessage("ちがいます。もう一度考えてみよう。");
    }
  }

  function nextPuzzle() {
    setIndex(index + 1);
    setAnswer("");
    setMessage("");
    setHintCount(0);
  }

  if (cleared) {
    return (
      <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
        <h1>クリア！</h1>
        <p>{stage.clear_message}</p>
        <Link href="/">トップに戻る</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <p>
        {stage.area} / {index + 1}問目
      </p>
      <h1>{stage.title}</h1>

      <section style={{ marginTop: 24 }}>
        <h2>{puzzle.title}</h2>
        <p style={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
          {puzzle.question}
        </p>
      </section>

      <section style={{ marginTop: 24 }}>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="答えを入力"
          style={{ padding: 12, width: "100%", fontSize: 16 }}
        />
        <button onClick={checkAnswer} style={{ marginTop: 12, padding: 12 }}>
          回答する
        </button>
      </section>

      <section style={{ marginTop: 24 }}>
        <button
          onClick={() => setHintCount(Math.min(hintCount + 1, puzzle.hints.length))}
          style={{ padding: 12 }}
        >
          ヒントを見る
        </button>

        {puzzle.hints.slice(0, hintCount).map((hint: string, i: number) => (
          <p key={i}>
            ヒント{i + 1}：{hint}
          </p>
        ))}
      </section>

      {message && (
        <section style={{ marginTop: 24 }}>
          <p>{message}</p>
          {message === "正解！" && (
            <>
              <p>{puzzle.explanation}</p>
              <button onClick={nextPuzzle} style={{ padding: 12 }}>
                次の問題へ
              </button>
            </>
          )}
        </section>
      )}
    </main>
  );
}
