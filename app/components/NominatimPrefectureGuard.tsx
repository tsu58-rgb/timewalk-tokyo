"use client";

import { useEffect } from "react";

const JAPANESE_PREFECTURES = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

function findPrefecture(values: unknown[]) {
  for (const value of values) {
    const text = String(value || "").trim();
    const exact = JAPANESE_PREFECTURES.find((prefecture) => text === prefecture);
    if (exact) return exact;
  }
  return "";
}

export default function NominatimPrefectureGuard() {
  useEffect(() => {
    if (!window.location.pathname.startsWith("/admin/spots-map")) return;

    const originalFetch = window.fetch.bind(window);

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      const requestUrl = typeof args[0] === "string" ? args[0] : args[0] instanceof Request ? args[0].url : "";

      if (!requestUrl.includes("nominatim.openstreetmap.org/reverse")) {
        return response;
      }

      try {
        const json = await response.clone().json();
        const address = json.address || {};
        const displayParts = String(json.display_name || "")
          .split(",")
          .map((value: string) => value.trim());

        const prefecture = findPrefecture([
          address.state,
          address.province,
          address.region,
          ...displayParts,
        ]);

        if ((address.country_code || "").toLowerCase() === "jp") {
          address.state = prefecture;
          address.province = "";
          address.region = "";

          json.display_name = displayParts
            .filter((part: string) => {
              if (!/[都道府県]/.test(part)) return true;
              return JAPANESE_PREFECTURES.includes(part);
            })
            .join(", ");
        }

        json.address = address;

        return new Response(JSON.stringify(json), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      } catch {
        return response;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
