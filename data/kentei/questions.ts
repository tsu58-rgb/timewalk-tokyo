import type { KenteiQuestion } from "@/types/kentei";

export const kenteiQuestions: KenteiQuestion[] = [
  {
    id: "beginner-edo-shogunate-year",
    format: "choice",
    level: "beginner",
    category: "江戸",
    question: "江戸幕府が開かれた年はいつ？",
    choices: ["1192年", "1603年", "1868年", "1964年"],
    answer: "1603年",
    explanation: "徳川家康が征夷大将軍となり、1603年に江戸幕府が始まりました。",
    relatedEventIds: ["edo-shogunate"],
  },
  {
    id: "beginner-meiji-restoration-input",
    format: "input",
    level: "beginner",
    category: "明治",
    question: "江戸幕府の時代が終わり、明治政府のもとで近代化が進んだ大きな改革を何という？",
    answer: ["明治維新", "めいじいしん"],
    explanation: "明治維新により、日本の政治・社会・文化は大きく変化しました。",
    relatedEventIds: ["meiji-restoration"],
  },
];
