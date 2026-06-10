import Papa from "papaparse";

import { CHARACTERS_URL, EVENTS_URL, SPOTS_URL } from "./sheetUrls";
import type { Character, EventItem, Spot } from "@/types/timewalk";

function parseCsvObjects(text: string) {
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data;
}

async function fetchCsvObjects(url: string, noStore = false) {
  const targetUrl = noStore ? `${url}&cacheBust=${Date.now()}` : url;
  const response = await fetch(targetUrl, noStore ? { cache: "no-store" } : undefined);

  if (!response.ok) {
    throw new Error(`CSVを取得できませんでした: ${response.status}`);
  }

  return parseCsvObjects(await response.text());
}

export async function fetchSpots(options: { noStore?: boolean } = {}) {
  const rows = await fetchCsvObjects(SPOTS_URL, options.noStore);

  return rows
    .map((row): Spot => ({
      id: row.id || "",
      name: row.name || "",
      spotsImage: row.spotsImage || "",
      lat: Number(row.lat),
      lng: Number(row.lng),
      category: row.category || "",
      characterIds: row.characterIds || "",
      status: String(row.status || "").trim(),
      mode: row.mode || "",
      description: row.description || "",
    }))
    .filter(
      (spot) =>
        spot.status.toLowerCase() === "ready" &&
        Number.isFinite(spot.lat) &&
        Number.isFinite(spot.lng) &&
        !String(spot.mode || "").includes("除外")
    );
}

export async function fetchCharacters(options: { noStore?: boolean } = {}) {
  const rows = await fetchCsvObjects(CHARACTERS_URL, options.noStore);

  return rows.map((row): Character => ({
    characterId: row.characterId || "",
    characterName: row.characterName || "",
  }));
}

export async function fetchEvents(options: { noStore?: boolean } = {}) {
  const rows = await fetchCsvObjects(EVENTS_URL, options.noStore);

  return rows.map((row): EventItem => ({
    id: row.id || "",
    date: row.date || "",
    description: row.description || "",
    memorial: row.memorial || "",
    source_url: row.source_url || "",
    quiz: row.quiz || "",
    quizAnswer: row.quizAnswer || "",
  }));
}
