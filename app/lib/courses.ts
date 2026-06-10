import type { Spot } from "@/types/timewalk";

export type Course = {
  id: string;
  title: string;
  description: string;
  area: string;
  duration: string;
  distance: string;
  spotIds: string[];
  fallbackKeywords: string[];
  status: "ready" | "draft";
};

export const courses: Course[] = [
  {
    id: "ueno-history-walk",
    title: "上野公園 歴史さんぽ",
    description: "博物館や寺社、近代の記憶が重なる上野エリアを、短時間で歩きやすく楽しむコースです。",
    area: "上野",
    duration: "約60〜90分",
    distance: "約2km",
    spotIds: [],
    fallbackKeywords: ["上野", "寛永寺", "西郷", "不忍", "彰義隊"],
    status: "ready",
  },
  {
    id: "asakusa-edo-culture-walk",
    title: "浅草 江戸文化さんぽ",
    description: "浅草寺周辺を中心に、江戸のにぎわいや文化の名残を感じながら歩くコースです。",
    area: "浅草",
    duration: "約60〜90分",
    distance: "約2km",
    spotIds: [],
    fallbackKeywords: ["浅草", "浅草寺", "雷門", "蔦屋", "吉原"],
    status: "ready",
  },
  {
    id: "tokyo-station-modern-walk",
    title: "東京駅・丸の内 近代建築さんぽ",
    description: "東京駅から丸の内周辺を歩き、近代東京の都市づくりや建築の雰囲気を楽しむコースです。",
    area: "東京駅・丸の内",
    duration: "約45〜75分",
    distance: "約1.5km",
    spotIds: [],
    fallbackKeywords: ["東京駅", "丸の内", "日本橋", "皇居", "大手町"],
    status: "ready",
  },
];

export function getReadyCourses() {
  return courses.filter((course) => course.status === "ready");
}

export function getCourseById(id: string) {
  return courses.find((course) => course.id === id && course.status === "ready") || null;
}

export function resolveCourseSpots(course: Course, spots: Spot[]) {
  const byId = new Map(spots.map((spot) => [spot.id, spot]));
  const selected: Spot[] = [];
  const usedIds = new Set<string>();

  course.spotIds.forEach((id) => {
    const spot = byId.get(id);
    if (!spot || usedIds.has(spot.id)) return;
    selected.push(spot);
    usedIds.add(spot.id);
  });

  if (selected.length > 0) return selected;

  const keywords = course.fallbackKeywords.map((keyword) => keyword.toLowerCase());

  return spots
    .filter((spot) => {
      const text = `${spot.name} ${spot.category} ${spot.description}`.toLowerCase();
      return keywords.some((keyword) => text.includes(keyword));
    })
    .slice(0, 8);
}
