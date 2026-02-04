"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface SidebarItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface DashboardSidebarProps {
  items: SidebarItem[];
  title: string;
}

export default function DashboardSidebar({
  items,
  title,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-16">
      <div className="p-6">
        <h2 className="text-xl font-bold text-black mb-6">{title}</h2>
        <nav className="space-y-2">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}>
                <span className={isActive ? "text-white" : "text-gray-500"}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
