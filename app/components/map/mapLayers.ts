export type MapLayerId =
  | "osm"
  | "gsi-pale"
  | "gsi-photo"
  | "gsi-photo-1945"
  | "gsi-photo-1936";

export type MapLayer = {
  id: MapLayerId;
  label: string;
  description: string;
  url: string;
  attribution: string;
  minNativeZoom?: number;
  maxNativeZoom?: number;
};

export const GSI_ATTRIBUTION =
  '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">地理院タイル</a>';

export const mapLayers: MapLayer[] = [
  {
    id: "osm",
    label: "OpenStreetMap",
    description: "通常の地図",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  {
    id: "gsi-pale",
    label: "地理院 淡色地図",
    description: "ピンが見やすい淡色地図",
    attribution: GSI_ATTRIBUTION,
    url: "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
    maxNativeZoom: 18,
  },
  {
    id: "gsi-photo",
    label: "地理院 最新写真",
    description: "全国最新写真・空中写真",
    attribution: GSI_ATTRIBUTION,
    url: "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg",
    minNativeZoom: 9,
    maxNativeZoom: 18,
  },
  {
    id: "gsi-photo-1945",
    label: "地理院 空中写真 1945-1950",
    description: "終戦直後ごろの空中写真",
    attribution: GSI_ATTRIBUTION,
    url: "https://cyberjapandata.gsi.go.jp/xyz/ort_USA10/{z}/{x}/{y}.png",
    minNativeZoom: 10,
    maxNativeZoom: 17,
  },
  {
    id: "gsi-photo-1936",
    label: "地理院 空中写真 1936-1942",
    description: "東京23区内などの戦前空中写真",
    attribution: GSI_ATTRIBUTION,
    url: "https://cyberjapandata.gsi.go.jp/xyz/ort_riku10/{z}/{x}/{y}.png",
    minNativeZoom: 13,
    maxNativeZoom: 18,
  },
];

export const defaultMapLayerId: MapLayerId = "gsi-pale";
