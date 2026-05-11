"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Spot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

type Props = {
  spots: Spot[];
};

const defaultCenter: [number, number] = [35.681236, 139.767125];

const spotIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function SpotMap({ spots }: Props) {
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(
    null
  );

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
    <MapContainer
      center={currentPosition || defaultCenter}
      zoom={12}
      style={{
        width: "100%",
        height: "80vh",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {currentPosition && (
        <CircleMarker
          center={currentPosition}
          radius={9}
          pathOptions={{
            color: "#ffffff",
            weight: 3,
            fillColor: "#3b82f6",
            fillOpacity: 1,
          }}
        >
          <Popup>現在地</Popup>
        </CircleMarker>
      )}

      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={spotIcon}
        >
          <Popup>
            <div>
              <strong>{spot.name}</strong>
              <br />
              <a href={`/spot/${spot.id}`}>詳細を見る</a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}