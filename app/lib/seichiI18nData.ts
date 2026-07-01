import {
  LANGUAGES_URL,
  SPOT_I18N_URL,
  WORK_I18N_URL,
} from "./sheetUrls";
import { fetchCsvObjects } from "./timewalkData";
import type {
  Language,
  Spot,
  SpotTranslation,
  Work,
  WorkTranslation,
} from "@/types/timewalk";

export const supportedLanguages = ["ja", "en", "zh-CN", "zh-TW", "ko", "vn"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const languageLabels: Record<SupportedLanguage, string> = {
  ja: "日本語",
  en: "English",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  ko: "한국어",
  vn: "Tiếng Việt",
};

export function normalizeLanguage(value?: string): SupportedLanguage {
  const code = String(value || "").toLowerCase();
  if (code === "en") return "en";
  if (code === "zh-cn") return "zh-CN";
  if (code === "zh-tw") return "zh-TW";
  if (code === "ko") return "ko";
  if (code === "vn") return "vn";
  return "ja";
}

export function languagePathCode(lang: SupportedLanguage) {
  if (lang === "ja") return "";
  return lang.toLowerCase();
}

export async function fetchLanguages(revalidateSeconds = 300) {
  const rows = await fetchCsvObjects(LANGUAGES_URL, false, revalidateSeconds);
  return rows
    .map((row): Language => ({
      lang: String(row.lang || "").trim(),
      label: String(row.label || "").trim(),
      nativeLabel: String(row.nativeLabel || "").trim(),
      urlPrefix: String(row.urlPrefix || "").trim(),
      isActive: String(row.isActive || "").toLowerCase() === "true",
      note: String(row.note || "").trim(),
    }))
    .filter((item) => item.lang);
}

export async function fetchWorkTranslations(revalidateSeconds = 300) {
  const rows = await fetchCsvObjects(WORK_I18N_URL, false, revalidateSeconds);
  return rows
    .map((row): WorkTranslation => ({
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
    }))
    .filter((item) => item.workId && item.lang);
}

export async function fetchSpotTranslations(revalidateSeconds = 300) {
  const rows = await fetchCsvObjects(SPOT_I18N_URL, false, revalidateSeconds);
  return rows
    .map((row): SpotTranslation => ({
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
    }))
    .filter((item) => item.spotId && item.lang);
}

export function localizeWork(
  work: Work,
  lang: SupportedLanguage,
  translations: WorkTranslation[]
) {
  if (lang === "ja") return { ...work };
  const translated = translations.find(
    (item) => item.workId === work.workId && item.lang === lang
  );
  return {
    ...work,
    workTitle: translated?.workTitle || work.workTitle,
    workDescription: translated?.workDescription || work.workDescription,
    metaTitle: translated?.metaTitle || "",
    metaDescription: translated?.metaDescription || "",
    h1: translated?.h1 || translated?.workTitle || work.workTitle,
    leadText: translated?.leadText || translated?.workDescription || work.workDescription,
    ogTitle: translated?.ogTitle || translated?.metaTitle || translated?.workTitle || work.workTitle,
    ogDescription:
      translated?.ogDescription || translated?.metaDescription || translated?.workDescription || work.workDescription,
  };
}

export function localizeSpot(
  spot: Spot,
  lang: SupportedLanguage,
  translations: SpotTranslation[]
): Spot {
  if (lang === "ja") return spot;
  const translated = translations.find(
    (item) => item.spotId === spot.id && item.lang === lang
  );
  return {
    ...spot,
    name: translated?.name || spot.name,
    kana: translated?.kana || spot.kana,
    description:
      translated?.description || translated?.sceneDescription || spot.description,
  };
}
