"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";

import { clusterSpots } from "../../components/map/clusterSpots";
import {
  getClusterMarkerIcon,
  getCurrentLocationMarkerIcon,
  getNewSpotMarkerIcon,
  getSpotMarkerIcon,
} from "../../components/map/mapIcons";

type SeichiSpot = {
  id?: string;
  workId: string;
  name: string;
  kana?: string;
  lat: number;
  lng: number;
  country?: string;
  prefecture?: string;
  city?: string;
  area?: string;
  spotsImage?: string;
  description?: string;
  status?: string;
};

type Work = {
  workId: string;
  workTitle: string;
};

const emptySpot: SeichiSpot = {
  workId: "",
  name: "",
  kana: "",
  lat: 35.681236,
  lng: 139.767125,
  country: "JP",
  prefecture: "",
  city: "",
  area: "",
  spotsImage: "",
  description: "",
  status: "ready",
};

function normalizeSpot(value: any): SeichiSpot {
  return {
    id: String(value.id || ""),
    workId: String(value.workId || ""),
    name: String(value.name || ""),
    kana: String(value.kana || ""),
    lat: Number(value.lat),
    lng: Number(value.lng),
    country: String(value.country || ""),
    prefecture: String(value.prefecture || ""),
    city: String(value.city || ""),
    area: String(value.area || ""),
    spotsImage: String(value.spotsImage || ""),
    description: String(value.description || ""),
    status: String(value.status || "ready"),
  };
}

export default function AdminSeichiMapPage() {
  const mapRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const newMarkerRef = useRef<any>(null);
  const currentLocationRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const savingRef = useRef(false);

  const [passwordInput, setPasswordInput] = useState("");
  const [pagePassword, setPagePassword] = useState("");
  const [spot, setSpot] = useState<SeichiSpot>(emptySpot);
  const [spots, setSpots] = useState<SeichiSpot[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [imageBase64, setImageBase64] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ lat: number; lng: number } | null>(null);

  const selectedWorkTitle = useMemo(
    () => works.find((work) => work.workId === spot.workId)?.workTitle || "",
    [works, spot.workId]
  );

  useEffect(() => {
    const saved = localStorage.getItem("timewalkAdminPassword");
    if (saved) setPagePassword(saved);
  }, []);

  useEffect(() => {
    if (!pagePassword) return;
    loadWorks();
    initMap();
  }, [pagePassword]);

  function login() {
    if (!passwordInput) return;
    localStorage.setItem("timewalkAdminPassword", passwordInput);
    setPagePassword(passwordInput);
  }

  async function loadWorks() {
    try {
      const response = await fetch("/api/admin/seichi-works", { cache: "no-store" });
      const json = await response.json();
      if (!json.ok) {
        setMessage(json.error || "worksを取得できませんでした。");
        return;
      }
      setWorks(json.works || []);
    } catch {
      setMessage("worksを取得できませんでした。");
    }
  }

  async function initMap() {
    const L = await import("leaflet");
    if (mapRef.current) return;

    const map = L.map("seichi-admin-map", { maxZoom: 18 }).setView(
      [35.681236, 139.767125],
      15
    );
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 18,
      maxNativeZoom: 18,
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);

    map.on("click", async (event: any) => {
      if (savingRef.current) return;
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      const address = await reverseGeocode(lat, lng);

      setSpot({ ...emptySpot, lat, lng, ...address });
      setPendingMove(null);
      setImageBase64("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await placeNewMarker(lat, lng);
    });

    map.on("zoomend", loadSpots);
    map.on("moveend", loadSpots);

    await moveToCurrentLocation(false);
    await loadSpots();
  }

  async function loadSpots() {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds().pad(0.2);

    try {
      const response = await fetch("/api/admin/seichi-spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        }),
      });
      const json = await response.json();
      if (!json.ok) {
        setMessage(json.error || "聖地巡礼スポットを取得できませんでした。");
        return;
      }

      const loaded = (json.spots || []).map(normalizeSpot);
      setSpots(loaded);
      await renderSpots(loaded);
      setMessage(`聖地巡礼スポット ${loaded.length}件を表示中`);
    } catch {
      setMessage("聖地巡礼スポットを取得できませんでした。");
    }
  }

  async function renderSpots(targetSpots: SeichiSpot[]) {
    const L = await import("leaflet");
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    const bounds = map.getBounds().pad(0.2);
    const visible = targetSpots.filter(
      (item) =>
        Number.isFinite(item.lat) &&
        Number.isFinite(item.lng) &&
        bounds.contains([item.lat, item.lng])
    );

    clusterSpots(visible, map, map.getZoom()).forEach((item) => {
      if (item.type === "spot") {
        const marker = L.marker([item.spot.lat, item.spot.lng], {
          draggable: true,
          icon: getSpotMarkerIcon(L, item.spot) as any,
        })
          .addTo(layer)
          .bindPopup(
            `<strong>${item.spot.name || "名称未入力"}</strong><br>${item.spot.workId}<br>${item.spot.id || ""}`
          );

        marker.on("click", () => selectSpot(item.spot));
        marker.on("dragend", (event: any) => {
          const point = event.target.getLatLng();
          selectSpot(item.spot);
          setPendingMove({ lat: point.lat, lng: point.lng });
          setMessage("移動候補があります。右側の『この位置に反映』を押してください。");
        });
        return;
      }

      const marker = L.marker([item.lat, item.lng], {
        icon: getClusterMarkerIcon(L, item.count) as any,
      })
        .addTo(layer)
        .bindPopup(`${item.count}件`);

      marker.on("click", () => {
        map.setView(
          [item.lat, item.lng],
          Math.min(map.getZoom() + 1, map.getMaxZoom())
        );
      });
    });
  }

  function selectSpot(selected: SeichiSpot) {
    setSpot(normalizeSpot(selected));
    setPendingMove(null);
    setImageBase64("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function startNewSpot() {
    setSpot(emptySpot);
    setPendingMove(null);
    setImageBase64("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setMessage("地図をクリックして新しい聖地巡礼スポットの位置を指定してください。");
  }

  async function placeNewMarker(lat: number, lng: number) {
    const L = await import("leaflet");
    if (newMarkerRef.current) mapRef.current.removeLayer(newMarkerRef.current);

    newMarkerRef.current = L.marker([lat, lng], {
      draggable: true,
      icon: getNewSpotMarkerIcon(L) as any,
    }).addTo(mapRef.current);

    newMarkerRef.current.on("dragend", async (event: any) => {
      const point = event.target.getLatLng();
      const address = await reverseGeocode(point.lat, point.lng);
      setSpot((current) => ({
        ...current,
        lat: point.lat,
        lng: point.lng,
        ...address,
      }));
    });
  }

  async function reverseGeocode(lat: number, lng: number) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ja`
      );
      const json = await response.json();
      const address = json.address || {};
      return {
        country: String(address.country_code || "jp").toUpperCase(),
        prefecture: address.state || address.province || "",
        city: address.city || address.town || address.village || address.ward || "",
        area: address.suburb || address.neighbourhood || address.quarter || "",
      };
    } catch {
      return { country: "JP", prefecture: "", city: "", area: "" };
    }
  }

  async function searchPlace() {
    const keyword = searchKeyword.trim();
    if (!keyword) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=ja&q=${encodeURIComponent(keyword)}`
      );
      const json = await response.json();
      if (!Array.isArray(json) || !json[0]) {
        setMessage("地点が見つかりませんでした。");
        return;
      }
      mapRef.current.setView([Number(json[0].lat), Number(json[0].lon)], 16);
      setMessage(`検索地点へ移動しました：${keyword}`);
    } catch {
      setMessage("地点検索に失敗しました。");
    }
  }

  async function moveToCurrentLocation(showMessage = true) {
    if (!navigator.geolocation) {
      if (showMessage) setMessage("このブラウザでは現在地を取得できません。");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const L = await import("leaflet");
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        mapRef.current?.setView([lat, lng], 16);

        if (currentLocationRef.current) {
          mapRef.current.removeLayer(currentLocationRef.current);
        }
        currentLocationRef.current = L.marker([lat, lng], {
          icon: getCurrentLocationMarkerIcon(L) as any,
          interactive: false,
          zIndexOffset: 1000,
        }).addTo(mapRef.current);

        if (showMessage) setMessage("現在地へ移動しました。");
      },
      () => {
        if (showMessage) setMessage("現在地を取得できませんでした。");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }

  async function onImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageBase64(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function applyPendingMove() {
    if (!pendingMove) return;
    const address = await reverseGeocode(pendingMove.lat, pendingMove.lng);
    setSpot((current) => ({ ...current, ...pendingMove, ...address }));
    setPendingMove(null);
    setMessage("移動候補をフォームへ反映しました。保存すると確定します。");
  }

  async function saveSpot() {
    if (savingRef.current) return;
    if (!spot.workId) {
      setMessage("workIdを選択してください。workIdは必須です。");
      return;
    }

    savingRef.current = true;
    setIsSaving(true);
    setMessage("保存中...");

    try {
      const response = await fetch("/api/admin/save-seichi-spot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spot: {
            ...spot,
            imageBase64,
          },
        }),
      });
      const json = await response.json();
      if (!json.ok) {
        setMessage(json.error || "保存に失敗しました。");
        return;
      }

      setSpot((current) => ({
        ...current,
        id: json.id,
        spotsImage: json.spotsImage || current.spotsImage || "",
      }));
      setImageBase64("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage(`保存しました：${json.id}`);
      await loadSpots();
    } catch {
      setMessage("保存に失敗しました。");
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }

  if (!pagePassword) {
    return (
      <main style={{ padding: 24, color: "#111", background: "#fff" }}>
        <h1>聖地巡礼TimeWalk 地点管理</h1>
        <p>管理パスワードを入力してください。</p>
        <input
          type="password"
          value={passwordInput}
          onChange={(event) => setPasswordInput(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && login()}
          style={inputStyle}
        />
        <button type="button" onClick={login} style={buttonStyle}>
          ログイン
        </button>
      </main>
    );
  }

  return (
    <main className="seichi-admin-page">
      <style>{`
        .seichi-admin-page{display:grid;grid-template-columns:minmax(0,1fr)420px;width:100vw;height:100vh;background:#fff;color:#111}
        .seichi-admin-form,.seichi-admin-form label,.seichi-admin-form h2,.seichi-admin-form p{color:#111!important}
        .seichi-admin-form input,.seichi-admin-form textarea,.seichi-admin-form select{color:#111!important;background:#fff!important;border-color:#777!important}
        @media(max-width:800px){.seichi-admin-page{display:block;height:auto}.seichi-map-column{height:60vh;min-height:380px}.seichi-admin-form{width:100%;box-sizing:border-box}}
      `}</style>

      <div className="seichi-map-column" style={{ position: "relative", minHeight: 420 }}>
        <div style={toolbarStyle}>
          <button type="button" onClick={startNewSpot} style={topButtonStyle}>新規</button>
          <input
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && searchPlace()}
            placeholder="地点を検索"
            style={{ ...inputStyle, flex: 1, minWidth: 100, marginBottom: 0, pointerEvents: "auto" }}
          />
          <button type="button" onClick={searchPlace} style={topButtonStyle}>検索</button>
          <button type="button" onClick={() => moveToCurrentLocation(true)} style={topButtonStyle}>現在地</button>
        </div>
        <div id="seichi-admin-map" style={{ width: "100%", height: "100%", minHeight: 420 }} />
      </div>

      <aside className="seichi-admin-form" style={{ padding: 16, overflowY: "auto", borderLeft: "1px solid #ddd", background: "#fff" }}>
        <h2 style={{ marginTop: 0 }}>聖地巡礼スポット編集</h2>

        <label>ID</label>
        <input value={spot.id || "保存時にse_で自動作成"} readOnly style={inputStyle} />

        <label>workId（必須）</label>
        <select
          value={spot.workId}
          onChange={(event) => setSpot({ ...spot, workId: event.target.value })}
          style={{ ...inputStyle, border: spot.workId ? "1px solid #777" : "2px solid #c62828" }}
          required
        >
          <option value="">作品を選択してください</option>
          {works.map((work) => (
            <option key={work.workId} value={work.workId}>
              {work.workId}{work.workTitle ? ` — ${work.workTitle}` : ""}
            </option>
          ))}
        </select>
        {selectedWorkTitle && <p style={{ marginTop: -4, fontSize: 13 }}>{selectedWorkTitle}</p>}

        <label>name</label>
        <input value={spot.name} onChange={(event) => setSpot({ ...spot, name: event.target.value })} style={inputStyle} />

        <label>kana</label>
        <input value={spot.kana || ""} onChange={(event) => setSpot({ ...spot, kana: event.target.value })} style={inputStyle} />

        {pendingMove && (
          <div style={{ border: "2px solid #b33a2f", background: "#fff7f5", padding: 12, marginBottom: 12 }}>
            <p style={{ margin: "0 0 8px", fontWeight: 700 }}>移動候補</p>
            <p style={{ margin: "0 0 8px" }}>{pendingMove.lat}, {pendingMove.lng}</p>
            <button type="button" onClick={applyPendingMove} style={buttonStyle}>この位置に反映</button>
            <button type="button" onClick={() => { setPendingMove(null); loadSpots(); }} style={subButtonStyle}>取り消し</button>
          </div>
        )}

        <label>lat</label>
        <input value={spot.lat} readOnly style={inputStyle} />
        <label>lng</label>
        <input value={spot.lng} readOnly style={inputStyle} />

        <label>country</label>
        <input value={spot.country || ""} onChange={(event) => setSpot({ ...spot, country: event.target.value })} style={inputStyle} />
        <label>prefecture</label>
        <input value={spot.prefecture || ""} onChange={(event) => setSpot({ ...spot, prefecture: event.target.value })} style={inputStyle} />
        <label>city</label>
        <input value={spot.city || ""} onChange={(event) => setSpot({ ...spot, city: event.target.value })} style={inputStyle} />
        <label>area</label>
        <input value={spot.area || ""} onChange={(event) => setSpot({ ...spot, area: event.target.value })} style={inputStyle} />

        <label>spotsImage</label>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageChange} style={inputStyle} />
        {spot.spotsImage && <img src={spot.spotsImage} alt="" style={{ width: "100%", marginBottom: 12 }} />}

        <label>description</label>
        <textarea value={spot.description || ""} onChange={(event) => setSpot({ ...spot, description: event.target.value })} style={textareaStyle} />

        <button type="button" onClick={saveSpot} disabled={isSaving} style={{ ...buttonStyle, opacity: isSaving ? 0.6 : 1 }}>
          {isSaving ? "保存中..." : "保存"}
        </button>
        <p style={{ lineHeight: 1.5 }}>{message}</p>
      </aside>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginBottom: 10,
  padding: 9,
  border: "1px solid #777",
  borderRadius: 6,
  background: "#fff",
  color: "#111",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 150,
  resize: "vertical",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: 11,
  marginTop: 8,
  border: "1px solid #111",
  borderRadius: 6,
  background: "#111",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const subButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "#fff",
  color: "#111",
};

const topButtonStyle: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid #111",
  borderRadius: 6,
  background: "#111",
  color: "#fff",
  fontWeight: 700,
  whiteSpace: "nowrap",
  pointerEvents: "auto",
  cursor: "pointer",
};

const toolbarStyle: React.CSSProperties = {
  position: "absolute",
  top: 12,
  left: 64,
  right: 12,
  zIndex: 1000,
  display: "flex",
  gap: 8,
  alignItems: "center",
  pointerEvents: "none",
};
