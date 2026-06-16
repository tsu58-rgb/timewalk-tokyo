import type { Metadata } from "next";

import SugorokuGame from "./SugorokuGame";

export const metadata: Metadata = {
  title: "東京歴史すごろく | TimeWalk",
  description:
    "TimeWalkの歴史スポットを実際の東京地図上で巡る、歴史クイズ付きすごろくのプロトタイプです。",
};

export default function SugorokuPage() {
  return <SugorokuGame />;
}
