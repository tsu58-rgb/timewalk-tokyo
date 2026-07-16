"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import PublicRedeployButton from "./components/PublicRedeployButton";

export default function AdminSectionShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSpotsMap = pathname === "/admin/spots-map";
  const isSeichiMap = pathname === "/admin/seichi-map";
  const isCourses = pathname === "/admin/courses";
  const showSwitcher = isSpotsMap || isSeichiMap || isCourses;

  if (!showSwitcher) return <>{children}</>;

  const currentTitle = isSpotsMap
    ? "通常スポット管理"
    : isSeichiMap
      ? "聖地巡礼スポット管理"
      : "散歩コース管理";

  const links = [
    { href: "/admin/spots-map", label: "通常スポット管理 ↗", active: isSpotsMap },
    { href: "/admin/seichi-map", label: "聖地巡礼スポット管理 ↗", active: isSeichiMap },
    { href: "/admin/courses", label: "散歩コース管理 ↗", active: isCourses },
  ].filter((item) => !item.active);

  return (
    <div className="admin-section-shell">
      <div className="admin-section-switcher">
        <strong>{currentTitle}</strong>
        <div className="admin-section-links">
          {links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className="admin-public-redeploy">
        <PublicRedeployButton />
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
        .admin-section-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
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
        .admin-public-redeploy {
          box-sizing: border-box;
          width: min(100%, 1200px);
          margin: 12px auto 0;
          padding: 0 16px;
        }
        .admin-section-content > main {
          height: calc(100vh - 56px) !important;
          min-height: calc(100vh - 56px) !important;
        }
        @media (max-width: 700px) {
          .admin-section-switcher {
            align-items: stretch;
            flex-direction: column;
          }
          .admin-section-links {
            display: grid;
            grid-template-columns: 1fr;
          }
          .admin-section-switcher a {
            width: 100%;
            box-sizing: border-box;
          }
          .admin-public-redeploy {
            padding: 0 8px;
          }
          .admin-section-content > main {
            height: auto !important;
            min-height: calc(100vh - 140px) !important;
          }
        }
      `}</style>
    </div>
  );
}
