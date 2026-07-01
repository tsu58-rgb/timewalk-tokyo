import Link from "next/link";
import type { Language } from "@/types/timewalk";
import {
  languageLabels,
  languagePathCode,
  supportedLanguages,
  type SupportedLanguage,
} from "../lib/seichiI18nData";

export default function SeichiLanguageSwitcher({
  currentLanguage,
  workId,
  languages,
}: {
  currentLanguage: SupportedLanguage;
  workId?: string;
  languages: Language[];
}) {
  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-4 border-black bg-white p-3 shadow-[4px_4px_0_#111]" aria-label="Language">
      {supportedLanguages.map((lang) => {
        const code = languagePathCode(lang);
        const dbItem = languages.find((item) => item.lang === lang);
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
            className={`rounded-full border-2 border-black px-3 py-1.5 text-sm font-black ${currentLanguage === lang ? "bg-[#ffd83d]" : "bg-white hover:bg-[#d9f7ff]"}`}
          >
            {dbItem?.nativeLabel || languageLabels[lang]}
          </Link>
        );
      })}
    </nav>
  );
}
