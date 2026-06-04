import type { Metadata } from "next";

import TimeFlowGame from "./components/TimeFlowGame";

export const metadata: Metadata = {
  title: "ゆる歴史散歩ゲーム TimeFlow | 歴史の流れチャレンジ",
  description:
    "ゆる歴史散歩ゲーム TimeFlowは、200枚の歴史カードを古い順に並べて時代の流れをつかむミニゲームです。",
};

export default function TimeFlowPage() {
  return <TimeFlowGame />;
}
