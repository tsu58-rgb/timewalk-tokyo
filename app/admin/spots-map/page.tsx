"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import { clusterSpots } from "../../components/map/clusterSpots";
import {
  getClusterMarkerIcon,
  getCurrentLocationMarkerIcon,
  getNewSpotMarkerIcon,
  getSpotMarkerIcon,
} from "../../components/map/mapIcons";

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
  status?: string;
};

type ReviewItem = { spot: Spot; reasons: string[] };

const CHARACTERS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub?gid=1745190060&single=true&output=csv";

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
  status: "",
};

function normalizeSpot(value: any): Spot {
  return {
    id: String(value.id || ""),
    name: String(value.name || ""),
    kana: String(value.kana || ""),
    lat: Number(value.lat),
    lng: Number(value.lng),
    country: String(value.country || ""),
    prefecture: String(value.prefecture || ""),
    city: String(value.city || ""),
    area: String(value.area || ""),
    category: String(value.category || ""),
    mode: String(value.mode || ""),
    spotsImage: String(value.spotsImage || ""),
    description: String(value.description || ""),
    trivia: String(value.trivia || ""),
    characterIds: String(value.characterIds || ""),
    status: String(value.status || ""),
  };
}

function reviewReasons(spot: Spot, characterIds: Set<string>) {
  const reasons: string[] = [];
  if (!String(spot.name || "").trim()) reasons.push("名前なし");
  if (!Number.isFinite(Number(spot.lat)) || !Number.isFinite(Number(spot.lng))) reasons.push("座標不正");
  if (!String(spot.description || "").trim()) reasons.push("説明なし");
  if (String(spot.description || "").trim().length > 0 && String(spot.description || "").trim().length <= 50) reasons.push("説明50文字以下");
  if (!String(spot.spotsImage || "").trim()) reasons.push("画像なし");
  if (!String(spot.category || "").trim()) reasons.push("カテゴリなし");
  const missing = String(spot.characterIds || "")
    .split("・")
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((id) => !characterIds.has(id));
  if (missing.length) reasons.push(`人物ID不一致: ${missing.join("・")}`);
  if (spot.status && spot.status.toLowerCase() !== "ready") reasons.push(`status=${spot.status}`);
  return reasons;
}

export default function AdminSpotsMapPage() {
  const mapRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const newMarkerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const savingRef = useRef(false);
  const selectionTokenRef = useRef(0);

  const [passwordInput, setPasswordInput] = useState("");
  const [pagePassword, setPagePassword] = useState("");
  const [spot, setSpot] = useState<Spot>(emptySpot);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [characterIds, setCharacterIds] = useState<Set<string>>(new Set());
  const [imageBase64, setImageBase64] = useState("");
  const [message, setMessage] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "review">("map");
  const [pendingMove, setPendingMove] = useState<{ lat: number; lng: number } | null>(null);

  const reviewItems: ReviewItem[] = useMemo(
    () => spots.map((item) => ({ spot: item, reasons: reviewReasons(item, characterIds) })).filter((item) => item.reasons.length),
    [spots, characterIds]
  );

  useEffect(() => {
    const saved = localStorage.getItem("timewalkAdminPassword");
    if (saved) setPagePassword(saved);
  }, []);

  useEffect(() => {
    if (!pagePassword) return;
    initMap();
    loadCharacterIds();
  }, [pagePassword]);

  function selectSpot(nextSpot: Spot) {
    if (savingRef.current) return;
    selectionTokenRef.current += 1;
    setSpot(normalizeSpot(nextSpot));
    setPendingMove(null);
    setImageBase64("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function loadCharacterIds() {
    try {
      const text = await fetch(CHARACTERS_URL).then((response) => response.text());
      const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
      setCharacterIds(new Set(parsed.data.map((row) => String(row.characterId || "").trim()).filter(Boolean)));
    } catch {
      setCharacterIds(new Set());
    }
  }

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

    map.on("click", async (event: any) => {
      if (savingRef.current) return;
      const requestToken = ++selectionTokenRef.current;
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      const address = await reverseGeocode(lat, lng);
      if (savingRef.current || requestToken !== selectionTokenRef.current) return;

      setSpot({ ...emptySpot, lat, lng, ...address });
      setPendingMove(null);
      setImageBase64("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await placeNewMarker(lat, lng);
    });

    map.on("zoomend", () => {
      if (!savingRef.current) loadExistingSpots();
    });
    map.on("moveend", () => {
      if (!savingRef.current) loadExistingSpots();
    });

    await flyToCurrentLocation(false);
    await loadExistingSpots();
  }

  async function loadExistingSpots(force = false) {
    if ((!force && savingRef.current) || !pagePassword || !mapRef.current) return;
    const bounds = mapRef.current.getBounds().pad(0.2);
    const response = await fetch("/api/admin/spots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pagePassword,
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      }),
    });
    const json = await response.json();
    if (!json.ok) {
      setMessage(json.error || "取得失敗");
      return;
    }
    const loaded = (json.spots || []).map(normalizeSpot);
    setSpots(loaded);
    await renderSpots(loaded);
    setMessage(`表示中：${loaded.length}件 / 全${json.total || loaded.length}件`);
  }

  async function renderSpots(target: Spot[]) {
    const L = await import("leaflet");
    if (!mapRef.current || !markerLayerRef.current) return;
    markerLayerRef.current.clearLayers();
    const map = mapRef.current;
    const visible = target.filter(
      (item) =>
        Number.isFinite(item.lat) &&
        Number.isFinite(item.lng) &&
        map.getBounds().pad(0.2).contains([item.lat, item.lng])
    );

    clusterSpots(visible, map, map.getZoom()).forEach((item) => {
      if (item.type === "spot") {
        const marker = L.marker([item.spot.lat, item.spot.lng], {
          draggable: true,
          icon: getSpotMarkerIcon(L, item.spot) as any,
        })
          .addTo(markerLayerRef.current)
          .bindPopup(`${item.spot.name}<br>${item.spot.id || ""}`);

        marker.on("click", () => selectSpot(item.spot));
        marker.on("dragend", (event: any) => {
          if (savingRef.current) {
            loadExistingSpots(true);
            return;
          }
          const point = event.target.getLatLng();
          selectSpot(item.spot);
          setPendingMove({ lat: point.lat, lng: point.lng });
        });
        return;
      }

      const marker = L.marker([item.lat, item.lng], {
        icon: getClusterMarkerIcon(L, item.count) as any,
      })
        .addTo(markerLayerRef.current)
        .bindPopup(`${item.count}件`);
      marker.on("click", () => {
        if (savingRef.current) return;
        map.setView([item.lat, item.lng], Math.min(map.getZoom() + 1, map.getMaxZoom()));
      });
    });
  }

  async function placeNewMarker(lat: number, lng: number) {
    const L = await import("leaflet");
    if (newMarkerRef.current) mapRef.current.removeLayer(newMarkerRef.current);
    newMarkerRef.current = L.marker([lat, lng], {
      draggable: true,
      icon: getNewSpotMarkerIcon(L) as any,
    }).addTo(mapRef.current);
    newMarkerRef.current.on("dragend", async (event: any) => {
      if (savingRef.current) return;
      const requestToken = ++selectionTokenRef.current;
      const point = event.target.getLatLng();
      const address = await reverseGeocode(point.lat, point.lng);
      if (savingRef.current || requestToken !== selectionTokenRef.current) return;
      setSpot((current) => ({ ...current, lat: point.lat, lng: point.lng, ...address }));
    });
  }

  async function reverseGeocode(lat: number, lng: number) {
    try {
      const json = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ja`
      ).then((response) => response.json());
      const address = json.address || {};
      return {
        country: (address.country_code || "jp").toUpperCase(),
        prefecture: address.state || address.province || "",
        city: address.city || address.town || address.village || address.ward || "",
        area: address.suburb || address.neighbourhood || address.quarter || "",
      };
    } catch {
      return { country: "JP", prefecture: "", city: "", area: "" };
    }
  }

  async function searchPlace() {
    if (savingRef.current) return;
    const keyword = searchKeyword.trim();
    if (!keyword) return;
    const json = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=ja&q=${encodeURIComponent(keyword)}`
    ).then((response) => response.json());
    if (!Array.isArray(json) || !json[0]) {
      setMessage("地点が見つかりませんでした。");
      return;
    }
    mapRef.current.setView([Number(json[0].lat), Number(json[0].lon)], 16);
  }

  async function flyToCurrentLocation(showMessage = true) {
    if (savingRef.current || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (savingRef.current) return;
        const L = await import("leaflet");
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        mapRef.current?.setView([lat, lng], 16);
        L.marker([lat, lng], {
          icon: getCurrentLocationMarkerIcon(L) as any,
          interactive: false,
          zIndexOffset: 1000,
        }).addTo(mapRef.current);
        if (showMessage) setMessage("現在地に移動しました。");
      },
      () => showMessage && setMessage("現在地を取得できませんでした。"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }

  async function saveSpot() {
    if (savingRef.current) return;

    const savingSpot = {
      ...spot,
      id: spot.id && spot.id !== "新規" ? spot.id : "",
      imageBase64,
    };

    if (!savingSpot.name && !savingSpot.description && !savingSpot.lat && !savingSpot.lng) {
      setMessage("保存する内容が空です");
      return;
    }

    savingRef.current = true;
    setIsSaving(true);
    setMessage(`保存中：${savingSpot.id || "新規スポット"}。完了まで他の地点は選択できません。`);

    try {
      const response = await fetch("/api/admin/save-spot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spot: savingSpot }),
      });
      const json = await response.json();
      if (!json.ok) {
        setMessage(json.error || "保存失敗");
        return;
      }

      const { imageBase64: _unusedImageBase64, ...savedSpot } = savingSpot;
      setSpot({
        ...savedSpot,
        id: json.id,
        spotsImage: json.spotsImage || savedSpot.spotsImage || "",
      });
      setImageBase64("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage(`保存しました：${json.id}`);
      await loadExistingSpots(true);
    } catch (error) {
      console.error(error);
      setMessage("保存に失敗しました。");
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }

  if (!pagePassword) {
    return (
      <main style={{ padding: 24, color: "#111", background: "#fff" }}>
        <h1>TimeWalk 地点管理</h1>
        <p>管理パスワードを入力してください。</p>
        <input
          type="password"
          value={passwordInput}
          onChange={(event) => setPasswordInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              localStorage.setItem("timewalkAdminPassword", passwordInput);
              setPagePassword(passwordInput);
            }
          }}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => {
            localStorage.setItem("timewalkAdminPassword", passwordInput);
            setPagePassword(passwordInput);
          }}
          style={buttonStyle}
        >
          ログイン
        </button>
      </main>
    );
  }

  const fields: Array<[keyof Spot, string]> = [
    ["name", "name"],
    ["kana", "kana"],
    ["country", "country"],
    ["prefecture", "prefecture"],
    ["city", "city"],
    ["area", "area"],
    ["category", "category"],
    ["mode", "mode"],
    ["characterIds", "characterIds"],
  ];

  return (
    <main style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 420px", height: "100vh", width: "100vw", background: "#fff", color: "#111" }}>
      {isSaving && (
        <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(255,255,255,.72)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "wait" }}>
          <div style={{ padding: "18px 24px", border: "2px solid #111", borderRadius: 10, background: "#fff", color: "#111", fontWeight: 800, boxShadow: "0 6px 24px rgba(0,0,0,.25)" }}>
            保存中です。完了まで他の地点は選択できません。
          </div>
        </div>
      )}
      <style>{`.spots-admin-form,.spots-admin-form label,.spots-admin-form h2,.spots-admin-form p{color:#111!important}.spots-admin-form input,.spots-admin-form textarea{color:#111!important;background:#fff!important;border-color:#888!important}@media(max-width:800px){main{display:block!important;height:auto!important}#map,#review-list{width:100vw!important;height:60vh!important}.spots-admin-form{width:100vw!important}}`}</style>
      <div style={{ position: "relative", minHeight: 420 }}>
        <div style={{ position: "absolute", top: 12, left: 64, right: 12, zIndex: 1000, display: "flex", gap: 8, pointerEvents: "none" }}>
          <button type="button" onClick={() => !savingRef.current && setViewMode("map")} style={{ ...topButtonStyle, background: viewMode === "map" ? "#111" : "#fff", color: viewMode === "map" ? "#fff" : "#111" }}>地図で探す</button>
          <button type="button" onClick={() => !savingRef.current && setViewMode("review")} style={{ ...topButtonStyle, background: viewMode === "review" ? "#b33a2f" : "#fff", color: viewMode === "review" ? "#fff" : "#111" }}>要修正一覧 {reviewItems.length}件</button>
          {viewMode === "map" && (
            <>
              <input value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} onKeyDown={(event) => event.key === "Enter" && searchPlace()} placeholder="地点を検索" style={{ ...inputStyle, flex: 1, marginBottom: 0, pointerEvents: "auto" }} />
              <button type="button" onClick={searchPlace} style={topButtonStyle}>検索</button>
              <button type="button" onClick={() => flyToCurrentLocation(true)} style={topButtonStyle}>現在地</button>
            </>
          )}
        </div>
        <div id="map" style={{ display: viewMode === "map" ? "block" : "none", width: "100%", height: "100%", minHeight: 420 }} />
        {viewMode === "review" && (
          <div id="review-list" style={{ height: "100%", overflowY: "auto", padding: "76px 16px 16px", background: "#f5f5f5" }}>
            {reviewItems.map((item) => (
              <button
                key={item.spot.id || item.spot.name}
                type="button"
                onClick={() => {
                  if (savingRef.current) return;
                  selectSpot(item.spot);
                  setViewMode("map");
                  mapRef.current?.setView([item.spot.lat, item.spot.lng], 16);
                }}
                style={{ display: "block", width: "100%", textAlign: "left", marginBottom: 10, padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", borderRadius: 8 }}
              >
                <strong>{item.spot.name || "名称未入力"}</strong>
                <div style={{ marginTop: 6, fontSize: 12 }}>{item.reasons.join(" / ")}</div>
              </button>
            ))}
          </div>
        )}
      </div>
      <aside className="spots-admin-form" style={{ padding: 16, overflowY: "auto", borderLeft: "1px solid #ddd", background: "#fff", color: "#111" }}>
        <h2>地点編集</h2>
        <label>ID</label>
        <input value={spot.id || "新規"} readOnly style={inputStyle} />
        {fields.map(([key, label]) => (
          <div key={String(key)}>
            <label>{label}</label>
            <input value={String(spot[key] || "")} onChange={(event) => setSpot({ ...spot, [key]: event.target.value })} style={inputStyle} />
          </div>
        ))}
        <label>lat</label>
        <input value={spot.lat} readOnly style={inputStyle} />
        <label>lng</label>
        <input value={spot.lng} readOnly style={inputStyle} />
        {pendingMove && (
          <div style={{ padding: 10, marginBottom: 10, border: "2px solid #b33a2f", background: "#fff7f5", color: "#111" }}>
            <p>移動候補: {pendingMove.lat}, {pendingMove.lng}</p>
            <button
              type="button"
              onClick={async () => {
                if (savingRef.current) return;
                const address = await reverseGeocode(pendingMove.lat, pendingMove.lng);
                setSpot({ ...spot, ...pendingMove, ...address });
                setPendingMove(null);
              }}
              style={buttonStyle}
            >
              この位置に反映
            </button>
          </div>
        )}
        <label>spotsImage</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => setImageBase64(String(reader.result));
            reader.readAsDataURL(file);
          }}
          style={inputStyle}
        />
        {spot.spotsImage && <img src={spot.spotsImage} alt="" style={{ width: "100%", marginBottom: 10 }} />}
        <label>description</label>
        <textarea value={spot.description || ""} onChange={(event) => setSpot({ ...spot, description: event.target.value })} style={textareaStyle} />
        <label>trivia</label>
        <textarea value={spot.trivia || ""} onChange={(event) => setSpot({ ...spot, trivia: event.target.value })} style={textareaStyle} />
        <button type="button" onClick={saveSpot} disabled={isSaving} style={buttonStyle}>{isSaving ? "保存中..." : "保存"}</button>
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
  background: "#fff",
  color: "#111",
  border: "1px solid #888",
  borderRadius: 6,
};
const textareaStyle: React.CSSProperties = { ...inputStyle, height: 100, resize: "vertical" };
const buttonStyle: React.CSSProperties = { width: "100%", padding: 12, marginTop: 8, fontWeight: "bold", background: "#fff", color: "#111", border: "1px solid #111", borderRadius: 6, cursor: "pointer" };
const topButtonStyle: React.CSSProperties = { padding: "10px 12px", borderRadius: 6, border: "1px solid #111", background: "#111", color: "#fff", fontWeight: "bold", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0,0,0,.2)", pointerEvents: "auto", cursor: "pointer" };
