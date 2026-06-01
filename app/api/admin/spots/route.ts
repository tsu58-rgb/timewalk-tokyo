import { NextResponse } from "next/server";
import Papa from "papaparse";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub?output=csv";

export async function POST(req: Request) {
  const body = await req.json();

  const csv = await fetch(CSV_URL, { cache: "no-store" }).then((r) => r.text());

  const parsed = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  });

  const spots = (parsed.data as any[])
    .filter((s) => s.id && s.lat && s.lng)
    .map((s) => ({
      id: String(s.id || "").trim(),
      name: String(s.name || "").trim(),
      kana: String(s.kana || "").trim(),
      lat: String(s.lat || "").trim(),
      lng: String(s.lng || "").trim(),
      country: String(s.country || "").trim(),
      prefecture: String(s.prefecture || "").trim(),
      city: String(s.city || "").trim(),
      area: String(s.area || "").trim(),
      category: String(s.category || "").trim(),
      mode: String(s.mode || "").trim(),
      spotsImage: String(s.spotsImage || "").trim().replace(/^"+|"+$/g, ""),
      description: String(s.description || "").trim(),
      trivia: String(s.trivia || "").trim(),
      characterIds: String(s.characterIds || "").trim(),
      status: String(s.status || "").trim(),
    }));

  return NextResponse.json({
    ok: true,
    spots,
    total: spots.length,
    debug: {
      receivedPassword: body.pagePassword ? "あり" : "なし",
      envPassword: process.env.ADMIN_PAGE_PASSWORD ? "あり" : "なし",
    },
  });
}
