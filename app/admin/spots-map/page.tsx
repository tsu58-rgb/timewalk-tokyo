"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

type Spot = {
  id?: string;
  name: string;
  kana?: string;
  lat: number;
  lng: number;
  country?: string;
  prefecture?: string;
  city?: string;
  area?: string;
  category?: string;
  mode?: string;
  spotsImage?: string;
  description?: string;
  trivia?: string;
  characterIds?: string;
};

const emptySpot: Spot = {
  name: "",
  kana: "",
  lat: 35.681236,
  lng: 139.767125,
  country: "JP",
  prefecture: "",
  city: "",
  area: "",
  category: "",
  mode: "",
  spotsImage: "",
  description: "",
  trivia: "",
  characterIds: "",
};

export default function AdminSpotsMapPage() {
  const mapRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const allSpotsRef = useRef<any[]>([]);
  const selectedMarkerRef = useRef<any>(null);
  const newMarkerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [passwordInput, setPasswordInput] = useState("");
  const [pagePassword, setPagePassword] = useState("");
  const [spot, setSpot] = useState<Spot>(emptySpot);
  const [imageBase64, setImageBase64] = useState("");
  const [message, setMessage] = useState("");
  const [pendingMove, setPendingMove] = useState<{ lat: number; lng: number } | null>(null);
  const [allSpots, setAllSpots] = useState<any[]>([]);

  function login() {
    if (!passwordInput) {
      return;
    }
    setPagePassword(passwordInput);
  }

  useEffect(() => {
    if (!pagePassword) return;
    initMap();
  }, [pagePassword]);

  async function initMap() {
    const L = await import("leaflet");

    if (mapRef.current) return;

    const map = L.map("map", { maxZoom: 18 }).setView([35.681236, 139.767125], 15);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 18,
      maxNativeZoom: 18,
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);


    map.on("click", async (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const geo = await reverseGeocode(lat, lng);

      setSpot({
        ...emptySpot,
        lat,
        lng,
        country: geo.country,
        prefecture: geo.prefecture,
        city: geo.city,
        area: geo.area,
      });

      setPendingMove(null);
    setImageBase64("");
    if (fileInputRef.current) fileInputRef.current.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";

      await placeSelectedMarker(lat, lng);
    });

map.on("zoomend", () => {
  loadExistingSpots();
});

map.on("moveend", () => {
  loadExistingSpots();
});

await loadExistingSpots();

  }

  async function loadExistingSpots() {
    setMessage("既存地点を読み込み中...");

    const map = mapRef.current;
    const bounds = map ? map.getBounds().pad(0.2) : null;

    const res = await fetch("/api/admin/spots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pagePassword,
        north: bounds ? bounds.getNorth() : undefined,
        south: bounds ? bounds.getSouth() : undefined,
        east: bounds ? bounds.getEast() : undefined,
        west: bounds ? bounds.getWest() : undefined,
      }),
    });

    const json = await res.json();

    if (!json.ok) {
      setMessage(json.error || "取得失敗");
      return;
    }

    const spots = json.spots || [];
    setAllSpots(spots);
    allSpotsRef.current = spots;

    await renderSpots(spots);

    setMessage(`表示中：${spots.length}件 / 全${json.total || spots.length}件`);
  }

  async function renderSpots(spots: any[]) {
    const L = await import("leaflet");

    if (!mapRef.current || !markerLayerRef.current) return;

    markerLayerRef.current.clearLayers();

    const map = mapRef.current;
    const zoom = map.getZoom();
    const bounds = map.getBounds().pad(0.2);

    const visibleSpots = spots.filter((s: any) => {
      const lat = Number(s.lat);
      const lng = Number(s.lng);
      if (!lat || !lng) return false;
      return bounds.contains([lat, lng]);
    });

    const shouldCluster = zoom < 17;
    const cellSize = zoom <= 12 ? 90 : zoom <= 14 ? 75 : zoom <= 16 ? 60 : 45;

    if (!shouldCluster) {
      visibleSpots.forEach((s: any) => addSpotMarker(L, s));
      setMessage(`表示中：${visibleSpots.length}件 / 取得${spots.length}件`);
      return;
    }

    const clusters: Record<string, any[]> = {};

    visibleSpots.forEach((s: any) => {
      const lat = Number(s.lat);
      const lng = Number(s.lng);
      if (!lat || !lng) return;

      const point = map.project([lat, lng], zoom);
      const key = `${Math.floor(point.x / cellSize)}_${Math.floor(point.y / cellSize)}`;

      if (!clusters[key]) clusters[key] = [];
      clusters[key].push(s);
    });

    Object.values(clusters).forEach((group: any[]) => {
      if (group.length === 1) {
        addSpotMarker(L, group[0]);
        return;
      }

      const avgLat = group.reduce((sum, s) => sum + Number(s.lat), 0) / group.length;
      const avgLng = group.reduce((sum, s) => sum + Number(s.lng), 0) / group.length;

      const marker = L.marker([avgLat, avgLng], {
        icon: getClusterIcon(L, group.length),
      })
        .addTo(markerLayerRef.current)
        .bindPopup(`${group.length}件`);

      marker.on("click", () => {
        map.setView([avgLat, avgLng], Math.min(map.getZoom() + 2, 20));
      });
    });

    setMessage(`表示中：${visibleSpots.length}件 / 取得${spots.length}件`);
  }

  function addSpotMarker(L: any, s: any) {
    const lat = Number(s.lat);
    const lng = Number(s.lng);
    if (!lat || !lng) return;

    const marker = L.marker([lat, lng], {
      draggable: true,
      icon: getSpotIcon(L, s),
    })
      .addTo(markerLayerRef.current)
      .bindPopup(`${s.name || ""}<br>${s.id || ""}`);

    marker.on("click", () => {
      setSpot({
        id: String(s.id || ""),
        name: String(s.name || ""),
        kana: String(s.kana || ""),
        lat,
        lng,
        country: String(s.country || ""),
        prefecture: String(s.prefecture || ""),
        city: String(s.city || ""),
        area: String(s.area || ""),
        category: String(s.category || ""),
        mode: String(s.mode || ""),
        spotsImage: String(s.spotsImage || ""),
        description: String(s.description || ""),
        trivia: String(s.trivia || ""),
        characterIds: String(s.characterIds || ""),
      });

      selectedMarkerRef.current = marker;
      setPendingMove(null);
      setImageBase64("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    });

    marker.on("dragend", (e: any) => {
      const p = e.target.getLatLng();

      setPendingMove({
        lat: p.lat,
        lng: p.lng,
      });

      selectedMarkerRef.current = marker;
      setMessage("移動候補があります。「この位置に反映」を押すまで保存対象にはなりません。");
    });
  }

  function getSpotIcon(L: any, s: any) {
    let pinColor = "#9f2f25";
    let centerColor = "#ffffff";

    if (String(s.spotsImage || "").trim()) {
      centerColor = "#ffe96a";
    }

    if (String(s.description || "").includes("自動入力")) {
      pinColor = "#f3a6a6";
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
    });
  }

  function getClusterIcon(L: any, count: number) {
    return L.divIcon({
      html: `
        <svg width="42" height="56" viewBox="0 0 42 56">
          <path
            d="M21 0 C10 0 1 9 1 20 C1 36 21 56 21 56 C21 56 41 36 41 20 C41 9 32 0 21 0Z"
            fill="#9f2f25"
          />
          <circle cx="21" cy="20" r="10" fill="#ffffff" />
          <text
            x="21"
            y="24"
            text-anchor="middle"
            font-size="11"
            font-weight="bold"
            fill="#9f2f25"
          >${count}</text>
        </svg>
      `,
      className: "",
      iconSize: [42, 56],
      iconAnchor: [21, 56],
    });
  }


  async function placeSelectedMarker(lat: number, lng: number) {
    const L = await import("leaflet");

    // 既存ピンは絶対に動かさない。
    // 地図クリック用の新規ピンだけを作り直す。
    if (newMarkerRef.current) {
      mapRef.current.removeLayer(newMarkerRef.current);
    }

    newMarkerRef.current = L.marker([lat, lng], {
      draggable: true,
      icon: L.divIcon({
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
      }),
    }).addTo(mapRef.current);

    newMarkerRef.current.on("dragend", async (e: any) => {
      const p = e.target.getLatLng();
      const geo = await reverseGeocode(p.lat, p.lng);

      setSpot(prev => ({
        ...prev,
        lat: p.lat,
        lng: p.lng,
        country: geo.country,
        prefecture: geo.prefecture,
        city: geo.city,
        area: geo.area,
      }));
    });
  }

  async function reverseGeocode(lat: number, lng: number) {
    try {
      const url =
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ja`;

      const res = await fetch(url);
      const json = await res.json();
      const a = json.address || {};

      const displayParts = String(json.display_name || "")
        .split(",")
        .map((v: string) => v.trim());

      const prefectureFromDisplay =
        displayParts.find((v: string) => /都|道|府|県$/.test(v)) || "";

      const cityFromDisplay =
        displayParts.find((v: string) => /市|区|町|村$/.test(v)) || "";

      return {
        country: (a.country_code || "jp").toUpperCase(),

        prefecture:
          a.state ||
          a.province ||
          a.region ||
          prefectureFromDisplay ||
          "",

        city:
          a.city ||
          a.town ||
          a.village ||
          a.ward ||
          a.city_district ||
          a.county ||
          cityFromDisplay ||
          "",

        area:
          a.suburb ||
          a.neighbourhood ||
          a.quarter ||
          a.hamlet ||
          a.residential ||
          "",
      };
    } catch {
      return {
        country: "JP",
        prefecture: "",
        city: "",
        area: "",
      };
    }
  }

  async function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);
    setImageBase64(base64);
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(file);
    });
  }

  async function saveSpot() {
    setMessage("保存中...");

    const payloadSpot = {
      ...spot,
      id: spot.id === "新規" ? "" : spot.id,
      imageBase64,
    };

    console.log("保存データ", {
      ...payloadSpot,
      imageBase64: imageBase64 ? "画像あり" : "",
    });

    if (!payloadSpot.name && !payloadSpot.description && !payloadSpot.lat && !payloadSpot.lng) {
      setMessage("保存する内容が空です");
      return;
    }

    const res = await fetch("/api/admin/save-spot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pagePassword,
        spot: payloadSpot,
      }),
    });

    const json = await res.json();

    if (!json.ok) {
      setMessage(json.error || "保存失敗");
      return;
    }

    setMessage(`保存しました：${json.id}`);
    setImageBase64("");

    setSpot(prev => ({
      ...prev,
      id: json.id,
      spotsImage: json.spotsImage || prev.spotsImage || "",
    }));
await loadExistingSpots();
  }

  if (!pagePassword) {
    return (
      <main style={{ padding: 24 }}>
        <h1>TimeWalk 地点管理</h1>
        <p>管理パスワードを入力してください。</p>

        <input
          type="password"
          placeholder="管理パスワード"
          value={passwordInput}
          onChange={e => setPasswordInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") login();
          }}
          style={inputStyle}
        />

        <button
          type="button"
          onClick={login}
          style={{
            ...buttonStyle,
            cursor: "pointer",
            background: "#111",
            color: "#fff",
            border: "1px solid #111",
            borderRadius: 6
          }}
        >
          ログイン
        </button>
      </main>
    );
  }

  return (
    <main style={{
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) 420px",
      height: "100vh",
      width: "100vw",
    }}>
      <style>{`
        @media (max-width: 800px) {
          main {
            display: block !important;
            height: auto !important;
          }
          #map {
            width: 100vw !important;
            height: 60vh !important;
            min-height: 360px !important;
          }
          section {
            width: 100vw !important;
            height: auto !important;
            overflow-y: visible !important;
          }
        }
      `}</style>
      <div id="map" style={{ width: "100%", height: "100%", minHeight: 420 }} />

      <aside style={{ padding: 16, overflowY: "auto", borderLeft: "1px solid #ddd" }}>
        <h2>地点編集</h2>

        <label>ID</label>
        <input value={spot.id || "新規"} readOnly style={inputStyle} />

        <label>name</label>
        <input value={spot.name} onChange={e => setSpot({ ...spot, name: e.target.value })} style={inputStyle} />

        <label>kana</label>
        <input value={spot.kana || ""} onChange={e => setSpot({ ...spot, kana: e.target.value })} style={inputStyle} />

        <label>lat</label>
        <input value={spot.lat} readOnly style={inputStyle} />

        <label>lng</label>
        <input value={spot.lng} readOnly style={inputStyle} />

        <label>country</label>
        <input value={spot.country || ""} onChange={e => setSpot({ ...spot, country: e.target.value })} style={inputStyle} />

        <label>prefecture</label>
        <input value={spot.prefecture || ""} onChange={e => setSpot({ ...spot, prefecture: e.target.value })} style={inputStyle} />

        <label>city</label>
        <input value={spot.city || ""} onChange={e => setSpot({ ...spot, city: e.target.value })} style={inputStyle} />

        <label>area</label>
        <input value={spot.area || ""} onChange={e => setSpot({ ...spot, area: e.target.value })} style={inputStyle} />

        <label>category</label>
        <input value={spot.category || ""} onChange={e => setSpot({ ...spot, category: e.target.value })} style={inputStyle} />

        <label>mode</label>
        <input value={spot.mode || ""} onChange={e => setSpot({ ...spot, mode: e.target.value })} style={inputStyle} />

        <label>spotsImage</label>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageChange} style={inputStyle} />

        {spot.spotsImage && (
          <img src={spot.spotsImage} style={{ width: "100%", marginTop: 8, marginBottom: 8 }} />
        )}

        <label>description</label>
        <textarea value={spot.description || ""} onChange={e => setSpot({ ...spot, description: e.target.value })} style={textareaStyle} />

        <label>trivia</label>
        <textarea value={spot.trivia || ""} onChange={e => setSpot({ ...spot, trivia: e.target.value })} style={textareaStyle} />

        <label>characterIds</label>
        <input value={spot.characterIds || ""} onChange={e => setSpot({ ...spot, characterIds: e.target.value })} style={inputStyle} />

        <button onClick={saveSpot} style={buttonStyle}>
          保存
        </button>

        <p>{message}</p>
      </aside>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginBottom: 10,
  padding: 8,
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  height: 100,
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  marginTop: 12,
  fontWeight: "bold",
};
