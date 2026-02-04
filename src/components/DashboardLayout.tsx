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
    <div className="flex min-h-screen bg-gray-50">
      {sidebar}
      <main className="flex-1 lg:ml-64 w-full">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
