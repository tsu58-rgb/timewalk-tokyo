"use client";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useEffect, useRef } from "react";

import type { CoursePoint } from "../lib/courses";

type SelectableSpot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  spotsImage?: string;
  description?: string;
};

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

  useEffect(() => {
    callbacksRef.current = { onSpotSelect, onWaypointAdd, mode };
  }, [onSpotSelect, onWaypointAdd, mode]);

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

      clusterLayerRef.current = (L as any).markerClusterGroup({ disableClusteringAtZoom: 17 });
      selectedLayerRef.current = L.layerGroup().addTo(map);
      map.addLayer(clusterLayerRef.current);

      map.on("click", (event: any) => {
        if (callbacksRef.current.mode !== "waypoint") return;
        callbacksRef.current.onWaypointAdd(event.latlng.lat, event.latlng.lng);
      });
    }

    initialize();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    async function renderSpots() {
      const L = await import("leaflet");
      const layer = clusterLayerRef.current;
      if (!layer) return;
      layer.clearLayers();

      spots.forEach((spot) => {
        if (!Number.isFinite(spot.lat) || !Number.isFinite(spot.lng)) return;
        const marker = L.circleMarker([spot.lat, spot.lng], {
          radius: 7,
          color: "#fff",
          weight: 2,
          fillColor: "#b91c1c",
          fillOpacity: 1,
        }).bindTooltip(spot.name || spot.id);
        marker.on("click", (event: any) => {
          L.DomEvent.stopPropagation(event);
          if (callbacksRef.current.mode === "spot") callbacksRef.current.onSpotSelect(spot);
        });
        layer.addLayer(marker);
      });
    }

    renderSpots();
  }, [spots]);

  useEffect(() => {
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
          html: `<div style="width:32px;height:32px;border-radius:50%;background:#fde047;color:#111;border:3px solid #111;display:flex;align-items:center;justify-content:center;font-weight:800">${index + 1}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        L.marker([point.lat, point.lng], { icon }).bindTooltip(point.name).addTo(layer);
      });

      if (positions.length >= 2) {
        L.polyline(positions, { color: "#2563eb", weight: 5, opacity: 0.8 }).addTo(layer);
      }
      if (positions.length > 0 && mapRef.current) {
        mapRef.current.fitBounds(L.latLngBounds(positions), { padding: [30, 30], maxZoom: 17 });
      }
    }

    renderSelected();
  }, [points]);

  return <div ref={mapContainerRef} style={{ width: "100%", height: "480px", borderRadius: 12, overflow: "hidden" }} />;
}
