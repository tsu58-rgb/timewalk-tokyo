"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import type { LeafletMouseEvent, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  onSelect: (lat: number, lng: number) => void;
};

function LocationMarker({ onSelect }: Props) {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  useMapEvents({
    click(e: LeafletMouseEvent) {
      setPosition(e.latlng);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default function MapPicker({ onSelect }: Props) {
  return (
    <MapContainer
      center={[35.681236, 139.767125]} // 東京駅
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onSelect={onSelect} />
    </MapContainer>
  );
}