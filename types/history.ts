export type HistoryEra =
  | "古代"
  | "飛鳥"
  | "奈良"
  | "平安"
  | "鎌倉"
  | "南北朝"
  | "室町"
  | "戦国"
  | "安土桃山"
  | "江戸"
  | "明治"
  | "大正"
  | "昭和"
  | "平成"
  | "令和";

export type HistoryEventId = string;

export type HistoryEvent = {
  id: HistoryEventId;
  title: string;
  year: number;
  era: HistoryEra;
  shortText: string;
  description: string;
  detailText?: string;
  imageUrl?: string;
  imageAlt?: string;
  tags: string[];
  characterIds?: string[];
  card?: {
    rarity: "common" | "rare" | "legend";
    color: string;
  };
};
