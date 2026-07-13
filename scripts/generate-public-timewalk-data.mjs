import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import Papa from "papaparse";

const SHEETS_BASE_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub";

const URLS = {
  events: `${SHEETS_BASE_URL}?gid=1015785763&single=true&output=csv`,
  spots: `${SHEETS_BASE_URL}?gid=1242477641&single=true&output=csv`,
  works: `${SHEETS_BASE_URL}?gid=697753165&single=true&output=csv`,
  languages: `${SHEETS_BASE_URL}?gid=31001&single=true&output=csv`,
  workTranslations: `${SHEETS_BASE_URL}?gid=31002&single=true&output=csv`,
  spotTranslations: `${SHEETS_BASE_URL}?gid=31003&single=true&output=csv`,
  characters: `${SHEETS_BASE_URL}?gid=1745190060&single=true&output=csv`,
  courses: `${SHEETS_BASE_URL}?gid=21001&single=true&output=csv`,
  coursePoints: `${SHEETS_BASE_URL}?gid=21002&single=true&output=csv`,
};

const outputDir = path.join(process.cwd(), "app", "generated", "timewalk");
const publicOutputDir = path.join(process.cwd(), "public", "data", "timewalk");

function parseCsv(text) {
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  return parsed.data;
}

async function fetchCsvObjects(name, url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${name} CSV fetch failed: ${response.status}`);
  return parseCsv(await response.text());
}

function getCourseDate(row) {
  const notes = String(row.notes || "");
  const notesMatch = notes.match(/courseDate:(\d{4}-\d{2}-\d{2})/);
  return String(row.date || notesMatch?.[1] || row.createdAt || "").trim().slice(0, 10);
}

function normalizeSpot(row) {
  return {
    id: String(row.id || ""),
    name: String(row.name || ""),
    kana: String(row.kana || ""),
    spotsImage: String(row.spotsImage || ""),
    lat: Number(row.lat),
    lng: Number(row.lng),
    country: String(row.country || ""),
    prefecture: String(row.prefecture || ""),
    city: String(row.city || ""),
    area: String(row.area || ""),
    category: String(row.category || ""),
    characterIds: String(row.characterIds || ""),
    status: String(row.status || "").trim(),
    mode: String(row.mode || ""),
    workId: String(row.workId || "").trim(),
    description: String(row.description || ""),
    trivia: String(row.trivia || ""),
  };
}

function normalizeCharacter(row) {
  return {
    characterId: String(row.characterId || ""),
    characterName: String(row.characterName || ""),
    characterKana: String(row.characterKana || ""),
    characterYears: String(row.characterYears || ""),
    characterDescription: String(row.characterDescription || ""),
    characterImage: String(row.characterImage || ""),
    wikipediaUrl: String(row.wikipediaUrl || ""),
  };
}

function normalizeEvent(row) {
  return {
    id: String(row.id || ""),
    date: String(row.date || ""),
    description: String(row.description || ""),
    memorial: String(row.memorial || ""),
    source_url: String(row.source_url || ""),
    quiz: String(row.quiz || ""),
    quizAnswer: String(row.quizAnswer || ""),
  };
}

function normalizeWork(row) {
  return {
    workId: String(row.workId || "").trim(),
    workTitle: String(row.workTitle || "").trim(),
    workDescription: String(row.workDescription || "").trim(),
  };
}

function normalizeLanguage(row) {
  return {
    lang: String(row.lang || "").trim(),
    label: String(row.label || "").trim(),
    nativeLabel: String(row.nativeLabel || "").trim(),
    urlPrefix: String(row.urlPrefix || "").trim(),
    isActive: String(row.isActive || "").toLowerCase() === "true",
    note: String(row.note || "").trim(),
  };
}

function normalizeWorkTranslation(row) {
  return {
    workId: String(row.workId || "").trim(),
    lang: String(row.lang || "").trim(),
    workTitle: String(row.workTitle || "").trim(),
    workDescription: String(row.workDescription || "").trim(),
    metaTitle: String(row.metaTitle || "").trim(),
    metaDescription: String(row.metaDescription || "").trim(),
    h1: String(row.h1 || "").trim(),
    leadText: String(row.leadText || "").trim(),
    ogTitle: String(row.ogTitle || "").trim(),
    ogDescription: String(row.ogDescription || "").trim(),
    status: String(row.status || "").trim(),
  };
}

function normalizeSpotTranslation(row) {
  return {
    spotId: String(row.spotId || "").trim(),
    lang: String(row.lang || "").trim(),
    name: String(row.name || "").trim(),
    kana: String(row.kana || "").trim(),
    description: String(row.description || "").trim(),
    sceneTitle: String(row.sceneTitle || "").trim(),
    sceneDescription: String(row.sceneDescription || "").trim(),
    photoCaption: String(row.photoCaption || "").trim(),
    metaTitle: String(row.metaTitle || "").trim(),
    metaDescription: String(row.metaDescription || "").trim(),
    status: String(row.status || "").trim(),
  };
}

function normalizeCourse(row) {
  return {
    id: String(row.courseId || "").trim(),
    status: String(row.status || "").trim(),
    title: String(row.title || "").trim(),
    description: String(row.description || "").trim(),
    area: String(row.area || "").trim(),
    distanceKm: Number(row.distanceKm),
    durationMin: Number(row.durationMin),
    durationLabel: String(row.durationLabel || "").trim(),
    displayOrder: Number(row.displayOrder),
    date: getCourseDate(row),
    eyecatchImage: String(row.eyecatchImage || "").trim().replace(/^"+|"+$/g, ""),
  };
}

function normalizeCoursePoint(row) {
  return {
    courseId: String(row.courseId || "").trim(),
    pointOrder: Number(row.pointOrder),
    pointType: String(row.pointType || "spot").trim().toLowerCase() === "waypoint" ? "waypoint" : "spot",
    spotId: String(row.spotId || "").trim(),
    pointId: String(row.pointId || "").trim(),
    name: String(row.name || "").trim(),
    lat: Number(row.lat),
    lng: Number(row.lng),
  };
}

async function writeJson(fileName, data) {
  const json = `${JSON.stringify(data)}\n`;
  await Promise.all([
    writeFile(path.join(outputDir, fileName), json, "utf8"),
    writeFile(path.join(publicOutputDir, fileName), json, "utf8"),
  ]);
}

await Promise.all([mkdir(outputDir, { recursive: true }), mkdir(publicOutputDir, { recursive: true })]);

const [
  spotRows,
  characterRows,
  eventRows,
  workRows,
  languageRows,
  workTranslationRows,
  spotTranslationRows,
  courseRows,
  coursePointRows,
] = await Promise.all([
  fetchCsvObjects("spots", URLS.spots),
  fetchCsvObjects("characters", URLS.characters),
  fetchCsvObjects("events", URLS.events),
  fetchCsvObjects("works", URLS.works),
  fetchCsvObjects("languages", URLS.languages),
  fetchCsvObjects("workTranslations", URLS.workTranslations),
  fetchCsvObjects("spotTranslations", URLS.spotTranslations),
  fetchCsvObjects("courses", URLS.courses),
  fetchCsvObjects("coursePoints", URLS.coursePoints),
]);

const allUsableSpots = spotRows
  .map(normalizeSpot)
  .filter(
    (spot) =>
      spot.status.toLowerCase() === "ready" &&
      Number.isFinite(spot.lat) &&
      Number.isFinite(spot.lng) &&
      !String(spot.mode || "").includes("除外")
  );

const spots = allUsableSpots.filter((spot) => !spot.workId);
const seichiSpots = allUsableSpots.filter((spot) => spot.workId);
const works = workRows.map(normalizeWork).filter((item) => item.workId && item.workTitle);
const languages = languageRows.map(normalizeLanguage).filter((item) => item.lang);
const workTranslations = workTranslationRows.map(normalizeWorkTranslation).filter((item) => item.workId && item.lang);
const spotTranslations = spotTranslationRows.map(normalizeSpotTranslation).filter((item) => item.spotId && item.lang);
const characters = characterRows.map(normalizeCharacter).filter((item) => item.characterId && item.characterName);
const events = eventRows.map(normalizeEvent).filter((item) => item.id || item.date || item.description);
const courses = courseRows
  .map(normalizeCourse)
  .filter((course) => course.id && course.title && course.status.toLowerCase() === "ready")
  .sort((a, b) => (a.displayOrder || 9999) - (b.displayOrder || 9999));
const coursePoints = coursePointRows
  .map(normalizeCoursePoint)
  .filter(
    (point) =>
      point.courseId &&
      point.pointId &&
      Number.isFinite(point.lat) &&
      Number.isFinite(point.lng)
  )
  .sort((a, b) => a.pointOrder - b.pointOrder);

await Promise.all([
  writeJson("spots.json", spots),
  writeJson("seichi-spots.json", seichiSpots),
  writeJson("characters.json", characters),
  writeJson("events.json", events),
  writeJson("works.json", works),
  writeJson("languages.json", languages),
  writeJson("work-translations.json", workTranslations),
  writeJson("spot-translations.json", spotTranslations),
  writeJson("courses.json", courses),
  writeJson("course-points.json", coursePoints),
]);

console.log(
  `Generated TimeWalk static data: spots=${spots.length}, seichiSpots=${seichiSpots.length}, characters=${characters.length}, events=${events.length}, works=${works.length}, courses=${courses.length}, coursePoints=${coursePoints.length}`
);
