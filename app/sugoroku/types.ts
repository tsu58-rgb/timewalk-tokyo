export type SugorokuSpot = {
  id: string;
  name: string;
  kana: string;
  lat: number;
  lng: number;
  prefecture: string;
  city: string;
  description: string;
  spotsImage: string;
};

export type SugorokuQuiz = {
  quizId: string;
  spotId: string;
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  explanation: string;
  level: number;
};

export type SugorokuEdge = {
  from: string;
  to: string;
};

export type GamePhase =
  | "ready"
  | "moving"
  | "quiz"
  | "answered"
  | "finished";
