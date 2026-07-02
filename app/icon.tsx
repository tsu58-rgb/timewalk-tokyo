import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #020617 0%, #0f172a 58%, #1e293b 100%)",
          color: "white",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 42,
            border: "8px solid #facc15",
            borderRadius: 112,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div style={{ fontSize: 122, fontWeight: 900, lineHeight: 1 }}>TW</div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 2, color: "#fde047" }}>
            TimeWalk
          </div>
        </div>
      </div>
    ),
    size
  );
}
