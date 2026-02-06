"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BankSampahResponse, PaginationMeta } from "@/types/api";
import Image from "next/image";
import { Hand, Lightbulb, Sprout, Coins, Gift } from "lucide-react";

export default function UserDashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [bankSampahList, setBankSampahList] = useState<BankSampahResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPoints, setCurrentPoints] = useState(0);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 0,
  });

  useEffect(() => {
    fetchBankSampah(pagination.page, search);
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const response = await fetch("/api/user/points");
      if (response.ok) {
        const result = await response.json();
        setCurrentPoints(result.currentPoints);
      }
    } catch (error) {
      console.error("Error fetching points:", error);
    }
  };

  const fetchBankSampah = async (page = 1, searchQuery = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/user/bank-sampah?${params}`);
      if (!response.ok) throw new Error("Gagal mengambil data");

      const result = await response.json();
      setBankSampahList(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBankSampah(1, search);
  };

  const handlePageChange = (newPage: number) => {
    fetchBankSampah(newPage, search);
  };

  const isVerifiedUser = session?.user?.role === "VERIFIED_USER";

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          Selamat datang, {session?.user?.name || "User"}!
          <Hand className="w-8 h-8 text-yellow-500" strokeWidth={1.5} />
        </h1>
        <p className="text-gray-600">
          Pilih bank sampah untuk melihat edukasi pengolahan sampah
          {isVerifiedUser && " dan menyetorkan produk olahan Anda"}
        </p>
      </div>

      {/* Points Card */}
      <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-50 mb-1 flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Total Poin Anda
            </p>
            <p className="text-4xl font-bold">
              {currentPoints.toLocaleString("id-ID")}
            </p>
            <p className="text-green-50 text-sm mt-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Tukarkan poin dengan berbagai hadiah menarik!
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/user/rewards")}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg transition-all font-medium">
            <Gift className="w-5 h-5" />
            Lihat Rewards
          </button>
        </div>
      </div>

      {/* User Status Card - Only for non-verified users */}
      {!isVerifiedUser && (
        <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-start gap-4">
            <svg
              className="w-10 h-10 flex-shrink-0"
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
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Lightbulb className="w-6 h-6" strokeWidth={1.5} /> Ingin Setor
                Produk Olahan Sampah?
              </h3>
              <p className="mb-4 text-green-50">
                Anda dapat mempelajari cara mengolah sampah dari edukasi yang
                disediakan bank sampah. Untuk dapat menyetorkan produk olahan
                dan mendapatkan poin, ajukan verifikasi sebagai user
                terverifikasi!
              </p>
              <button
                onClick={() => router.push("/dashboard/user/verification")}
                className="px-6 py-2.5 bg-white text-green-600 rounded-lg hover:bg-green-50 transition font-semibold shadow-md">
                Ajukan Verifikasi Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch}>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cari bank sampah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
              Cari
            </button>
          </div>
        </form>
      </div>

      {/* Bank Sampah Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Memuat daftar bank sampah...</p>
        </div>
      ) : bankSampahList.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="w-20 h-20 text-gray-400 mx-auto mb-4"
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
          <p className="text-gray-600 text-lg">
            Tidak ada bank sampah yang ditemukan
          </p>
          {search && (
            <button
              onClick={() => {
                setSearch("");
                fetchBankSampah(1, "");
              }}
              className="mt-4 text-green-600 hover:text-green-700 font-medium">
              Tampilkan semua bank sampah
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Daftar Bank Sampah
            </h2>
            <p className="text-gray-600">
              Menampilkan {bankSampahList.length} dari {pagination.total} bank
              sampah
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bankSampahList.map((bankSampah) => (
              <div
                key={bankSampah.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
                onClick={() =>
                  router.push(`/dashboard/user/bank-sampah/${bankSampah.id}`)
                }>
                <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600">
                  {bankSampah.image ? (
                    <Image
                      src={bankSampah.image}
                      alt={bankSampah.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg
                        className="w-20 h-20 text-white opacity-80"
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
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {bankSampah.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {bankSampah.description ||
                      "Bank sampah yang siap menerima produk olahan sampah Anda"}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-gray-600 text-sm">
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      <span className="line-clamp-2">{bankSampah.address}</span>
                    </div>

                    {bankSampah.phone && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>{bankSampah.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
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
                      <span>Lihat Edukasi</span>
                    </div>
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition">
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border rounded-lg transition ${
                      page === pagination.page
                        ? "bg-green-600 text-white border-green-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}>
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition">
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <Sprout className="w-7 h-7" strokeWidth={1.5} /> Cara Kerja Platform
          Ini
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white text-green-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-semibold mb-1">Pilih Bank Sampah</p>
              <p className="text-green-50 text-sm">
                Klik salah satu bank sampah di atas untuk melihat informasi
                detail dan edukasi yang tersedia
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white text-green-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-semibold mb-1">Pelajari Edukasi</p>
              <p className="text-green-50 text-sm">
                Setiap bank sampah menyediakan konten edukasi tentang cara
                mengolah sampah menjadi produk bernilai
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white text-green-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-semibold mb-1">Setor Produk Olahan</p>
              <p className="text-green-50 text-sm">
                {isVerifiedUser
                  ? "Sebagai user terverifikasi, Anda dapat langsung menyetorkan produk olahan dan mendapat poin!"
                  : "Setelah terverifikasi, Anda bisa menyetorkan produk olahan dan mendapatkan poin yang dapat ditukarkan!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
