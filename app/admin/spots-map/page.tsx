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

type ReviewItem = {
  spot: Spot;
  reasons: string[];
};

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

function splitCharacterIds(value: string) {
  return String(value || "")
    .split("・")
    .map((v) => v.trim())
    .filter(Boolean);
}

function getReviewReasons(s: Spot, characterIdSet: Set<string>) {
  const reasons: string[] = [];
  const name = String(s.name || "").trim();
  const description = String(s.description || "").trim();
  const image = String(s.spotsImage || "").trim();
  const category = String(s.category || "").trim();
  const characterIds = splitCharacterIds(String(s.characterIds || ""));
  const status = String(s.status || "").trim();
  const lat = Number(s.lat);
  const lng = Number(s.lng);

  if (!name) reasons.push("名前なし");
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) reasons.push("座標不正");
  if (!description) reasons.push("説明なし");
  if (description && description.length <= 50) reasons.push("説明50文字以下");
  if (description.includes("自動入力")) reasons.push("自動入力あり");
  if (!image) reasons.push("画像なし");
  if (!category) reasons.push("カテゴリなし");

  const missingCharacterIds = characterIds.filter((characterId) => !characterIdSet.has(characterId));
  if (missingCharacterIds.length > 0) {
    reasons.push(`人物ID不一致: ${missingCharacterIds.join("・")}`);
  }

  if (status && status.toLowerCase() !== "ready") reasons.push(`status=${status}`);

  return reasons;
}

function normalizeSpot(s: any): Spot {
  return {
    id: String(s.id || ""),
    name: String(s.name || ""),
    kana: String(s.kana || ""),
    lat: Number(s.lat),
    lng: Number(s.lng),
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
    status: String(s.status || ""),
  };
}

export default function AdminSpotsMapPage() {
  const mapRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const allSpotsRef = useRef<Spot[]>([]);
  const selectedMarkerRef = useRef<any>(null);
  const newMarkerRef = useRef<any>(null);
  const currentLocationMarkerRef = useRef<any>(null);
  const currentAccuracyCircleRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isSavingRef = useRef(false);

  const [passwordInput, setPasswordInput] = useState("");
  const [pagePassword, setPagePassword] = useState("");
  const [spot, setSpot] = useState<Spot>(emptySpot);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [characterIds, setCharacterIds] = useState<Set<string>>(new Set());
  const [imageBase64, setImageBase64] = useState("");
  const [message, setMessage] = useState("");
  const [pendingMove, setPendingMove] = useState<{ lat: number; lng: number } | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "review">("map");

  const reviewItems: ReviewItem[] = useMemo(
    () =>
      spots
        .map((s) => ({ spot: s, reasons: getReviewReasons(s, characterIds) }))
        .filter((item) => item.reasons.length > 0),
    [spots, characterIds]
  );

  function login() {
    if (!passwordInput) return;

    localStorage.setItem("timewalkAdminPassword", passwordInput);
    setPagePassword(passwordInput);
  }

  useEffect(() => {
    const savedPassword = localStorage.getItem("timewalkAdminPassword");

    if (savedPassword) {
      setPagePassword(savedPassword);
    }
  }, []);

  useEffect(() => {
    if (!pagePassword) return;
    initMap();
    loadCharacterIds();
  }, [pagePassword]);

  async function loadCharacterIds() {
    try {
      const text = await fetch(CHARACTERS_URL).then((res) => res.text());
      const parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      });

      const ids = new Set(
        (parsed.data as any[])
          .map((row) => String(row.characterId || "").trim())
          .filter(Boolean)
      );

      setCharacterIds(ids);
    } catch (e) {
      console.error(e);
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

    await flyToCurrentLocation(false);

    map.on("click", async (e: any) => {
      if (isSavingRef.current) return;

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
    });
  }

  async function loadCharacterIdsDummy() {}

  async function flyToCurrentLocation(_showMessage = false) {}
  async function searchPlace() {}
  async function loadExistingSpots() {}
  function selectSpot(_spot: Spot, _fly = true) {}

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
    return new Promise((resolve) => {
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
      id: spot.id && spot.id !== "新規" ? spot.id : "",
      imageBase64,
    };

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
      <main style={{ padding: 24, color: "#111", background: "#fff" }}>
        <h1>TimeWalk 地点管理</h1>
        <p>管理パスワードを入力してください。</p>

        <input
          type="password"
          placeholder="管理パスワード"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          onKeyDown={(e) => {
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
    <main
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 420px",
        height: "100vh",
        width: "100vw",
        color: "#111",
        background: "#fff",
      }}
    >
      <style>{`
        @media (max-width: 800px) {
          main {
            display: block !important;
            height: auto !important;
          }
          #map,
          #review-list {
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
        .spots-admin-form,
        .spots-admin-form label,
        .spots-admin-form h2,
        .spots-admin-form p {
          color: #111 !important;
        }
        .spots-admin-form input,
        .spots-admin-form textarea,
        .spots-admin-form select {
          color: #111 !important;
          background: #fff !important;
          border-color: #999 !important;
        }
      `}</style>

      <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 420 }}>
        <div id="map" style={{ width: "100%", height: "100%", minHeight: 420 }} />
      </div>

      <aside
        className="spots-admin-form"
        style={{
          padding: 16,
          overflowY: "auto",
          borderLeft: "1px solid #ddd",
          background: "#fff",
          color: "#111",
        }}
      >
        <h2>地点編集</h2>

        <label>ID</label>
        <input value={spot.id || "新規"} readOnly style={inputStyle} />

        <label>name</label>
        <input value={spot.name} onChange={(e) => setSpot({ ...spot, name: e.target.value })} style={editableInputStyle} />

        <label>kana</label>
        <input value={spot.kana || ""} onChange={(e) => setSpot({ ...spot, kana: e.target.value })} style={editableInputStyle} />

        <label>lat</label>
        <input value={spot.lat} readOnly style={inputStyle} />

        <label>lng</label>
        <input value={spot.lng} readOnly style={inputStyle} />

        <label>country</label>
        <input value={spot.country || ""} onChange={(e) => setSpot({ ...spot, country: e.target.value })} style={editableInputStyle} />

        <label>prefecture</label>
        <input value={spot.prefecture || ""} onChange={(e) => setSpot({ ...spot, prefecture: e.target.value })} style={editableInputStyle} />

        <label>city</label>
        <input value={spot.city || ""} onChange={(e) => setSpot({ ...spot, city: e.target.value })} style={editableInputStyle} />

        <label>area</label>
        <input value={spot.area || ""} onChange={(e) => setSpot({ ...spot, area: e.target.value })} style={editableInputStyle} />

        <label>category</label>
        <input value={spot.category || ""} onChange={(e) => setSpot({ ...spot, category: e.target.value })} style={editableInputStyle} />

        <label>mode</label>
        <input value={spot.mode || ""} onChange={(e) => setSpot({ ...spot, mode: e.target.value })} style={editableInputStyle} />

        <label>spotsImage</label>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageChange} style={editableInputStyle} />

        {spot.spotsImage && (
          <img src={spot.spotsImage} style={{ width: "100%", marginTop: 8, marginBottom: 8 }} />
        )}

        <label>description</label>
        <textarea value={spot.description || ""} onChange={(e) => setSpot({ ...spot, description: e.target.value })} style={editableTextareaStyle} />

        <label>trivia</label>
        <textarea value={spot.trivia || ""} onChange={(e) => setSpot({ ...spot, trivia: e.target.value })} style={editableTextareaStyle} />

        <label>characterIds</label>
        <input value={spot.characterIds || ""} onChange={(e) => setSpot({ ...spot, characterIds: e.target.value })} style={editableInputStyle} />

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
  background: "#fff",
  color: "#111",
  border: "1px solid #999",
  borderRadius: 6,
};

const editableInputStyle: React.CSSProperties = {
  ...inputStyle,
  background: "#fff",
  color: "#111",
  border: "1px solid #777",
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
  color: "#111",
};

const topButtonStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  fontWeight: "bold",
  whiteSpace: "nowrap",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  pointerEvents: "auto",
  cursor: "pointer",
};
