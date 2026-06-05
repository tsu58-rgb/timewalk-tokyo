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

export type HistoryPeriod = "古代" | "中世" | "近世" | "近代" | "現代";
export type HistoryEventId = string;

export type HistoryCardImage = {
  src: string;
  alt: string;
};

export type HistoryEvent = {
  id: HistoryEventId;
  title: string;
  year: number;
  era: HistoryEra;
  period?: HistoryPeriod;
  shortText: string;
  description: string;
  tags: string[];
  keywords?: string[];
  difficulty?: 1 | 2 | 3 | 4 | 5;
  relatedPersonIds?: string[];
  relatedSpotIds?: string[];
  characterIds?: string[];
  isPublic?: boolean;
  isDraft?: boolean;
  card?: {
    rarity: "common" | "rare" | "legend";
    color: string;
    number?: string;
    set?: string;
    frontTitle?: string;
    backYear?: number;
    flavorText?: string;
    printText?: string;
    image?: HistoryCardImage;
    imagePrompt?: string;
  };
};
