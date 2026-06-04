import type { HistoryEventId } from "./history";

export type GameDifficulty = 1 | 2 | 3 | 4 | 5;

export type TimeFlowChallenge = {
  id: string;
  title: string;
  description: string;
  difficulty: GameDifficulty;
  eventIds: HistoryEventId[];
  hint: string;
  clearMessage: string;
};
