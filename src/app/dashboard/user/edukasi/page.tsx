"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PaginationMeta } from "@/types/api";
import Image from "next/image";

interface EdukasiResponse {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string | null;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  bankSampah: {
    id: string;
    name: string;
  };
}

export default function EdukasiPage() {
  const router = useRouter();
  const [edukasiList, setEdukasiList] = useState<EdukasiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 0,
  });

  const categories = [
    { value: "", label: "Semua Kategori" },
    { value: "eco-enzyme", label: "Eco Enzyme" },
    { value: "kompos", label: "Kompos" },
    { value: "kerajinan", label: "Kerajinan" },
    { value: "daur-ulang", label: "Daur Ulang" },
  ];

  const fetchEdukasi = async (page = 1, searchQuery = "", category = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(category && { category }),
      });

      const response = await fetch(`/api/user/edukasi?${params}`);
      if (!response.ok) throw new Error("Gagal mengambil data");

      const result = await response.json();
      setEdukasiList(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengambil data edukasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEdukasi(pagination.page, search, selectedCategory);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEdukasi(1, search, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchEdukasi(1, search, category);
  };

  const handlePageChange = (newPage: number) => {
    fetchEdukasi(newPage, search, selectedCategory);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edukasi</h1>
        <p className="text-gray-600">
          Pelajari cara mengolah sampah menjadi produk bernilai
        </p>
      </div>

      {/* Filter Section */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch}>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cari edukasi..."
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

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === cat.value
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Edukasi Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      ) : edukasiList.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
          <p className="text-gray-600">Tidak ada edukasi yang ditemukan</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {edukasiList.map((edukasi) => (
              <div
                key={edukasi.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() =>
                  router.push(`/dashboard/user/edukasi/${edukasi.id}`)
                }>
                <div className="relative h-48 bg-gray-200">
                  {edukasi.image ? (
                    <Image
                      src={edukasi.image}
                      alt={edukasi.title}
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
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {edukasi.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(edukasi.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                    {edukasi.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {edukasi.description}
                  </p>
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span>{edukasi.bankSampah.name}</span>
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
    </div>
  );
}
