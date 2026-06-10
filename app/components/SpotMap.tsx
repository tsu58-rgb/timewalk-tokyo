"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Pane,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Spot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  mode: string;
  spotsImage: string;
  description?: string;
};

type Props = {
  spots: Spot[];
  initialZoom?: number;
  height?: string;
};

type MapLayerId =
  | "osm"
  | "gsi-pale"
  | "gsi-photo"
  | "gsi-photo-1945"
  | "gsi-photo-1936";

type MapLayer = {
  id: MapLayerId;
  label: string;
  description: string;
  url: string;
  attribution: string;
  minNativeZoom?: number;
  maxNativeZoom?: number;
};

type MapItem =
  | {
      type: "spot";
      spot: Spot;
    }
  | {
      type: "cluster";
      key: string;
      count: number;
      lat: number;
      lng: number;
    };

const GSI_ATTRIBUTION =
  '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">地理院タイル</a>';

const mapLayers: MapLayer[] = [
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

const defaultCenter: [number, number] = [35.681236, 139.767125];

function getSpotIcon(spot: Spot) {
  let pinColor = "#9f2f25";
  let centerColor = "#ffffff";

  if (String(spot.spotsImage || "").trim()) {
    centerColor = "#ffe96a";
  }

  const desc = String(spot.description || "").trim();

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
    popupAnchor: [0, -40],
  });
}

function getClusterIcon(count: number) {
  return L.divIcon({
    html: `
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="#9f2f25" />
        <circle cx="22" cy="22" r="12" fill="#ffffff" />
        <text
          x="22"
          y="26"
          text-anchor="middle"
          font-size="12"
          font-weight="bold"
          fill="#9f2f25"
        >${count}</text>
      </svg>
    `,
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

function RecenterMap({ position, zoom }: { position: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, zoom);
  }, [position, zoom, map]);

  return null;
}

function runWhenIdle(callback: () => void) {
  if (typeof window === "undefined") return;

  if ("requestIdleCallback" in window) {
    const idleId = window.requestIdleCallback(callback, { timeout: 1000 });
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = window.setTimeout(callback, 0);
  return () => window.clearTimeout(timeoutId);
}

function SpotLayerController({
  spots,
  onItemsChange,
}: {
  spots: Spot[];
  onItemsChange: (items: MapItem[]) => void;
}) {
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  const updateItems = (map: L.Map) => {
    cleanupRef.current?.();

    cleanupRef.current = runWhenIdle(() => {
      const zoom = map.getZoom();
      const bounds = map.getBounds().pad(0.2);

      const visibleSpots = spots.filter((spot) => {
        if (!Number.isFinite(spot.lat) || !Number.isFinite(spot.lng)) return false;
        return bounds.contains([spot.lat, spot.lng]);
      });

      const shouldCluster = zoom < 17;
      const cellSize = zoom <= 12 ? 90 : zoom <= 14 ? 75 : zoom <= 16 ? 60 : 45;

      if (!shouldCluster) {
        onItemsChange(visibleSpots.map((spot) => ({ type: "spot", spot })));
        return;
      }

      const clusters: Record<string, Spot[]> = {};

      visibleSpots.forEach((spot) => {
        const point = map.project([spot.lat, spot.lng], zoom);
        const key = `${Math.floor(point.x / cellSize)}_${Math.floor(point.y / cellSize)}`;

        if (!clusters[key]) clusters[key] = [];
        clusters[key].push(spot);
      });

      const items: MapItem[] = [];

      Object.entries(clusters).forEach(([key, group]) => {
        if (group.length === 1) {
          items.push({ type: "spot", spot: group[0] });
          return;
        }

        const lat = group.reduce((sum, spot) => sum + spot.lat, 0) / group.length;
        const lng = group.reduce((sum, spot) => sum + spot.lng, 0) / group.length;

        items.push({
          type: "cluster",
          key,
          count: group.length,
          lat,
          lng,
        });
      });

      onItemsChange(items);
    });
  };

  const map = useMapEvents({
    load: () => updateItems(map),
    moveend: () => updateItems(map),
    zoomend: () => updateItems(map),
  });

  useEffect(() => {
    updateItems(map);

    return () => cleanupRef.current?.();
  }, [spots, map]);

  return null;
}

export default function SpotMap({ spots, initialZoom = 16, height = "360px" }: Props) {
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(
    null
  );
  const [mapItems, setMapItems] = useState<MapItem[]>([]);
  const [selectedLayerId, setSelectedLayerId] =
    useState<MapLayerId>("gsi-pale");

  const selectedLayer =
    mapLayers.find((layer) => layer.id === selectedLayerId) || mapLayers[0];

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error(err);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 56,
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.95)",
          color: "#111",
          padding: "8px 10px",
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        <select
          aria-label="地図の種類"
          value={selectedLayerId}
          onChange={(e) => setSelectedLayerId(e.target.value as MapLayerId)}
          style={{
            width: 180,
            maxWidth: "52vw",
            padding: "6px 8px",
            borderRadius: 6,
            border: "1px solid #cbd5e1",
            background: "#fff",
            color: "#111",
            fontWeight: 700,
          }}
        >
          {mapLayers.map((layer) => (
            <option key={layer.id} value={layer.id}>
              {layer.label}
            </option>
          ))}
        </select>
      </div>

      <MapContainer
        center={currentPosition || defaultCenter}
        zoom={initialZoom}
        style={{
          width: "100%",
          height,
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <TileLayer
          attribution={selectedLayer.attribution}
          url={selectedLayer.url}
          minNativeZoom={selectedLayer.minNativeZoom}
          maxNativeZoom={selectedLayer.maxNativeZoom}
          maxZoom={18}
        />

        <SpotLayerController spots={spots} onItemsChange={setMapItems} />

        {currentPosition && <RecenterMap position={currentPosition} zoom={initialZoom} />}

        {currentPosition !== null && (
          <Pane name="current-location-pane" style={{ zIndex: 1000 }}>
            <CircleMarker
              center={[currentPosition[0], currentPosition[1]]}
              radius={10}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: "#3b82f6",
                fillOpacity: 1,
              }}
            >
              <Popup>現在地</Popup>
            </CircleMarker>
          </Pane>
        )}

        {mapItems.map((item) => {
          if (item.type === "cluster") {
            return (
              <Marker
                key={`cluster-${item.key}`}
                position={[item.lat, item.lng]}
                icon={getClusterIcon(item.count)}
              >
                <Popup>{item.count}件</Popup>
              </Marker>
            );
          }

          const spot = item.spot;

          return (
            <Marker
              key={spot.id}
              position={[spot.lat, spot.lng]}
              icon={getSpotIcon(spot)}
            >
              <Popup>
                <div>
                  <strong>{spot.name}</strong>
                  <br />
                  <a
                    href={`/spot/${spot.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    詳細ページを見る
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
