"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { CircleMarker, MapContainer, Pane, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type L from "leaflet";

import { clusterSpots, type ClusterItem } from "./clusterSpots";
import ClusterMarker from "./ClusterMarker";
import {
  defaultMapLayerId,
  GSI_ATTRIBUTION,
  mapLayers,
  PALE_MAP_URL,
  type MapLayerId,
} from "./mapLayers";
import MapLayerSelector from "./MapLayerSelector";
import SpotMarker, { type SpotMarkerItem } from "./SpotMarker";

type Spot = SpotMarkerItem & {
  mode: string;
};

type Props = {
  spots: Spot[];
  initialZoom?: number;
  height?: string;
  currentPosition?: [number, number] | null;
  followCurrentLocation?: boolean;
  recenterRequestKey?: number;
};

type MapItem = ClusterItem<Spot>;

const defaultCenter: [number, number] = [35.681236, 139.767125];

function RecenterMap({
  position,
  zoom,
  requestKey,
}: {
  position: [number, number];
  zoom: number;
  requestKey: number;
}) {
  const map = useMap();
  const previousRequestKey = useRef(0);

  useEffect(() => {
    if (requestKey <= 0 || requestKey === previousRequestKey.current) return;

    previousRequestKey.current = requestKey;
    map.setView(position, zoom);
  }, [position, zoom, requestKey, map]);

  return null;
}

function FitSpotsWithoutLocation({
  spots,
  hasCurrentPosition,
}: {
  spots: Spot[];
  hasCurrentPosition: boolean;
}) {
  const map = useMap();
  const fittedRef = useRef(false);

  useEffect(() => {
    if (hasCurrentPosition || fittedRef.current) return;

    const validPositions = spots
      .filter((spot) => Number.isFinite(spot.lat) && Number.isFinite(spot.lng))
      .map((spot) => [spot.lat, spot.lng] as [number, number]);

    if (validPositions.length === 0) return;

    fittedRef.current = true;

    if (validPositions.length === 1) {
      map.setView(validPositions[0], 15);
      return;
    }

    map.fitBounds(validPositions, {
      padding: [24, 24],
      maxZoom: 15,
      animate: false,
    });
  }, [spots, hasCurrentPosition, map]);

  return null;
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

export default function SpotMap({
  spots,
  initialZoom = 16,
  height = "360px",
  currentPosition,
  recenterRequestKey = 0,
}: Props) {
  const [detectedCurrentPosition, setDetectedCurrentPosition] = useState<[number, number] | null>(null);
  const [mapItems, setMapItems] = useState<MapItem[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<MapLayerId>(defaultMapLayerId);

  const selectedLayer =
    mapLayers.find((layer) => layer.id === selectedLayerId) || mapLayers[0];

  useEffect(() => {
    if (currentPosition !== undefined) return;
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectedCurrentPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error(err);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, [currentPosition]);

  const displayedCurrentPosition =
    currentPosition !== undefined ? currentPosition : detectedCurrentPosition;

  return (
    <div style={{ position: "relative" }}>
      <MapLayerSelector selectedLayerId={selectedLayerId} onChange={setSelectedLayerId} />

      <MapContainer
        center={displayedCurrentPosition || defaultCenter}
        zoom={initialZoom}
        style={{
          width: "100%",
          height,
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {selectedLayer.showPaleBase && (
          <TileLayer
            key={`pale-base-${selectedLayer.id}`}
            attribution={GSI_ATTRIBUTION}
            url={PALE_MAP_URL}
            maxNativeZoom={18}
            maxZoom={18}
          />
        )}

        <TileLayer
          key={`selected-${selectedLayer.id}`}
          attribution={selectedLayer.attribution}
          url={selectedLayer.url}
          minNativeZoom={selectedLayer.minNativeZoom}
          maxNativeZoom={selectedLayer.maxNativeZoom}
          opacity={selectedLayer.opacity ?? 1}
          maxZoom={18}
        />

        <FitSpotsWithoutLocation
          spots={spots}
          hasCurrentPosition={Boolean(displayedCurrentPosition)}
        />

        <SpotLayerController spots={spots} onItemsChange={setMapItems} />

        {displayedCurrentPosition && recenterRequestKey > 0 && (
          <RecenterMap
            position={displayedCurrentPosition}
            zoom={initialZoom}
            requestKey={recenterRequestKey}
          />
        )}

        {displayedCurrentPosition !== null && displayedCurrentPosition !== undefined && (
          <Pane name="current-location-pane" style={{ zIndex: 1000 }}>
            <CircleMarker
              center={[displayedCurrentPosition[0], displayedCurrentPosition[1]]}
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
            return <ClusterMarker key={`cluster-${item.key}`} item={item} />;
          }

          return <SpotMarker key={item.spot.id} spot={item.spot} />;
        })}
      </MapContainer>
    </div>
  );
}
