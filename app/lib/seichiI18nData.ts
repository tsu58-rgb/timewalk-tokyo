import type {
  Language,
  Spot,
  SpotTranslation,
  Work,
  WorkTranslation,
} from "@/types/timewalk";
import {
  getStaticLanguages,
  getStaticSpotTranslations,
  getStaticWorkTranslations,
} from "./staticTimewalkData";

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

export async function fetchLanguages(_revalidateSeconds = 300): Promise<Language[]> {
  return getStaticLanguages();
}

export async function fetchWorkTranslations(_revalidateSeconds = 300): Promise<WorkTranslation[]> {
  return getStaticWorkTranslations();
}

export async function fetchSpotTranslations(_revalidateSeconds = 300): Promise<SpotTranslation[]> {
  return getStaticSpotTranslations();
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
