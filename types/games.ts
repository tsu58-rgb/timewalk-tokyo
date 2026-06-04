import type { HistoryEventId } from "./history";

export type GameDifficulty = "easy" | "normal" | "hard";

export type TimeFlowChallenge = {
  id: string;
  title: string;
  description: string;
  difficulty: GameDifficulty;
  eventIds: HistoryEventId[];
  hint: string;
  clearMessage: string;
};
