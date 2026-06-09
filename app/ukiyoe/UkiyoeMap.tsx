"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  CircleMarker,
  Pane,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { UkiyoeSpot } from "./data";
import { accuracyLabel } from "./data";

type Props = {
  spots: UkiyoeSpot[];
};

const defaultCenter: [number, number] = [35.681236, 139.767125];

const ukiyoeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 13);
  }, [position, map]);

  return null;
}

function VisibleBoundsController({
  spots,
  onVisibleSpotsChange,
}: {
  spots: UkiyoeSpot[];
  onVisibleSpotsChange: (spots: UkiyoeSpot[]) => void;
}) {
  const updateVisibleSpots = (map: L.Map) => {
    const bounds = map.getBounds();
    onVisibleSpotsChange(
      spots.filter((spot) => bounds.contains([spot.lat, spot.lng]))
    );
  };

  const map = useMapEvents({
    load: () => updateVisibleSpots(map),
    moveend: () => updateVisibleSpots(map),
    zoomend: () => updateVisibleSpots(map),
  });

  useEffect(() => {
    updateVisibleSpots(map);
  }, [spots, map]);

  return null;
}

export default function UkiyoeMap({ spots }: Props) {
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(
    null
  );
  const [visibleSpots, setVisibleSpots] = useState<UkiyoeSpot[]>([]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setCurrentPosition([pos.coords.latitude, pos.coords.longitude]),
      () => undefined,
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <MapContainer
      center={currentPosition || defaultCenter}
      zoom={12}
      style={{
        width: "100%",
        height: "78vh",
        borderRadius: "18px",
        overflow: "hidden",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <VisibleBoundsController
        spots={spots}
        onVisibleSpotsChange={setVisibleSpots}
      />

      {currentPosition && <RecenterMap position={currentPosition} />}

      {currentPosition && (
        <Pane name="ukiyoe-current-location-pane" style={{ zIndex: 1000 }}>
          <CircleMarker
            center={currentPosition}
            radius={10}
            pathOptions={{
              color: "#ffffff",
              weight: 3,
              fillColor: "#2563eb",
              fillOpacity: 1,
            }}
          >
            <Popup>現在地</Popup>
          </CircleMarker>
        </Pane>
      )}

      {visibleSpots.map((spot) => (
        <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={ukiyoeIcon}>
          <Popup>
            <div style={{ maxWidth: 220 }}>
              {spot.thumbnailUrl && (
                <img
                  src={spot.thumbnailUrl}
                  alt={spot.title}
                  style={{
                    width: "100%",
                    maxHeight: 120,
                    objectFit: "contain",
                    marginBottom: 8,
                  }}
                />
              )}
              <strong>{spot.title}</strong>
              <br />
              <span>{spot.series}</span>
              <br />
              <span>{spot.placeName} {accuracyLabel(spot.accuracy)}</span>
              <br />
              <a href={`/ukiyoe/${spot.id}`} target="_blank" rel="noreferrer">
                詳細を見る
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
