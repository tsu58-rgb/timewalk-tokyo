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
  {
    id: "floating-exchange-rate",
    title: "変動相場制へ移行",
    year: 1973,
    era: "昭和",
    shortText: "円相場が固定制から変動制へ移った。",
    description:
      "変動相場制へ移行は1973年の出来事です。円相場が固定制から変動制へ移った。",
    tags: ["経済"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "first-oil-shock",
    title: "第一次オイルショック",
    year: 1973,
    era: "昭和",
    shortText: "石油価格の高騰が日本経済と生活に大きく影響した。",
    description:
      "第一次オイルショックは1973年の出来事です。石油価格の高騰が日本経済と生活に大きく影響した。",
    tags: ["経済"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "sato-nobel-peace-prize",
    title: "佐藤栄作がノーベル平和賞受賞",
    year: 1974,
    era: "昭和",
    shortText: "非核三原則などが評価され平和賞を受賞した。",
    description:
      "佐藤栄作がノーベル平和賞受賞は1974年の出来事です。非核三原則などが評価され平和賞を受賞した。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "seven-eleven-first-store",
    title: "セブン-イレブン日本1号店開店",
    year: 1974,
    era: "昭和",
    shortText: "日本のコンビニ文化が広がるきっかけになった。",
    description:
      "セブン-イレブン日本1号店開店は1974年の出来事です。日本のコンビニ文化が広がるきっかけになった。",
    tags: ["生活"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "okinawa-ocean-expo",
    title: "沖縄国際海洋博覧会開催",
    year: 1975,
    era: "昭和",
    shortText: "沖縄復帰後の大型イベントとして開催された。",
    description:
      "沖縄国際海洋博覧会開催は1975年の出来事です。沖縄復帰後の大型イベントとして開催された。",
    tags: ["文化"],
    card: {
      rarity: "common",
      color: "#f472b6",
    },
  },
  {
    id: "lockheed-scandal",
    title: "ロッキード事件",
    year: 1976,
    era: "昭和",
    shortText: "政治と金をめぐる大きな事件として社会を揺らした。",
    description:
      "ロッキード事件は1976年の出来事です。政治と金をめぐる大きな事件として社会を揺らした。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "oh-756-homerun",
    title: "王貞治が756号本塁打",
    year: 1977,
    era: "昭和",
    shortText: "プロ野球で世界記録となる本塁打数を達成した。",
    description:
      "王貞治が756号本塁打は1977年の出来事です。プロ野球で世界記録となる本塁打数を達成した。",
    tags: ["スポーツ"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "narita-airport-open",
    title: "成田空港開港",
    year: 1978,
    era: "昭和",
    shortText: "国際線の主要空港として成田空港が開港した。",
    description:
      "成田空港開港は1978年の出来事です。国際線の主要空港として成田空港が開港した。",
    tags: ["交通"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "japan-china-peace-treaty",
    title: "日中平和友好条約締結",
    year: 1978,
    era: "昭和",
    shortText: "日本と中国の友好関係を確認する条約が結ばれた。",
    description:
      "日中平和友好条約締結は1978年の出来事です。日本と中国の友好関係を確認する条約が結ばれた。",
    tags: ["外交"],
    card: {
      rarity: "rare",
      color: "#38bdf8",
    },
  },
  {
    id: "pc-8001-release",
    title: "NEC PC-8001発売",
    year: 1979,
    era: "昭和",
    shortText: "日本のパソコン普及のきっかけとなった。",
    description:
      "NEC PC-8001発売は1979年の出来事です。日本のパソコン普及のきっかけとなった。",
    tags: ["技術"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "moscow-olympics-boycott",
    title: "日本がモスクワ五輪不参加",
    year: 1980,
    era: "昭和",
    shortText: "国際情勢を受けて日本選手団の派遣を見送った。",
    description:
      "日本がモスクワ五輪不参加は1980年の出来事です。国際情勢を受けて日本選手団の派遣を見送った。",
    tags: ["スポーツ"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "portopia-expo",
    title: "神戸ポートアイランド博覧会開催",
    year: 1981,
    era: "昭和",
    shortText: "神戸の新しい都市開発を示す博覧会が開かれた。",
    description:
      "神戸ポートアイランド博覧会開催は1981年の出来事です。神戸の新しい都市開発を示す博覧会が開かれた。",
    tags: ["文化"],
    card: {
      rarity: "common",
      color: "#f472b6",
    },
  },
  {
    id: "tohoku-shinkansen",
    title: "東北新幹線開業",
    year: 1982,
    era: "昭和",
    shortText: "東北地方と首都圏を結ぶ新幹線が走り始めた。",
    description:
      "東北新幹線開業は1982年の出来事です。東北地方と首都圏を結ぶ新幹線が走り始めた。",
    tags: ["交通"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "joetsu-shinkansen",
    title: "上越新幹線開業",
    year: 1982,
    era: "昭和",
    shortText: "新潟方面へ向かう新幹線が開業した。",
    description:
      "上越新幹線開業は1982年の出来事です。新潟方面へ向かう新幹線が開業した。",
    tags: ["交通"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "tokyo-disneyland-open",
    title: "東京ディズニーランド開園",
    year: 1983,
    era: "昭和",
    shortText: "大型テーマパークとして多くの人に親しまれた。",
    description:
      "東京ディズニーランド開園は1983年の出来事です。大型テーマパークとして多くの人に親しまれた。",
    tags: ["文化"],
    card: {
      rarity: "common",
      color: "#f472b6",
    },
  },
  {
    id: "new-banknotes-1984",
    title: "新一万円札発行",
    year: 1984,
    era: "昭和",
    shortText: "福沢諭吉の一万円札など新紙幣が発行された。",
    description:
      "新一万円札発行は1984年の出来事です。福沢諭吉の一万円札など新紙幣が発行された。",
    tags: ["経済"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "glico-morinaga-case",
    title: "グリコ・森永事件発生",
    year: 1984,
    era: "昭和",
    shortText: "食品会社を狙った脅迫事件が社会不安を広げた。",
    description:
      "グリコ・森永事件発生は1984年の出来事です。食品会社を狙った脅迫事件が社会不安を広げた。",
    tags: ["社会"],
    card: {
      rarity: "common",
      color: "#64748b",
    },
  },
  {
    id: "plaza-accord",
    title: "プラザ合意",
    year: 1985,
    era: "昭和",
    shortText: "円高が進み、日本経済に大きな影響を与えた。",
    description:
      "プラザ合意は1985年の出来事です。円高が進み、日本経済に大きな影響を与えた。",
    tags: ["経済"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "jal-123-crash",
    title: "日本航空123便墜落事故",
    year: 1985,
    era: "昭和",
    shortText: "単独機として世界最大規模の航空事故となった。",
    description:
      "日本航空123便墜落事故は1985年の出来事です。単独機として世界最大規模の航空事故となった。",
    tags: ["災害"],
    card: {
      rarity: "rare",
      color: "#fb7185",
    },
  },
  {
    id: "equal-employment-law",
    title: "男女雇用機会均等法施行",
    year: 1986,
    era: "昭和",
    shortText: "雇用での男女の機会均等をめざす法律が施行された。",
    description:
      "男女雇用機会均等法施行は1986年の出来事です。雇用での男女の機会均等をめざす法律が施行された。",
    tags: ["社会"],
    card: {
      rarity: "common",
      color: "#64748b",
    },
  },
  {
    id: "jnr-privatization",
    title: "国鉄分割民営化",
    year: 1987,
    era: "昭和",
    shortText: "国鉄がJR各社に分かれて民営化された。",
    description:
      "国鉄分割民営化は1987年の出来事です。国鉄がJR各社に分かれて民営化された。",
    tags: ["交通"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "seikan-tunnel-open",
    title: "青函トンネル開業",
    year: 1988,
    era: "昭和",
    shortText: "本州と北海道を鉄道で結ぶ海底トンネルが開業した。",
    description:
      "青函トンネル開業は1988年の出来事です。本州と北海道を鉄道で結ぶ海底トンネルが開業した。",
    tags: ["交通"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "seto-ohashi-open",
    title: "瀬戸大橋開通",
    year: 1988,
    era: "昭和",
    shortText: "本州と四国を道路と鉄道で結ぶ橋が開通した。",
    description:
      "瀬戸大橋開通は1988年の出来事です。本州と四国を道路と鉄道で結ぶ橋が開通した。",
    tags: ["交通"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "heisei-start",
    title: "平成開始",
    year: 1989,
    era: "平成",
    shortText: "昭和が終わり、新しい元号の平成が始まった。",
    description:
      "平成開始は1989年の出来事です。昭和が終わり、新しい元号の平成が始まった。",
    tags: ["元号"],
    card: {
      rarity: "legend",
      color: "#facc15",
    },
  },
  {
    id: "consumption-tax-start",
    title: "消費税導入",
    year: 1989,
    era: "平成",
    shortText: "日本で消費税制度が始まった。",
    description:
      "消費税導入は1989年の出来事です。日本で消費税制度が始まった。",
    tags: ["経済"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "flower-green-expo",
    title: "国際花と緑の博覧会開催",
    year: 1990,
    era: "平成",
    shortText: "大阪で花と緑をテーマにした国際博覧会が開かれた。",
    description:
      "国際花と緑の博覧会開催は1990年の出来事です。大阪で花と緑をテーマにした国際博覧会が開かれた。",
    tags: ["文化"],
    card: {
      rarity: "common",
      color: "#f472b6",
    },
  },
  {
    id: "bubble-collapse",
    title: "バブル経済崩壊が進む",
    year: 1991,
    era: "平成",
    shortText: "地価や株価が下落し、長い不況につながった。",
    description:
      "バブル経済崩壊が進むは1991年の出来事です。地価や株価が下落し、長い不況につながった。",
    tags: ["経済"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "unzen-pyroclastic-flow",
    title: "雲仙普賢岳火砕流",
    year: 1991,
    era: "平成",
    shortText: "火山災害により大きな被害が出た。",
    description:
      "雲仙普賢岳火砕流は1991年の出来事です。火山災害により大きな被害が出た。",
    tags: ["災害"],
    card: {
      rarity: "rare",
      color: "#fb7185",
    },
  },
  {
    id: "pko-law",
    title: "PKO協力法成立",
    year: 1992,
    era: "平成",
    shortText: "国際平和協力活動への参加を定める法律が成立した。",
    description:
      "PKO協力法成立は1992年の出来事です。国際平和協力活動への参加を定める法律が成立した。",
    tags: ["外交"],
    card: {
      rarity: "rare",
      color: "#38bdf8",
    },
  },
  {
    id: "mohri-space-shuttle",
    title: "毛利衛が宇宙へ",
    year: 1992,
    era: "平成",
    shortText: "日本人科学者がスペースシャトルで宇宙へ行った。",
    description:
      "毛利衛が宇宙へは1992年の出来事です。日本人科学者がスペースシャトルで宇宙へ行った。",
    tags: ["科学"],
    card: {
      rarity: "rare",
      color: "#a78bfa",
    },
  },
  {
    id: "j-league-start",
    title: "Jリーグ開幕",
    year: 1993,
    era: "平成",
    shortText: "日本のプロサッカーリーグが始まった。",
    description:
      "Jリーグ開幕は1993年の出来事です。日本のプロサッカーリーグが始まった。",
    tags: ["スポーツ"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "hosokawa-cabinet",
    title: "細川内閣成立",
    year: 1993,
    era: "平成",
    shortText: "非自民連立政権が成立した。",
    description:
      "細川内閣成立は1993年の出来事です。非自民連立政権が成立した。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "kansai-airport-open",
    title: "関西国際空港開港",
    year: 1994,
    era: "平成",
    shortText: "海上空港として関西国際空港が開港した。",
    description:
      "関西国際空港開港は1994年の出来事です。海上空港として関西国際空港が開港した。",
    tags: ["交通"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "matsumoto-sarin",
    title: "松本サリン事件",
    year: 1994,
    era: "平成",
    shortText: "長野県松本市でサリンによる事件が起きた。",
    description:
      "松本サリン事件は1994年の出来事です。長野県松本市でサリンによる事件が起きた。",
    tags: ["社会"],
    card: {
      rarity: "common",
      color: "#64748b",
    },
  },
  {
    id: "hanshin-awaji-earthquake",
    title: "阪神・淡路大震災",
    year: 1995,
    era: "平成",
    shortText: "都市部を襲った大地震で大きな被害が出た。",
    description:
      "阪神・淡路大震災は1995年の出来事です。都市部を襲った大地震で大きな被害が出た。",
    tags: ["災害"],
    card: {
      rarity: "rare",
      color: "#fb7185",
    },
  },
  {
    id: "subway-sarin",
    title: "地下鉄サリン事件",
    year: 1995,
    era: "平成",
    shortText: "東京の地下鉄でサリンが使われた事件。",
    description:
      "地下鉄サリン事件は1995年の出来事です。東京の地下鉄でサリンが使われた事件。",
    tags: ["社会"],
    card: {
      rarity: "common",
      color: "#64748b",
    },
  },
  {
    id: "windows-95-japan",
    title: "Windows 95日本語版発売",
    year: 1995,
    era: "平成",
    shortText: "家庭や職場のパソコン利用が広がるきっかけとなった。",
    description:
      "Windows 95日本語版発売は1995年の出来事です。家庭や職場のパソコン利用が広がるきっかけとなった。",
    tags: ["技術"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "yahoo-japan-start",
    title: "Yahoo! JAPANサービス開始",
    year: 1996,
    era: "平成",
    shortText: "日本のインターネット利用を広げる入口となった。",
    description:
      "Yahoo! JAPANサービス開始は1996年の出来事です。日本のインターネット利用を広げる入口となった。",
    tags: ["技術"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "consumption-tax-5",
    title: "消費税率5%へ引き上げ",
    year: 1997,
    era: "平成",
    shortText: "消費税率が3%から5%へ上がった。",
    description:
      "消費税率5%へ引き上げは1997年の出来事です。消費税率が3%から5%へ上がった。",
    tags: ["経済"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "kyoto-protocol",
    title: "京都議定書採択",
    year: 1997,
    era: "平成",
    shortText: "温室効果ガス削減をめざす国際合意が採択された。",
    description:
      "京都議定書採択は1997年の出来事です。温室効果ガス削減をめざす国際合意が採択された。",
    tags: ["環境"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "nagano-olympics",
    title: "長野冬季オリンピック開催",
    year: 1998,
    era: "平成",
    shortText: "長野で冬季オリンピックが開かれた。",
    description:
      "長野冬季オリンピック開催は1998年の出来事です。長野で冬季オリンピックが開かれた。",
    tags: ["スポーツ"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "akashi-kaikyo-bridge",
    title: "明石海峡大橋開通",
    year: 1998,
    era: "平成",
    shortText: "本州と淡路島を結ぶ大橋が開通した。",
    description:
      "明石海峡大橋開通は1998年の出来事です。本州と淡路島を結ぶ大橋が開通した。",
    tags: ["交通"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "i-mode-start",
    title: "iモード開始",
    year: 1999,
    era: "平成",
    shortText: "携帯電話でインターネットを使う文化が広がった。",
    description:
      "iモード開始は1999年の出来事です。携帯電話でインターネットを使う文化が広がった。",
    tags: ["技術"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "jco-criticality",
    title: "東海村JCO臨界事故",
    year: 1999,
    era: "平成",
    shortText: "原子力施設で重大な臨界事故が起きた。",
    description:
      "東海村JCO臨界事故は1999年の出来事です。原子力施設で重大な臨界事故が起きた。",
    tags: ["災害"],
    card: {
      rarity: "rare",
      color: "#fb7185",
    },
  },
  {
    id: "long-term-care-insurance",
    title: "介護保険制度開始",
    year: 2000,
    era: "平成",
    shortText: "高齢者介護を社会で支える制度が始まった。",
    description:
      "介護保険制度開始は2000年の出来事です。高齢者介護を社会で支える制度が始まった。",
    tags: ["制度"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "kyushu-okinawa-summit",
    title: "九州・沖縄サミット開催",
    year: 2000,
    era: "平成",
    shortText: "沖縄などで主要国首脳会議が開かれた。",
    description:
      "九州・沖縄サミット開催は2000年の出来事です。沖縄などで主要国首脳会議が開かれた。",
    tags: ["外交"],
    card: {
      rarity: "rare",
      color: "#38bdf8",
    },
  },
  {
    id: "central-government-reform",
    title: "中央省庁再編",
    year: 2001,
    era: "平成",
    shortText: "国の行政組織が大きく再編された。",
    description:
      "中央省庁再編は2001年の出来事です。国の行政組織が大きく再編された。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "koizumi-cabinet",
    title: "小泉内閣成立",
    year: 2001,
    era: "平成",
    shortText: "構造改革を掲げた内閣が発足した。",
    description:
      "小泉内閣成立は2001年の出来事です。構造改革を掲げた内閣が発足した。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "japan-korea-world-cup",
    title: "日韓ワールドカップ開催",
    year: 2002,
    era: "平成",
    shortText: "日本と韓国がサッカーW杯を共同開催した。",
    description:
      "日韓ワールドカップ開催は2002年の出来事です。日本と韓国がサッカーW杯を共同開催した。",
    tags: ["スポーツ"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "abductees-return",
    title: "拉致被害者5人帰国",
    year: 2002,
    era: "平成",
    shortText: "北朝鮮による拉致被害者の一部が帰国した。",
    description:
      "拉致被害者5人帰国は2002年の出来事です。北朝鮮による拉致被害者の一部が帰国した。",
    tags: ["外交"],
    card: {
      rarity: "rare",
      color: "#38bdf8",
    },
  },
  {
    id: "terrestrial-digital-start",
    title: "地上デジタル放送開始",
    year: 2003,
    era: "平成",
    shortText: "テレビ放送のデジタル化が始まった。",
    description:
      "地上デジタル放送開始は2003年の出来事です。テレビ放送のデジタル化が始まった。",
    tags: ["技術"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "sdf-iraq-dispatch",
    title: "自衛隊イラク派遣",
    year: 2004,
    era: "平成",
    shortText: "自衛隊が復興支援のためイラクへ派遣された。",
    description:
      "自衛隊イラク派遣は2004年の出来事です。自衛隊が復興支援のためイラクへ派遣された。",
    tags: ["外交"],
    card: {
      rarity: "rare",
      color: "#38bdf8",
    },
  },
  {
    id: "niigata-chuetsu-earthquake",
    title: "新潟県中越地震",
    year: 2004,
    era: "平成",
    shortText: "新潟県中越地方で大きな地震が起きた。",
    description:
      "新潟県中越地震は2004年の出来事です。新潟県中越地方で大きな地震が起きた。",
    tags: ["災害"],
    card: {
      rarity: "rare",
      color: "#fb7185",
    },
  },
  {
    id: "new-banknotes-2004",
    title: "新紙幣発行",
    year: 2004,
    era: "平成",
    shortText: "野口英世などの新しい紙幣が発行された。",
    description:
      "新紙幣発行は2004年の出来事です。野口英世などの新しい紙幣が発行された。",
    tags: ["経済"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "expo-aichi",
    title: "愛・地球博開催",
    year: 2005,
    era: "平成",
    shortText: "愛知県で自然との共生をテーマにした万博が開かれた。",
    description:
      "愛・地球博開催は2005年の出来事です。愛知県で自然との共生をテーマにした万博が開かれた。",
    tags: ["文化"],
    card: {
      rarity: "common",
      color: "#f472b6",
    },
  },
  {
    id: "postal-privatization-law",
    title: "郵政民営化法成立",
    year: 2005,
    era: "平成",
    shortText: "郵政事業の民営化に向けた法律が成立した。",
    description:
      "郵政民営化法成立は2005年の出来事です。郵政事業の民営化に向けた法律が成立した。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "basic-education-law-revision",
    title: "教育基本法改正",
    year: 2006,
    era: "平成",
    shortText: "戦後教育の基本法が大きく改正された。",
    description:
      "教育基本法改正は2006年の出来事です。戦後教育の基本法が大きく改正された。",
    tags: ["教育"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "postal-privatization",
    title: "郵政民営化",
    year: 2007,
    era: "平成",
    shortText: "日本郵政グループが発足した。",
    description:
      "郵政民営化は2007年の出来事です。日本郵政グループが発足した。",
    tags: ["制度"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "tokyo-marathon-first",
    title: "第1回東京マラソン開催",
    year: 2007,
    era: "平成",
    shortText: "市民参加型の大規模マラソン大会が始まった。",
    description:
      "第1回東京マラソン開催は2007年の出来事です。市民参加型の大規模マラソン大会が始まった。",
    tags: ["スポーツ"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "iphone-japan",
    title: "iPhone日本発売",
    year: 2008,
    era: "平成",
    shortText: "スマートフォン普及の大きなきっかけになった。",
    description:
      "iPhone日本発売は2008年の出来事です。スマートフォン普及の大きなきっかけになった。",
    tags: ["技術"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "lehman-shock-japan",
    title: "リーマンショックの影響",
    year: 2008,
    era: "平成",
    shortText: "世界的金融危機が日本経済にも影響した。",
    description:
      "リーマンショックの影響は2008年の出来事です。世界的金融危機が日本経済にも影響した。",
    tags: ["経済"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "dpj-government",
    title: "民主党政権成立",
    year: 2009,
    era: "平成",
    shortText: "衆議院選挙の結果、政権交代が起きた。",
    description:
      "民主党政権成立は2009年の出来事です。衆議院選挙の結果、政権交代が起きた。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "hayabusa-return",
    title: "はやぶさ帰還",
    year: 2010,
    era: "平成",
    shortText: "小惑星探査機が地球へ帰還した。",
    description:
      "はやぶさ帰還は2010年の出来事です。小惑星探査機が地球へ帰還した。",
    tags: ["科学"],
    card: {
      rarity: "rare",
      color: "#a78bfa",
    },
  },
  {
    id: "senkaku-collision",
    title: "尖閣諸島沖衝突事件",
    year: 2010,
    era: "平成",
    shortText: "尖閣諸島沖で巡視船と漁船が衝突した。",
    description:
      "尖閣諸島沖衝突事件は2010年の出来事です。尖閣諸島沖で巡視船と漁船が衝突した。",
    tags: ["外交"],
    card: {
      rarity: "rare",
      color: "#38bdf8",
    },
  },
  {
    id: "great-east-japan-earthquake",
    title: "東日本大震災",
    year: 2011,
    era: "平成",
    shortText: "東北地方太平洋沖地震と津波が大きな被害をもたらした。",
    description:
      "東日本大震災は2011年の出来事です。東北地方太平洋沖地震と津波が大きな被害をもたらした。",
    tags: ["災害"],
    card: {
      rarity: "legend",
      color: "#fb7185",
    },
  },
  {
    id: "fukushima-nuclear-accident",
    title: "福島第一原発事故",
    year: 2011,
    era: "平成",
    shortText: "原子力発電所で重大事故が発生した。",
    description:
      "福島第一原発事故は2011年の出来事です。原子力発電所で重大事故が発生した。",
    tags: ["災害"],
    card: {
      rarity: "legend",
      color: "#fb7185",
    },
  },
  {
    id: "nadeshiko-world-cup",
    title: "なでしこジャパンW杯優勝",
    year: 2011,
    era: "平成",
    shortText: "女子サッカー日本代表が世界一になった。",
    description:
      "なでしこジャパンW杯優勝は2011年の出来事です。女子サッカー日本代表が世界一になった。",
    tags: ["スポーツ"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "tokyo-skytree-open",
    title: "東京スカイツリー開業",
    year: 2012,
    era: "平成",
    shortText: "東京の新しい電波塔・観光名所が開業した。",
    description:
      "東京スカイツリー開業は2012年の出来事です。東京の新しい電波塔・観光名所が開業した。",
    tags: ["文化"],
    card: {
      rarity: "common",
      color: "#f472b6",
    },
  },
  {
    id: "yamanaka-nobel",
    title: "山中伸弥がノーベル賞受賞",
    year: 2012,
    era: "平成",
    shortText: "iPS細胞研究でノーベル生理学・医学賞を受賞した。",
    description:
      "山中伸弥がノーベル賞受賞は2012年の出来事です。iPS細胞研究でノーベル生理学・医学賞を受賞した。",
    tags: ["科学"],
    card: {
      rarity: "rare",
      color: "#a78bfa",
    },
  },
  {
    id: "fuji-world-heritage",
    title: "富士山が世界文化遺産登録",
    year: 2013,
    era: "平成",
    shortText: "信仰と芸術の対象として富士山が評価された。",
    description:
      "富士山が世界文化遺産登録は2013年の出来事です。信仰と芸術の対象として富士山が評価された。",
    tags: ["文化"],
    card: {
      rarity: "common",
      color: "#f472b6",
    },
  },
  {
    id: "washoku-unesco",
    title: "和食がユネスコ無形文化遺産登録",
    year: 2013,
    era: "平成",
    shortText: "日本の食文化が国際的に評価された。",
    description:
      "和食がユネスコ無形文化遺産登録は2013年の出来事です。日本の食文化が国際的に評価された。",
    tags: ["文化"],
    card: {
      rarity: "common",
      color: "#f472b6",
    },
  },
  {
    id: "consumption-tax-8",
    title: "消費税率8%へ引き上げ",
    year: 2014,
    era: "平成",
    shortText: "消費税率が5%から8%へ上がった。",
    description:
      "消費税率8%へ引き上げは2014年の出来事です。消費税率が5%から8%へ上がった。",
    tags: ["経済"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "tomioka-world-heritage",
    title: "富岡製糸場が世界遺産登録",
    year: 2014,
    era: "平成",
    shortText: "近代日本の産業化を伝える遺産が登録された。",
    description:
      "富岡製糸場が世界遺産登録は2014年の出来事です。近代日本の産業化を伝える遺産が登録された。",
    tags: ["産業"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "hokuriku-shinkansen-kanazawa",
    title: "北陸新幹線金沢開業",
    year: 2015,
    era: "平成",
    shortText: "北陸への移動が大きく便利になった。",
    description:
      "北陸新幹線金沢開業は2015年の出来事です。北陸への移動が大きく便利になった。",
    tags: ["交通"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "my-number-start",
    title: "マイナンバー制度開始",
    year: 2015,
    era: "平成",
    shortText: "社会保障・税・災害対策で使う番号制度が始まった。",
    description:
      "マイナンバー制度開始は2015年の出来事です。社会保障・税・災害対策で使う番号制度が始まった。",
    tags: ["制度"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "kumamoto-earthquake",
    title: "熊本地震",
    year: 2016,
    era: "平成",
    shortText: "熊本県を中心に強い地震が発生した。",
    description:
      "熊本地震は2016年の出来事です。熊本県を中心に強い地震が発生した。",
    tags: ["災害"],
    card: {
      rarity: "rare",
      color: "#fb7185",
    },
  },
  {
    id: "voting-age-18",
    title: "選挙権年齢18歳へ",
    year: 2016,
    era: "平成",
    shortText: "18歳以上が国政選挙で投票できるようになった。",
    description:
      "選挙権年齢18歳へは2016年の出来事です。18歳以上が国政選挙で投票できるようになった。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "ise-shima-summit",
    title: "伊勢志摩サミット開催",
    year: 2016,
    era: "平成",
    shortText: "三重県で主要国首脳会議が開かれた。",
    description:
      "伊勢志摩サミット開催は2016年の出来事です。三重県で主要国首脳会議が開かれた。",
    tags: ["外交"],
    card: {
      rarity: "rare",
      color: "#38bdf8",
    },
  },
  {
    id: "okinoshima-world-heritage",
    title: "宗像・沖ノ島が世界遺産登録",
    year: 2017,
    era: "平成",
    shortText: "古代の信仰を伝える遺産が世界遺産に登録された。",
    description:
      "宗像・沖ノ島が世界遺産登録は2017年の出来事です。古代の信仰を伝える遺産が世界遺産に登録された。",
    tags: ["文化"],
    card: {
      rarity: "common",
      color: "#f472b6",
    },
  },
  {
    id: "abdication-special-law",
    title: "天皇退位特例法成立",
    year: 2017,
    era: "平成",
    shortText: "天皇退位を可能にする特例法が成立した。",
    description:
      "天皇退位特例法成立は2017年の出来事です。天皇退位を可能にする特例法が成立した。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "osaka-north-earthquake",
    title: "大阪北部地震",
    year: 2018,
    era: "平成",
    shortText: "大阪府北部で強い地震が発生した。",
    description:
      "大阪北部地震は2018年の出来事です。大阪府北部で強い地震が発生した。",
    tags: ["災害"],
    card: {
      rarity: "rare",
      color: "#fb7185",
    },
  },
  {
    id: "meiji-150",
    title: "明治150年",
    year: 2018,
    era: "平成",
    shortText: "明治元年から150年の節目を迎えた。",
    description:
      "明治150年は2018年の出来事です。明治元年から150年の節目を迎えた。",
    tags: ["文化"],
    card: {
      rarity: "common",
      color: "#f472b6",
    },
  },
  {
    id: "toyosu-market-open",
    title: "築地市場が豊洲へ移転",
    year: 2018,
    era: "平成",
    shortText: "東京の中央卸売市場が豊洲に移った。",
    description:
      "築地市場が豊洲へ移転は2018年の出来事です。東京の中央卸売市場が豊洲に移った。",
    tags: ["生活"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "reiwa-start",
    title: "令和開始",
    year: 2019,
    era: "令和",
    shortText: "平成が終わり、新しい元号の令和が始まった。",
    description:
      "令和開始は2019年の出来事です。平成が終わり、新しい元号の令和が始まった。",
    tags: ["元号"],
    card: {
      rarity: "legend",
      color: "#facc15",
    },
  },
  {
    id: "rugby-world-cup-japan",
    title: "ラグビーワールドカップ日本大会",
    year: 2019,
    era: "令和",
    shortText: "日本でラグビーW杯が開催された。",
    description:
      "ラグビーワールドカップ日本大会は2019年の出来事です。日本でラグビーW杯が開催された。",
    tags: ["スポーツ"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "consumption-tax-10",
    title: "消費税率10%へ引き上げ",
    year: 2019,
    era: "令和",
    shortText: "消費税率が10%になった。",
    description:
      "消費税率10%へ引き上げは2019年の出来事です。消費税率が10%になった。",
    tags: ["経済"],
    card: {
      rarity: "common",
      color: "#f97316",
    },
  },
  {
    id: "shuri-castle-fire",
    title: "首里城火災",
    year: 2019,
    era: "令和",
    shortText: "沖縄の象徴的な建物が火災で焼失した。",
    description:
      "首里城火災は2019年の出来事です。沖縄の象徴的な建物が火災で焼失した。",
    tags: ["災害"],
    card: {
      rarity: "rare",
      color: "#fb7185",
    },
  },
  {
    id: "covid-school-closure",
    title: "新型コロナ全国一斉休校",
    year: 2020,
    era: "令和",
    shortText: "感染拡大を受けて学校生活が大きく変わった。",
    description:
      "新型コロナ全国一斉休校は2020年の出来事です。感染拡大を受けて学校生活が大きく変わった。",
    tags: ["教育"],
    card: {
      rarity: "common",
      color: "#a78bfa",
    },
  },
  {
    id: "tokyo-olympics-postponed",
    title: "東京五輪延期",
    year: 2020,
    era: "令和",
    shortText: "感染症の影響で東京大会が延期された。",
    description:
      "東京五輪延期は2020年の出来事です。感染症の影響で東京大会が延期された。",
    tags: ["スポーツ"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "plastic-bag-fee",
    title: "レジ袋有料化",
    year: 2020,
    era: "令和",
    shortText: "プラスチックごみ削減をめざし有料化が始まった。",
    description:
      "レジ袋有料化は2020年の出来事です。プラスチックごみ削減をめざし有料化が始まった。",
    tags: ["環境"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "tokyo-olympics-2021",
    title: "東京2020オリンピック開催",
    year: 2021,
    era: "令和",
    shortText: "延期された東京大会が開催された。",
    description:
      "東京2020オリンピック開催は2021年の出来事です。延期された東京大会が開催された。",
    tags: ["スポーツ"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "tokyo-paralympics-2021",
    title: "東京パラリンピック開催",
    year: 2021,
    era: "令和",
    shortText: "東京でパラリンピックが開催された。",
    description:
      "東京パラリンピック開催は2021年の出来事です。東京でパラリンピックが開催された。",
    tags: ["スポーツ"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "digital-agency",
    title: "デジタル庁発足",
    year: 2021,
    era: "令和",
    shortText: "行政のデジタル化を進める新しい組織ができた。",
    description:
      "デジタル庁発足は2021年の出来事です。行政のデジタル化を進める新しい組織ができた。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
  {
    id: "adult-age-18",
    title: "成人年齢18歳へ",
    year: 2022,
    era: "令和",
    shortText: "民法上の成人年齢が20歳から18歳になった。",
    description:
      "成人年齢18歳へは2022年の出来事です。民法上の成人年齢が20歳から18歳になった。",
    tags: ["法律"],
    card: {
      rarity: "common",
      color: "#facc15",
    },
  },
  {
    id: "okinawa-reversion-50",
    title: "沖縄復帰50年",
    year: 2022,
    era: "令和",
    shortText: "沖縄の日本復帰から50年の節目を迎えた。",
    description:
      "沖縄復帰50年は2022年の出来事です。沖縄の日本復帰から50年の節目を迎えた。",
    tags: ["地域"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "nishi-kyushu-shinkansen",
    title: "西九州新幹線開業",
    year: 2022,
    era: "令和",
    shortText: "長崎方面へ向かう新幹線が開業した。",
    description:
      "西九州新幹線開業は2022年の出来事です。長崎方面へ向かう新幹線が開業した。",
    tags: ["交通"],
    card: {
      rarity: "common",
      color: "#38bdf8",
    },
  },
  {
    id: "g7-hiroshima-summit",
    title: "G7広島サミット開催",
    year: 2023,
    era: "令和",
    shortText: "広島で主要国首脳会議が開かれた。",
    description:
      "G7広島サミット開催は2023年の出来事です。広島で主要国首脳会議が開かれた。",
    tags: ["外交"],
    card: {
      rarity: "rare",
      color: "#38bdf8",
    },
  },
  {
    id: "covid-category-5",
    title: "新型コロナ5類移行",
    year: 2023,
    era: "令和",
    shortText: "感染症法上の位置づけが5類へ移行した。",
    description:
      "新型コロナ5類移行は2023年の出来事です。感染症法上の位置づけが5類へ移行した。",
    tags: ["医療"],
    card: {
      rarity: "common",
      color: "#64748b",
    },
  },
  {
    id: "wbc-japan-2023",
    title: "WBC日本優勝",
    year: 2023,
    era: "令和",
    shortText: "野球日本代表が世界一になった。",
    description:
      "WBC日本優勝は2023年の出来事です。野球日本代表が世界一になった。",
    tags: ["スポーツ"],
    card: {
      rarity: "common",
      color: "#22c55e",
    },
  },
  {
    id: "kodomo-agency-start",
    title: "こども家庭庁発足",
    year: 2023,
    era: "令和",
    shortText: "こども政策を担当する新しい行政機関が発足した。",
    description:
      "こども家庭庁発足は2023年の出来事です。こども政策を担当する新しい行政機関が発足した。",
    tags: ["政治"],
    card: {
      rarity: "rare",
      color: "#facc15",
    },
  },
];
