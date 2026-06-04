import type { Metadata } from "next";

import TimelineChallenge from "./components/TimelineChallenge";

export const metadata: Metadata = {
  title: "少年山田の歴史年表チャレンジ | TimeWalk",
  description:
    "少年山田と一緒に、歴史のできごとを古い順に並べて学べるTimeWalkのミニゲームです。",
};

export default function ShonenYamadaPage() {
  return <TimelineChallenge />;
}
