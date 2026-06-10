"use client";

import L from "leaflet";
import { Marker, Popup, useMap } from "react-leaflet";

import { getClusterMarkerIcon } from "./mapIcons";

type Props = {
  item: {
    key: string;
    count: number;
    lat: number;
    lng: number;
  };
};

export default function ClusterMarker({ item }: Props) {
  const map = useMap();

  return (
    <Marker
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
