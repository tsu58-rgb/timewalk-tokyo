export type MapLayerId =
  | "osm"
  | "gsi-pale"
  | "edo-kiriezu"
  | "gsi-hillshade"
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

const EDO_KIRIEZU_ATTRIBUTION =
  '<a href="https://mapwarper.h-gis.jp/layers/25" target="_blank" rel="noopener noreferrer">江戸切絵図</a>（<a href="https://codh.rois.ac.jp/edo-maps/" target="_blank" rel="noopener noreferrer">CODH</a>・<a href="https://dl.ndl.go.jp/" target="_blank" rel="noopener noreferrer">国立国会図書館</a>）';

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
    id: "edo-kiriezu",
    label: "江戸時代 江戸切絵図",
    description: "江戸市中の切絵図を現在の位置に重ねた古地図",
    attribution: EDO_KIRIEZU_ATTRIBUTION,
    url: "https://mapwarper.h-gis.jp/mosaics/tile/25/{z}/{x}/{y}",
  },
  {
    id: "gsi-hillshade",
    label: "地理院 陰影起伏図",
    description: "地形の高低や谷・尾根がわかる陰影図",
    attribution: GSI_ATTRIBUTION,
    url: "https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png",
    minNativeZoom: 2,
    maxNativeZoom: 16,
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
    label: "地理院 戦前空中写真 1936-1942",
    description: "東京23区内などの戦前空中写真（地形図ではありません）",
    attribution: GSI_ATTRIBUTION,
    url: "https://cyberjapandata.gsi.go.jp/xyz/ort_riku10/{z}/{x}/{y}.png",
    minNativeZoom: 13,
    maxNativeZoom: 18,
  },
];

export const defaultMapLayerId: MapLayerId = "gsi-pale";
