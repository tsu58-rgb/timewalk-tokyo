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
  "kojiki": {
    imageUrl: "/images/games/timeflow/kojiki.svg",
    imageAlt: "書物や建築で文化を表す古事記が完成のイメージ画像",
    detailText:
      "712年、奈良の出来事。神話や古い伝承をまとめた歴史書が完成した。「古事記が完成」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "nihon-shoki": {
    imageUrl: "/images/games/timeflow/nihon-shoki.svg",
    imageAlt: "書物や建築で文化を表す日本書紀が完成のイメージ画像",
    detailText:
      "720年、奈良の出来事。国の成り立ちを記した正史がまとめられた。「日本書紀が完成」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "todai-ji-buddha": {
    imageUrl: "/images/games/timeflow/todai-ji-buddha.svg",
    imageAlt: "書物や建築で文化を表す東大寺大仏の開眼供養のイメージ画像",
    detailText:
      "752年、奈良の出来事。奈良の大仏完成を祝う大きな儀式が行われた。「東大寺大仏の開眼供養」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "heian-kyo": {
    imageUrl: "/images/games/timeflow/heian-kyo.svg",
    imageAlt: "都市や施設を表す平安京に都を移すのイメージ画像",
    detailText:
      "794年、平安の出来事。京都の平安京を中心とする時代が始まった。「平安京に都を移す」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。都や施設、都市空間の変化は、政治、経済、文化の中心がどこに置かれたかを考える手がかりになる。",
  },
  "kukai-shingon": {
    imageUrl: "/images/games/timeflow/kukai-shingon.svg",
    imageAlt: "書物や建築で文化を表す空海が高野山を開くのイメージ画像",
    detailText:
      "816年、平安の出来事。高野山が真言密教の重要な拠点となった。「空海が高野山を開く」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "taira-masakado": {
    imageUrl: "/images/games/timeflow/taira-masakado.svg",
    imageAlt: "旗や城で争いを象徴する平将門の乱のイメージ画像",
    detailText:
      "939年、平安の出来事。武士の力が広がる時代を示す大きな反乱だった。「平将門の乱」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "genji-monogatari": {
    imageUrl: "/images/games/timeflow/genji-monogatari.svg",
    imageAlt: "書物や建築で文化を表す源氏物語が成立したころのイメージ画像",
    detailText:
      "1008年、平安の出来事。平安貴族の文化を伝える長編物語が生まれた。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "insei-start": {
    imageUrl: "/images/games/timeflow/insei-start.svg",
    imageAlt: "人びとと社会の変化を表す院政が始まるのイメージ画像",
    detailText:
      "1086年、平安の出来事。天皇を退いた上皇が政治を動かす仕組みが始まった。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "hogen-rebellion": {
    imageUrl: "/images/games/timeflow/hogen-rebellion.svg",
    imageAlt: "旗や城で争いを象徴する保元の乱のイメージ画像",
    detailText:
      "1156年、平安の出来事。武士が中央政治で大きな役割を持つきっかけとなった。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "heiji-rebellion": {
    imageUrl: "/images/games/timeflow/heiji-rebellion.svg",
    imageAlt: "旗や城で争いを象徴する平治の乱のイメージ画像",
    detailText:
      "1159年、平安の出来事。平氏政権へ向かう流れを強めた争いだった。「平治の乱」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "taira-kiyomori": {
    imageUrl: "/images/games/timeflow/taira-kiyomori.svg",
    imageAlt: "人びとと社会の変化を表す平清盛が太政大臣になるのイメージ画像",
    detailText:
      "1167年、平安の出来事。武士が朝廷政治の頂点に立った象徴的な出来事。「平清盛が太政大臣になる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "genpei-war": {
    imageUrl: "/images/games/timeflow/genpei-war.svg",
    imageAlt: "旗や城で争いを象徴する源平合戦が始まるのイメージ画像",
    detailText:
      "1180年、平安の出来事。源氏と平氏が全国規模で争う時代になった。「源平合戦が始まる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "dan-no-ura": {
    imageUrl: "/images/games/timeflow/dan-no-ura.svg",
    imageAlt: "旗や城で争いを象徴する壇ノ浦の戦いのイメージ画像",
    detailText:
      "1185年、平安の出来事。源平合戦の最後を飾る海上の戦いだった。「壇ノ浦の戦い」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "kamakura-shogunate": {
    imageUrl: "/images/games/timeflow/kamakura-shogunate.svg",
    imageAlt: "文書と印で制度を表す鎌倉幕府が開かれるのイメージ画像",
    detailText:
      "1192年、鎌倉の出来事。武士による政治が本格的に始まった。「鎌倉幕府が開かれる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "jokyu-war": {
    imageUrl: "/images/games/timeflow/jokyu-war.svg",
    imageAlt: "旗や城で争いを象徴する承久の乱のイメージ画像",
    detailText:
      "1221年、鎌倉の出来事。朝廷より幕府の力が強まるきっかけとなった。「承久の乱」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "goseibai-shikimoku": {
    imageUrl: "/images/games/timeflow/goseibai-shikimoku.svg",
    imageAlt: "文書と印で制度を表す御成敗式目が制定のイメージ画像",
    detailText:
      "1232年、鎌倉の出来事。武士社会の裁判や政治の基準が整えられた。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "mongol-first": {
    imageUrl: "/images/games/timeflow/mongol-first.svg",
    imageAlt: "旗や城で争いを象徴する文永の役のイメージ画像",
    detailText:
      "1274年、鎌倉の出来事。元軍が九州北部へ来襲し、防衛戦が行われた。「文永の役」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "mongol-second": {
    imageUrl: "/images/games/timeflow/mongol-second.svg",
    imageAlt: "旗や城で争いを象徴する弘安の役のイメージ画像",
    detailText:
      "1281年、鎌倉の出来事。二度目の元軍来襲を退けた出来事。「弘安の役」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "kamakura-fall": {
    imageUrl: "/images/games/timeflow/kamakura-fall.svg",
    imageAlt: "文書と印で制度を表す鎌倉幕府が滅亡のイメージ画像",
    detailText:
      "1333年、鎌倉の出来事。鎌倉幕府の支配が終わり、新たな政治へ移った。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "kenmu-restoration": {
    imageUrl: "/images/games/timeflow/kenmu-restoration.svg",
    imageAlt: "人びとと社会の変化を表す建武の新政のイメージ画像",
    detailText:
      "1334年、南北朝の出来事。天皇中心の政治を復活させようとした改革。「建武の新政」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "muromachi-shogunate": {
    imageUrl: "/images/games/timeflow/muromachi-shogunate.svg",
    imageAlt: "文書と印で制度を表す室町幕府が開かれるのイメージ画像",
    detailText:
      "1338年、室町の出来事。京都を中心とした室町幕府の時代が始まった。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "kinkaku": {
    imageUrl: "/images/games/timeflow/kinkaku.svg",
    imageAlt: "書物や建築で文化を表す金閣が建てられるのイメージ画像",
    detailText:
      "1397年、室町の出来事。室町時代の華やかな文化を代表する建築。「金閣が建てられる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "shocho-uprising": {
    imageUrl: "/images/games/timeflow/shocho-uprising.svg",
    imageAlt: "人びとと社会の変化を表す正長の土一揆のイメージ画像",
    detailText:
      "1428年、室町の出来事。民衆が政治や社会に影響を与えた出来事。「正長の土一揆」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "onin-war": {
    imageUrl: "/images/games/timeflow/onin-war.svg",
    imageAlt: "旗や城で争いを象徴する応仁の乱が始まるのイメージ画像",
    detailText:
      "1467年、室町の出来事。戦国時代の始まりにつながる長い内乱。「応仁の乱が始まる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "ginkaku": {
    imageUrl: "/images/games/timeflow/ginkaku.svg",
    imageAlt: "書物や建築で文化を表す銀閣が建てられるのイメージ画像",
    detailText:
      "1489年、室町の出来事。わび・さびの美意識につながる文化を代表する建築。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "tanegashima-guns": {
    imageUrl: "/images/games/timeflow/tanegashima-guns.svg",
    imageAlt: "人びとと社会の変化を表す鉄砲伝来のイメージ画像",
    detailText:
      "1543年、戦国の出来事。戦国時代の合戦に大きな変化をもたらした。「鉄砲伝来」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "francis-xavier": {
    imageUrl: "/images/games/timeflow/francis-xavier.svg",
    imageAlt: "書物や建築で文化を表すキリスト教伝来のイメージ画像",
    detailText:
      "1549年、戦国の出来事。日本とヨーロッパの交流が深まった。「キリスト教伝来」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "okehazama": {
    imageUrl: "/images/games/timeflow/okehazama.svg",
    imageAlt: "旗や城で争いを象徴する桶狭間の戦いのイメージ画像",
    detailText:
      "1560年、戦国の出来事。信長が全国に名を知られるきっかけとなった戦い。「桶狭間の戦い」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "muromachi-fall": {
    imageUrl: "/images/games/timeflow/muromachi-fall.svg",
    imageAlt: "文書と印で制度を表す室町幕府が滅亡のイメージ画像",
    detailText:
      "1573年、戦国の出来事。室町幕府の時代が終わった。「室町幕府が滅亡」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "nagashino": {
    imageUrl: "/images/games/timeflow/nagashino.svg",
    imageAlt: "旗や城で争いを象徴する長篠の戦いのイメージ画像",
    detailText:
      "1575年、戦国の出来事。鉄砲の活用で知られる戦国時代の合戦。「長篠の戦い」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "azuchi-castle": {
    imageUrl: "/images/games/timeflow/azuchi-castle.svg",
    imageAlt: "都市や施設を表す安土城の築城開始のイメージ画像",
    detailText:
      "1576年、安土桃山の出来事。天下統一をめざす拠点となった城。「安土城の築城開始」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。都や施設、都市空間の変化は、政治、経済、文化の中心がどこに置かれたかを考える手がかりになる。",
  },
  "honnoji": {
    imageUrl: "/images/games/timeflow/honnoji.svg",
    imageAlt: "旗や城で争いを象徴する本能寺の変のイメージ画像",
    detailText:
      "1582年、安土桃山の出来事。信長の天下統一目前で起きた大事件。「本能寺の変」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "taiko-kenchi": {
    imageUrl: "/images/games/timeflow/taiko-kenchi.svg",
    imageAlt: "人びとと社会の変化を表す太閤検地が始まるのイメージ画像",
    detailText:
      "1582年、安土桃山の出来事。年貢や土地支配の基準が整えられた。「太閤検地が始まる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "sword-hunt": {
    imageUrl: "/images/games/timeflow/sword-hunt.svg",
    imageAlt: "人びとと社会の変化を表す刀狩令のイメージ画像",
    detailText:
      "1588年、安土桃山の出来事。兵農分離を進める政策だった。「刀狩令」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "odawara": {
    imageUrl: "/images/games/timeflow/odawara.svg",
    imageAlt: "旗や城で争いを象徴する小田原攻めのイメージ画像",
    detailText:
      "1590年、安土桃山の出来事。秀吉の天下統一を決定づけた戦い。「小田原攻め」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "korean-invasion": {
    imageUrl: "/images/games/timeflow/korean-invasion.svg",
    imageAlt: "旗や城で争いを象徴する文禄の役のイメージ画像",
    detailText:
      "1592年、安土桃山の出来事。東アジアを巻き込む大きな戦争となった。「文禄の役」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "battle-of-sekigahara": {
    imageUrl: "/images/games/timeflow/battle-of-sekigahara.svg",
    imageAlt: "旗や城で争いを象徴する関ヶ原の戦いのイメージ画像",
    detailText:
      "1600年、安土桃山の出来事。天下分け目と呼ばれる大きな戦い。「関ヶ原の戦い」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "edo-shogunate": {
    imageUrl: "/images/games/timeflow/edo-shogunate.svg",
    imageAlt: "文書と印で制度を表す江戸幕府が開かれるのイメージ画像",
    detailText:
      "1603年、江戸の出来事。江戸を中心とする長い幕府政治が始まった。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "osaka-siege": {
    imageUrl: "/images/games/timeflow/osaka-siege.svg",
    imageAlt: "旗や城で争いを象徴する大坂の陣が終わるのイメージ画像",
    detailText:
      "1615年、江戸の出来事。江戸幕府の安定につながった戦い。「大坂の陣が終わる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "bukeshohatto": {
    imageUrl: "/images/games/timeflow/bukeshohatto.svg",
    imageAlt: "文書と印で制度を表す武家諸法度が出されるのイメージ画像",
    detailText:
      "1615年、江戸の出来事。幕府が大名を管理する仕組みが整えられた。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "sankin-kotai": {
    imageUrl: "/images/games/timeflow/sankin-kotai.svg",
    imageAlt: "文書と印で制度を表す参勤交代が制度化のイメージ画像",
    detailText:
      "1635年、江戸の出来事。大名統制と江戸の発展に大きな影響を与えた。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "sakoku-edict": {
    imageUrl: "/images/games/timeflow/sakoku-edict.svg",
    imageAlt: "船と文書で外交を表す鎖国体制が強まるのイメージ画像",
    detailText:
      "1639年、江戸の出来事。対外交流が長崎などに限られていった。「鎖国体制が強まる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "shimabara": {
    imageUrl: "/images/games/timeflow/shimabara.svg",
    imageAlt: "人びとと社会の変化を表す島原・天草一揆のイメージ画像",
    detailText:
      "1637年、江戸の出来事。幕府の宗教政策にも影響した大きな一揆。「島原・天草一揆」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "meireki-fire": {
    imageUrl: "/images/games/timeflow/meireki-fire.svg",
    imageAlt: "災害や復旧を象徴する明暦の大火のイメージ画像",
    detailText:
      "1657年、江戸の出来事。江戸の町づくりを見直すきっかけとなった火災。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "genroku-culture": {
    imageUrl: "/images/games/timeflow/genroku-culture.svg",
    imageAlt: "書物や建築で文化を表す元禄文化が栄えるのイメージ画像",
    detailText:
      "1688年、江戸の出来事。歌舞伎や浮世草子など町人文化が花開いた。「元禄文化が栄える」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "ako-incident": {
    imageUrl: "/images/games/timeflow/ako-incident.svg",
    imageAlt: "人びとと社会の変化を表す赤穂事件のイメージ画像",
    detailText:
      "1703年、江戸の出来事。のちに忠臣蔵として広く知られる事件。「赤穂事件」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "kyohoreforms": {
    imageUrl: "/images/games/timeflow/kyohoreforms.svg",
    imageAlt: "文書と印で制度を表す享保の改革が始まるのイメージ画像",
    detailText:
      "1716年、江戸の出来事。倹約や新田開発などの改革が行われた。「享保の改革が始まる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "rangaku-start": {
    imageUrl: "/images/games/timeflow/rangaku-start.svg",
    imageAlt: "人びとと社会の変化を表す解体新書が刊行のイメージ画像",
    detailText:
      "1774年、江戸の出来事。蘭学の発展を象徴する出来事。「解体新書が刊行」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "tenmei-famine": {
    imageUrl: "/images/games/timeflow/tenmei-famine.svg",
    imageAlt: "災害や復旧を象徴する天明の飢饉のイメージ画像",
    detailText:
      "1782年、江戸の出来事。社会不安や改革の背景となった災害。「天明の飢饉」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "kansei-reforms": {
    imageUrl: "/images/games/timeflow/kansei-reforms.svg",
    imageAlt: "文書と印で制度を表す寛政の改革が始まるのイメージ画像",
    detailText:
      "1787年、江戸の出来事。倹約や学問奨励などで幕府を立て直そうとした。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "ino-map": {
    imageUrl: "/images/games/timeflow/ino-map.svg",
    imageAlt: "交通や技術の発展を表す伊能忠敬の測量開始のイメージ画像",
    detailText:
      "1800年、江戸の出来事。正確な日本地図作成につながった。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "tempo-reforms": {
    imageUrl: "/images/games/timeflow/tempo-reforms.svg",
    imageAlt: "文書と印で制度を表す天保の改革が始まるのイメージ画像",
    detailText:
      "1841年、江戸の出来事。幕府の立て直しをめざした改革。「天保の改革が始まる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "perry-arrival": {
    imageUrl: "/images/games/timeflow/perry-arrival.svg",
    imageAlt: "船と文書で外交を表すペリー来航のイメージ画像",
    detailText:
      "1853年、江戸の出来事。開国を迫る大きな転機となった。「ペリー来航」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "kanagawa-treaty": {
    imageUrl: "/images/games/timeflow/kanagawa-treaty.svg",
    imageAlt: "船と文書で外交を表す日米和親条約のイメージ画像",
    detailText:
      "1854年、江戸の出来事。下田・函館を開くことになった条約。「日米和親条約」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "ansei-treaties": {
    imageUrl: "/images/games/timeflow/ansei-treaties.svg",
    imageAlt: "船と文書で外交を表す日米修好通商条約のイメージ画像",
    detailText:
      "1858年、江戸の出来事。不平等条約として国内政治にも影響した。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "sakuradamon": {
    imageUrl: "/images/games/timeflow/sakuradamon.svg",
    imageAlt: "旗や城で争いを象徴する桜田門外の変のイメージ画像",
    detailText:
      "1860年、江戸の出来事。幕末政治の緊張を象徴する事件。「桜田門外の変」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "satsuma-choshu": {
    imageUrl: "/images/games/timeflow/satsuma-choshu.svg",
    imageAlt: "船と文書で外交を表す薩長同盟のイメージ画像",
    detailText:
      "1866年、江戸の出来事。倒幕運動を強める大きなきっかけとなった。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "taisei-hokan": {
    imageUrl: "/images/games/timeflow/taisei-hokan.svg",
    imageAlt: "文書と印で制度を表す大政奉還のイメージ画像",
    detailText:
      "1867年、江戸の出来事。江戸幕府の終わりに向かう重要な出来事。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "meiji-restoration": {
    imageUrl: "/images/games/timeflow/meiji-restoration.svg",
    imageAlt: "文書と印で制度を表す明治維新のイメージ画像",
    detailText:
      "1868年、明治の出来事。政治・社会・文化の大きな改革が行われた。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "boshin-war": {
    imageUrl: "/images/games/timeflow/boshin-war.svg",
    imageAlt: "旗や城で争いを象徴する戊辰戦争のイメージ画像",
    detailText:
      "1868年、明治の出来事。新政府の支配を固める内戦だった。「戊辰戦争」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "haihan-chiken": {
    imageUrl: "/images/games/timeflow/haihan-chiken.svg",
    imageAlt: "文書と印で制度を表す廃藩置県のイメージ画像",
    detailText:
      "1871年、明治の出来事。中央集権国家づくりを進めた改革。「廃藩置県」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "gakusei": {
    imageUrl: "/images/games/timeflow/gakusei.svg",
    imageAlt: "学校と本で教育を表す学制が公布のイメージ画像",
    detailText:
      "1872年、明治の出来事。教育制度の整備が進められた。「学制が公布」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。教育制度の整備は、近代国家づくりや人びとの学びの広がりと結びつく重要な動きだった。",
  },
  "railway-start": {
    imageUrl: "/images/games/timeflow/railway-start.svg",
    imageAlt: "交通や技術の発展を表す新橋・横浜間に鉄道開業のイメージ画像",
    detailText:
      "1872年、明治の出来事。交通と産業の近代化を象徴する出来事。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "land-tax": {
    imageUrl: "/images/games/timeflow/land-tax.svg",
    imageAlt: "人びとと社会の変化を表す地租改正のイメージ画像",
    detailText:
      "1873年、明治の出来事。明治政府の財政基盤を支えた改革。「地租改正」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "seinan-war": {
    imageUrl: "/images/games/timeflow/seinan-war.svg",
    imageAlt: "旗や城で争いを象徴する西南戦争のイメージ画像",
    detailText:
      "1877年、明治の出来事。士族反乱の最後で最大の戦い。「西南戦争」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "constitution": {
    imageUrl: "/images/games/timeflow/constitution.svg",
    imageAlt: "文書と印で制度を表す大日本帝国憲法発布のイメージ画像",
    detailText:
      "1889年、明治の出来事。議会政治の枠組みが整えられた。「大日本帝国憲法発布」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "imperial-diet": {
    imageUrl: "/images/games/timeflow/imperial-diet.svg",
    imageAlt: "文書と印で制度を表す第一回帝国議会のイメージ画像",
    detailText:
      "1890年、明治の出来事。日本で本格的な議会政治が始まった。「第一回帝国議会」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "sino-japanese-war": {
    imageUrl: "/images/games/timeflow/sino-japanese-war.svg",
    imageAlt: "旗や城で争いを象徴する日清戦争が始まるのイメージ画像",
    detailText:
      "1894年、明治の出来事。朝鮮半島をめぐる対立から始まった戦争。「日清戦争が始まる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "treaty-shimonoseki": {
    imageUrl: "/images/games/timeflow/treaty-shimonoseki.svg",
    imageAlt: "船と文書で外交を表す下関条約のイメージ画像",
    detailText:
      "1895年、明治の出来事。日本の国際的地位に影響した条約。「下関条約」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "anglo-japanese": {
    imageUrl: "/images/games/timeflow/anglo-japanese.svg",
    imageAlt: "船と文書で外交を表す日英同盟のイメージ画像",
    detailText:
      "1902年、明治の出来事。日本の外交上の地位を高めた同盟。「日英同盟」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "russo-japanese-war": {
    imageUrl: "/images/games/timeflow/russo-japanese-war.svg",
    imageAlt: "旗や城で争いを象徴する日露戦争が始まるのイメージ画像",
    detailText:
      "1904年、明治の出来事。満州や朝鮮をめぐる対立から始まった。「日露戦争が始まる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "portsmouth": {
    imageUrl: "/images/games/timeflow/portsmouth.svg",
    imageAlt: "船と文書で外交を表すポーツマス条約のイメージ画像",
    detailText:
      "1905年、明治の出来事。戦争終結とその後の国内世論に影響した。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "korea-annexation": {
    imageUrl: "/images/games/timeflow/korea-annexation.svg",
    imageAlt: "船と文書で外交を表す韓国併合のイメージ画像",
    detailText:
      "1910年、明治の出来事。東アジアの近代史に大きな影響を与えた出来事。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "taisho-democracy": {
    imageUrl: "/images/games/timeflow/taisho-democracy.svg",
    imageAlt: "人びとと社会の変化を表す大正時代が始まるのイメージ画像",
    detailText:
      "1912年、大正の出来事。政党政治や大衆文化が広がる時代になった。「大正時代が始まる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "ww1-japan": {
    imageUrl: "/images/games/timeflow/ww1-japan.svg",
    imageAlt: "旗や城で争いを象徴する日本が第一次世界大戦に参戦のイメージ画像",
    detailText:
      "1914年、大正の出来事。国際社会での立場に影響した。「日本が第一次世界大戦に参戦」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "rice-riots": {
    imageUrl: "/images/games/timeflow/rice-riots.svg",
    imageAlt: "硬貨とグラフで経済を表す米騒動のイメージ画像",
    detailText:
      "1918年、大正の出来事。民衆運動と政治に大きな影響を与えた。「米騒動」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。経済のしくみや物価、企業活動、人びとの消費行動に影響し、暮らし方の変化とも結びついた。",
  },
  "hara-cabinet": {
    imageUrl: "/images/games/timeflow/hara-cabinet.svg",
    imageAlt: "文書と印で制度を表す原敬内閣が成立のイメージ画像",
    detailText:
      "1918年、大正の出来事。政党政治の発展を象徴する内閣。「原敬内閣が成立」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "kanto-earthquake": {
    imageUrl: "/images/games/timeflow/kanto-earthquake.svg",
    imageAlt: "災害や復旧を象徴する関東大震災のイメージ画像",
    detailText:
      "1923年、大正の出来事。東京や横浜に大きな被害をもたらした災害。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "universal-suffrage": {
    imageUrl: "/images/games/timeflow/universal-suffrage.svg",
    imageAlt: "文書と印で制度を表す普通選挙法が成立のイメージ画像",
    detailText:
      "1925年、大正の出来事。政治参加の範囲が広がった。「普通選挙法が成立」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "showa-start": {
    imageUrl: "/images/games/timeflow/showa-start.svg",
    imageAlt: "人びとと社会の変化を表す昭和時代が始まるのイメージ画像",
    detailText:
      "1926年、昭和の出来事。激動の昭和時代が始まった。「昭和時代が始まる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "manchurian-incident": {
    imageUrl: "/images/games/timeflow/manchurian-incident.svg",
    imageAlt: "旗や城で争いを象徴する満州事変のイメージ画像",
    detailText:
      "1931年、昭和の出来事。日本の対外政策が大きく変化した。「満州事変」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "may15": {
    imageUrl: "/images/games/timeflow/may15.svg",
    imageAlt: "人びとと社会の変化を表す五・一五事件のイメージ画像",
    detailText:
      "1932年、昭和の出来事。政党政治が大きく揺らいだ事件。「五・一五事件」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "feb26": {
    imageUrl: "/images/games/timeflow/feb26.svg",
    imageAlt: "人びとと社会の変化を表す二・二六事件のイメージ画像",
    detailText:
      "1936年、昭和の出来事。軍部の影響力が強まる背景となった。「二・二六事件」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "sino-japanese-war-1937": {
    imageUrl: "/images/games/timeflow/sino-japanese-war-1937.svg",
    imageAlt: "旗や城で争いを象徴する日中戦争が始まるのイメージ画像",
    detailText:
      "1937年、昭和の出来事。長期化する戦争へ発展した。「日中戦争が始まる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "pacific-war": {
    imageUrl: "/images/games/timeflow/pacific-war.svg",
    imageAlt: "旗や城で争いを象徴する太平洋戦争が始まるのイメージ画像",
    detailText:
      "1941年、昭和の出来事。アジア太平洋地域に広がる大きな戦争となった。「太平洋戦争が始まる」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "hiroshima": {
    imageUrl: "/images/games/timeflow/hiroshima.svg",
    imageAlt: "旗や城で争いを象徴する広島に原爆投下のイメージ画像",
    detailText:
      "1945年、昭和の出来事。多くの市民が被害を受けた出来事。「広島に原爆投下」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "end-war": {
    imageUrl: "/images/games/timeflow/end-war.svg",
    imageAlt: "旗や城で争いを象徴する終戦のイメージ画像",
    detailText:
      "1945年、昭和の出来事。第二次世界大戦が終わり、戦後改革へ向かった。「終戦」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "constitution-japan": {
    imageUrl: "/images/games/timeflow/constitution-japan.svg",
    imageAlt: "文書と印で制度を表す日本国憲法施行のイメージ画像",
    detailText:
      "1947年、昭和の出来事。国民主権・基本的人権・平和主義を掲げた。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "san-francisco": {
    imageUrl: "/images/games/timeflow/san-francisco.svg",
    imageAlt: "船と文書で外交を表すサンフランシスコ平和条約のイメージ画像",
    detailText:
      "1951年、昭和の出来事。日本の主権回復につながった条約。「サンフランシスコ平和条約」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "sovereignty-restored": {
    imageUrl: "/images/games/timeflow/sovereignty-restored.svg",
    imageAlt: "船と文書で外交を表す日本の主権回復のイメージ画像",
    detailText:
      "1952年、昭和の出来事。占領が終わり、日本が主権を回復した。「日本の主権回復」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "un-joining": {
    imageUrl: "/images/games/timeflow/un-joining.svg",
    imageAlt: "船と文書で外交を表す日本が国連加盟のイメージ画像",
    detailText:
      "1956年、昭和の出来事。国際社会への復帰を示す出来事。「日本が国連加盟」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "tokyo-olympics-1964": {
    imageUrl: "/images/games/timeflow/tokyo-olympics-1964.svg",
    imageAlt: "競技場と星でスポーツを表す東京オリンピック開催のイメージ画像",
    detailText:
      "1964年、昭和の出来事。戦後復興と高度経済成長を象徴した。「東京オリンピック開催」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。スポーツを通じて社会の関心が集まり、国際交流、地域のにぎわい、メディア文化にも影響を与えた。",
  },
  "shinkansen": {
    imageUrl: "/images/games/timeflow/shinkansen.svg",
    imageAlt: "交通や技術の発展を表す東海道新幹線開業のイメージ画像",
    detailText:
      "1964年、昭和の出来事。高速交通の時代を開いた。「東海道新幹線開業」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "osaka-expo": {
    imageUrl: "/images/games/timeflow/osaka-expo.svg",
    imageAlt: "書物や建築で文化を表す大阪万博開催のイメージ画像",
    detailText:
      "1970年、昭和の出来事。高度経済成長期の日本を象徴するイベント。「大阪万博開催」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "okinawa-return": {
    imageUrl: "/images/games/timeflow/okinawa-return.svg",
    imageAlt: "船と文書で外交を表す沖縄返還のイメージ画像",
    detailText:
      "1972年、昭和の出来事。戦後日本の大きな節目となった。「沖縄返還」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "floating-exchange-rate": {
    imageUrl: "/images/games/timeflow/floating-exchange-rate.svg",
    imageAlt: "旗や城で争いを象徴する変動相場制へ移行のイメージ画像",
    detailText:
      "1973年、昭和の出来事。円相場が固定制から変動制へ移った。「変動相場制へ移行」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "first-oil-shock": {
    imageUrl: "/images/games/timeflow/first-oil-shock.svg",
    imageAlt: "硬貨とグラフで経済を表す第一次オイルショックのイメージ画像",
    detailText:
      "1973年、昭和の出来事。石油価格の高騰が日本経済と生活に大きく影響した。経済のしくみや物価、企業活動、人びとの消費行動に影響し、暮らし方の変化とも結びついた。",
  },
  "sato-nobel-peace-prize": {
    imageUrl: "/images/games/timeflow/sato-nobel-peace-prize.svg",
    imageAlt: "人びとと社会の変化を表す佐藤栄作がノーベル平和賞受賞のイメージ画像",
    detailText:
      "1974年、昭和の出来事。非核三原則などが評価され平和賞を受賞した。「佐藤栄作がノーベル平和賞受賞」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "seven-eleven-first-store": {
    imageUrl: "/images/games/timeflow/seven-eleven-first-store.svg",
    imageAlt: "人びとと社会の変化を表すセブン-イレブン日本1号店開店のイメージ画像",
    detailText:
      "1974年、昭和の出来事。日本のコンビニ文化が広がるきっかけになった。「セブン-イレブン日本1号店開店」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "okinawa-ocean-expo": {
    imageUrl: "/images/games/timeflow/okinawa-ocean-expo.svg",
    imageAlt: "書物や建築で文化を表す沖縄国際海洋博覧会開催のイメージ画像",
    detailText:
      "1975年、昭和の出来事。沖縄復帰後の大型イベントとして開催された。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "lockheed-scandal": {
    imageUrl: "/images/games/timeflow/lockheed-scandal.svg",
    imageAlt: "人びとと社会の変化を表すロッキード事件のイメージ画像",
    detailText:
      "1976年、昭和の出来事。政治と金をめぐる大きな事件として社会を揺らした。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "oh-756-homerun": {
    imageUrl: "/images/games/timeflow/oh-756-homerun.svg",
    imageAlt: "競技場と星でスポーツを表す王貞治が756号本塁打のイメージ画像",
    detailText:
      "1977年、昭和の出来事。プロ野球で世界記録となる本塁打数を達成した。スポーツを通じて社会の関心が集まり、国際交流、地域のにぎわい、メディア文化にも影響を与えた。",
  },
  "narita-airport-open": {
    imageUrl: "/images/games/timeflow/narita-airport-open.svg",
    imageAlt: "交通や技術の発展を表す成田空港開港のイメージ画像",
    detailText:
      "1978年、昭和の出来事。国際線の主要空港として成田空港が開港した。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "japan-china-peace-treaty": {
    imageUrl: "/images/games/timeflow/japan-china-peace-treaty.svg",
    imageAlt: "船と文書で外交を表す日中平和友好条約締結のイメージ画像",
    detailText:
      "1978年、昭和の出来事。日本と中国の友好関係を確認する条約が結ばれた。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "pc-8001-release": {
    imageUrl: "/images/games/timeflow/pc-8001-release.svg",
    imageAlt: "交通や技術の発展を表すNEC PC-8001発売のイメージ画像",
    detailText:
      "1979年、昭和の出来事。日本のパソコン普及のきっかけとなった。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "moscow-olympics-boycott": {
    imageUrl: "/images/games/timeflow/moscow-olympics-boycott.svg",
    imageAlt: "競技場と星でスポーツを表す日本がモスクワ五輪不参加のイメージ画像",
    detailText:
      "1980年、昭和の出来事。国際情勢を受けて日本選手団の派遣を見送った。スポーツを通じて社会の関心が集まり、国際交流、地域のにぎわい、メディア文化にも影響を与えた。",
  },
  "portopia-expo": {
    imageUrl: "/images/games/timeflow/portopia-expo.svg",
    imageAlt: "書物や建築で文化を表す神戸ポートアイランド博覧会開催のイメージ画像",
    detailText:
      "1981年、昭和の出来事。神戸の新しい都市開発を示す博覧会が開かれた。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "tohoku-shinkansen": {
    imageUrl: "/images/games/timeflow/tohoku-shinkansen.svg",
    imageAlt: "交通や技術の発展を表す東北新幹線開業のイメージ画像",
    detailText:
      "1982年、昭和の出来事。東北地方と首都圏を結ぶ新幹線が走り始めた。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "joetsu-shinkansen": {
    imageUrl: "/images/games/timeflow/joetsu-shinkansen.svg",
    imageAlt: "交通や技術の発展を表す上越新幹線開業のイメージ画像",
    detailText:
      "1982年、昭和の出来事。新潟方面へ向かう新幹線が開業した。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "tokyo-disneyland-open": {
    imageUrl: "/images/games/timeflow/tokyo-disneyland-open.svg",
    imageAlt: "書物や建築で文化を表す東京ディズニーランド開園のイメージ画像",
    detailText:
      "1983年、昭和の出来事。大型テーマパークとして多くの人に親しまれた。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "new-banknotes-1984": {
    imageUrl: "/images/games/timeflow/new-banknotes-1984.svg",
    imageAlt: "硬貨とグラフで経済を表す新一万円札発行のイメージ画像",
    detailText:
      "1984年、昭和の出来事。福沢諭吉の一万円札など新紙幣が発行された。「新一万円札発行」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。経済のしくみや物価、企業活動、人びとの消費行動に影響し、暮らし方の変化とも結びついた。",
  },
  "glico-morinaga-case": {
    imageUrl: "/images/games/timeflow/glico-morinaga-case.svg",
    imageAlt: "人びとと社会の変化を表すグリコ・森永事件発生のイメージ画像",
    detailText:
      "1984年、昭和の出来事。食品会社を狙った脅迫事件が社会不安を広げた。「グリコ・森永事件発生」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "plaza-accord": {
    imageUrl: "/images/games/timeflow/plaza-accord.svg",
    imageAlt: "硬貨とグラフで経済を表すプラザ合意のイメージ画像",
    detailText:
      "1985年、昭和の出来事。円高が進み、日本経済に大きな影響を与えた。「プラザ合意」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。経済のしくみや物価、企業活動、人びとの消費行動に影響し、暮らし方の変化とも結びついた。",
  },
  "jal-123-crash": {
    imageUrl: "/images/games/timeflow/jal-123-crash.svg",
    imageAlt: "災害や復旧を象徴する日本航空123便墜落事故のイメージ画像",
    detailText:
      "1985年、昭和の出来事。単独機として世界最大規模の航空事故となった。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "equal-employment-law": {
    imageUrl: "/images/games/timeflow/equal-employment-law.svg",
    imageAlt: "文書と印で制度を表す男女雇用機会均等法施行のイメージ画像",
    detailText:
      "1986年、昭和の出来事。雇用での男女の機会均等をめざす法律が施行された。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "jnr-privatization": {
    imageUrl: "/images/games/timeflow/jnr-privatization.svg",
    imageAlt: "文書と印で制度を表す国鉄分割民営化のイメージ画像",
    detailText:
      "1987年、昭和の出来事。国鉄がJR各社に分かれて民営化された。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "seikan-tunnel-open": {
    imageUrl: "/images/games/timeflow/seikan-tunnel-open.svg",
    imageAlt: "交通や技術の発展を表す青函トンネル開業のイメージ画像",
    detailText:
      "1988年、昭和の出来事。本州と北海道を鉄道で結ぶ海底トンネルが開業した。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "seto-ohashi-open": {
    imageUrl: "/images/games/timeflow/seto-ohashi-open.svg",
    imageAlt: "交通や技術の発展を表す瀬戸大橋開通のイメージ画像",
    detailText:
      "1988年、昭和の出来事。本州と四国を道路と鉄道で結ぶ橋が開通した。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "heisei-start": {
    imageUrl: "/images/games/timeflow/heisei-start.svg",
    imageAlt: "都市や施設を表す平成開始のイメージ画像",
    detailText:
      "1989年、平成の出来事。昭和が終わり、新しい元号の平成が始まった。都や施設、都市空間の変化は、政治、経済、文化の中心がどこに置かれたかを考える手がかりになる。",
  },
  "consumption-tax-start": {
    imageUrl: "/images/games/timeflow/consumption-tax-start.svg",
    imageAlt: "文書と印で制度を表す消費税導入のイメージ画像",
    detailText:
      "1989年、平成の出来事。日本で消費税制度が始まった。「消費税導入」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "flower-green-expo": {
    imageUrl: "/images/games/timeflow/flower-green-expo.svg",
    imageAlt: "書物や建築で文化を表す国際花と緑の博覧会開催のイメージ画像",
    detailText:
      "1990年、平成の出来事。大阪で花と緑をテーマにした国際博覧会が開かれた。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "bubble-collapse": {
    imageUrl: "/images/games/timeflow/bubble-collapse.svg",
    imageAlt: "硬貨とグラフで経済を表すバブル経済崩壊が進むのイメージ画像",
    detailText:
      "1991年、平成の出来事。地価や株価が下落し、長い不況につながった。「バブル経済崩壊が進む」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。経済のしくみや物価、企業活動、人びとの消費行動に影響し、暮らし方の変化とも結びついた。",
  },
  "unzen-pyroclastic-flow": {
    imageUrl: "/images/games/timeflow/unzen-pyroclastic-flow.svg",
    imageAlt: "災害や復旧を象徴する雲仙普賢岳火砕流のイメージ画像",
    detailText:
      "1991年、平成の出来事。火山災害により大きな被害が出た。「雲仙普賢岳火砕流」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "pko-law": {
    imageUrl: "/images/games/timeflow/pko-law.svg",
    imageAlt: "船と文書で外交を表すPKO協力法成立のイメージ画像",
    detailText:
      "1992年、平成の出来事。国際平和協力活動への参加を定める法律が成立した。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "mohri-space-shuttle": {
    imageUrl: "/images/games/timeflow/mohri-space-shuttle.svg",
    imageAlt: "交通や技術の発展を表す毛利衛が宇宙へのイメージ画像",
    detailText:
      "1992年、平成の出来事。日本人科学者がスペースシャトルで宇宙へ行った。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "j-league-start": {
    imageUrl: "/images/games/timeflow/j-league-start.svg",
    imageAlt: "競技場と星でスポーツを表すJリーグ開幕のイメージ画像",
    detailText:
      "1993年、平成の出来事。日本のプロサッカーリーグが始まった。「Jリーグ開幕」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。スポーツを通じて社会の関心が集まり、国際交流、地域のにぎわい、メディア文化にも影響を与えた。",
  },
  "hosokawa-cabinet": {
    imageUrl: "/images/games/timeflow/hosokawa-cabinet.svg",
    imageAlt: "文書と印で制度を表す細川内閣成立のイメージ画像",
    detailText:
      "1993年、平成の出来事。非自民連立政権が成立した。「細川内閣成立」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "kansai-airport-open": {
    imageUrl: "/images/games/timeflow/kansai-airport-open.svg",
    imageAlt: "交通や技術の発展を表す関西国際空港開港のイメージ画像",
    detailText:
      "1994年、平成の出来事。海上空港として関西国際空港が開港した。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "matsumoto-sarin": {
    imageUrl: "/images/games/timeflow/matsumoto-sarin.svg",
    imageAlt: "災害や復旧を象徴する松本サリン事件のイメージ画像",
    detailText:
      "1994年、平成の出来事。長野県松本市でサリンによる事件が起きた。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "hanshin-awaji-earthquake": {
    imageUrl: "/images/games/timeflow/hanshin-awaji-earthquake.svg",
    imageAlt: "災害や復旧を象徴する阪神・淡路大震災のイメージ画像",
    detailText:
      "1995年、平成の出来事。都市部を襲った大地震で大きな被害が出た。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "subway-sarin": {
    imageUrl: "/images/games/timeflow/subway-sarin.svg",
    imageAlt: "災害や復旧を象徴する地下鉄サリン事件のイメージ画像",
    detailText:
      "1995年、平成の出来事。東京の地下鉄でサリンが使われた事件。「地下鉄サリン事件」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "windows-95-japan": {
    imageUrl: "/images/games/timeflow/windows-95-japan.svg",
    imageAlt: "交通や技術の発展を表すWindows 95日本語版発売のイメージ画像",
    detailText:
      "1995年、平成の出来事。家庭や職場のパソコン利用が広がるきっかけとなった。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "yahoo-japan-start": {
    imageUrl: "/images/games/timeflow/yahoo-japan-start.svg",
    imageAlt: "交通や技術の発展を表すYahoo! JAPANサービス開始のイメージ画像",
    detailText:
      "1996年、平成の出来事。日本のインターネット利用を広げる入口となった。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "consumption-tax-5": {
    imageUrl: "/images/games/timeflow/consumption-tax-5.svg",
    imageAlt: "文書と印で制度を表す消費税率5%へ引き上げのイメージ画像",
    detailText:
      "1997年、平成の出来事。消費税率が3%から5%へ上がった。「消費税率5%へ引き上げ」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "kyoto-protocol": {
    imageUrl: "/images/games/timeflow/kyoto-protocol.svg",
    imageAlt: "都市や施設を表す京都議定書採択のイメージ画像",
    detailText:
      "1997年、平成の出来事。温室効果ガス削減をめざす国際合意が採択された。都や施設、都市空間の変化は、政治、経済、文化の中心がどこに置かれたかを考える手がかりになる。",
  },
  "nagano-olympics": {
    imageUrl: "/images/games/timeflow/nagano-olympics.svg",
    imageAlt: "競技場と星でスポーツを表す長野冬季オリンピック開催のイメージ画像",
    detailText:
      "1998年、平成の出来事。長野で冬季オリンピックが開かれた。「長野冬季オリンピック開催」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。スポーツを通じて社会の関心が集まり、国際交流、地域のにぎわい、メディア文化にも影響を与えた。",
  },
  "akashi-kaikyo-bridge": {
    imageUrl: "/images/games/timeflow/akashi-kaikyo-bridge.svg",
    imageAlt: "交通や技術の発展を表す明石海峡大橋開通のイメージ画像",
    detailText:
      "1998年、平成の出来事。本州と淡路島を結ぶ大橋が開通した。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "i-mode-start": {
    imageUrl: "/images/games/timeflow/i-mode-start.svg",
    imageAlt: "都市や施設を表すiモード開始のイメージ画像",
    detailText:
      "1999年、平成の出来事。携帯電話でインターネットを使う文化が広がった。都や施設、都市空間の変化は、政治、経済、文化の中心がどこに置かれたかを考える手がかりになる。",
  },
  "jco-criticality": {
    imageUrl: "/images/games/timeflow/jco-criticality.svg",
    imageAlt: "災害や復旧を象徴する東海村JCO臨界事故のイメージ画像",
    detailText:
      "1999年、平成の出来事。原子力施設で重大な臨界事故が起きた。「東海村JCO臨界事故」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "long-term-care-insurance": {
    imageUrl: "/images/games/timeflow/long-term-care-insurance.svg",
    imageAlt: "文書と印で制度を表す介護保険制度開始のイメージ画像",
    detailText:
      "2000年、平成の出来事。高齢者介護を社会で支える制度が始まった。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "kyushu-okinawa-summit": {
    imageUrl: "/images/games/timeflow/kyushu-okinawa-summit.svg",
    imageAlt: "船と文書で外交を表す九州・沖縄サミット開催のイメージ画像",
    detailText:
      "2000年、平成の出来事。沖縄などで主要国首脳会議が開かれた。「九州・沖縄サミット開催」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "central-government-reform": {
    imageUrl: "/images/games/timeflow/central-government-reform.svg",
    imageAlt: "文書と印で制度を表す中央省庁再編のイメージ画像",
    detailText:
      "2001年、平成の出来事。国の行政組織が大きく再編された。「中央省庁再編」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "koizumi-cabinet": {
    imageUrl: "/images/games/timeflow/koizumi-cabinet.svg",
    imageAlt: "文書と印で制度を表す小泉内閣成立のイメージ画像",
    detailText:
      "2001年、平成の出来事。構造改革を掲げた内閣が発足した。「小泉内閣成立」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "japan-korea-world-cup": {
    imageUrl: "/images/games/timeflow/japan-korea-world-cup.svg",
    imageAlt: "競技場と星でスポーツを表す日韓ワールドカップ開催のイメージ画像",
    detailText:
      "2002年、平成の出来事。日本と韓国がサッカーW杯を共同開催した。「日韓ワールドカップ開催」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。スポーツを通じて社会の関心が集まり、国際交流、地域のにぎわい、メディア文化にも影響を与えた。",
  },
  "abductees-return": {
    imageUrl: "/images/games/timeflow/abductees-return.svg",
    imageAlt: "船と文書で外交を表す拉致被害者5人帰国のイメージ画像",
    detailText:
      "2002年、平成の出来事。北朝鮮による拉致被害者の一部が帰国した。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "terrestrial-digital-start": {
    imageUrl: "/images/games/timeflow/terrestrial-digital-start.svg",
    imageAlt: "交通や技術の発展を表す地上デジタル放送開始のイメージ画像",
    detailText:
      "2003年、平成の出来事。テレビ放送のデジタル化が始まった。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "sdf-iraq-dispatch": {
    imageUrl: "/images/games/timeflow/sdf-iraq-dispatch.svg",
    imageAlt: "旗や城で争いを象徴する自衛隊イラク派遣のイメージ画像",
    detailText:
      "2004年、平成の出来事。自衛隊が復興支援のためイラクへ派遣された。「自衛隊イラク派遣」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "niigata-chuetsu-earthquake": {
    imageUrl: "/images/games/timeflow/niigata-chuetsu-earthquake.svg",
    imageAlt: "災害や復旧を象徴する新潟県中越地震のイメージ画像",
    detailText:
      "2004年、平成の出来事。新潟県中越地方で大きな地震が起きた。「新潟県中越地震」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "new-banknotes-2004": {
    imageUrl: "/images/games/timeflow/new-banknotes-2004.svg",
    imageAlt: "硬貨とグラフで経済を表す新紙幣発行のイメージ画像",
    detailText:
      "2004年、平成の出来事。野口英世などの新しい紙幣が発行された。「新紙幣発行」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。経済のしくみや物価、企業活動、人びとの消費行動に影響し、暮らし方の変化とも結びついた。",
  },
  "expo-aichi": {
    imageUrl: "/images/games/timeflow/expo-aichi.svg",
    imageAlt: "書物や建築で文化を表す愛・地球博開催のイメージ画像",
    detailText:
      "2005年、平成の出来事。愛知県で自然との共生をテーマにした万博が開かれた。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "postal-privatization-law": {
    imageUrl: "/images/games/timeflow/postal-privatization-law.svg",
    imageAlt: "文書と印で制度を表す郵政民営化法成立のイメージ画像",
    detailText:
      "2005年、平成の出来事。郵政事業の民営化に向けた法律が成立した。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "basic-education-law-revision": {
    imageUrl: "/images/games/timeflow/basic-education-law-revision.svg",
    imageAlt: "文書と印で制度を表す教育基本法改正のイメージ画像",
    detailText:
      "2006年、平成の出来事。戦後教育の基本法が大きく改正された。「教育基本法改正」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "postal-privatization": {
    imageUrl: "/images/games/timeflow/postal-privatization.svg",
    imageAlt: "文書と印で制度を表す郵政民営化のイメージ画像",
    detailText:
      "2007年、平成の出来事。日本郵政グループが発足した。「郵政民営化」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "tokyo-marathon-first": {
    imageUrl: "/images/games/timeflow/tokyo-marathon-first.svg",
    imageAlt: "競技場と星でスポーツを表す第1回東京マラソン開催のイメージ画像",
    detailText:
      "2007年、平成の出来事。市民参加型の大規模マラソン大会が始まった。スポーツを通じて社会の関心が集まり、国際交流、地域のにぎわい、メディア文化にも影響を与えた。",
  },
  "iphone-japan": {
    imageUrl: "/images/games/timeflow/iphone-japan.svg",
    imageAlt: "交通や技術の発展を表すiPhone日本発売のイメージ画像",
    detailText:
      "2008年、平成の出来事。スマートフォン普及の大きなきっかけになった。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "lehman-shock-japan": {
    imageUrl: "/images/games/timeflow/lehman-shock-japan.svg",
    imageAlt: "硬貨とグラフで経済を表すリーマンショックの影響のイメージ画像",
    detailText:
      "2008年、平成の出来事。世界的金融危機が日本経済にも影響した。「リーマンショックの影響」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。経済のしくみや物価、企業活動、人びとの消費行動に影響し、暮らし方の変化とも結びついた。",
  },
  "dpj-government": {
    imageUrl: "/images/games/timeflow/dpj-government.svg",
    imageAlt: "文書と印で制度を表す民主党政権成立のイメージ画像",
    detailText:
      "2009年、平成の出来事。衆議院選挙の結果、政権交代が起きた。「民主党政権成立」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "hayabusa-return": {
    imageUrl: "/images/games/timeflow/hayabusa-return.svg",
    imageAlt: "交通や技術の発展を表すはやぶさ帰還のイメージ画像",
    detailText:
      "2010年、平成の出来事。小惑星探査機が地球へ帰還した。「はやぶさ帰還」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "senkaku-collision": {
    imageUrl: "/images/games/timeflow/senkaku-collision.svg",
    imageAlt: "旗や城で争いを象徴する尖閣諸島沖衝突事件のイメージ画像",
    detailText:
      "2010年、平成の出来事。尖閣諸島沖で巡視船と漁船が衝突した。「尖閣諸島沖衝突事件」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。争いや軍事的な動きそのものより、政治の中心や社会の仕組みがどう変わったかを押さえたい。",
  },
  "great-east-japan-earthquake": {
    imageUrl: "/images/games/timeflow/great-east-japan-earthquake.svg",
    imageAlt: "災害や復旧を象徴する東日本大震災のイメージ画像",
    detailText:
      "2011年、平成の出来事。東北地方太平洋沖地震と津波が大きな被害をもたらした。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "fukushima-nuclear-accident": {
    imageUrl: "/images/games/timeflow/fukushima-nuclear-accident.svg",
    imageAlt: "災害や復旧を象徴する福島第一原発事故のイメージ画像",
    detailText:
      "2011年、平成の出来事。原子力発電所で重大事故が発生した。「福島第一原発事故」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "nadeshiko-world-cup": {
    imageUrl: "/images/games/timeflow/nadeshiko-world-cup.svg",
    imageAlt: "競技場と星でスポーツを表すなでしこジャパンW杯優勝のイメージ画像",
    detailText:
      "2011年、平成の出来事。女子サッカー日本代表が世界一になった。「なでしこジャパンW杯優勝」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。スポーツを通じて社会の関心が集まり、国際交流、地域のにぎわい、メディア文化にも影響を与えた。",
  },
  "tokyo-skytree-open": {
    imageUrl: "/images/games/timeflow/tokyo-skytree-open.svg",
    imageAlt: "交通や技術の発展を表す東京スカイツリー開業のイメージ画像",
    detailText:
      "2012年、平成の出来事。東京の新しい電波塔・観光名所が開業した。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "yamanaka-nobel": {
    imageUrl: "/images/games/timeflow/yamanaka-nobel.svg",
    imageAlt: "人びとと社会の変化を表す山中伸弥がノーベル賞受賞のイメージ画像",
    detailText:
      "2012年、平成の出来事。iPS細胞研究でノーベル生理学・医学賞を受賞した。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "fuji-world-heritage": {
    imageUrl: "/images/games/timeflow/fuji-world-heritage.svg",
    imageAlt: "書物や建築で文化を表す富士山が世界文化遺産登録のイメージ画像",
    detailText:
      "2013年、平成の出来事。信仰と芸術の対象として富士山が評価された。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "washoku-unesco": {
    imageUrl: "/images/games/timeflow/washoku-unesco.svg",
    imageAlt: "書物や建築で文化を表す和食がユネスコ無形文化遺産登録のイメージ画像",
    detailText:
      "2013年、平成の出来事。日本の食文化が国際的に評価された。「和食がユネスコ無形文化遺産登録」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "consumption-tax-8": {
    imageUrl: "/images/games/timeflow/consumption-tax-8.svg",
    imageAlt: "文書と印で制度を表す消費税率8%へ引き上げのイメージ画像",
    detailText:
      "2014年、平成の出来事。消費税率が5%から8%へ上がった。「消費税率8%へ引き上げ」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "tomioka-world-heritage": {
    imageUrl: "/images/games/timeflow/tomioka-world-heritage.svg",
    imageAlt: "書物や建築で文化を表す富岡製糸場が世界遺産登録のイメージ画像",
    detailText:
      "2014年、平成の出来事。近代日本の産業化を伝える遺産が登録された。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "hokuriku-shinkansen-kanazawa": {
    imageUrl: "/images/games/timeflow/hokuriku-shinkansen-kanazawa.svg",
    imageAlt: "交通や技術の発展を表す北陸新幹線金沢開業のイメージ画像",
    detailText:
      "2015年、平成の出来事。北陸への移動が大きく便利になった。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "my-number-start": {
    imageUrl: "/images/games/timeflow/my-number-start.svg",
    imageAlt: "文書と印で制度を表すマイナンバー制度開始のイメージ画像",
    detailText:
      "2015年、平成の出来事。社会保障・税・災害対策で使う番号制度が始まった。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "kumamoto-earthquake": {
    imageUrl: "/images/games/timeflow/kumamoto-earthquake.svg",
    imageAlt: "災害や復旧を象徴する熊本地震のイメージ画像",
    detailText:
      "2016年、平成の出来事。熊本県を中心に強い地震が発生した。「熊本地震」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "voting-age-18": {
    imageUrl: "/images/games/timeflow/voting-age-18.svg",
    imageAlt: "文書と印で制度を表す選挙権年齢18歳へのイメージ画像",
    detailText:
      "2016年、平成の出来事。18歳以上が国政選挙で投票できるようになった。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "ise-shima-summit": {
    imageUrl: "/images/games/timeflow/ise-shima-summit.svg",
    imageAlt: "船と文書で外交を表す伊勢志摩サミット開催のイメージ画像",
    detailText:
      "2016年、平成の出来事。三重県で主要国首脳会議が開かれた。「伊勢志摩サミット開催」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "okinoshima-world-heritage": {
    imageUrl: "/images/games/timeflow/okinoshima-world-heritage.svg",
    imageAlt: "書物や建築で文化を表す宗像・沖ノ島が世界遺産登録のイメージ画像",
    detailText:
      "2017年、平成の出来事。古代の信仰を伝える遺産が世界遺産に登録された。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "abdication-special-law": {
    imageUrl: "/images/games/timeflow/abdication-special-law.svg",
    imageAlt: "文書と印で制度を表す天皇退位特例法成立のイメージ画像",
    detailText:
      "2017年、平成の出来事。天皇退位を可能にする特例法が成立した。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "osaka-north-earthquake": {
    imageUrl: "/images/games/timeflow/osaka-north-earthquake.svg",
    imageAlt: "災害や復旧を象徴する大阪北部地震のイメージ画像",
    detailText:
      "2018年、平成の出来事。大阪府北部で強い地震が発生した。「大阪北部地震」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "meiji-150": {
    imageUrl: "/images/games/timeflow/meiji-150.svg",
    imageAlt: "書物や建築で文化を表す明治150年のイメージ画像",
    detailText:
      "2018年、平成の出来事。明治元年から150年の節目を迎えた。「明治150年」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。作品、宗教、建築、生活文化などを通じて、その時代の価値観や社会の広がりを知る手がかりになる。",
  },
  "toyosu-market-open": {
    imageUrl: "/images/games/timeflow/toyosu-market-open.svg",
    imageAlt: "都市や施設を表す築地市場が豊洲へ移転のイメージ画像",
    detailText:
      "2018年、平成の出来事。東京の中央卸売市場が豊洲に移った。「築地市場が豊洲へ移転」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。都や施設、都市空間の変化は、政治、経済、文化の中心がどこに置かれたかを考える手がかりになる。",
  },
  "reiwa-start": {
    imageUrl: "/images/games/timeflow/reiwa-start.svg",
    imageAlt: "都市や施設を表す令和開始のイメージ画像",
    detailText:
      "2019年、令和の出来事。平成が終わり、新しい元号の令和が始まった。都や施設、都市空間の変化は、政治、経済、文化の中心がどこに置かれたかを考える手がかりになる。",
  },
  "rugby-world-cup-japan": {
    imageUrl: "/images/games/timeflow/rugby-world-cup-japan.svg",
    imageAlt: "競技場と星でスポーツを表すラグビーワールドカップ日本大会のイメージ画像",
    detailText:
      "2019年、令和の出来事。日本でラグビーW杯が開催された。「ラグビーワールドカップ日本大会」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。スポーツを通じて社会の関心が集まり、国際交流、地域のにぎわい、メディア文化にも影響を与えた。",
  },
  "consumption-tax-10": {
    imageUrl: "/images/games/timeflow/consumption-tax-10.svg",
    imageAlt: "文書と印で制度を表す消費税率10%へ引き上げのイメージ画像",
    detailText:
      "2019年、令和の出来事。消費税率が10%になった。「消費税率10%へ引き上げ」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "shuri-castle-fire": {
    imageUrl: "/images/games/timeflow/shuri-castle-fire.svg",
    imageAlt: "災害や復旧を象徴する首里城火災のイメージ画像",
    detailText:
      "2019年、令和の出来事。沖縄の象徴的な建物が火災で焼失した。「首里城火災」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "covid-school-closure": {
    imageUrl: "/images/games/timeflow/covid-school-closure.svg",
    imageAlt: "災害や復旧を象徴する新型コロナ全国一斉休校のイメージ画像",
    detailText:
      "2020年、令和の出来事。感染拡大を受けて学校生活が大きく変わった。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "tokyo-olympics-postponed": {
    imageUrl: "/images/games/timeflow/tokyo-olympics-postponed.svg",
    imageAlt: "競技場と星でスポーツを表す東京五輪延期のイメージ画像",
    detailText:
      "2020年、令和の出来事。感染症の影響で東京大会が延期された。「東京五輪延期」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。スポーツを通じて社会の関心が集まり、国際交流、地域のにぎわい、メディア文化にも影響を与えた。",
  },
  "plastic-bag-fee": {
    imageUrl: "/images/games/timeflow/plastic-bag-fee.svg",
    imageAlt: "人びとと社会の変化を表すレジ袋有料化のイメージ画像",
    detailText:
      "2020年、令和の出来事。プラスチックごみ削減をめざし有料化が始まった。「レジ袋有料化」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "tokyo-olympics-2021": {
    imageUrl: "/images/games/timeflow/tokyo-olympics-2021.svg",
    imageAlt: "競技場と星でスポーツを表す東京2020オリンピック開催のイメージ画像",
    detailText:
      "2021年、令和の出来事。延期された東京大会が開催された。「東京2020オリンピック開催」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。スポーツを通じて社会の関心が集まり、国際交流、地域のにぎわい、メディア文化にも影響を与えた。",
  },
  "tokyo-paralympics-2021": {
    imageUrl: "/images/games/timeflow/tokyo-paralympics-2021.svg",
    imageAlt: "競技場と星でスポーツを表す東京パラリンピック開催のイメージ画像",
    detailText:
      "2021年、令和の出来事。東京でパラリンピックが開催された。「東京パラリンピック開催」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。スポーツを通じて社会の関心が集まり、国際交流、地域のにぎわい、メディア文化にも影響を与えた。",
  },
  "digital-agency": {
    imageUrl: "/images/games/timeflow/digital-agency.svg",
    imageAlt: "文書と印で制度を表すデジタル庁発足のイメージ画像",
    detailText:
      "2021年、令和の出来事。行政のデジタル化を進める新しい組織ができた。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "adult-age-18": {
    imageUrl: "/images/games/timeflow/adult-age-18.svg",
    imageAlt: "文書と印で制度を表す成人年齢18歳へのイメージ画像",
    detailText:
      "2022年、令和の出来事。民法上の成人年齢が20歳から18歳になった。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
  "okinawa-reversion-50": {
    imageUrl: "/images/games/timeflow/okinawa-reversion-50.svg",
    imageAlt: "人びとと社会の変化を表す沖縄復帰50年のイメージ画像",
    detailText:
      "2022年、令和の出来事。沖縄の日本復帰から50年の節目を迎えた。「沖縄復帰50年」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。社会のしくみや人びとの意識が変わる節目として、前後の出来事と合わせて流れをつかみたい。",
  },
  "nishi-kyushu-shinkansen": {
    imageUrl: "/images/games/timeflow/nishi-kyushu-shinkansen.svg",
    imageAlt: "交通や技術の発展を表す西九州新幹線開業のイメージ画像",
    detailText:
      "2022年、令和の出来事。長崎方面へ向かう新幹線が開業した。新しい技術や交通・通信の広がりが、人の移動、情報の伝わり方、産業のあり方を変えていった点に注目したい。",
  },
  "g7-hiroshima-summit": {
    imageUrl: "/images/games/timeflow/g7-hiroshima-summit.svg",
    imageAlt: "船と文書で外交を表すG7広島サミット開催のイメージ画像",
    detailText:
      "2023年、令和の出来事。広島で主要国首脳会議が開かれた。「G7広島サミット開催」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。相手国や国際社会との関係を変え、貿易、安全保障、国内政治にも影響を広げた出来事として押さえたい。",
  },
  "covid-category-5": {
    imageUrl: "/images/games/timeflow/covid-category-5.svg",
    imageAlt: "災害や復旧を象徴する新型コロナ5類移行のイメージ画像",
    detailText:
      "2023年、令和の出来事。感染症法上の位置づけが5類へ移行した。「新型コロナ5類移行」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。被害だけでなく、防災、復旧、社会制度の見直しにつながった点も歴史の流れを考える手がかりになる。",
  },
  "wbc-japan-2023": {
    imageUrl: "/images/games/timeflow/wbc-japan-2023.svg",
    imageAlt: "競技場と星でスポーツを表すWBC日本優勝のイメージ画像",
    detailText:
      "2023年、令和の出来事。野球日本代表が世界一になった。「WBC日本優勝」は前後の出来事と結びつけると、時代の変化をよりつかみやすい。スポーツを通じて社会の関心が集まり、国際交流、地域のにぎわい、メディア文化にも影響を与えた。",
  },
  "kodomo-agency-start": {
    imageUrl: "/images/games/timeflow/kodomo-agency-start.svg",
    imageAlt: "文書と印で制度を表すこども家庭庁発足のイメージ画像",
    detailText:
      "2023年、令和の出来事。こども政策を担当する新しい行政機関が発足した。法律や制度の変更を通じて、政治のしくみや人びとの暮らしにどのような変化が生まれたかが重要になる。",
  },
};
