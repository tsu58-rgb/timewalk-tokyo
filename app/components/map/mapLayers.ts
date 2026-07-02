export type MapLayerId =
  | "osm"
  | "gsi-pale"
  | "edo-kiriezu"
  | "meiji-rapid"
  | "meiji-tokyo-5000"
  | "gsi-swale"
  | "gsi-sekishoku"
  | "gsi-lcmfc2"
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
  showPaleBase?: boolean;
  opacity?: number;
};

export const GSI_ATTRIBUTION =
  '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">地理院タイル</a>';

const EDO_KIRIEZU_ATTRIBUTION =
  '<a href="https://mapwarper.h-gis.jp/layers/25" target="_blank" rel="noopener noreferrer">江戸切絵図</a>（<a href="https://codh.rois.ac.jp/edo-maps/" target="_blank" rel="noopener noreferrer">CODH</a>・<a href="https://dl.ndl.go.jp/" target="_blank" rel="noopener noreferrer">国立国会図書館</a>）';

const HABS_ATTRIBUTION =
  '<a href="https://habs.rad.naro.go.jp/" target="_blank" rel="noopener noreferrer">農研機構農業環境研究部門・歴史的農業環境閲覧システム</a>';

export const PALE_MAP_URL =
  "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png";

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
    url: PALE_MAP_URL,
    maxNativeZoom: 18,
  },
  {
    id: "edo-kiriezu",
    label: "江戸時代 江戸切絵図",
    description: "江戸市中の切絵図を現在の位置に重ねた古地図",
    attribution: EDO_KIRIEZU_ATTRIBUTION,
    url: "/api/map-tiles/edo-kiriezu/{z}/{x}/{y}",
    minNativeZoom: 10,
    maxNativeZoom: 18,
    showPaleBase: true,
  },
  {
    id: "meiji-rapid",
    label: "明治時代 迅速測図",
    description: "1880年代の関東地方を広域で見られる2万分の1迅速測図",
    attribution: HABS_ATTRIBUTION,
    url: "/api/map-tiles/meiji-rapid/{z}/{x}/{y}",
    minNativeZoom: 8,
    maxNativeZoom: 16,
    showPaleBase: true,
  },
  {
    id: "meiji-tokyo-5000",
    label: "明治時代 東京五千分一",
    description: "1880年代の東京中心部を精密に見られる五千分の一測量図",
    attribution: HABS_ATTRIBUTION,
    url: "/api/map-tiles/meiji-tokyo-5000/{z}/{x}/{y}",
    minNativeZoom: 10,
    maxNativeZoom: 17,
    showPaleBase: true,
  },
  {
    id: "gsi-swale",
    label: "地理院 明治期の低湿地",
    description: "明治期に河川・湿地・水田だった低湿地を確認できる地図",
    attribution: GSI_ATTRIBUTION,
    url: "https://cyberjapandata.gsi.go.jp/xyz/swale/{z}/{x}/{y}.png",
    minNativeZoom: 10,
    maxNativeZoom: 16,
    showPaleBase: true,
    opacity: 0.78,
  },
  {
    id: "gsi-sekishoku",
    label: "地理院 赤色立体地図",
    description: "地形の微細な起伏を赤色の濃淡で読み取れる地図",
    attribution: GSI_ATTRIBUTION,
    url: "https://cyberjapandata.gsi.go.jp/xyz/sekishoku/{z}/{x}/{y}.png",
    minNativeZoom: 2,
    maxNativeZoom: 14,
  },
  {
    id: "gsi-lcmfc2",
    label: "地理院 治水地形分類図",
    description: "旧河道・自然堤防・後背湿地など河川沿いの地形分類図",
    attribution: GSI_ATTRIBUTION,
    url: "https://cyberjapandata.gsi.go.jp/xyz/lcmfc2/{z}/{x}/{y}.png",
    minNativeZoom: 11,
    maxNativeZoom: 16,
    showPaleBase: true,
    opacity: 0.82,
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
