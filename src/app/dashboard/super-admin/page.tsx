"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardSidebar from "@/components/DashboardSidebar";

interface Stats {
  totalUsers: number;
  pendingUsers: number;
  verifiedUsers: number;
  bankSampahAdmins: number;
}

export default function SuperAdminOverview() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    pendingUsers: 0,
    verifiedUsers: 0,
    bankSampahAdmins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.role !== "SUPER_ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === "SUPER_ADMIN") {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    {
      label: "Overview",
      href: "/dashboard/super-admin",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      label: "Kelola Pengguna",
      href: "/dashboard/super-admin/users",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];

  // Early returns for auth checks
  if (status === "loading") {
    return (
      <DashboardLayout
        sidebar={<DashboardSidebar items={sidebarItems} title="Super Admin" />}>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-black">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (session?.user?.role !== "SUPER_ADMIN") {
    return null;
  }

  return (
    <DashboardLayout
      sidebar={<DashboardSidebar items={sidebarItems} title="Super Admin" />}>
      {loading ? (
        <div className="flex items-center justify-center min-h-100">
          <div className="text-black">Loading...</div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mb-8">Ringkasan sistem Sirasa</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* Total Users */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Pengguna</p>
                  <p className="text-2xl sm:text-3xl font-bold text-black">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pending Users */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Menunggu Verifikasi
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                    {stats.pendingUsers}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Verified Users */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    User Terverifikasi
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    {stats.verifiedUsers}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bank Sampah Admins */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Admin Bank Sampah
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                    {stats.bankSampahAdmins}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
            <h2 className="text-lg sm:text-xl font-bold text-black mb-4">
              Aksi Cepat
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => router.push("/dashboard/super-admin/users")}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-black">Kelola Pengguna</p>
                  <p className="text-sm text-gray-600">
                    Verifikasi dan ubah role pengguna
                  </p>
                </div>
              </button>

              <button
                onClick={() =>
                  router.push("/dashboard/super-admin/users?filter=pending")
                }
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-black">Verifikasi Pending</p>
                  <p className="text-sm text-gray-600">
                    Lihat pengguna yang menunggu verifikasi
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
