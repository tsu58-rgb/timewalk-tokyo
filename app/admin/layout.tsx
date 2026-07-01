import type { ReactNode } from "react";

import AdminSectionShell from "./AdminSectionShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminSectionShell>{children}</AdminSectionShell>;
}
