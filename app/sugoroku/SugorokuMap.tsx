"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

import MapLayerSelector from "../components/map/MapLayerSelector";
import {
  defaultMapLayerId,
  mapLayers,
  type MapLayerId,
} from "../components/map/mapLayers";
import type { SugorokuEdge, SugorokuSpot } from "./types";

type Props = {
  spots: SugorokuSpot[];
  edges: SugorokuEdge[];
  currentSpotId: string;
  selectableSpotIds: string[];
  onSelectSpot: (spotId: string) => void;
};

const TOKYO_CENTER: [number, number] = [35.681236, 139.767125];

function MapController({
  spots,
  currentSpot,
}: {
  spots: SugorokuSpot[];
  currentSpot: SugorokuSpot | undefined;
}) {
  const map = useMap();
  const fittedRef = useRef(false);

  useEffect(() => {
    if (fittedRef.current || spots.length === 0) return;

    map.fitBounds(
      spots.map((spot) => [spot.lat, spot.lng] as [number, number]),
      { padding: [28, 28], maxZoom: 13 }
    );
    fittedRef.current = true;
  }, [map, spots]);

  useEffect(() => {
    if (!currentSpot || !fittedRef.current) return;
    map.flyTo([currentSpot.lat, currentSpot.lng], Math.max(map.getZoom(), 13), {
      duration: 0.55,
    });
  }, [currentSpot, map]);

  return null;
}

export default function SugorokuMap({
  spots,
  edges,
  currentSpotId,
  selectableSpotIds,
  onSelectSpot,
}: Props) {
  const [selectedLayerId, setSelectedLayerId] =
    useState<MapLayerId>(defaultMapLayerId);

  const selectedLayer =
    mapLayers.find((layer) => layer.id === selectedLayerId) || mapLayers[0];
  const spotsById = useMemo(
    () => new Map(spots.map((spot) => [spot.id, spot])),
    [spots]
  );
  const currentSpot = spotsById.get(currentSpotId);
  const selectableSet = useMemo(
    () => new Set(selectableSpotIds),
    [selectableSpotIds]
  );

  const lines = edges
    .map((edge) => {
      const from = spotsById.get(edge.from);
      const to = spotsById.get(edge.to);
      if (!from || !to) return null;
      return {
        key: `${edge.from}-${edge.to}`,
        positions: [
          [from.lat, from.lng],
          [to.lat, to.lng],
        ] as [number, number][],
      };
    })
    .filter((line): line is NonNullable<typeof line> => Boolean(line));

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900">
      <MapLayerSelector
        selectedLayerId={selectedLayerId}
        onChange={setSelectedLayerId}
      />

      <MapContainer
        center={currentSpot ? [currentSpot.lat, currentSpot.lng] : TOKYO_CENTER}
        zoom={12}
        style={{ width: "100%", height: "min(58vh, 560px)" }}
      >
        <TileLayer
          attribution={selectedLayer.attribution}
          url={selectedLayer.url}
          minNativeZoom={selectedLayer.minNativeZoom}
          maxNativeZoom={selectedLayer.maxNativeZoom}
          maxZoom={18}
        />

        <MapController spots={spots} currentSpot={currentSpot} />

        {lines.map((line) => (
          <Polyline
            key={line.key}
            positions={line.positions}
            pathOptions={{
              color: "#f59e0b",
              weight: 5,
              opacity: 0.78,
              lineCap: "round",
            }}
          />
        ))}

        {spots.map((spot) => {
          const isCurrent = spot.id === currentSpotId;
          const isSelectable = selectableSet.has(spot.id);

          return (
            <CircleMarker
              key={spot.id}
              center={[spot.lat, spot.lng]}
              radius={isCurrent ? 13 : isSelectable ? 11 : 7}
              pathOptions={{
                color: isCurrent ? "#ffffff" : isSelectable ? "#111827" : "#334155",
                weight: isCurrent ? 4 : isSelectable ? 3 : 2,
                fillColor: isCurrent ? "#2563eb" : isSelectable ? "#fde047" : "#f8fafc",
                fillOpacity: 1,
              }}
              eventHandlers={{
                click: () => {
                  if (isSelectable) onSelectSpot(spot.id);
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                {isCurrent ? `現在地：${spot.name}` : spot.name}
              </Tooltip>
              <Popup>
                <strong>{spot.name}</strong>
                <br />
                {isCurrent
                  ? "現在地"
                  : isSelectable
                    ? "ここへ1マス進む"
                    : "すごろくの地点"}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
