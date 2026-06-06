export type TimeFlowEventDetail = {
  imageUrl: string;
  imageAlt: string;
  detailText: string;
};

export const timeFlowEventDetails: Record<string, TimeFlowEventDetail> = {
  "wa-envoy-sui": {
    imageUrl: "/images/games/timeflow/wa-envoy-sui.svg",
    imageAlt: "遣隋使として海を渡る小野妹子のイメージ画像",
    detailText:
      "607年、推古天皇の時代に小野妹子が隋へ派遣されました。中国王朝と直接外交を行い、制度や文化を学ぼうとした動きで、のちの律令国家づくりにもつながる重要な出来事です。",
  },
  "taika-reform": {
    imageUrl: "/images/games/timeflow/taika-reform.svg",
    imageAlt: "朝廷で政治改革を話し合う大化の改新のイメージ画像",
    detailText:
      "645年、乙巳の変で蘇我氏本宗家が倒されたことをきっかけに、大きな政治改革が進められました。豪族ごとの支配を見直し、天皇を中心とする中央集権国家をめざした点が重要です。",
  },
  "jinshin-war": {
    imageUrl: "/images/games/timeflow/jinshin-war.svg",
    imageAlt: "古代の軍勢が対峙する壬申の乱のイメージ画像",
    detailText:
      "672年、天智天皇の死後、皇位継承をめぐって大友皇子と大海人皇子が争いました。勝利した大海人皇子はのちに天武天皇となり、天皇中心の政治体制を強める大きな転機になりました。",
  },
  "taiho-code": {
    imageUrl: "/images/games/timeflow/taiho-code.svg",
    imageAlt: "役人たちが法典を整える大宝律令のイメージ画像",
    detailText:
      "701年に完成した大宝律令は、刑罰を定める律と行政制度を定める令からなる法典です。官職、税、戸籍、地方支配など国家運営の仕組みを整え、日本の律令国家体制を明確にしました。",
  },
  "heijo-kyo": {
    imageUrl: "/images/games/timeflow/heijo-kyo.svg",
    imageAlt: "碁盤目状に整えられた平城京のイメージ画像",
    detailText:
      "710年、元明天皇の時代に都が藤原京から平城京へ移されました。唐の長安にならった都市計画を取り入れた都で、ここから奈良時代の政治や文化が本格的に展開していきます。",
  },
};
