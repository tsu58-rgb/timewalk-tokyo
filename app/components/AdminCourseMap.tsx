"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

import type { CoursePoint } from "../lib/courses";
import { clusterSpots } from "./map/clusterSpots";
import { getClusterMarkerIcon, getSpotMarkerIcon } from "./map/mapIcons";

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
  const markerLayerRef = useRef<any>(null);
  const selectedLayerRef = useRef<any>(null);
  const callbacksRef = useRef({ onSpotSelect, onWaypointAdd, mode });
  const spotsRef = useRef<SelectableSpot[]>(spots);
  const [mapReady, setMapReady] = useState(false);

  callbacksRef.current = { onSpotSelect, onWaypointAdd, mode };
  spotsRef.current = spots;

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      const L = await import("leaflet");
      if (cancelled || !mapContainerRef.current || mapRef.current) return;

      const map = L.map(mapContainerRef.current, { maxZoom: 18 }).setView(
        [35.681236, 139.767125],
        14
      );
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
        maxNativeZoom: 18,
      }).addTo(map);

      markerLayerRef.current = L.layerGroup().addTo(map);
      selectedLayerRef.current = L.layerGroup().addTo(map);

      map.on("click", (event: any) => {
        if (callbacksRef.current.mode !== "waypoint") return;
        callbacksRef.current.onWaypointAdd(event.latlng.lat, event.latlng.lng);
      });

      setMapReady(true);
      requestAnimationFrame(() => map.invalidateSize());
    }

    initialize().catch((error) => console.error(error));

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
      selectedLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    mapRef.current.getContainer().style.cursor =
      mode === "waypoint" ? "crosshair" : "grab";
  }, [mode, mapReady]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !markerLayerRef.current) return;

    let cancelled = false;

    async function renderSpots() {
      const L = await import("leaflet");
      if (cancelled || !mapRef.current || !markerLayerRef.current) return;

      const map = mapRef.current;
      const layer = markerLayerRef.current;
      const zoom = map.getZoom();
      const bounds = map.getBounds().pad(0.2);

      layer.clearLayers();

      const visibleSpots = spotsRef.current.filter((spot) => {
        if (!Number.isFinite(spot.lat) || !Number.isFinite(spot.lng)) return false;
        return bounds.contains([spot.lat, spot.lng]);
      });

      const items = clusterSpots(visibleSpots, map, zoom);

      items.forEach((item) => {
        if (item.type === "spot") {
          const spot = item.spot;
          const marker = L.marker([spot.lat, spot.lng], {
            icon: getSpotMarkerIcon(L, spot) as any,
          }).bindTooltip(spot.name || spot.id);

          marker.on("click", (event: any) => {
            L.DomEvent.stopPropagation(event);

            if (callbacksRef.current.mode === "spot") {
              callbacksRef.current.onSpotSelect(spot);
            } else {
              callbacksRef.current.onWaypointAdd(spot.lat, spot.lng);
            }
          });

          marker.addTo(layer);
          return;
        }

        const clusterMarker = L.marker([item.lat, item.lng], {
          icon: getClusterMarkerIcon(L, item.count) as any,
        })
          .addTo(layer)
          .bindPopup(`${item.count}件`);

        clusterMarker.on("click", () => {
          map.setView(
            [item.lat, item.lng],
            Math.min(map.getZoom() + 1, map.getMaxZoom())
          );
        });
      });
    }

    renderSpots().catch((error) => console.error(error));

    const map = mapRef.current;
    map.on("zoomend", renderSpots);
    map.on("moveend", renderSpots);

    return () => {
      cancelled = true;
      map.off("zoomend", renderSpots);
      map.off("moveend", renderSpots);
    };
  }, [spots, mapReady]);

  useEffect(() => {
    if (!mapReady || !selectedLayerRef.current) return;

    let cancelled = false;

    async function renderSelected() {
      const L = await import("leaflet");
      if (cancelled || !selectedLayerRef.current) return;

      const layer = selectedLayerRef.current;
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

        L.marker([point.lat, point.lng], {
          icon,
          zIndexOffset: 1000,
        })
          .bindTooltip(point.name)
          .addTo(layer);
      });

      if (positions.length >= 2) {
        L.polyline(positions, {
          color: "#2563eb",
          weight: 5,
          opacity: 0.8,
        }).addTo(layer);
      }

      if (positions.length > 0 && mapRef.current) {
        mapRef.current.fitBounds(L.latLngBounds(positions), {
          padding: [30, 30],
          maxZoom: 17,
        });
      }
    }

    renderSelected().catch((error) => console.error(error));

    return () => {
      cancelled = true;
    };
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
