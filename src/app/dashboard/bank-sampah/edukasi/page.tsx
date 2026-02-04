"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardSidebar from "@/components/DashboardSidebar";
import { PaginationMeta } from "@/types/api";

interface Edukasi {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function EdukasiPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [edukasiList, setEdukasiList] = useState<Edukasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEdukasi, setSelectedEdukasi] = useState<Edukasi | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters and pagination
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 0,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    image: "",
  });

  const categories = [
    { value: "", label: "Semua Kategori" },
    { value: "eco-enzyme", label: "Eco-Enzyme" },
    { value: "kompos", label: "Kompos" },
    { value: "daur-ulang", label: "Daur Ulang" },
    { value: "pemilahan", label: "Pemilahan" },
    { value: "tips-umum", label: "Tips Umum" },
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.role !== "BANK_SAMPAH_ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  const fetchEdukasi = useCallback(
    async (page = 1, searchQuery = "", category = "") => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: pagination.limit.toString(),
          ...(searchQuery && { search: searchQuery }),
          ...(category && { category }),
        });

        const response = await fetch(`/api/bank-sampah/edukasi?${params}`);
        const result = await response.json();

        if (response.ok) {
          setEdukasiList(result.data || []);
          setPagination(result.pagination || pagination);
        } else {
          console.error("Error:", result.error);
          setEdukasiList([]);
        }
      } catch (error) {
        console.error("Error fetching edukasi:", error);
        setEdukasiList([]);
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit],
  );

  useEffect(() => {
    if (session?.user?.role === "BANK_SAMPAH_ADMIN") {
      fetchEdukasi(pagination.page, search, selectedCategory);
    }
  }, [session, fetchEdukasi]);

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

  const handleOpenModal = (edukasi?: Edukasi) => {
    if (edukasi) {
      setEditMode(true);
      setSelectedEdukasi(edukasi);
      setFormData({
        title: edukasi.title,
        description: edukasi.description,
        content: edukasi.content,
        category: edukasi.category,
        image: edukasi.image || "",
      });
    } else {
      setEditMode(false);
      setSelectedEdukasi(null);
      setFormData({
        title: "",
        description: "",
        content: "",
        category: "",
        image: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedEdukasi(null);
    setFormData({
      title: "",
      description: "",
      content: "",
      category: "",
      image: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.content ||
      !formData.category
    ) {
      alert("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    try {
      setSubmitting(true);
      const url =
        editMode && selectedEdukasi
          ? `/api/bank-sampah/edukasi/${selectedEdukasi.id}`
          : "/api/bank-sampah/edukasi";

      const response = await fetch(url, {
        method: editMode ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(`Edukasi berhasil ${editMode ? "diupdate" : "ditambahkan"}`);
        handleCloseModal();
        fetchEdukasi(pagination.page, search, selectedCategory);
      } else {
        const data = await response.json();
        alert(data.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error saving edukasi:", error);
      alert("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus edukasi ini?")) return;

    try {
      const response = await fetch(`/api/bank-sampah/edukasi/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Edukasi berhasil dihapus");
        fetchEdukasi(pagination.page, search, selectedCategory);
      } else {
        const data = await response.json();
        alert(data.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error deleting edukasi:", error);
      alert("Terjadi kesalahan");
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

  if (status === "loading" || loading) {
    return (
      <DashboardLayout
        sidebar={<DashboardSidebar items={sidebarItems} title="Bank Sampah" />}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-black">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (session?.user?.role !== "BANK_SAMPAH_ADMIN") {
    return null;
  }

  return (
    <DashboardLayout
      sidebar={<DashboardSidebar items={sidebarItems} title="Bank Sampah" />}>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
              Konten Edukasi
            </h1>
            <p className="text-gray-600">
              Kelola konten edukasi pengelolaan sampah
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Edukasi
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch}>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Cari edukasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition">
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
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Edukasi List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {edukasiList.length === 0 ? (
                <div className="col-span-full bg-white border border-gray-200 rounded-lg p-8 text-center">
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
                  <p className="text-gray-500 mb-4">Belum ada konten edukasi</p>
                  {(search || selectedCategory) && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setSelectedCategory("");
                        fetchEdukasi(1, "", "");
                      }}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">
                      Reset Filter
                    </button>
                  )}
                </div>
              ) : (
                edukasiList.map((edukasi) => (
                  <div
                    key={edukasi.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {edukasi.image && (
                      <div className="w-full h-48">
                        <img
                          src={edukasi.image}
                          alt={edukasi.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-lg font-semibold text-black line-clamp-2">
                          {edukasi.title}
                        </h3>
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full whitespace-nowrap">
                          {edukasi.category}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {edukasi.description}
                      </p>

                      <div className="text-xs text-gray-500 mb-4">
                        Diperbarui:{" "}
                        {new Date(edukasi.updatedAt).toLocaleDateString(
                          "id-ID",
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(edukasi)}
                          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(edukasi.id)}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2">
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
                          ? "bg-primary text-white border-primary"
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

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8">
            <h3 className="text-xl font-bold text-black mb-4">
              {editMode ? "Edit Edukasi" : "Tambah Edukasi Baru"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Masukkan judul edukasi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required>
                  <option value="">Pilih kategori</option>
                  <option value="eco-enzyme">Eco-Enzyme</option>
                  <option value="kompos">Kompos</option>
                  <option value="daur-ulang">Daur Ulang</option>
                  <option value="pemilahan">Pemilahan</option>
                  <option value="tips-umum">Tips Umum</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Singkat <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Masukkan deskripsi singkat"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konten Lengkap (Markdown){" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                  placeholder="Masukkan konten lengkap (mendukung Markdown)"
                  rows={10}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Gambar (opsional)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? "Menyimpan..." : editMode ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
