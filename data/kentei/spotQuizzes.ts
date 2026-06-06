export type SpotQuiz = {
  quizId: string;
  spotId: string;
  level: 1 | 2 | 3 | 4 | 5;
  format: "choice" | "input";
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  explanation: string;
  sourceField: string;
  tags: string[];
  isActive: boolean;
  memo?: string;
};

export const spotQuizzes: SpotQuiz[] = [
  {
    quizId: "quiz_tw_000000014_001",
    spotId: "tw_000000014",
    level: 1,
    format: "choice",
    question: "明治座の起源となった、明治6年（1873）に