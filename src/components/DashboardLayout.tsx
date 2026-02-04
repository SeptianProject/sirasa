"use client";

import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export default function DashboardLayout({
  children,
  sidebar,
}: DashboardLayoutProps) {
  return (
    <div className="flex">
      {sidebar}
      <main className="flex-1 ml-64 bg-white min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
