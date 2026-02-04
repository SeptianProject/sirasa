"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface EdukasiDetailResponse {
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
    address: string;
    phone: string | null;
  };
}

export default function EdukasiDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [edukasi, setEdukasi] = useState<EdukasiDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEdukasiDetail();
  }, [params.id]);

  const fetchEdukasiDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/edukasi/${params.id}`);
      if (!response.ok) throw new Error("Gagal mengambil data");

      const result = await response.json();
      setEdukasi(result.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengambil detail edukasi");
      router.push("/dashboard/user/edukasi");
    } finally {
      setLoading(false);
    }
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

  if (!edukasi) {
    return null;
  }

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

      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Image */}
          {edukasi.image && (
            <div className="relative h-96 bg-gray-200">
              <Image
                src={edukasi.image}
                alt={edukasi.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Meta Info */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {edukasi.category}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(edukasi.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {edukasi.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-6">{edukasi.description}</p>

            {/* Divider */}
            <hr className="my-6" />

            {/* Content */}
            <div className="prose max-w-none">
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: edukasi.content }}
              />
            </div>

            {/* Divider */}
            <hr className="my-8" />

            {/* Bank Sampah Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Dibuat oleh
              </h3>
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-800">
                    {edukasi.bankSampah.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {edukasi.bankSampah.address}
                  </p>
                  {edukasi.bankSampah.phone && (
                    <p className="text-sm text-gray-600 mt-1">
                      📞 {edukasi.bankSampah.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/dashboard/user/edukasi")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
            Lihat Edukasi Lainnya
          </button>
        </div>
      </div>
    </div>
  );
}
