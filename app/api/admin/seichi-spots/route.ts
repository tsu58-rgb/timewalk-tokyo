import { NextResponse } from "next/server";
import Papa from "papaparse";

import { SPOTS_URL } from "../../../lib/sheetUrls";

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
  const hasBounds = [north, south, east, west].every(Number.isFinite);
  const centerLat = hasBounds ? (north + south) / 2 : 35.681236;
  const centerLng = hasBounds ? (east + west) / 2 : 139.767125;

  const response = await fetch(`${SPOTS_URL}&cacheBust=${Date.now()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: `スポットCSV取得失敗: ${response.status}` },
      { status: 502 }
    );
  }

  const parsed = Papa.parse<Record<string, string>>(await response.text(), {
    header: true,
    skipEmptyLines: true,
  });

  const spots = parsed.data
    .filter((row) => String(row.id || "").trim().startsWith("se_"))
    .map((row) => ({
      id: String(row.id || "").trim(),
      name: String(row.name || "").trim(),
      kana: String(row.kana || "").trim(),
      lat: Number(row.lat),
      lng: Number(row.lng),
      country: String(row.country || "").trim(),
      prefecture: String(row.prefecture || "").trim(),
      city: String(row.city || "").trim(),
      area: String(row.area || "").trim(),
      spotsImage: String(row.spotsImage || "").trim().replace(/^"+|"+$/g, ""),
      description: String(row.description || "").trim(),
      status: String(row.status || "").trim(),
      workId: String(row.workId || "").trim(),
    }))
    .filter((spot) => Number.isFinite(spot.lat) && Number.isFinite(spot.lng))
    .sort(
      (a, b) =>
        distanceKm(centerLat, centerLng, a.lat, a.lng) -
        distanceKm(centerLat, centerLng, b.lat, b.lng)
    );

  return NextResponse.json({ ok: true, spots, total: spots.length });
}
