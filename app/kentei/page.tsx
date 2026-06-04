import type { Metadata } from "next";

import KenteiQuiz from "./components/KenteiQuiz";

export const metadata: Metadata = {
  title: "ゆる歴史散歩検定 | TimeWalk",
  description:
    "ゆる歴史散歩検定は、100問の選択式・入力式問題で歴史知識を確認できる検定ページです。",
};

export default function KenteiPage() {
  return <KenteiQuiz />;
}
