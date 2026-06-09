import Papa from "papaparse";

export const UKIYOE_SPOTS_URL =
  "https://docs.google.com/spreadsheets/d/1fbdYLOTvelQkL8wBNhza00Xbh6Kculj5V_dht1beCII/gviz/tq?tqx=out:csv&sheet=ukiyoe_spots";

export type UkiyoeSpot = {
  id: string;
  status: string;
  seriesId: string;
  series: string;
  seriesOrder: string;
  title: string;
  titleKana: string;
  artist: string;
  year: string;
  period: string;
  placeName: string;
  modernAddress: string;
  lat: number;
  lng: number;
  accuracy: string;
  imageUrl: string;
  thumbnailUrl: string;
  sourceUrl: string;
  license: string;
  credit: string;
  description: string;
  highlight: string;
  modernNote: string;
  tags: string;
  difficulty: string;
  quizChoices: string;
  relatedSpotIds: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export function parseUkiyoeCsv(text: string): UkiyoeSpot[] {
  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  return (parsed.data as Record<string, string>[])
    .map((row) => ({
      id: row.id || "",
      status: String(row.status || "").trim(),
      seriesId: row.seriesId || "",
      series: row.series || "",
      seriesOrder: row.seriesOrder || "",
      title: row.title || "",
      titleKana: row.titleKana || "",
      artist: row.artist || "",
      year: row.year || "",
      period: row.period || "",
      placeName: row.placeName || "",
      modernAddress: row.modernAddress || "",
      lat: Number(row.lat),
      lng: Number(row.lng),
      accuracy: row.accuracy || "",
      imageUrl: row.imageUrl || "",
      thumbnailUrl: row.thumbnailUrl || "",
      sourceUrl: row.sourceUrl || "",
      license: row.license || "",
      credit: row.credit || "",
      description: row.description || "",
      highlight: row.highlight || "",
      modernNote: row.modernNote || "",
      tags: row.tags || "",
      difficulty: row.difficulty || "",
      quizChoices: row.quizChoices || "",
      relatedSpotIds: row.relatedSpotIds || "",
      notes: row.notes || "",
      createdAt: row.createdAt || "",
      updatedAt: row.updatedAt || "",
    }))
    .filter(
      (spot) =>
        spot.status.toLowerCase() === "ready" &&
        spot.id.trim() !== "" &&
        Number.isFinite(spot.lat) &&
        Number.isFinite(spot.lng)
    );
}

export function splitTags(value: string) {
  return String(value || "")
    .split(/[,、・]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function accuracyLabel(value: string) {
  switch (String(value || "").toLowerCase()) {
    case "exact":
      return "地点";
    case "near":
      return "周辺（推定）";
    case "area":
      return "地域（推定）";
    default:
      return "推定";
  }
}
