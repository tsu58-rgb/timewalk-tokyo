"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Pane,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import type { CoursePoint } from "../lib/courses";
import {
  defaultMapLayerId,
  GSI_ATTRIBUTION,
  mapLayers,
  PALE_MAP_URL,
  type MapLayerId,
} from "./map/mapLayers";
import MapLayerSelector from "./map/MapLayerSelector";

type BackgroundSpot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

function FitCourseBounds({ points }: { points: CoursePoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(
      points.map((point) => [point.lat, point.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 17 });
  }, [map, points]);

  return null;
}

function numberIcon(number: number) {
  return L.divIcon({
    className: "course-number-marker",
    html: `<div style="width:34px;height:34px;border-radius:50%;background:#fde047;color:#111;border:3px solid #111;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;box-shadow:0 2px 8px rgba(0,0,0,.35)">${number}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

export default function CourseRouteMap({
  points,
  allSpots,
  height = "340px",
}: {
  points: CoursePoint[];
  allSpots: BackgroundSpot[];
  height?: string;
}) {
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<MapLayerId>(defaultMapLayerId);
  const positions = useMemo(
    () => points.map((point) => [point.lat, point.lng] as [number, number]),
    [points]
  );
  const center = positions[0] || ([35.681236, 139.767125] as [number, number]);
  const selectedLayer = mapLayers.find((layer) => layer.id === selectedLayerId) || mapLayers[0];

  useEffect(() => {
    if (!navigator.geolocation) return;

    let intervalId: number | null = null;
    let stopped = false;

    const updateCurrentPosition = () => {
      if (stopped || document.visibilityState !== "visible") return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (stopped) return;
          setCurrentPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.warn("現在地を取得できませんでした", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 15000,
          timeout: 10000,
        }
      );
    };

    const startUpdates = () => {
      if (intervalId !== null) return;
      updateCurrentPosition();
      intervalId = window.setInterval(updateCurrentPosition, 30000);
    };

    const stopUpdates = () => {
      if (intervalId === null) return;
      window.clearInterval(intervalId);
      intervalId = null;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") startUpdates();
      else stopUpdates();
    };

    if (document.visibilityState === "visible") startUpdates();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopped = true;
      stopUpdates();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <MapLayerSelector selectedLayerId={selectedLayerId} onChange={setSelectedLayerId} />
      <MapContainer
        center={center}
        zoom={15}
        style={{ width: "100%", height, borderRadius: 16, overflow: "hidden" }}
      >
        {selectedLayer.showPaleBase && (
          <TileLayer
            key={`course-pale-${selectedLayer.id}`}
            attribution={GSI_ATTRIBUTION}
            url={PALE_MAP_URL}
            maxNativeZoom={18}
            maxZoom={18}
          />
        )}
        <TileLayer
          key={`course-selected-${selectedLayer.id}`}
          attribution={selectedLayer.attribution}
          url={selectedLayer.url}
          minNativeZoom={selectedLayer.minNativeZoom}
          maxNativeZoom={selectedLayer.maxNativeZoom}
          opacity={selectedLayer.opacity ?? 1}
          maxZoom={18}
        />

        <FitCourseBounds points={points} />

        <Pane name="course-background-spots" style={{ zIndex: 430 }}>
          {allSpots
            .filter((spot) => Number.isFinite(spot.lat) && Number.isFinite(spot.lng))
            .map((spot) => (
              <CircleMarker
                key={`background-${spot.id}`}
                center={[spot.lat, spot.lng]}
                radius={3.5}
                pathOptions={{
                  className: "course-background-spot-dot",
                  color: "#dc2626",
                  weight: 0,
                  fillColor: "#dc2626",
                  fillOpacity: 1,
                }}
              >
                <Popup pane="course-spot-popup-pane">
                  <div>
                    <strong>{spot.name}</strong>
                    <br />
                    <a href={`/spot/${spot.id}`}>詳細ページを見る</a>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
        </Pane>

        {positions.length >= 2 && (
          <Polyline
            positions={positions}
            pathOptions={{ color: "#2563eb", weight: 5, opacity: 0.8 }}
          />
        )}

        <Pane name="course-numbered-points" style={{ zIndex: 650 }}>
          {points.map((point, index) => (
            <Marker
              key={point.pointId}
              position={[point.lat, point.lng]}
              icon={numberIcon(index + 1)}
            >
              <Popup>
                {index + 1}. {point.name}
              </Popup>
            </Marker>
          ))}
        </Pane>

        {currentPosition && (
          <Pane name="course-current-location-pane" style={{ zIndex: 1000 }}>
            <CircleMarker
              center={currentPosition}
              radius={10}
              pathOptions={{
                color: "#fff",
                weight: 3,
                fillColor: "#3b82f6",
                fillOpacity: 1,
              }}
            >
              <Popup>現在地</Popup>
            </CircleMarker>
          </Pane>
        )}

        <Pane name="course-spot-popup-pane" style={{ zIndex: 1300 }} />
      </MapContainer>

      <style>{`
        .course-background-spot-dot {
          filter: drop-shadow(1px 1px 0.7px rgba(0, 0, 0, 0.55));
        }
      `}</style>
    </div>
  );
}
