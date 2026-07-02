import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: 38,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 15,
            border: "3px solid #facc15",
            borderRadius: 38,
          }}
        />
        <div style={{ fontSize: 58, fontWeight: 900, lineHeight: 1 }}>TW</div>
      </div>
    ),
    size
  );
}
