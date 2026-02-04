"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BankSampahResponse, PaginationMeta } from "@/types/api";
import Image from "next/image";

export default function BankSampahPage() {
  const router = useRouter();
  const [bankSampahList, setBankSampahList] = useState<BankSampahResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 0,
  });

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
      alert("Gagal mengambil data bank sampah");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankSampah(pagination.page, search);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBankSampah(1, search);
  };

  const handlePageChange = (newPage: number) => {
    fetchBankSampah(newPage, search);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bank Sampah</h1>
        <p className="text-gray-600">
          Pilih bank sampah untuk menyetorkan produk olahan sampah Anda
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Cari bank sampah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Cari
          </button>
        </div>
      </form>

      {/* Bank Sampah Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      ) : bankSampahList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Tidak ada bank sampah yang ditemukan</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bankSampahList.map((bankSampah) => (
              <div
                key={bankSampah.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() =>
                  router.push(`/dashboard/user/bank-sampah/${bankSampah.id}`)
                }>
                <div className="relative h-48 bg-gray-200">
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
                        className="w-16 h-16 text-gray-400"
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
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {bankSampah.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {bankSampah.description || "Tidak ada deskripsi"}
                  </p>
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="line-clamp-2">{bankSampah.address}</span>
                  </div>
                  {bankSampah.phone && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                      <svg
                        className="w-5 h-5"
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
    </div>
  );
}
