"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

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
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (!isLoaded) {
    return <p className="text-white">地図を読み込み中...</p>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
    >
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