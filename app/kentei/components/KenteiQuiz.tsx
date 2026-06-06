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
  quizId