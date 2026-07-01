"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import type { Spot } from "@/types/timewalk";

function FitAllSpots({ spots, resetKey }: { spots: Spot[]; resetKey: number }) {
  const map = useMap();

  useEffect(() => {
    if (spots.length === 0) return;
    const bounds = L.latLngBounds(spots.map((spot) => [spot.lat, spot.lng] as [number, number]));
    map.closePopup();
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 16 });
  }, [map, spots, resetKey]);

  return null;
}

function numberIcon(number: number) {
  return L.divIcon({
    className: "seichi-number-marker",
    html: `<div style="width:38px;height:38px;border-radius:50%;background:#ffd83d;color:#111;border:4px solid #111;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;box-shadow:4px 4px 0 #ff4f9a">${number}</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -20],
  });
}

export default function SeichiMap({
  spots,
  lang,
  resetKey,
}: {
  spots: Spot[];
  lang: string;
  resetKey: number;
}) {
  const center = useMemo<[number, number]>(() => {
    if (spots.length === 0) return [35.681236, 139.767125];
    return [spots[0].lat, spots[0].lng];
  }, [spots]);
  const code = lang === "ja" ? "" : lang.toLowerCase();
  const detailLabel = lang === "vn" ? "Xem chi tiết ↗" : lang === "en" ? "View details ↗" : "詳細を開く ↗";

  return (
    <div className="overflow-hidden border-4 border-black bg-white shadow-[7px_7px_0_#111]">
      <MapContainer center={center} zoom={13} style={{ width: "100%", height: "420px" }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />
        <FitAllSpots spots={spots} resetKey={resetKey} />
        {spots.map((spot, index) => (
          <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={numberIcon(index + 1)}>
            <Popup>
              <div style={{ minWidth: 190 }}>
                {spot.kana && <div style={{ fontSize: 11, color: "#666" }}>{spot.kana}</div>}
                <strong style={{ display: "block", marginBottom: 8 }}>{index + 1}. {spot.name}</strong>
                <a
                  href={code ? `/spot/${spot.id}/${code}` : `/spot/${spot.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block", padding: "7px 10px", borderRadius: 8, background: "#111", color: "#fff", fontWeight: 700, textDecoration: "none" }}
                >
                  {detailLabel}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
