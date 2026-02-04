"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardSidebar from "@/components/DashboardSidebar";

interface BankSampah {
  id: string;
  name: string;
  description: string | null;
  address: string;
  status: string;
}

interface Stats {
  totalSubmissions: number;
  pendingSubmissions: number;
  acceptedSubmissions: number;
  rejectedSubmissions: number;
  totalEdukasi: number;
}

export default function BankSampahOverview() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bankSampah, setBankSampah] = useState<BankSampah | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    acceptedSubmissions: 0,
    rejectedSubmissions: 0,
    totalEdukasi: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.role !== "BANK_SAMPAH_ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === "BANK_SAMPAH_ADMIN") {
      fetchBankSampah();
      fetchStats();
    }
  }, [session]);

  const fetchBankSampah = async () => {
    try {
      const response = await fetch("/api/bank-sampah/my-bank");
      const data = await response.json();

      if (response.ok && !data.error) {
        setBankSampah(data);
      } else {
        setBankSampah(null);
      }
    } catch (error) {
      console.error("Error fetching bank sampah:", error);
      setBankSampah(null);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bank-sampah/stats");
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
      href: "/dashboard/bank-sampah",
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
      label: "Pengajuan Olahan",
      href: "/dashboard/bank-sampah/submissions",
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      label: "Edukasi",
      href: "/dashboard/bank-sampah/edukasi",
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
  ];

  // Early returns for auth checks - without DashboardLayout
  if (status === "loading") {
    return (
      <DashboardLayout
        sidebar={<DashboardSidebar items={sidebarItems} title="Bank Sampah" />}>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-black">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (session?.user?.role !== "BANK_SAMPAH_ADMIN") {
    return null;
  }

  if (!bankSampah) {
    return (
      <DashboardLayout
        sidebar={<DashboardSidebar items={sidebarItems} title="Bank Sampah" />}>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-4">
              Anda belum memiliki Bank Sampah
            </h2>
            <p className="text-gray-600 mb-4">
              Silakan daftarkan Bank Sampah Anda terlebih dahulu
            </p>
            <button
              onClick={() => router.push("/dashboard/bank-sampah/register")}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90">
              Daftar Bank Sampah
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (bankSampah.status === "PENDING") {
    return (
      <DashboardLayout
        sidebar={<DashboardSidebar items={sidebarItems} title="Bank Sampah" />}>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-4">
              Bank Sampah Menunggu Verifikasi
            </h2>
            <p className="text-gray-600">
              Bank Sampah Anda sedang dalam proses verifikasi oleh admin.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (bankSampah.status === "REJECTED") {
    return (
      <DashboardLayout
        sidebar={<DashboardSidebar items={sidebarItems} title="Bank Sampah" />}>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-4">
              Bank Sampah Ditolak
            </h2>
            <p className="text-gray-600 mb-4">
              Maaf, pendaftaran Bank Sampah Anda ditolak. Silakan hubungi admin
              untuk informasi lebih lanjut.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      sidebar={<DashboardSidebar items={sidebarItems} title="Bank Sampah" />}>
      {loading ? (
        <div className="flex items-center justify-center min-h-100">
          <div className="text-black">Loading...</div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            {bankSampah.name}
          </h1>
          <p className="text-gray-600 mb-8">
            {bankSampah.description || "Dashboard Bank Sampah"}
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4">
            {/* Total Submissions */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Pengajuan</p>
                  <p className="text-2xl sm:text-3xl font-bold text-black">
                    {stats.totalSubmissions}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pending Submissions */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Menunggu</p>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                    {stats.pendingSubmissions}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
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

            {/* Accepted Submissions */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Diterima</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    {stats.acceptedSubmissions}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
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

            {/* Rejected Submissions */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ditolak</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600">
                    {stats.rejectedSubmissions}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Total Education Content */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Konten Edukasi</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {stats.totalEdukasi}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
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
                onClick={() =>
                  router.push("/dashboard/bank-sampah/submissions")
                }
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-black">Kelola Pengajuan</p>
                  <p className="text-sm text-gray-600">
                    Lihat dan proses pengajuan olahan sampah
                  </p>
                </div>
              </button>

              <button
                onClick={() => router.push("/dashboard/bank-sampah/edukasi")}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-black">Kelola Edukasi</p>
                  <p className="text-sm text-gray-600">
                    Tambah atau edit konten edukasi
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
