"use client";

import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

import { getSpotMarkerIcon } from "./mapIcons";

export type SpotMarkerItem = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  spotsImage?: string;
  description?: string;
};

type Props = {
  spot: SpotMarkerItem;
};

export default function SpotMarker({ spot }: Props) {
  return (
    <Marker
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
}
