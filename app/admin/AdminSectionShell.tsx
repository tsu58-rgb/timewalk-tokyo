"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function AdminSectionShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSpotsMap = pathname === "/admin/spots-map";
  const isCourses = pathname === "/admin/courses";
  const showSwitcher = isSpotsMap || isCourses;

  if (!showSwitcher) return <>{children}</>;

  const href = isSpotsMap ? "/admin/courses" : "/admin/spots-map";
  const label = isSpotsMap
    ? "散歩コース管理を新しいタブで開く ↗"
    : "スポット管理を新しいタブで開く ↗";

  return (
    <div className="admin-section-shell">
      <div className="admin-section-switcher">
        <strong>{isSpotsMap ? "スポット管理" : "散歩コース管理"}</strong>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      </div>
      <div className="admin-section-content">{children}</div>

      <style jsx global>{`
        .admin-section-shell {
          min-height: 100vh;
          background: #f4f4f4;
        }
        .admin-section-switcher {
          box-sizing: border-box;
          min-height: 56px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 8px 16px;
          border-bottom: 2px solid #111;
          background: #fff;
          color: #111;
          position: relative;
          z-index: 5000;
        }
        .admin-section-switcher a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 9px 14px;
          border: 2px solid #111;
          border-radius: 8px;
          background: #111;
          color: #fff;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
        }
        .admin-section-switcher a:hover {
          background: #333;
        }
        .admin-section-content > main {
          height: calc(100vh - 56px) !important;
          min-height: calc(100vh - 56px) !important;
        }
        @media (max-width: 640px) {
          .admin-section-switcher {
            align-items: stretch;
            flex-direction: column;
          }
          .admin-section-switcher a {
            width: 100%;
            box-sizing: border-box;
          }
          .admin-section-content > main {
            height: auto !important;
            min-height: calc(100vh - 96px) !important;
          }
        }
      `}</style>
    </div>
  );
}
