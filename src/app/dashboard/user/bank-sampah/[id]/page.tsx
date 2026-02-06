"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { BankSampahDetailResponse } from "@/types/api";
import { Lightbulb, Lock } from "lucide-react";

interface EdukasiItem {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string | null;
  category: string;
  createdAt: Date;
}

export default function BankSampahDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const resolvedParams = use(params);
  const bankSampahId = resolvedParams.id;

  const [bankSampah, setBankSampah] = useState<BankSampahDetailResponse | null>(
    null,
  );
  const [edukasiList, setEdukasiList] = useState<EdukasiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "edukasi" | "setor">(
    "info",
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    weight: "",
    image: "",
  });

  useEffect(() => {
    const loadData = async () => {
      await fetchBankSampahDetail();
      await fetchEdukasi();
    };
    loadData();
  }, [bankSampahId]);

  const fetchBankSampahDetail = async () => {
    try {
      setLoading(true);
      console.log("Fetching bank sampah with ID:", bankSampahId);

      const response = await fetch(`/api/user/bank-sampah/${bankSampahId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengambil data");
      }

      const result = await response.json();

      if (!result.data) {
        throw new Error("Data bank sampah tidak ditemukan");
      }

      console.log("Bank sampah loaded:", result.data.name);
      setBankSampah(result.data);
    } catch (error) {
      console.error("Error fetching bank sampah:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal mengambil detail bank sampah";
      alert(errorMessage);
      router.push("/dashboard/user");
    } finally {
      setLoading(false);
    }
  };

  const fetchEdukasi = async () => {
    try {
      console.log("Fetching edukasi for bank sampah:", bankSampahId);

      // Fetch edukasi from this specific bank sampah
      const response = await fetch(
        `/api/user/edukasi?bankSampahId=${bankSampahId}&limit=10`,
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Edukasi loaded:", result.data?.length || 0, "items");
        setEdukasiList(result.data || []);
      } else {
        console.error("Failed to fetch edukasi:", response.status);
        setEdukasiList([]);
      }
    } catch (error) {
      console.error("Error fetching edukasi:", error);
      setEdukasiList([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.weight) {
      alert("Semua field harus diisi");
      return;
    }

    const weight = parseFloat(formData.weight);
    if (isNaN(weight) || weight <= 0) {
      alert("Berat harus berupa angka positif");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/user/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          weight: weight,
          image: formData.image || undefined,
          bankSampahId: bankSampahId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal membuat submission");
      }

      alert(
        "Submission berhasil dibuat! Silakan tunggu verifikasi dari bank sampah.",
      );
      router.push("/dashboard/user/submissions");
    } catch (error) {
      console.error("Error:", error);
      alert(
        error instanceof Error ? error.message : "Gagal membuat submission",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!bankSampah) {
    return null;
  }

  // Check if user is verified
  const isVerifiedUser = session?.user?.role === "VERIFIED_USER";

  return (
    <div className="p-6">
      <button
        onClick={() => router.push("/dashboard/user")}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Kembali ke Daftar Bank Sampah
      </button>

      {/* Bank Sampah Header Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="relative h-64 bg-linear-to-br from-green-400 to-green-600">
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
                className="w-32 h-32 text-white opacity-50"
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
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {bankSampah.name}
          </h1>
          <p className="text-gray-600 mb-4">
            {bankSampah.description || "Tidak ada deskripsi"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-600 shrink-0 mt-1"
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
              <div>
                <p className="text-sm text-gray-500">Alamat</p>
                <p className="text-gray-800">{bankSampah.address}</p>
              </div>
            </div>

            {bankSampah.phone && (
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-600 shrink-0 mt-1"
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
                <div>
                  <p className="text-sm text-gray-500">Telepon</p>
                  <p className="text-gray-800">{bankSampah.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-600 shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Admin</p>
                <p className="text-gray-800">
                  {bankSampah.admin.name || "Admin"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab("info")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === "info"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              Informasi
            </button>
            <button
              onClick={() => setActiveTab("edukasi")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === "edukasi"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              Edukasi ({edukasiList.length})
            </button>
            {isVerifiedUser && (
              <button
                onClick={() => setActiveTab("setor")}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === "setor"
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}>
                Setor Produk
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tentang Bank Sampah
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              {bankSampah.description ||
                "Bank sampah ini menerima berbagai jenis produk olahan sampah. Pelajari cara mengolah sampah melalui konten edukasi yang tersedia."}
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" strokeWidth={1.5} /> Cara
                Menyetorkan Produk Olahan
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-green-700">
                <li>Pelajari edukasi yang disediakan oleh bank sampah ini</li>
                <li>Buat produk olahan sampah sesuai dengan panduan edukasi</li>
                <li>
                  {isVerifiedUser
                    ? 'Klik tab "Setor Produk" untuk mengajukan submission'
                    : "Ajukan verifikasi sebagai user terverifikasi"}
                </li>
                <li>
                  Tunggu admin bank sampah memverifikasi produk olahan Anda
                </li>
                <li>Dapatkan poin setelah produk olahan Anda diterima!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {activeTab === "edukasi" && (
        <div>
          {edukasiList.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg
                className="w-20 h-20 text-gray-400 mx-auto mb-4"
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
              <p className="text-gray-600 text-lg mb-2">
                Belum ada konten edukasi
              </p>
              <p className="text-gray-500 text-sm">
                Bank sampah ini belum menyediakan konten edukasi
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {edukasiList.map((edukasi) => (
                <div
                  key={edukasi.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/user/edukasi/${edukasi.id}`)
                  }>
                  <div className="relative h-40 bg-gray-200">
                    {edukasi.image ? (
                      <Image
                        src={edukasi.image}
                        alt={edukasi.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-linear-to-br from-green-400 to-green-600">
                        <svg
                          className="w-16 h-16 text-white"
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
                        {new Date(edukasi.createdAt).toLocaleDateString(
                          "id-ID",
                        )}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {edukasi.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {edukasi.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "setor" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Setor Produk Olahan
          </h2>

          {!showForm ? (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm flex items-start gap-2">
                  <Lightbulb
                    className="w-5 h-5 shrink-0 mt-0.5"
                    strokeWidth={1.5}
                  />
                  <span>
                    <strong>Tips:</strong> Pastikan Anda sudah mempelajari
                    edukasi yang disediakan sebelum menyetorkan produk olahan
                    agar sesuai dengan standar bank sampah.
                  </span>
                </p>
              </div>
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Klik tombol di bawah untuk mulai menyetorkan produk olahan
                  sampah ke bank sampah ini.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                  Mulai Setor Produk
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Eco Enzyme Jeruk"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Produk <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Jelaskan detail produk yang akan disetor..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Berat (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="0.0"
                  step="0.1"
                  min="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Foto Produk (opsional)
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Catatan:</strong> Submission Anda akan diverifikasi
                  oleh admin bank sampah. Anda akan mendapatkan poin setelah
                  submission diterima.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  disabled={submitting}>
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? "Mengirim..." : "Kirim Submission"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Non-Verified User Message */}
      {!isVerifiedUser && (
        <div className="mt-6 bg-linear-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-start gap-4">
            <svg
              className="w-10 h-10 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Lock className="w-6 h-6" strokeWidth={1.5} /> Verifikasi
                Diperlukan
              </h3>
              <p className="mb-4 text-green-50">
                Anda masih bisa melihat dan mempelajari semua edukasi yang
                tersedia. Namun untuk dapat menyetorkan produk olahan sampah dan
                mendapatkan poin, Anda perlu menjadi user terverifikasi terlebih
                dahulu.
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
    </div>
  );
}
