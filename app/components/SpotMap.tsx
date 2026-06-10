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

import { clusterSpots, type ClusterItem } from "./map/clusterSpots";
import { defaultMapLayerId, mapLayers, type MapLayerId } from "./map/mapLayers";
import { getClusterMarkerIcon, getSpotMarkerIcon } from "./map/mapIcons";

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

type MapItem = ClusterItem<Spot>;

const defaultCenter: [number, number] = [35.681236, 139.767125];

function RecenterMap({ position, zoom }: { position: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, zoom);
  }, [position, zoom, map]);

  return null;
}

function ZoomableClusterMarker({ item }: { item: Extract<MapItem, { type: "cluster" }> }) {
  const map = useMap();

  return (
    <Marker
      key={`cluster-${item.key}`}
      position={[item.lat, item.lng]}
      icon={getClusterMarkerIcon(L, item.count) as L.Icon}
      eventHandlers={{
        click: () => {
          const nextZoom = Math.min(map.getZoom() + 1, map.getMaxZoom());
          map.setView([item.lat, item.lng], nextZoom);
        },
      }}
    >
      <Popup>{item.count}件</Popup>
    </Marker>
  );
}

function deferMarkerUpdate(callback: () => void) {
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

    cleanupRef.current = deferMarkerUpdate(() => {
      const zoom = map.getZoom();
      const bounds = map.getBounds().pad(0.2);

      const visibleSpots = spots.filter((spot) => {
        if (!Number.isFinite(spot.lat) || !Number.isFinite(spot.lng)) return false;
        return bounds.contains([spot.lat, spot.lng]);
      });

      onItemsChange(clusterSpots(visibleSpots, map, zoom));
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
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [mapItems, setMapItems] = useState<MapItem[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<MapLayerId>(defaultMapLayerId);

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
            return <ZoomableClusterMarker key={`cluster-${item.key}`} item={item} />;
          }

          const spot = item.spot;

          return (
            <Marker
              key={spot.id}
              position={[spot.lat, spot.lng]}
              icon={getSpotMarkerIcon(L, spot) as L.Icon}
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
