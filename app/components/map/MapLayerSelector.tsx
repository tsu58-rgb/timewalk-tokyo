"use client";

import { mapLayers, type MapLayerId } from "./mapLayers";

type Props = {
  selectedLayerId: MapLayerId;
  onChange: (layerId: MapLayerId) => void;
};

export default function MapLayerSelector({ selectedLayerId, onChange }: Props) {
  return (
    <select
      aria-label="地図の種類"
      value={selectedLayerId}
      onChange={(event) => onChange(event.target.value as MapLayerId)}
      style={{
        position: "absolute",
        top: 12,
        left: 56,
        zIndex: 1000,
        width: 180,
        maxWidth: "52vw",
        padding: "8px 10px",
        borderRadius: 8,
        border: "1px solid #cbd5e1",
        background: "rgba(255, 255, 255, 0.96)",
        color: "#111",
        fontWeight: 700,
        boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
      }}
    >
      {mapLayers.map((layer) => (
        <option key={layer.id} value={layer.id}>
          {layer.label}
        </option>
      ))}
    </select>
  );
}
