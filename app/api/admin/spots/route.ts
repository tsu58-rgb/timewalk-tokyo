import { NextResponse } from "next/server";
import Papa from "papaparse";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub?output=csv";

let cache: any[] | null = null;
let cacheTime = 0;

async function getAllSpots() {
  const now = Date.now();

  if (cache && now - cacheTime < 5 * 60 * 1000) {
    return cache;
  }

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

  cache = spots;
  cacheTime = now;

  return spots;
}

export async function POST(req: Request) {
  const body = await req.json();

  if (body.pagePassword !== process.env.NEXT_PUBLIC_ADMIN_PAGE_PASSWORD) {
    return NextResponse.json({ ok: false, error: "password error" }, { status: 401 });
  }

  const allSpots = await getAllSpots();

  const north = Number(body.north);
  const south = Number(body.south);
  const east = Number(body.east);
  const west = Number(body.west);

  const hasBounds =
    Number.isFinite(north) &&
    Number.isFinite(south) &&
    Number.isFinite(east) &&
    Number.isFinite(west);

  const spots = hasBounds
    ? allSpots.filter((s) => {
        const lat = Number(s.lat);
        const lng = Number(s.lng);
        return lat <= north && lat >= south && lng <= east && lng >= west;
      })
    : allSpots;

  return NextResponse.json({
    ok: true,
    spots,
    total: allSpots.length,
  });
}
