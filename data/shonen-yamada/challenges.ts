import type { TimelineChallenge } from "@/types/shonen-yamada";

export const timelineChallenges: TimelineChallenge[] = [
  {
    id: "samurai-governments",
    title: "武士の時代をならべよう",
    description: "幕府や大きな合戦を、古い順に並べてみよう。",
    difficulty: "easy",
    eventIds: [
      "kamakura-shogunate",
      "muromachi-shogunate",
      "battle-of-sekigahara",
      "edo-shogunate",
    ],
    hint: "鎌倉、室町、関ヶ原、江戸の順番を思い出してみよう。",
    clearMessage: "すごい！武士の政治がどう移り変わったか見えてきたね。",
  },
  {
    id: "edo-to-modern",
    title: "江戸から近代へジャンプ",
    description: "江戸時代から昭和までの流れを、古い順に並べよう。",
    difficulty: "normal",
    eventIds: [
      "edo-shogunate",
      "sakoku-edict",
      "meiji-restoration",
      "tokyo-olympics-1964",
    ],
    hint: "江戸幕府が始まったあと、外交の制限、明治の改革、東京オリンピックへ進むよ。",
    clearMessage: "やったね！江戸から現代の東京まで、時間の道がつながったよ。",
  },
  {
    id: "all-stars",
    title: "日本史タイムウォーク総まとめ",
    description: "鎌倉から昭和まで、代表的な出来事を一気に年表にしよう。",
    difficulty: "hard",
    eventIds: [
      "kamakura-shogunate",
      "muromachi-shogunate",
      "battle-of-sekigahara",
      "edo-shogunate",
      "sakoku-edict",
      "meiji-restoration",
      "tokyo-olympics-1964",
    ],
    hint: "まず幕府の順番を固めて、そのあと江戸後半から近現代へ進もう。",
    clearMessage: "歴史年表マスター！少年山田もびっくりのタイムウォーカーだ！",
  },
];
