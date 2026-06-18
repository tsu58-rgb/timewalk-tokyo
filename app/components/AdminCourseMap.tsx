"use client";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
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
  const clusterLayerRef = useRef<any>(null);
  const selectedLayerRef = useRef<any>(null);
  const callbacksRef = useRef({ onSpotSelect, onWaypointAdd, mode });
  const [mapReady, setMapReady] = useState(false);

  callbacksRef.current = { onSpotSelect, onWaypointAdd, mode };

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      const L = await import("leaflet");
      await import("leaflet.markercluster");
      if (cancelled || !mapContainerRef.current || mapRef.current) return;

      const map = L.map(mapContainerRef.current, { maxZoom: 18 }).setView([35.681236, 139.767125], 14);
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      clusterLayerRef.current = (L as any).markerClusterGroup({
        maxClusterRadius: 55,
        disableClusteringAtZoom: 17,
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
      });
      selectedLayerRef.current = L.layerGroup().addTo(map);
      map.addLayer(clusterLayerRef.current);

      map.on("click", (event: any) => {
        if (callbacksRef.current.mode !== "waypoint") return;
        callbacksRef.current.onWaypointAdd(event.latlng.lat, event.latlng.lng);
      });

      setMapReady(true);
      requestAnimationFrame(() => map.invalidateSize());
    }

    initialize();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      clusterLayerRef.current = null;
      selectedLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    mapRef.current.getContainer().style.cursor = mode === "waypoint" ? "crosshair" : "grab";
  }, [mode, mapReady]);

  useEffect(() => {
    if (!mapReady) return;

    async function renderSpots() {
      const L = await import("leaflet");
      const layer = clusterLayerRef.current;
      if (!layer) return;
      layer.clearLayers();
      const icon = redPinIcon(L);

      spots.forEach((spot) => {
        if (!Number.isFinite(spot.lat) || !Number.isFinite(spot.lng)) return;
        const marker = L.marker([spot.lat, spot.lng], { icon }).bindTooltip(spot.name || spot.id);
        marker.on("click", (event: any) => {
          L.DomEvent.stopPropagation(event);
          if (callbacksRef.current.mode === "spot") {
            callbacksRef.current.onSpotSelect(spot);
          } else {
            callbacksRef.current.onWaypointAdd(spot.lat, spot.lng);
          }
        });
        layer.addLayer(marker);
      });

      layer.refreshClusters?.();
    }

    renderSpots();
  }, [spots, mapReady]);

  useEffect(() => {
    if (!mapReady) return;

    async function renderSelected() {
      const L = await import("leaflet");
      const layer = selectedLayerRef.current;
      if (!layer) return;
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
      if (positions.length > 0 && mapRef.current) {
        mapRef.current.fitBounds(L.latLngBounds(positions), { padding: [30, 30], maxZoom: 17 });
      }
    }

    renderSelected();
  }, [points, mapReady]);

  return (
    <>
      <div
        ref={mapContainerRef}
        className="admin-course-map"
        style={{
          width: "100%",
          height: "clamp(520px, 72vh, 820px)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      />
      <style jsx global>{`
        @media (min-width: 1100px) {
          main:has(.admin-course-map) > div {
            max-width: 1600px !important;
          }
        }
      `}</style>
    </>
  );
}
