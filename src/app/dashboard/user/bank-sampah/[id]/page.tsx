"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { BankSampahDetailResponse } from "@/types/api";

export default function BankSampahDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [bankSampah, setBankSampah] = useState<BankSampahDetailResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    weight: "",
    image: "",
  });

  useEffect(() => {
    fetchBankSampahDetail();
  }, [params.id]);

  const fetchBankSampahDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/bank-sampah/${params.id}`);
      if (!response.ok) throw new Error("Gagal mengambil data");

      const result = await response.json();
      setBankSampah(result.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengambil detail bank sampah");
      router.push("/dashboard/user/bank-sampah");
    } finally {
      setLoading(false);
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
          bankSampahId: params.id,
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
        onClick={() => router.back()}
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
        Kembali
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bank Sampah Info */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-64 bg-gray-200">
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
                  className="w-24 h-24 text-gray-400"
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {bankSampah.name}
            </h1>
            <p className="text-gray-600 mb-6">
              {bankSampah.description || "Tidak ada deskripsi"}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1"
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
                <div>
                  <p className="text-sm text-gray-500 mb-1">Alamat</p>
                  <p className="text-gray-800">{bankSampah.address}</p>
                </div>
              </div>

              {bankSampah.phone && (
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1"
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
                    <p className="text-sm text-gray-500 mb-1">Telepon</p>
                    <p className="text-gray-800">{bankSampah.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1"
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
                  <p className="text-sm text-gray-500 mb-1">Admin</p>
                  <p className="text-gray-800">
                    {bankSampah.admin.name || "Admin"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {bankSampah.admin.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Setor Produk Olahan
          </h2>

          {!isVerifiedUser ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-3">
                <svg
                  className="w-6 h-6 text-yellow-600 flex-shrink-0"
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
                <div>
                  <p className="font-medium text-yellow-800 mb-1">
                    Verifikasi Diperlukan
                  </p>
                  <p className="text-yellow-700 text-sm">
                    Hanya user terverifikasi yang dapat menyetorkan produk
                    olahan sampah. Silakan ajukan verifikasi terlebih dahulu.
                  </p>
                  <button
                    onClick={() => router.push("/dashboard/verification")}
                    className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm">
                    Ajukan Verifikasi
                  </button>
                </div>
              </div>
            </div>
          ) : !showForm ? (
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
      </div>
    </div>
  );
}
