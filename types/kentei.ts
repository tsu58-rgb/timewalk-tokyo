import type { HistoryEventId } from "./history";

export type KenteiQuestionFormat = "choice" | "input";
export type KenteiLevel = 1 | 2 | 3 | 4 | 5;

export type KenteiQuestion = {
  id: string;
  format: KenteiQuestionFormat;
  level: KenteiLevel;
  category: string;
  question: string;
  choices?: string[];
  answer: string | string[];
  explanation: string;
  relatedEventIds?: HistoryEventId[];
  relatedSpotIds?: string[];
};
