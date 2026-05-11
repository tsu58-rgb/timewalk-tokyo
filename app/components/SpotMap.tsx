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
  mode: string;
};

type Props = {
  spots: Spot[];
};

const defaultCenter: [number, number] = [35.681236, 139.767125];

const spotIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
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

      {currentPosition !== null && (
        <CircleMarker
          center={[currentPosition[0], currentPosition[1]]}
          radius={16}
          pathOptions={{
            color: "#000000",
            weight: 4,
            fillColor: "#facc15",
            fillOpacity: 1,
          }}
          pane="markerPane"
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