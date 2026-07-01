import type { Metadata } from "next";

import {
  languagePathCode,
  supportedLanguages,
  type SupportedLanguage,
} from "./seichiI18nData";

export const TIMEWALK_BASE_URL = "https://timewalk.yuru-rekishi-sanpo.com";

export function htmlLanguageCode(lang: SupportedLanguage) {
  return lang === "vn" ? "vi" : lang;
}

export function spotDetailUrl(spotId: string, lang: SupportedLanguage) {
  const code = languagePathCode(lang);
  return `${TIMEWALK_BASE_URL}/spot/${spotId}${code ? `/${code}` : ""}`;
}

export function workUrl(workId: string, lang: SupportedLanguage) {
  const code = languagePathCode(lang);
  return `${TIMEWALK_BASE_URL}/seichi/${workId}${code ? `/${code}` : ""}`;
}

export function seichiIndexUrl(lang: SupportedLanguage) {
  const code = languagePathCode(lang);
  return `${TIMEWALK_BASE_URL}/seichi${code ? `/${code}` : ""}`;
}

export function spotAlternates(spotId: string, currentLang: SupportedLanguage): Metadata["alternates"] {
  const languages: Record<string, string> = {};

  supportedLanguages.forEach((lang) => {
    languages[htmlLanguageCode(lang)] = spotDetailUrl(spotId, lang);
  });
  languages["x-default"] = spotDetailUrl(spotId, "ja");

  return {
    canonical: spotDetailUrl(spotId, currentLang),
    languages,
  };
}

export function workAlternates(workId: string, currentLang: SupportedLanguage): Metadata["alternates"] {
  const languages: Record<string, string> = {};

  supportedLanguages.forEach((lang) => {
    languages[htmlLanguageCode(lang)] = workUrl(workId, lang);
  });
  languages["x-default"] = workUrl(workId, "ja");

  return {
    canonical: workUrl(workId, currentLang),
    languages,
  };
}
