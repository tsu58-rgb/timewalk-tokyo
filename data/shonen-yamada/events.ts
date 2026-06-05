import type { HistoryEvent } from "@/types/shonen-yamada";

export const historyEvents: HistoryEvent[] = [
  {
    id: "kamakura-shogunate",
    title: "鎌倉幕府が開かれる",
    year: 1192,
    era: "鎌倉",
    shortText: "源頼朝が征夷大将軍となり、武士の政治が本格化した。",
    description:
      "源頼朝が征夷大将軍となり、鎌倉を中心とした武士による政治体制が整いました。",
    tags: ["政治", "武士", "幕府"],
    characterIds: ["minamoto_yoritomo"],
    card: {
      rarity: "rare",
      color: "#38bdf8",
    },
  },
  {
    id: "muromachi-shogunate",
    title: "室町幕府が開かれる",
    year: 1338,
    era: "室町",
    shortText: "足利尊氏が征夷大将軍となり、室町幕府が始まった。",
    description:
      "足利尊氏が征夷大将軍となり、京都を中心とした室町幕府の時代が始まりました。",
    tags: ["政治", "武士", "幕府"],
    characterIds: ["ashikaga_takauji"],
    card: {
      rarity: "rare",
      color: "#a78bfa",
    },
  },
  {
    id: "battle-of-sekigahara",
    title: "関ヶ原の戦い",
    year: 1600,
    era: "安土桃山",
    shortText: "徳川家康が石田三成らの西軍を破った天下分け目の戦い。",
    description:
      "徳川家康率いる東軍が石田三成らの西軍に勝利し、江戸幕府成立への流れが決定的になりました。",
    tags: ["合戦", "徳川家康", "天下分け目"],
    characterIds: ["tokugawa_ieyasu", "ishida_mitsunari"],
    card: {
      rarity: "legend",
      color: "#f97316",
    },
  },
  {
    id: "edo-shogunate",
    title: "江戸幕府が開かれる",
    year: 1603,
    era: "江戸",
    shortText: "徳川家康が征夷大将軍となり、江戸幕府が始まった。",
    description:
      "徳川家康が征夷大将軍となり、江戸を中心とする長い幕府政治が始まりました。",
    tags: ["政治", "江戸", "幕府"],
    characterIds: ["tokugawa_ieyasu"],
    card: {
      rarity: "legend",
      color: "#22c55e",
    },
  },
  {
    id: "sakoku-edict",
    title: "鎖国体制が強まる",
    year: 1639,
    era: "江戸",
    shortText: "ポルトガル船の来航が禁じられ、対外交流が厳しく制限された。",
    description:
      "江戸幕府はポルトガル船の来航を禁じ、長崎など限られた窓口で外国との交流を管理しました。",
    tags: ["外交", "江戸", "長崎"],
    characterIds: ["tokugawa_iemitsu"],
    card: {
      rarity: "common",
      color: "#0ea5e9",
    },
  },
  {
    id: "meiji-restoration",
    title: "明治維新",
    year: 1868,
    era: "明治",
    shortText: "新政府が始まり、日本の近代化が進んだ。",
    description:
      "江戸幕府の時代が終わり、明治政府のもとで政治・社会・文化の大きな改革が進められました。",
    tags: ["近代化", "政治", "明治"],
    characterIds: ["meiji_tennou"],
    card: {
      rarity: "legend",
      color: "#facc15",
    },
  },
  {
    id: "tokyo-olympics-1964",
    title: "東京オリンピック開催",
    year: 1964,
    era: "昭和",
    shortText: "アジア初のオリンピックが東京で開催された。",
    description:
      "東京オリンピックは、戦後復興と高度経済成長の象徴的な出来事として記憶されています。",
    tags: ["スポーツ", "東京", "近現代"],
    characterIds: ["kanakuri_shisou"],
    card: {
      rarity: "rare",
      color: "#60a5fa",
    },
  },
];
