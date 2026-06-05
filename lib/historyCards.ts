import type { HistoryEvent } from "@/types/history";

const tagIcons: Record<string, string> = {
  外交: "🤝",
  政治: "🏯",
  法律: "📜",
  都: "🏛️",
  文化: "🎎",
  宗教: "⛩️",
  戦乱: "⚔️",
  社会: "👥",
  産業: "⚙️",
  経済: "💰",
  交通: "🚄",
  技術: "💡",
  災害: "🌋",
  スポーツ: "🏅",
  元号: "📅",
  環境: "🌿",
  制度: "🏢",
  科学: "🔬",
  教育: "📚",
  地域: "🗾",
  医療: "🏥",
};

const tagLabels: Record<string, string> = {
  外交: "つながる歴史",
  政治: "うごく政治",
  法律: "きまりの歴史",
  都: "まちの記憶",
  文化: "くらしと文化",
  宗教: "祈りの歴史",
  戦乱: "戦いの記録",
  社会: "社会の変化",
  産業: "ものづくり",
  経済: "お金と社会",
  交通: "道と移動",
  技術: "技術の進歩",
  災害: "忘れない記憶",
  スポーツ: "熱狂の記憶",
  元号: "時代の節目",
  環境: "自然と未来",
  制度: "しくみの変化",
  科学: "発見と挑戦",
  教育: "学びの歴史",
  地域: "地域の記憶",
  医療: "命を守る歩み",
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getPrimaryTag(event: HistoryEvent) {
  return event.tags[0] ?? "歴史";
}

export function getHistoryCardImage(event: HistoryEvent) {
  const tag = getPrimaryTag(event);
  const icon = tagIcons[tag] ?? "🗺️";
  const label = tagLabels[tag] ?? "歴史の流れ";
  const color = event.card?.color ?? "#38bdf8";
  const title = escapeXml(label);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" role="img" aria-label="${escapeXml(event.title)}の歴史カード画像">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#020617"/>
          <stop offset="0.52" stop-color="${escapeXml(color)}" stop-opacity="0.72"/>
          <stop offset="1" stop-color="#111827"/>
        </linearGradient>
        <radialGradient id="glow" cx="35%" cy="30%" r="65%">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.34"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="640" height="360" rx="36" fill="url(#bg)"/>
      <rect width="640" height="360" rx="36" fill="url(#glow)"/>
      <circle cx="136" cy="120" r="70" fill="#ffffff" opacity="0.15"/>
      <circle cx="512" cy="252" r="98" fill="#ffffff" opacity="0.11"/>
      <path d="M88 276 C176 228 228 298 318 244 C392 200 454 218 552 156" fill="none" stroke="#ffffff" stroke-width="16" stroke-linecap="round" opacity="0.24"/>
      <text x="320" y="170" text-anchor="middle" font-size="96" font-family="Apple Color Emoji, Segoe UI Emoji, sans-serif">${icon}</text>
      <text x="320" y="248" text-anchor="middle" font-size="34" font-weight="700" fill="#ffffff" font-family="system-ui, sans-serif">${title}</text>
    </svg>`;

  return {
    src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    alt: `${event.title}の歴史カード画像`,
  };
}

export function getPrintableHistoryCard(event: HistoryEvent, index: number) {
  const image = getHistoryCardImage(event);

  return {
    number: event.card?.number ?? `TF-${String(index + 1).padStart(3, "0")}`,
    set: event.card?.set ?? "ゆる歴史散歩 TimeFlow 基本セット",
    frontTitle: event.card?.frontTitle ?? event.title,
    backYear: event.card?.backYear ?? event.year,
    flavorText: event.card?.flavorText ?? event.shortText,
    printText: event.card?.printText ?? event.description,
    image,
  };
}
