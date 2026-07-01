import Link from "next/link";

import {
  languageLabels,
  languagePathCode,
  supportedLanguages,
  type SupportedLanguage,
} from "../lib/seichiI18nData";

export default function SeichiLanguageSwitcher({
  currentLanguage,
  workId,
}: {
  currentLanguage: SupportedLanguage;
  workId?: string;
}) {
  return (
    <nav
      aria-label="Language"
      className="mb-6 flex flex-wrap gap-2 border-4 border-black bg-white p-3 shadow-[4px_4px_0_#111]"
    >
      {supportedLanguages.map((lang) => {
        const code = languagePathCode(lang);
        const href = workId
          ? code
            ? `/seichi/${workId}/${code}`
            : `/seichi/${workId}`
          : code
            ? `/seichi/${code}`
            : "/seichi";

        return (
          <Link
            key={lang}
            href={href}
            hrefLang={lang === "vn" ? "vi" : lang}
            className={`rounded-full border-2 border-black px-3 py-1.5 text-sm font-black ${
              currentLanguage === lang ? "bg-[#ffd83d]" : "bg-white hover:bg-[#d9f7ff]"
            }`}
          >
            {languageLabels[lang]}
          </Link>
        );
      })}
    </nav>
  );
}
