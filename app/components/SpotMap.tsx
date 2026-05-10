"use client";
import { useEffect, useState } from "react";

import {
  GoogleMap,
  Marker,
  Circle,
  useJsApiLoader,
} from "@react-google-maps/api";

type Spot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

type Props = {
  spots: Spot[];
};

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const center = {
  lat: 35.681236,
  lng: 139.767125,
};

export default function SpotMap({ spots }: Props) {

    const [currentPosition, setCurrentPosition] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
        (pos) => {
        setCurrentPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
        });
        },
        (err) => {
        console.error(err);
        },
        {
        enableHighAccuracy: true,
        }
    );
    }, []);

  if (!isLoaded) {
    return <p className="text-white">地図を読み込み中...</p>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentPosition || center}
      zoom={12}
    >
    {currentPosition && (
    <>
        <Circle
        center={currentPosition}
        radius={50}
        options={{
            fillColor: "#4285F4",
            fillOpacity: 0.35,
            strokeColor: "#4285F4",
            strokeOpacity: 0.8,
            strokeWeight: 2,
        }}
        />

        <Marker
        position={currentPosition}
        title="現在地"        
        icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "white",
            strokeWeight: 3,
        }}
        />
    </>
    )}        
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={{
            lat: spot.lat,
            lng: spot.lng,
          }}
          title={spot.name}
        />
      ))}
    </GoogleMap>
  );
}