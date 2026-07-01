import Papa from "papaparse";

import { CHARACTERS_URL, EVENTS_URL, SPOTS_URL, WORKS_URL } from "./sheetUrls";
import type { Character, EventItem, Spot, Work } from "@/types/timewalk";

type FetchOptions = {
  noStore?: boolean;
  revalidateSeconds?: number;
  includeWorkSpots?: boolean;
};

function parseCsvObjects(text: string) {
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data;
}

export async function fetchCsvObjects(
  url: string,
  noStore = false,
  revalidateSeconds?: number
) {
  const targetUrl = noStore ? `${url}&cacheBust=${Date.now()}` : url;
  const fetchOptions = noStore
    ? { cache: "no-store" as const }
    : revalidateSeconds
      ? { next: { revalidate: revalidateSeconds } }
      : undefined;

  const response = await fetch(targetUrl, fetchOptions);

  if (!response.ok) {
    throw new Error(`CSVを取得できませんでした: ${response.status}`);
  }

  return parseCsvObjects(await response.text());
}

export async function fetchSpots(options: FetchOptions = {}) {
  const rows = await fetchCsvObjects(
    SPOTS_URL,
    options.noStore,
    options.revalidateSeconds
  );

  return rows
    .map((row): Spot => ({
      id: row.id || "",
      name: row.name || "",
      kana: row.kana || "",
      spotsImage: row.spotsImage || "",
      lat: Number(row.lat),
      lng: Number(row.lng),
      country: row.country || "",
      prefecture: row.prefecture || "",
      city: row.city || "",
      area: row.area || "",
      category: row.category || "",
      characterIds: row.characterIds || "",
      status: String(row.status || "").trim(),
      mode: row.mode || "",
      workId: String(row.workId || "").trim(),
      description: row.description || "",
      trivia: row.trivia || "",
    }))
    .filter(
      (spot) =>
        spot.status.toLowerCase() === "ready" &&
        Number.isFinite(spot.lat) &&
        Number.isFinite(spot.lng) &&
        !String(spot.mode || "").includes("除外") &&
        (options.includeWorkSpots || !spot.workId)
    );
}

export async function fetchWorks(options: FetchOptions = {}) {
  const rows = await fetchCsvObjects(
    WORKS_URL,
    options.noStore,
    options.revalidateSeconds
  );

  return rows
    .map((row): Work => ({
      workId: String(row.workId || "").trim(),
      workTitle: String(row.workTitle || "").trim(),
      workDescription: String(row.workDescription || "").trim(),
    }))
    .filter((work) => work.workId && work.workTitle);
}

export async function fetchCharacters(options: FetchOptions = {}) {
  const rows = await fetchCsvObjects(
    CHARACTERS_URL,
    options.noStore,
    options.revalidateSeconds
  );

  return rows.map((row): Character => ({
    characterId: row.characterId || "",
    characterName: row.characterName || "",
  }));
}

export async function fetchEvents(options: FetchOptions = {}) {
  const rows = await fetchCsvObjects(
    EVENTS_URL,
    options.noStore,
    options.revalidateSeconds
  );

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
