import { type ReactNode } from "react";

import AdminPanelShell from "@/components/admin/AdminPanelShell";

export default function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminPanelShell>{children}</AdminPanelShell>;
}