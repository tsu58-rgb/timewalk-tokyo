import type { Metadata } from "next";

import KenteiQuiz from "./components/KenteiQuiz";

export const metadata: Metadata = {
  title: "TimeWalk検定 | TimeWalk",
  description:
    "TimeWalk検定は、選択式・入力式問題で歴史知識を確認できる検定ページです。",
};

export default function KenteiPage() {
  return <KenteiQuiz />;
}
