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

// TimeWalk検定の出題データは、Googleスプレッドシートの
// spot_quizzes シートから読み込みます。
// このファイルは過去の静的データ定義の互換用として残しています。
export const spotQuizzes: SpotQuiz[] = [];
