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
  const currentLocationMarkerRef = useRef<any>(null);
  const currentAccuracyCircleRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isSavingRef = useRef(false);

  const [passwordInput, setPasswordInput] = useState("");
  const [pagePassword, setPagePassword] = useState("");
  const [spot, setSpot] = useState<Spot>(emptySpot);
  const [imageBase64, setImageBase64] = useState("");
  const [message, setMessage] = useState("");
  const [pendingMove, setPendingMove] = useState<{ lat: number; lng: number } | null>(null);
  const [allSpots, setAllSpots] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

    await flyToCurrentLocation(false);

    map.on("click", async (e: any) => {
      if (isSavingRef.current) {
        return;
      }

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

      await placeSelectedMarker(lat, lng);
    });

    map.on("zoomend", () => {
      if (isSavingRef.current) return;
      loadExistingSpots();
    });

    map.on("moveend", () => {
      if (isSavingRef.current) return;
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
        if (isSavingRef.current) return;
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
      if (isSavingRef.current) {
        return;
      }

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
      if (isSavingRef.current) {
        loadExistingSpots();
        return;
      }

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

    const desc = String(s.description || "").trim();

    if (
      desc.includes("自動入力") ||
      desc === "" ||
      desc.length <= 50
    ) {
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

  function getCurrentLocationIcon(L: any) {
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

  async function renderCurrentLocation(lat: number, lng: number, accuracy?: number) {
    const L = await import("leaflet");
    const map = mapRef.current;
    if (!map) return;

    if (currentLocationMarkerRef.current) {
      map.removeLayer(currentLocationMarkerRef.current);
    }

    if (currentAccuracyCircleRef.current) {
      map.removeLayer(currentAccuracyCircleRef.current);
    }

    currentLocationMarkerRef.current = L.marker([lat, lng], {
      icon: getCurrentLocationIcon(L),
      interactive: false,
      zIndexOffset: 1000,
    }).addTo(map);

    if (accuracy) {
      currentAccuracyCircleRef.current = L.circle([lat, lng], {
        radius: accuracy,
        color: "#1a73e8",
        weight: 1,
        fillColor: "#1a73e8",
        fillOpacity: 0.12,
        interactive: false,
      }).addTo(map);
    }
  }

  async function flyToCurrentLocation(showMessage = true): Promise<boolean> {
    if (!navigator.geolocation) {
      if (showMessage) setMessage("このブラウザでは現在地を取得できません。");
      return false;
    }

    if (showMessage) setMessage("現在地を取得中...");

    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          const map = mapRef.current;
          if (!map) {
            resolve(false);
            return;
          }

          map.setView([lat, lng], Math.max(map.getZoom(), 16));

          await renderCurrentLocation(lat, lng, accuracy);

          if (showMessage) {
            setMessage("現在地に移動しました。");
          }

          resolve(true);
        },
        error => {
          console.warn(error);

          if (showMessage) {
            setMessage("現在地を取得できませんでした。ブラウザの位置情報許可を確認してください。");
          }

          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        }
      );
    });
  }

  async function searchPlace() {
    if (isSavingRef.current) return;

    const keyword = searchKeyword.trim();
    if (!keyword) {
      setMessage("検索する地点名を入力してください。");
      return;
    }

    setMessage("地点を検索中...");

    try {
      const url =
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=ja&q=${encodeURIComponent(keyword)}`;

      const res = await fetch(url);
      const json = await res.json();

      if (!Array.isArray(json) || json.length === 0) {
        setMessage("地点が見つかりませんでした。");
        return;
      }

      const lat = Number(json[0].lat);
      const lng = Number(json[0].lon);

      if (!lat || !lng) {
        setMessage("地点の緯度経度を取得できませんでした。");
        return;
      }

      mapRef.current.setView([lat, lng], 16);
      await loadExistingSpots();

      setMessage(`検索地点に移動しました：${keyword}`);
    } catch (e) {
      console.error(e);
      setMessage("地点検索に失敗しました。");
    }
  }

  async function placeSelectedMarker(lat: number, lng: number) {
    const L = await import("leaflet");

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
      if (isSavingRef.current) {
        return;
      }

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
    if (isSavingRef.current) return;

    isSavingRef.current = true;
    setIsSaving(true);
    setMessage("保存中...");

    const savingSpot = {
      ...spot,
      id: spot.id === "新規" ? "" : spot.id,
      imageBase64,
    };

    console.log("保存データ", {
      ...savingSpot,
      imageBase64: imageBase64 ? "画像あり" : "",
    });

    if (!savingSpot.name && !savingSpot.description && !savingSpot.lat && !savingSpot.lng) {
      setMessage("保存する内容が空です");
      isSavingRef.current = false;
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/save-spot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pagePassword,
          spot: savingSpot,
        }),
      });

      const json = await res.json();

      if (!json.ok) {
        setMessage(json.error || "保存失敗");
        return;
      }

      setMessage(`保存しました：${json.id}`);
      setImageBase64("");

      const { imageBase64: _unusedImageBase64, ...savedSpot } = savingSpot;

      setSpot({
        ...savedSpot,
        id: json.id,
        spotsImage: json.spotsImage || savedSpot.spotsImage || "",
      });

      await loadExistingSpots();
    } catch (e) {
      console.error(e);
      setMessage("保存に失敗しました。");
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
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
            borderRadius: 6,
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

          main > div {
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

      <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 420 }}>
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 64,
            right: 12,
            zIndex: 1000,
            display: "flex",
            gap: 8,
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <input
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") searchPlace();
            }}
            placeholder="地点を検索"
            disabled={isSaving}
            style={{
              flex: 1,
              minWidth: 0,
              padding: "10px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              background: "#fff",
              color: "#111",
              fontSize: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              pointerEvents: "auto",
            }}
          />

          <button
            type="button"
            onClick={searchPlace}
            disabled={isSaving}
            style={{
              padding: "10px 12px",
              borderRadius: 6,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              pointerEvents: "auto",
            }}
          >
            検索
          </button>

          <button
            type="button"
            onClick={() => {
              if (isSavingRef.current) return;
              flyToCurrentLocation(true);
            }}
            disabled={isSaving}
            style={{
              padding: "10px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              background: "#fff",
              color: "#111",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              pointerEvents: "auto",
            }}
          >
            現在地
          </button>
        </div>

        <div id="map" style={{ width: "100%", height: "100%", minHeight: 420 }} />

        {isSaving && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2000,
              background: "rgba(255, 255, 255, 0.15)",
              cursor: "wait",
            }}
          />
        )}
      </div>

      <aside style={{ padding: 16, overflowY: "auto", borderLeft: "1px solid #ddd" }}>
        <h2>地点編集</h2>

        <label>ID</label>
        <input value={spot.id || "新規"} readOnly style={inputStyle} />

        <label>name</label>
        <input value={spot.name} onChange={e => setSpot({ ...spot, name: e.target.value })} style={editableInputStyle} />

        <label>kana</label>
        <input value={spot.kana || ""} onChange={e => setSpot({ ...spot, kana: e.target.value })} style={editableInputStyle} />

        {pendingMove && (
          <div style={{
            border: "2px solid #b33a2f",
            padding: 12,
            margin: "12px 0",
            background: "#fff7f5",
          }}>
            <p style={{ margin: "0 0 8px", fontWeight: "bold" }}>移動候補</p>
            <p style={{ margin: "0 0 4px" }}>lat: {pendingMove.lat}</p>
            <p style={{ margin: "0 0 8px" }}>lng: {pendingMove.lng}</p>

            <button
              type="button"
              onClick={async () => {
                if (isSavingRef.current) return;

                const geo = await reverseGeocode(pendingMove.lat, pendingMove.lng);

                setSpot(prev => ({
                  ...prev,
                  lat: pendingMove.lat,
                  lng: pendingMove.lng,
                  country: geo.country || prev.country,
                  prefecture: geo.prefecture || prev.prefecture,
                  city: geo.city || prev.city,
                  area: geo.area || prev.area,
                }));

                setPendingMove(null);
                setMessage("移動候補をフォームに反映しました。保存ボタンを押すと確定します。");
              }}
              style={{
                ...buttonStyle,
                background: "#b33a2f",
                color: "#fff",
                border: "1px solid #b33a2f",
              }}
            >
              この位置に反映
            </button>

            <button
              type="button"
              onClick={() => {
                if (isSavingRef.current) return;

                setPendingMove(null);
                loadExistingSpots();
                setMessage("移動候補を取り消しました。");
              }}
              style={{
                ...buttonStyle,
                background: "#eee",
                color: "#111",
                border: "1px solid #999",
                marginTop: 8,
              }}
            >
              取り消し
            </button>
          </div>
        )}

        <label>lat</label>
        <input value={spot.lat} readOnly style={inputStyle} />

        <label>lng</label>
        <input value={spot.lng} readOnly style={inputStyle} />

        <label>country</label>
        <input value={spot.country || ""} onChange={e => setSpot({ ...spot, country: e.target.value })} style={editableInputStyle} />

        <label>prefecture</label>
        <input value={spot.prefecture || ""} onChange={e => setSpot({ ...spot, prefecture: e.target.value })} style={editableInputStyle} />

        <label>city</label>
        <input value={spot.city || ""} onChange={e => setSpot({ ...spot, city: e.target.value })} style={editableInputStyle} />

        <label>area</label>
        <input value={spot.area || ""} onChange={e => setSpot({ ...spot, area: e.target.value })} style={editableInputStyle} />

        <label>category</label>
        <input value={spot.category || ""} onChange={e => setSpot({ ...spot, category: e.target.value })} style={editableInputStyle} />

        <label>mode</label>
        <input value={spot.mode || ""} onChange={e => setSpot({ ...spot, mode: e.target.value })} style={editableInputStyle} />

        <label>spotsImage</label>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageChange} style={editableInputStyle} />

        {spot.spotsImage && (
          <img src={spot.spotsImage} style={{ width: "100%", marginTop: 8, marginBottom: 8 }} />
        )}

        <label>description</label>
        <textarea value={spot.description || ""} onChange={e => setSpot({ ...spot, description: e.target.value })} style={editableTextareaStyle} />

        <label>trivia</label>
        <textarea value={spot.trivia || ""} onChange={e => setSpot({ ...spot, trivia: e.target.value })} style={editableTextareaStyle} />

        <label>characterIds</label>
        <input value={spot.characterIds || ""} onChange={e => setSpot({ ...spot, characterIds: e.target.value })} style={editableInputStyle} />

        <button
          onClick={saveSpot}
          disabled={isSaving}
          style={{
            ...buttonStyle,
            opacity: isSaving ? 0.6 : 1,
            cursor: isSaving ? "wait" : "pointer",
          }}
        >
          {isSaving ? "保存中..." : "保存"}
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

const editableInputStyle: React.CSSProperties = {
  ...inputStyle,
  background: "#ffffff",
  color: "#111111",
  border: "2px solid #ffffff",
  borderRadius: 6,
};

const editableTextareaStyle: React.CSSProperties = {
  ...editableInputStyle,
  height: 100,
  resize: "vertical",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  marginTop: 12,
  fontWeight: "bold",
};