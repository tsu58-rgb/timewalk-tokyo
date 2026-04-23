import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, person, friendship } = await req.json();

  let reply = "";

  if (person === "徳川家康") {
    if (friendship >= 5) {
      reply = "そなた、なかなか見どころがある。もっと話してみるか。";
    } else if (message.includes("人生")) {
      reply = "焦るでない。勝つ者は待てる者じゃ。";
    } else {
      reply = "天下取りも一歩ずつ。落ち着いて進め。";
    }
  } else if (person === "西郷隆盛") {
    if (friendship >= 5) {
      reply = "おはんはもう仲間たい。遠慮なく何でも聞くごわす。";
    } else if (message.includes("人生")) {
      reply = "志を持って進むごわす！";
    } else {
      reply = "己を信じて前へ進めば道は開ける。";
    }
  } else if (person === "蔦屋重三郎") {
    if (friendship >= 5) {
      reply = "あんたは見る目があるねぇ。とっておきの話をしてもいい。";
    } else if (message.includes("商売") || message.includes("儲")) {
      reply = "流行を読むのが商いってもんさ。";
    } else if (message.includes("江戸")) {
      reply = "江戸は世界でも珍しい、大活気の娯楽都市だったのさ。";
    } else {
      reply = "面白い問いだねぇ。もっと聞かせな。";
    }
  } else {
    if (friendship >= 5) {
      reply = "あっしとずいぶん親しくなりましたね。町の噂も教えましょうか。";
    } else {
      reply = "ようこそ、このあたりの話なら少しはできますよ。";
    }
  }

  return NextResponse.json({ reply });
}