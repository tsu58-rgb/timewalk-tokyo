export type MapLayerId =
  | "gsi-pale"
  | "gsi-hillshade"
  | "gsi-photo"
  | "gsi-photo-1945"
  | "gsi-photo-1936"
  | "meiji-tokyo-5000"
  | "meiji-rapid"
  | "edo-kiriezu";

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
  '<a href="https://mapwarper.h-gis.jp/layers/25" target="_blank" rel="noopener noreferrer">江戸切絵図</a>（日本版Map Warper・国立国会図書館デジタルコレクション）';

const HABS_ATTRIBUTION =
  '<a href="https://habs.rad.naro.go.jp/" target="_blank" rel="noopener noreferrer">農研機構農業環境研究部門・歴史的農業環境閲覧システム</a>';

export const PALE_MAP_URL =
  "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png";

export const mapLayers: MapLayer[] = [
  {
    id: "gsi-pale",
    label: "現代：淡色地図",
    description: "現在の道路や地名が見やすい淡色地図",
    attribution: GSI_ATTRIBUTION,
    url: PALE_MAP_URL,
    maxNativeZoom: 18,
  },
  {
    id: "gsi-hillshade",
    label: "現代：陰影起伏図",
    description: "現在の地形の高低や谷・尾根がわかる陰影図",
    attribution: GSI_ATTRIBUTION,
    url: "https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png",
    minNativeZoom: 2,
    maxNativeZoom: 16,
  },
  {
    id: "gsi-photo",
    label: "現代：空中写真",
    description: "現在に近い全国の空中写真",
    attribution: GSI_ATTRIBUTION,
    url: "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg",
    minNativeZoom: 9,
    maxNativeZoom: 18,
  },
  {
    id: "gsi-photo-1945",
    label: "戦後：空中写真",
    description: "1945年から1950年ごろの空中写真",
    attribution: GSI_ATTRIBUTION,
    url: "https://cyberjapandata.gsi.go.jp/xyz/ort_USA10/{z}/{x}/{y}.png",
    minNativeZoom: 10,
    maxNativeZoom: 17,
  },
  {
    id: "gsi-photo-1936",
    label: "戦中：空中写真",
    description: "1936年から1942年ごろの東京23区内などの空中写真",
    attribution: GSI_ATTRIBUTION,
    url: "https://cyberjapandata.gsi.go.jp/xyz/ort_riku10/{z}/{x}/{y}.png",
    minNativeZoom: 13,
    maxNativeZoom: 18,
  },
  {
    id: "meiji-tokyo-5000",
    label: "明治：東京五千分一",
    description: "明治初期の東京中心部を精密に描いた五千分一東京図測量原図",
    attribution: HABS_ATTRIBUTION,
    url: "https://aginfo.cgk.affrc.go.jp/ws/tmc/1.0.0/Tokyo5000-900913-L/{z}/{x}/{y}.png",
    minNativeZoom: 10,
    maxNativeZoom: 18,
    showPaleBase: true,
  },
  {
    id: "meiji-rapid",
    label: "明治：迅速測図",
    description: "明治13年から19年に作成された関東地方の二万分一迅速測図",
    attribution: HABS_ATTRIBUTION,
    url: "https://aginfo.cgk.affrc.go.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png",
    minNativeZoom: 8,
    maxNativeZoom: 17,
    showPaleBase: true,
  },
  {
    id: "edo-kiriezu",
    label: "江戸：江戸切絵図",
    description: "幕末期の江戸切絵図29枚を現在位置に重ねた古地図",
    attribution: EDO_KIRIEZU_ATTRIBUTION,
    url: "https://mapwarper.h-gis.jp/mosaics/tile/25/{z}/{x}/{y}",
    minNativeZoom: 10,
    maxNativeZoom: 18,
    showPaleBase: true,
  },
];

export const defaultMapLayerId: MapLayerId = "gsi-pale";
