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

function languageAlternates(urlFor: (lang: SupportedLanguage) => string) {
  const languages: Record<string, string> = {};

  supportedLanguages.forEach((lang) => {
    languages[htmlLanguageCode(lang)] = urlFor(lang);
  });
  languages["x-default"] = urlFor("ja");

  return languages;
}

export function seichiIndexAlternates(currentLang: SupportedLanguage): Metadata["alternates"] {
  return {
    canonical: seichiIndexUrl(currentLang),
    languages: languageAlternates(seichiIndexUrl),
  };
}

export function spotAlternates(spotId: string, currentLang: SupportedLanguage): Metadata["alternates"] {
  return {
    canonical: spotDetailUrl(spotId, currentLang),
    languages: languageAlternates((lang) => spotDetailUrl(spotId, lang)),
  };
}

export function workAlternates(workId: string, currentLang: SupportedLanguage): Metadata["alternates"] {
  return {
    canonical: workUrl(workId, currentLang),
    languages: languageAlternates((lang) => workUrl(workId, lang)),
  };
}
