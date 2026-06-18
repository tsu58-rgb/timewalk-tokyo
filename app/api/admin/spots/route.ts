import { NextResponse } from "next/server";
import Papa from "papaparse";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub?gid=1242477641&single=true&output=csv";

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const north = Number(body.north);
  const south = Number(body.south);
  const east = Number(body.east);
  const west = Number(body.west);
  const hasCenter = [north, south, east, west].every(Number.isFinite);
  const centerLat = hasCenter ? (north + south) / 2 : 35.681236;
  const centerLng = hasCenter ? (east + west) / 2 : 139.767125;

  const response = await fetch(`${CSV_URL}&cacheBust=${Date.now()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: `スポットCSV取得失敗: ${response.status}` },
      { status: 502 }
    );
  }

  const csv = await response.text();
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
    }))
    .filter((spot) => Number.isFinite(Number(spot.lat)) && Number.isFinite(Number(spot.lng)))
    .sort((a, b) => {
      const distanceA = distanceKm(centerLat, centerLng, Number(a.lat), Number(a.lng));
      const distanceB = distanceKm(centerLat, centerLng, Number(b.lat), Number(b.lng));
      return distanceA - distanceB;
    });

  return NextResponse.json({
    ok: true,
    spots,
    total: spots.length,
  });
}
