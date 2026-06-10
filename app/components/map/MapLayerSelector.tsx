"use client";

import { mapLayers, type MapLayerId } from "./mapLayers";

type Props = {
  selectedLayerId: MapLayerId;
  onChange: (layerId: MapLayerId) => void;
};

export default function MapLayerSelector({ selectedLayerId, onChange }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 56,
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.95)",
        color: "#111",
        padding: "8px 10px",
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      }}
    >
      <select
        aria-label="地図の種類"
        value={selectedLayerId}
        onChange={(e) => onChange(e.target.value as MapLayerId)}
        style={{
          width: 180,
          maxWidth: "52vw",
          padding: "6px 8px",
          borderRadius: 6,
          border: "1px solid #cbd5e1",
          background: "#fff",
          color: "#111",
          fontWeight: 700,
        }}
      >
        {mapLayers.map((layer) => (
          <option key={layer.id} value={layer.id}>
            {layer.label}
          </option>
        ))}
      </select>
    </div>
  );
}
