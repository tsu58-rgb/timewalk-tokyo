type LeafletLike = {
  divIcon: (options: Record<string, unknown>) => unknown;
};

type SpotLike = {
  spotsImage?: string;
  description?: string;
};

export function getSpotMarkerIcon(L: LeafletLike, spot: SpotLike) {
  let pinColor = "#9f2f25";
  let centerColor = "#ffffff";

  if (String(spot.spotsImage || "").trim()) {
    centerColor = "#ffe96a";
  }

  const desc = String(spot.description || "").trim();

  if (desc.includes("自動入力") || desc === "" || desc.length <= 50) {
    pinColor = "#e36f6f";
  }

  return L.divIcon({
    html: `
      <svg width="26" height="40" viewBox="0 0 26 40">
        <path
          d="M13 0 C6 0 0 6 0 13 C0 24 13 40 13 40 C13 40 26 24 26 13 C26 6 20 0 13 0Z"
          fill="${pinColor}"
        />
        <circle cx="13" cy="13" r="5" fill="${centerColor}" />
      </svg>
    `,
    className: "",
    iconSize: [26, 40],
    iconAnchor: [13, 40],
    popupAnchor: [0, -40],
  });
}

export function getClusterMarkerIcon(L: LeafletLike, count: number) {
  return L.divIcon({
    html: `
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="#9f2f25" />
        <circle cx="22" cy="22" r="12" fill="#ffffff" />
        <text
          x="22"
          y="26"
          text-anchor="middle"
          font-size="12"
          font-weight="bold"
          fill="#9f2f25"
        >${count}</text>
      </svg>
    `,
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

export function getCurrentLocationMarkerIcon(L: LeafletLike) {
  return L.divIcon({
    html: `
      <div style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #1a73e8;
        border: 3px solid #ffffff;
        box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.25), 0 2px 6px rgba(0,0,0,0.35);
        box-sizing: border-box;
      "></div>
    `,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

export function getNewSpotMarkerIcon(L: LeafletLike) {
  return L.divIcon({
    html: `
      <svg width="26" height="40" viewBox="0 0 26 40">
        <path
          d="M13 0 C6 0 0 6 0 13 C0 24 13 40 13 40 C13 40 26 24 26 13 C26 6 20 0 13 0Z"
          fill="#20c7b5"
        />
        <circle cx="13" cy="13" r="5" fill="#ffffff" />
      </svg>
    `,
    className: "",
    iconSize: [26, 40],
    iconAnchor: [13, 40],
  });
}
