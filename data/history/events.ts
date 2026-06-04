import type { HistoryEvent } from "@/types/history";

export const historyEvents: HistoryEvent[] = [
  {
    id: "wa-envoy-sui",
    title: "小野妹子を隋へ派遣",
    year: 607,
    era: "古代",
    shortText: "小野妹子が隋へ渡り、東アジアとの外交が進んだ。",
    description:
      "推古天皇の時代、小野妹子が隋へ派遣されました。",
    tags: ["外交"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "taika-reform",
    title: "大化の改新",
    year: 645,
    era: "飛鳥",
    shortText: "中央集権国家をめざす大きな政治改革が始まった。",
    description:
      "中大兄皇子や中臣鎌足らが中心となり、政治改革が進みました。",
    tags: ["政治"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "jinshin-war",
    title: "壬申の乱",
    year: 672,
    era: "飛鳥",
    shortText: "古代最大級の内乱で、のちの天武天皇が勝利した。",
    description:
      "天智天皇の後継をめぐる争いで、大海人皇子が勝利しました。",
    tags: ["政治"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "taiho-code",
    title: "大宝律令が完成",
    year: 701,
    era: "飛鳥",
    shortText: "律令国家の基本となる法律が整えられた。",
    description:
      "律令にもとづく国家制度が整えられました。",
    tags: ["法律"],
    card: {
      rarity: "rare",
      color: "#22c55e",
    },
  },
  {
    id: "heijo-kyo",
    title: "平城京に都を移す",
    year: 710,
    era: "奈良",
    shortText: "奈良の平城京を中心に政治が行われた。",
    description:
      "現在の奈良に都が置かれ、奈良時代が始まりました。",
    tags: ["都"],
    card: {
      rarity: "common",
      color: "#0ea5e9",
    },
  },
  {
    id: "kojiki",
    title: "古事記が完成",
    year: 712,
    era: "奈良",
    shortText: "神話や古い伝承をまとめた歴史書が完成した。",
    description:
      "日本最古級の歴史書として古事記がまとめられました。",
    tags: ["文化"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "nihon-shoki",
    title: "日本書紀が完成",
    year: 720,
    era: "奈良",
    shortText: "国の成り立ちを記した正史がまとめられた。",
    description:
      "国家の歴史をまとめた日本書紀が完成しました。",
    tags: ["文化"],
    card: {
      rarity: "common",
      color: "#60a5fa",
    },
  },
  {
    id: "todai-ji-buddha",
    title: "東大寺大仏の開眼供養",
    year: 752,
    era: "奈良",
    shortText: "奈良の大仏完成を祝う大きな儀式が行われた。",
    description:
      "聖武天皇の時代に大仏の完成を祝う儀式が行われました。",
    tags: ["宗教"],
    card: {
      rarity: "legend",
      color: "#fb7185",
    },
  },
  {
    id: "heian-kyo",
    title: "平安京に都を移す",
    year: 794,
    era: "平安",
    shortText: "京都の平安京を中心とする時代が始まった。",
    description:
      "桓武天皇が都を平安京へ移し、平安時代が始まりました。",
    tags: ["都"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "kukai-shingon",
    title: "空海が高野山を開く",
    year: 816,
    era: "平安",
    shortText: "高野山が真言密教の重要な拠点となった。",
    description:
      "空海が高野山を真言密教の修行の場としました。",
    tags: ["宗教"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "taira-masakado",
    title: "平将門の乱",
    year: 939,
    era: "平安",
    shortText: "武士の力が広がる時代を示す大きな反乱だった。",
    description:
      "関東で平将門が反乱を起こしました。",
    tags: ["武士"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "genji-monogatari",
    title: "源氏物語が成立したころ",
    year: 1008,
    era: "平安",
    shortText: "平安貴族の文化を伝える長編物語が生まれた。",
    description:
      "紫式部による源氏物語が貴族文化を代表する作品となりました。",
    tags: ["文化"],
    card: {
      rarity: "rare",
      color: "#22c55e",
    },
  },
  {
    id: "insei-start",
    title: "院政が始まる",
    year: 1086,
    era: "平安",
    shortText: "天皇を退いた上皇が政治を動かす仕組みが始まった。",
    description:
      "白河上皇が院政を始め、上皇が政治に強い影響を持ちました。",
    tags: ["政治"],
    card: {
      rarity: "common",
      color: "#0ea5e9",
    },
  },
  {
    id: "hogen-rebellion",
    title: "保元の乱",
    year: 1156,
    era: "平安",
    shortText: "武士が中央政治で大きな役割を持つきっかけとなった。",
    description:
      "皇位継承などをめぐり、武士が政治の中心に近づきました。",
    tags: ["武士"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "heiji-rebellion",
    title: "平治の乱",
    year: 1159,
    era: "平安",
    shortText: "平氏政権へ向かう流れを強めた争いだった。",
    description:
      "源氏と平氏の対立が深まり、平氏の力が強まりました。",
    tags: ["武士"],
    card: {
      rarity: "common",
      color: "#60a5fa",
    },
  },
  {
    id: "taira-kiyomori",
    title: "平清盛が太政大臣になる",
    year: 1167,
    era: "平安",
    shortText: "武士が朝廷政治の頂点に立った象徴的な出来事。",
    description:
      "平清盛が武士として初めて太政大臣となりました。",
    tags: ["武士"],
    card: {
      rarity: "legend",
      color: "#fb7185",
    },
  },
  {
    id: "genpei-war",
    title: "源平合戦が始まる",
    year: 1180,
    era: "平安",
    shortText: "源氏と平氏が全国規模で争う時代になった。",
    description:
      "源氏と平氏の大きな戦いが始まりました。",
    tags: ["合戦"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "dan-no-ura",
    title: "壇ノ浦の戦い",
    year: 1185,
    era: "平安",
    shortText: "源平合戦の最後を飾る海上の戦いだった。",
    description:
      "源氏が平氏を滅ぼし、平氏政権が終わりました。",
    tags: ["合戦"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "kamakura-shogunate",
    title: "鎌倉幕府が開かれる",
    year: 1192,
    era: "鎌倉",
    shortText: "武士による政治が本格的に始まった。",
    description:
      "源頼朝が征夷大将軍となり、鎌倉幕府が整いました。",
    tags: ["幕府"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "jokyu-war",
    title: "承久の乱",
    year: 1221,
    era: "鎌倉",
    shortText: "朝廷より幕府の力が強まるきっかけとなった。",
    description:
      "後鳥羽上皇が幕府に対して兵を挙げましたが敗れました。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#22c55e",
    },
  },
  {
    id: "goseibai-shikimoku",
    title: "御成敗式目が制定",
    year: 1232,
    era: "鎌倉",
    shortText: "武士社会の裁判や政治の基準が整えられた。",
    description:
      "北条泰時が武士のための法律を定めました。",
    tags: ["法律"],
    card: {
      rarity: "common",
      color: "#0ea5e9",
    },
  },
  {
    id: "mongol-first",
    title: "文永の役",
    year: 1274,
    era: "鎌倉",
    shortText: "元軍が九州北部へ来襲し、防衛戦が行われた。",
    description:
      "元が日本へ攻めてきた最初の戦いです。",
    tags: ["外交"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "mongol-second",
    title: "弘安の役",
    year: 1281,
    era: "鎌倉",
    shortText: "二度目の元軍来襲を退けた出来事。",
    description:
      "元が再び日本へ攻めてきました。",
    tags: ["外交"],
    card: {
      rarity: "common",
      color: "#60a5fa",
    },
  },
  {
    id: "kamakura-fall",
    title: "鎌倉幕府が滅亡",
    year: 1333,
    era: "鎌倉",
    shortText: "鎌倉幕府の支配が終わり、新たな政治へ移った。",
    description:
      "新田義貞らの攻撃により鎌倉幕府が倒れました。",
    tags: ["幕府"],
    card: {
      rarity: "legend",
      color: "#fb7185",
    },
  },
  {
    id: "kenmu-restoration",
    title: "建武の新政",
    year: 1334,
    era: "南北朝",
    shortText: "天皇中心の政治を復活させようとした改革。",
    description:
      "後醍醐天皇による新しい政治が始まりました。",
    tags: ["政治"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "muromachi-shogunate",
    title: "室町幕府が開かれる",
    year: 1338,
    era: "室町",
    shortText: "京都を中心とした室町幕府の時代が始まった。",
    description:
      "足利尊氏が征夷大将軍となりました。",
    tags: ["幕府"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "kinkaku",
    title: "金閣が建てられる",
    year: 1397,
    era: "室町",
    shortText: "室町時代の華やかな文化を代表する建築。",
    description:
      "足利義満が北山文化を象徴する金閣を建てました。",
    tags: ["文化"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "shocho-uprising",
    title: "正長の土一揆",
    year: 1428,
    era: "室町",
    shortText: "民衆が政治や社会に影響を与えた出来事。",
    description:
      "農民らが借金帳消しを求めて一揆を起こしました。",
    tags: ["社会"],
    card: {
      rarity: "rare",
      color: "#22c55e",
    },
  },
  {
    id: "onin-war",
    title: "応仁の乱が始まる",
    year: 1467,
    era: "室町",
    shortText: "戦国時代の始まりにつながる長い内乱。",
    description:
      "京都を中心に大きな内乱が起こり、戦国時代へ向かいました。",
    tags: ["合戦"],
    card: {
      rarity: "common",
      color: "#0ea5e9",
    },
  },
  {
    id: "ginkaku",
    title: "銀閣が建てられる",
    year: 1489,
    era: "室町",
    shortText: "わび・さびの美意識につながる文化を代表する建築。",
    description:
      "足利義政が東山文化を象徴する銀閣を建てました。",
    tags: ["文化"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "tanegashima-guns",
    title: "鉄砲伝来",
    year: 1543,
    era: "戦国",
    shortText: "戦国時代の合戦に大きな変化をもたらした。",
    description:
      "種子島に鉄砲が伝わり、戦い方が変わりました。",
    tags: ["技術"],
    card: {
      rarity: "common",
      color: "#60a5fa",
    },
  },
  {
    id: "francis-xavier",
    title: "キリスト教伝来",
    year: 1549,
    era: "戦国",
    shortText: "日本とヨーロッパの交流が深まった。",
    description:
      "フランシスコ・ザビエルが日本にキリスト教を伝えました。",
    tags: ["宗教"],
    card: {
      rarity: "legend",
      color: "#fb7185",
    },
  },
  {
    id: "okehazama",
    title: "桶狭間の戦い",
    year: 1560,
    era: "戦国",
    shortText: "信長が全国に名を知られるきっかけとなった戦い。",
    description:
      "織田信長が今川義元を破りました。",
    tags: ["合戦"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "muromachi-fall",
    title: "室町幕府が滅亡",
    year: 1573,
    era: "戦国",
    shortText: "室町幕府の時代が終わった。",
    description:
      "織田信長が足利義昭を京都から追放しました。",
    tags: ["幕府"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "nagashino",
    title: "長篠の戦い",
    year: 1575,
    era: "戦国",
    shortText: "鉄砲の活用で知られる戦国時代の合戦。",
    description:
      "織田・徳川連合軍が武田軍を破りました。",
    tags: ["合戦"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "azuchi-castle",
    title: "安土城の築城開始",
    year: 1576,
    era: "安土桃山",
    shortText: "天下統一をめざす拠点となった城。",
    description:
      "織田信長が安土城を築き始めました。",
    tags: ["城"],
    card: {
      rarity: "rare",
      color: "#22c55e",
    },
  },
  {
    id: "honnoji",
    title: "本能寺の変",
    year: 1582,
    era: "安土桃山",
    shortText: "信長の天下統一目前で起きた大事件。",
    description:
      "明智光秀が織田信長を討ちました。",
    tags: ["合戦"],
    card: {
      rarity: "common",
      color: "#0ea5e9",
    },
  },
  {
    id: "taiko-kenchi",
    title: "太閤検地が始まる",
    year: 1582,
    era: "安土桃山",
    shortText: "年貢や土地支配の基準が整えられた。",
    description:
      "豊臣秀吉が全国の土地調査を進めました。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "sword-hunt",
    title: "刀狩令",
    year: 1588,
    era: "安土桃山",
    shortText: "兵農分離を進める政策だった。",
    description:
      "豊臣秀吉が農民から武器を取り上げました。",
    tags: ["政治"],
    card: {
      rarity: "common",
      color: "#60a5fa",
    },
  },
  {
    id: "odawara",
    title: "小田原攻め",
    year: 1590,
    era: "安土桃山",
    shortText: "秀吉の天下統一を決定づけた戦い。",
    description:
      "豊臣秀吉が北条氏を破り、全国統一を進めました。",
    tags: ["合戦"],
    card: {
      rarity: "legend",
      color: "#fb7185",
    },
  },
  {
    id: "korean-invasion",
    title: "文禄の役",
    year: 1592,
    era: "安土桃山",
    shortText: "東アジアを巻き込む大きな戦争となった。",
    description:
      "豊臣秀吉が朝鮮へ出兵しました。",
    tags: ["外交"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "battle-of-sekigahara",
    title: "関ヶ原の戦い",
    year: 1600,
    era: "安土桃山",
    shortText: "天下分け目と呼ばれる大きな戦い。",
    description:
      "徳川家康が石田三成らの西軍を破りました。",
    tags: ["合戦"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "edo-shogunate",
    title: "江戸幕府が開かれる",
    year: 1603,
    era: "江戸",
    shortText: "江戸を中心とする長い幕府政治が始まった。",
    description:
      "徳川家康が征夷大将軍となりました。",
    tags: ["幕府"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "osaka-siege",
    title: "大坂の陣が終わる",
    year: 1615,
    era: "江戸",
    shortText: "江戸幕府の安定につながった戦い。",
    description:
      "豊臣氏が滅び、徳川氏の支配が固まりました。",
    tags: ["合戦"],
    card: {
      rarity: "rare",
      color: "#22c55e",
    },
  },
  {
    id: "bukeshohatto",
    title: "武家諸法度が出される",
    year: 1615,
    era: "江戸",
    shortText: "幕府が大名を管理する仕組みが整えられた。",
    description:
      "大名を統制するための決まりが定められました。",
    tags: ["法律"],
    card: {
      rarity: "common",
      color: "#0ea5e9",
    },
  },
  {
    id: "sankin-kotai",
    title: "参勤交代が制度化",
    year: 1635,
    era: "江戸",
    shortText: "大名統制と江戸の発展に大きな影響を与えた。",
    description:
      "大名が江戸と領地を往復する制度が整いました。",
    tags: ["制度"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "sakoku-edict",
    title: "鎖国体制が強まる",
    year: 1639,
    era: "江戸",
    shortText: "対外交流が長崎などに限られていった。",
    description:
      "ポルトガル船の来航が禁止されました。",
    tags: ["外交"],
    card: {
      rarity: "common",
      color: "#60a5fa",
    },
  },
  {
    id: "shimabara",
    title: "島原・天草一揆",
    year: 1637,
    era: "江戸",
    shortText: "幕府の宗教政策にも影響した大きな一揆。",
    description:
      "キリシタンや農民らが大規模な一揆を起こしました。",
    tags: ["社会"],
    card: {
      rarity: "legend",
      color: "#fb7185",
    },
  },
  {
    id: "meireki-fire",
    title: "明暦の大火",
    year: 1657,
    era: "江戸",
    shortText: "江戸の町づくりを見直すきっかけとなった火災。",
    description:
      "江戸で大火が起こり、都市整備に影響しました。",
    tags: ["災害"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "genroku-culture",
    title: "元禄文化が栄える",
    year: 1688,
    era: "江戸",
    shortText: "歌舞伎や浮世草子など町人文化が花開いた。",
    description:
      "上方を中心に町人文化が発展しました。",
    tags: ["文化"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "ako-incident",
    title: "赤穂事件",
    year: 1703,
    era: "江戸",
    shortText: "のちに忠臣蔵として広く知られる事件。",
    description:
      "赤穂浪士の討ち入りが起こりました。",
    tags: ["社会"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "kyohoreforms",
    title: "享保の改革が始まる",
    year: 1716,
    era: "江戸",
    shortText: "倹約や新田開発などの改革が行われた。",
    description:
      "徳川吉宗が幕府財政の立て直しを進めました。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#22c55e",
    },
  },
  {
    id: "rangaku-start",
    title: "解体新書が刊行",
    year: 1774,
    era: "江戸",
    shortText: "蘭学の発展を象徴する出来事。",
    description:
      "杉田玄白らが西洋医学書を翻訳しました。",
    tags: ["学問"],
    card: {
      rarity: "common",
      color: "#0ea5e9",
    },
  },
  {
    id: "tenmei-famine",
    title: "天明の飢饉",
    year: 1782,
    era: "江戸",
    shortText: "社会不安や改革の背景となった災害。",
    description:
      "東北地方などで大きな飢饉が起こりました。",
    tags: ["災害"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "kansei-reforms",
    title: "寛政の改革が始まる",
    year: 1787,
    era: "江戸",
    shortText: "倹約や学問奨励などで幕府を立て直そうとした。",
    description:
      "松平定信が幕政改革を進めました。",
    tags: ["政治"],
    card: {
      rarity: "common",
      color: "#60a5fa",
    },
  },
  {
    id: "ino-map",
    title: "伊能忠敬の測量開始",
    year: 1800,
    era: "江戸",
    shortText: "正確な日本地図作成につながった。",
    description:
      "伊能忠敬が全国測量を始めました。",
    tags: ["学問"],
    card: {
      rarity: "legend",
      color: "#fb7185",
    },
  },
  {
    id: "tempo-reforms",
    title: "天保の改革が始まる",
    year: 1841,
    era: "江戸",
    shortText: "幕府の立て直しをめざした改革。",
    description:
      "水野忠邦が幕政改革を進めました。",
    tags: ["政治"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "perry-arrival",
    title: "ペリー来航",
    year: 1853,
    era: "江戸",
    shortText: "開国を迫る大きな転機となった。",
    description:
      "アメリカのペリーが浦賀に来航しました。",
    tags: ["外交"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "kanagawa-treaty",
    title: "日米和親条約",
    year: 1854,
    era: "江戸",
    shortText: "下田・函館を開くことになった条約。",
    description:
      "日本がアメリカと条約を結び、開国へ進みました。",
    tags: ["外交"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "ansei-treaties",
    title: "日米修好通商条約",
    year: 1858,
    era: "江戸",
    shortText: "不平等条約として国内政治にも影響した。",
    description:
      "貿易開始を定める条約が結ばれました。",
    tags: ["外交"],
    card: {
      rarity: "rare",
      color: "#22c55e",
    },
  },
  {
    id: "sakuradamon",
    title: "桜田門外の変",
    year: 1860,
    era: "江戸",
    shortText: "幕末政治の緊張を象徴する事件。",
    description:
      "大老井伊直弼が水戸浪士らに暗殺されました。",
    tags: ["政治"],
    card: {
      rarity: "common",
      color: "#0ea5e9",
    },
  },
  {
    id: "satsuma-choshu",
    title: "薩長同盟",
    year: 1866,
    era: "江戸",
    shortText: "倒幕運動を強める大きなきっかけとなった。",
    description:
      "薩摩藩と長州藩が同盟を結びました。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "taisei-hokan",
    title: "大政奉還",
    year: 1867,
    era: "江戸",
    shortText: "江戸幕府の終わりに向かう重要な出来事。",
    description:
      "徳川慶喜が政権を朝廷へ返しました。",
    tags: ["政治"],
    card: {
      rarity: "common",
      color: "#60a5fa",
    },
  },
  {
    id: "meiji-restoration",
    title: "明治維新",
    year: 1868,
    era: "明治",
    shortText: "政治・社会・文化の大きな改革が行われた。",
    description:
      "新政府のもとで近代化が進みました。",
    tags: ["政治"],
    card: {
      rarity: "legend",
      color: "#fb7185",
    },
  },
  {
    id: "boshin-war",
    title: "戊辰戦争",
    year: 1868,
    era: "明治",
    shortText: "新政府の支配を固める内戦だった。",
    description:
      "旧幕府勢力と新政府軍が戦いました。",
    tags: ["合戦"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "haihan-chiken",
    title: "廃藩置県",
    year: 1871,
    era: "明治",
    shortText: "中央集権国家づくりを進めた改革。",
    description:
      "藩を廃止して府県を置きました。",
    tags: ["政治"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "gakusei",
    title: "学制が公布",
    year: 1872,
    era: "明治",
    shortText: "教育制度の整備が進められた。",
    description:
      "近代的な学校制度が始まりました。",
    tags: ["教育"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "railway-start",
    title: "新橋・横浜間に鉄道開業",
    year: 1872,
    era: "明治",
    shortText: "交通と産業の近代化を象徴する出来事。",
    description:
      "日本初の本格的な鉄道が開業しました。",
    tags: ["技術"],
    card: {
      rarity: "rare",
      color: "#22c55e",
    },
  },
  {
    id: "land-tax",
    title: "地租改正",
    year: 1873,
    era: "明治",
    shortText: "明治政府の財政基盤を支えた改革。",
    description:
      "土地に税をかける制度が整えられました。",
    tags: ["政治"],
    card: {
      rarity: "common",
      color: "#0ea5e9",
    },
  },
  {
    id: "seinan-war",
    title: "西南戦争",
    year: 1877,
    era: "明治",
    shortText: "士族反乱の最後で最大の戦い。",
    description:
      "西郷隆盛らが新政府に反乱を起こしました。",
    tags: ["合戦"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "constitution",
    title: "大日本帝国憲法発布",
    year: 1889,
    era: "明治",
    shortText: "議会政治の枠組みが整えられた。",
    description:
      "近代国家の基本法が定められました。",
    tags: ["法律"],
    card: {
      rarity: "common",
      color: "#60a5fa",
    },
  },
  {
    id: "imperial-diet",
    title: "第一回帝国議会",
    year: 1890,
    era: "明治",
    shortText: "日本で本格的な議会政治が始まった。",
    description:
      "帝国議会が開かれました。",
    tags: ["政治"],
    card: {
      rarity: "legend",
      color: "#fb7185",
    },
  },
  {
    id: "sino-japanese-war",
    title: "日清戦争が始まる",
    year: 1894,
    era: "明治",
    shortText: "朝鮮半島をめぐる対立から始まった戦争。",
    description:
      "日本と清の間で戦争が起こりました。",
    tags: ["外交"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "treaty-shimonoseki",
    title: "下関条約",
    year: 1895,
    era: "明治",
    shortText: "日本の国際的地位に影響した条約。",
    description:
      "日清戦争後の講和条約が結ばれました。",
    tags: ["外交"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "anglo-japanese",
    title: "日英同盟",
    year: 1902,
    era: "明治",
    shortText: "日本の外交上の地位を高めた同盟。",
    description:
      "日本とイギリスが同盟を結びました。",
    tags: ["外交"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "russo-japanese-war",
    title: "日露戦争が始まる",
    year: 1904,
    era: "明治",
    shortText: "満州や朝鮮をめぐる対立から始まった。",
    description:
      "日本とロシアの間で戦争が起こりました。",
    tags: ["外交"],
    card: {
      rarity: "rare",
      color: "#22c55e",
    },
  },
  {
    id: "portsmouth",
    title: "ポーツマス条約",
    year: 1905,
    era: "明治",
    shortText: "戦争終結とその後の国内世論に影響した。",
    description:
      "日露戦争の講和条約が結ばれました。",
    tags: ["外交"],
    card: {
      rarity: "common",
      color: "#0ea5e9",
    },
  },
  {
    id: "korea-annexation",
    title: "韓国併合",
    year: 1910,
    era: "明治",
    shortText: "東アジアの近代史に大きな影響を与えた出来事。",
    description:
      "日本が韓国を併合しました。",
    tags: ["外交"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "taisho-democracy",
    title: "大正時代が始まる",
    year: 1912,
    era: "大正",
    shortText: "政党政治や大衆文化が広がる時代になった。",
    description:
      "明治天皇が崩御し、大正時代に入りました。",
    tags: ["政治"],
    card: {
      rarity: "common",
      color: "#60a5fa",
    },
  },
  {
    id: "ww1-japan",
    title: "日本が第一次世界大戦に参戦",
    year: 1914,
    era: "大正",
    shortText: "国際社会での立場に影響した。",
    description:
      "日本は連合国側として参戦しました。",
    tags: ["外交"],
    card: {
      rarity: "legend",
      color: "#fb7185",
    },
  },
  {
    id: "rice-riots",
    title: "米騒動",
    year: 1918,
    era: "大正",
    shortText: "民衆運動と政治に大きな影響を与えた。",
    description:
      "米価高騰を背景に全国で騒動が起きました。",
    tags: ["社会"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "hara-cabinet",
    title: "原敬内閣が成立",
    year: 1918,
    era: "大正",
    shortText: "政党政治の発展を象徴する内閣。",
    description:
      "本格的な政党内閣が成立しました。",
    tags: ["政治"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "kanto-earthquake",
    title: "関東大震災",
    year: 1923,
    era: "大正",
    shortText: "東京や横浜に大きな被害をもたらした災害。",
    description:
      "関東地方を大地震が襲いました。",
    tags: ["災害"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "universal-suffrage",
    title: "普通選挙法が成立",
    year: 1925,
    era: "大正",
    shortText: "政治参加の範囲が広がった。",
    description:
      "25歳以上の男子に選挙権が広がりました。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#22c55e",
    },
  },
  {
    id: "showa-start",
    title: "昭和時代が始まる",
    year: 1926,
    era: "昭和",
    shortText: "激動の昭和時代が始まった。",
    description:
      "大正天皇が崩御し、昭和時代に入りました。",
    tags: ["政治"],
    card: {
      rarity: "common",
      color: "#0ea5e9",
    },
  },
  {
    id: "manchurian-incident",
    title: "満州事変",
    year: 1931,
    era: "昭和",
    shortText: "日本の対外政策が大きく変化した。",
    description:
      "柳条湖事件をきっかけに満州で軍事行動が広がりました。",
    tags: ["外交"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "may15",
    title: "五・一五事件",
    year: 1932,
    era: "昭和",
    shortText: "政党政治が大きく揺らいだ事件。",
    description:
      "犬養毅首相が海軍将校らに暗殺されました。",
    tags: ["政治"],
    card: {
      rarity: "common",
      color: "#60a5fa",
    },
  },
  {
    id: "feb26",
    title: "二・二六事件",
    year: 1936,
    era: "昭和",
    shortText: "軍部の影響力が強まる背景となった。",
    description:
      "陸軍青年将校らがクーデターを試みました。",
    tags: ["政治"],
    card: {
      rarity: "legend",
      color: "#fb7185",
    },
  },
  {
    id: "sino-japanese-war-1937",
    title: "日中戦争が始まる",
    year: 1937,
    era: "昭和",
    shortText: "長期化する戦争へ発展した。",
    description:
      "盧溝橋事件をきっかけに戦争が拡大しました。",
    tags: ["外交"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "pacific-war",
    title: "太平洋戦争が始まる",
    year: 1941,
    era: "昭和",
    shortText: "アジア太平洋地域に広がる大きな戦争となった。",
    description:
      "日本がアメリカ・イギリスなどと戦争に入りました。",
    tags: ["戦争"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "hiroshima",
    title: "広島に原爆投下",
    year: 1945,
    era: "昭和",
    shortText: "多くの市民が被害を受けた出来事。",
    description:
      "広島に原子爆弾が投下されました。",
    tags: ["戦争"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "end-war",
    title: "終戦",
    year: 1945,
    era: "昭和",
    shortText: "第二次世界大戦が終わり、戦後改革へ向かった。",
    description:
      "日本がポツダム宣言を受け入れました。",
    tags: ["戦争"],
    card: {
      rarity: "rare",
      color: "#22c55e",
    },
  },
  {
    id: "constitution-japan",
    title: "日本国憲法施行",
    year: 1947,
    era: "昭和",
    shortText: "国民主権・基本的人権・平和主義を掲げた。",
    description:
      "新しい憲法が施行されました。",
    tags: ["法律"],
    card: {
      rarity: "common",
      color: "#0ea5e9",
    },
  },
  {
    id: "san-francisco",
    title: "サンフランシスコ平和条約",
    year: 1951,
    era: "昭和",
    shortText: "日本の主権回復につながった条約。",
    description:
      "日本が連合国と講和条約を結びました。",
    tags: ["外交"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "sovereignty-restored",
    title: "日本の主権回復",
    year: 1952,
    era: "昭和",
    shortText: "占領が終わり、日本が主権を回復した。",
    description:
      "サンフランシスコ平和条約が発効しました。",
    tags: ["外交"],
    card: {
      rarity: "common",
      color: "#60a5fa",
    },
  },
  {
    id: "un-joining",
    title: "日本が国連加盟",
    year: 1956,
    era: "昭和",
    shortText: "国際社会への復帰を示す出来事。",
    description:
      "日本が国際連合に加盟しました。",
    tags: ["外交"],
    card: {
      rarity: "legend",
      color: "#fb7185",
    },
  },
  {
    id: "tokyo-olympics-1964",
    title: "東京オリンピック開催",
    year: 1964,
    era: "昭和",
    shortText: "戦後復興と高度経済成長を象徴した。",
    description:
      "アジア初のオリンピックが東京で開催されました。",
    tags: ["スポーツ"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "shinkansen",
    title: "東海道新幹線開業",
    year: 1964,
    era: "昭和",
    shortText: "高速交通の時代を開いた。",
    description:
      "東京・新大阪間で新幹線が開業しました。",
    tags: ["技術"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "osaka-expo",
    title: "大阪万博開催",
    year: 1970,
    era: "昭和",
    shortText: "高度経済成長期の日本を象徴するイベント。",
    description:
      "日本万国博覧会が大阪で開かれました。",
    tags: ["文化"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "okinawa-return",
    title: "沖縄返還",
    year: 1972,
    era: "昭和",
    shortText: "戦後日本の大きな節目となった。",
    description:
      "沖縄が日本に復帰しました。",
    tags: ["外交"],
    card: {
      rarity: "rare",
      color: "#22c55e",
    },
  },
];
