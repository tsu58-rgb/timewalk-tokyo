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
  height = "340px",
}: {
  points: CoursePoint[];
  height?: string;
}) {
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const positions = useMemo(
    () => points.map((point) => [point.lat, point.lng] as [number, number]),
    [points]
  );
  const center = positions[0] || ([35.681236, 139.767125] as [number, number]);

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
      if (document.visibilityState === "visible") {
        startUpdates();
      } else {
        stopUpdates();
      }
    };

    if (document.visibilityState === "visible") {
      startUpdates();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopped = true;
      stopUpdates();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ width: "100%", height, borderRadius: 16, overflow: "hidden" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={18}
      />
      <FitCourseBounds points={points} />
      {positions.length >= 2 && (
        <Polyline
          positions={positions}
          pathOptions={{ color: "#2563eb", weight: 5, opacity: 0.8 }}
        />
      )}
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
    </MapContainer>
  );
}
