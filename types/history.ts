export type HistoryEra =
  | "平安"
  | "鎌倉"
  | "室町"
  | "安土桃山"
  | "江戸"
  | "明治"
  | "大正"
  | "昭和";

export type HistoryEventId = string;

export type HistoryEvent = {
  id: HistoryEventId;
  title: string;
  year: number;
  era: HistoryEra;
  shortText: string;
  description: string;
  tags: string[];
  characterIds?: string[];
  card?: {
    rarity: "common" | "rare" | "legend";
    color: string;
  };
};
