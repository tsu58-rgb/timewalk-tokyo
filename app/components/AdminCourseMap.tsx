"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

import type { CoursePoint } from "../lib/courses";

type SelectableSpot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  spotsImage?: string;
  description?: string;
};

function redPinIcon(L: any) {
  return L.divIcon({
    className: "course-admin-pin",
    html: '<div style="position:relative;width:26px;height:26px;border-radius:50% 50% 50% 0;background:#dc2626;border:3px solid #fff;transform:rotate(-45deg);box-shadow:0 2px 7px rgba(0,0,0,.45)"><div style="width:8px;height:8px;border-radius:50%;background:#fff;position:absolute;left:6px;top:6px"></div></div>',
    iconSize: [26, 36],
    iconAnchor: [13, 32],
  });
}

export default function AdminCourseMap({
  spots,
  points,
  mode,
  onSpotSelect,
  onWaypointAdd,
}: {
  spots: SelectableSpot[];
  points: CoursePoint[];
  mode: "spot" | "waypoint";
  onSpotSelect: (spot: SelectableSpot) => void;
  onWaypointAdd: (lat: number, lng: number) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const spotLayerRef = useRef<any>(null);
  const selectedLayerRef = useRef<any>(null);
  const spotsRef = useRef<SelectableSpot[]>(spots);
  const callbacksRef = useRef({ onSpotSelect, onWaypointAdd, mode });
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    spotsRef.current = spots;
  }, [spots]);

  useEffect(() => {
    callbacksRef.current = { onSpotSelect, onWaypointAdd, mode };
  }, [onSpotSelect, onWaypointAdd, mode]);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      const L = await import("leaflet");
      if (cancelled || !mapContainerRef.current || mapRef.current) return;

      const map = L.map(mapContainerRef.current, { maxZoom: 18 }).setView([35.681236, 139.767125], 14);
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      spotLayerRef.current = L.layerGroup().addTo(map);
      selectedLayerRef.current = L.layerGroup().addTo(map);

      map.on("click", (event: any) => {
        if (callbacksRef.current.mode !== "waypoint") return;
        callbacksRef.current.onWaypointAdd(event.latlng.lat, event.latlng.lng);
      });

      const rerenderVisibleSpots = () => setMapReady((value) => !value);
      map.on("moveend", rerenderVisibleSpots);
      map.on("zoomend", rerenderVisibleSpots);

      setMapReady(true);
      requestAnimationFrame(() => map.invalidateSize());
    }

    initialize();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      spotLayerRef.current = null;
      selectedLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = spotLayerRef.current;
    if (!map || !layer) return;

    async function renderSpots() {
      const L = await import("leaflet");
      layer.clearLayers();
      const icon = redPinIcon(L);
      const bounds = map.getBounds().pad(0.2);

      spotsRef.current.forEach((spot) => {
        if (!Number.isFinite(spot.lat) || !Number.isFinite(spot.lng)) return;
        if (!bounds.contains([spot.lat, spot.lng])) return;

        const marker = L.marker([spot.lat, spot.lng], { icon }).bindTooltip(spot.name || spot.id);
        marker.on("click", (event: any) => {
          L.DomEvent.stopPropagation(event);
          if (callbacksRef.current.mode === "spot") callbacksRef.current.onSpotSelect(spot);
        });
        marker.addTo(layer);
      });
    }

    renderSpots();
  }, [spots, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = selectedLayerRef.current;
    if (!map || !layer) return;

    async function renderSelected() {
      const L = await import("leaflet");
      layer.clearLayers();

      const positions: [number, number][] = [];
      points.forEach((point, index) => {
        positions.push([point.lat, point.lng]);
        const icon = L.divIcon({
          className: "course-builder-number",
          html: `<div style="width:32px;height:32px;border-radius:50%;background:#fde047;color:#111;border:3px solid #111;display:flex;align-items:center;justify-content:center;font-weight:800;box-shadow:0 2px 8px rgba(0,0,0,.35)">${index + 1}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        L.marker([point.lat, point.lng], { icon, zIndexOffset: 1000 }).bindTooltip(point.name).addTo(layer);
      });

      if (positions.length >= 2) {
        L.polyline(positions, { color: "#2563eb", weight: 5, opacity: 0.8 }).addTo(layer);
      }
      if (positions.length > 0) {
        map.fitBounds(L.latLngBounds(positions), { padding: [30, 30], maxZoom: 17 });
      }
    }

    renderSelected();
  }, [points, mapReady]);

  return <div ref={mapContainerRef} style={{ width: "100%", height: "480px", borderRadius: 12, overflow: "hidden" }} />;
}
