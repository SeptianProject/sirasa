"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function UserDashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    acceptedSubmissions: 0,
    totalPoints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch user submission stats
      const submissionsResponse = await fetch(
        "/api/user/submissions?limit=100",
      );
      if (submissionsResponse.ok) {
        const submissionsData = await submissionsResponse.json();
        const submissions = submissionsData.data;

        const totalSubmissions = submissions.length;
        const pendingSubmissions = submissions.filter(
          (s: { status: string }) => s.status === "PENDING",
        ).length;
        const acceptedSubmissions = submissions.filter(
          (s: { status: string }) => s.status === "ACCEPTED",
        ).length;
        const totalPoints = submissions
          .filter((s: { status: string }) => s.status === "ACCEPTED")
          .reduce(
            (sum: number, s: { pointsEarned?: number | null }) =>
              sum + (s.pointsEarned || 0),
            0,
          );

        setStats({
          totalSubmissions,
          pendingSubmissions,
          acceptedSubmissions,
          totalPoints,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const isVerifiedUser = session?.user?.role === "VERIFIED_USER";

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Selamat datang, {session?.user?.name || "User"}! 👋
        </h1>
        <p className="text-gray-600">
          {isVerifiedUser
            ? "Anda adalah user terverifikasi. Jelajahi edukasi dan setor produk olahan sampah Anda."
            : "Jelajahi konten edukasi tentang pengolahan sampah."}
        </p>
      </div>

      {/* User Status Card */}
      {!isVerifiedUser && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <svg
              className="w-8 h-8 text-blue-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Ingin menyetorkan produk olahan sampah?
              </h3>
              <p className="text-blue-800 mb-4">
                Untuk dapat menyetorkan produk olahan sampah ke bank sampah dan
                mendapatkan poin, Anda perlu menjadi user terverifikasi terlebih
                dahulu.
              </p>
              <button
                onClick={() => router.push("/dashboard/verification")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Ajukan Verifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards - Only for verified users */}
      {isVerifiedUser && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Submission</p>
            <p className="text-3xl font-bold text-gray-800">
              {loading ? "..." : stats.totalSubmissions}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
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
            <p className="text-gray-600 text-sm mb-1">Menunggu Verifikasi</p>
            <p className="text-3xl font-bold text-gray-800">
              {loading ? "..." : stats.pendingSubmissions}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
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
            <p className="text-gray-600 text-sm mb-1">Submission Diterima</p>
            <p className="text-3xl font-bold text-gray-800">
              {loading ? "..." : stats.acceptedSubmissions}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Poin</p>
            <p className="text-3xl font-bold text-gray-800">
              {loading ? "..." : stats.totalPoints}
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Menu Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => router.push("/dashboard/user/edukasi")}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-left">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Edukasi
            </h3>
            <p className="text-gray-600 text-sm">
              Pelajari cara mengolah sampah menjadi produk bernilai
            </p>
          </button>

          {isVerifiedUser && (
            <>
              <button
                onClick={() => router.push("/dashboard/user/bank-sampah")}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-left">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Bank Sampah
                </h3>
                <p className="text-gray-600 text-sm">
                  Lihat daftar bank sampah dan setor produk olahan Anda
                </p>
              </button>

              <button
                onClick={() => router.push("/dashboard/user/submissions")}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-left">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
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
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Riwayat Submission
                </h3>
                <p className="text-gray-600 text-sm">
                  Lihat status dan riwayat submission Anda
                </p>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">
          Tentang Sistem Pengolahan Sampah
        </h2>
        <p className="mb-4">
          Platform ini membantu Anda untuk mengelola sampah dengan lebih baik.
          Pelajari cara mengolah sampah menjadi produk bernilai melalui konten
          edukasi kami.
        </p>
        {isVerifiedUser ? (
          <p>
            Sebagai user terverifikasi, Anda dapat menyetorkan produk olahan
            sampah ke bank sampah dan mendapatkan poin yang dapat ditukarkan
            dengan hadiah menarik!
          </p>
        ) : (
          <p>
            Ingin berkontribusi lebih? Ajukan verifikasi untuk dapat menyetorkan
            produk olahan sampah dan dapatkan poin yang dapat ditukarkan dengan
            hadiah!
          </p>
        )}
      </div>
    </div>
  );
}
