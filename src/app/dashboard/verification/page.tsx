"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardSidebar from "@/components/DashboardSidebar";

interface VerificationData {
  role: string;
  status: string;
  verificationDocument?: string | null;
  verificationCertificate?: string | null;
  verificationRequestedAt?: string | null;
  verificationNote?: string | null;
}

export default function VerificationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verificationData, setVerificationData] =
    useState<VerificationData | null>(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user) {
      fetchVerificationStatus();
    }
  }, [session, status, router]);

  const fetchVerificationStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/verification");

      if (response.ok) {
        const data = await response.json();
        setVerificationData(data);
      }
    } catch (error) {
      console.error("Error fetching verification status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!documentUrl.trim() || !certificateUrl.trim()) {
      setError("Semua dokumen wajib dilampirkan");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/users/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationDocument: documentUrl.trim(),
          verificationCertificate: certificateUrl.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          "Permohonan verifikasi berhasil diajukan! Mohon tunggu admin untuk meninjau dokumen Anda.",
        );
        setDocumentUrl("");
        setCertificateUrl("");
        fetchVerificationStatus();
      } else {
        setError(data.error || "Gagal mengajukan verifikasi");
      }
    } catch (error) {
      console.error("Error submitting verification:", error);
      setError("Terjadi kesalahan saat mengajukan verifikasi");
    } finally {
      setSubmitting(false);
    }
  };

  const sidebarItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
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
      label: "Pengajuan Verifikasi",
      href: "/dashboard/verification",
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
  ];

  if (status === "loading" || loading) {
    return (
      <DashboardLayout
        sidebar={<DashboardSidebar items={sidebarItems} title="Dashboard" />}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-black">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  const isVerified = verificationData?.role === "VERIFIED_USER";
  const isPending =
    verificationData?.status === "PENDING" &&
    verificationData?.verificationRequestedAt;
  const isRejected = verificationData?.status === "REJECTED";

  return (
    <DashboardLayout
      sidebar={<DashboardSidebar items={sidebarItems} title="Dashboard" />}>
      <div className="max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
          Pengajuan Verifikasi
        </h1>
        <p className="text-gray-600 mb-6">
          Ajukan verifikasi untuk menjadi pengguna terverifikasi
        </p>

        {/* Status Card */}
        {isVerified && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
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
              <div>
                <h3 className="font-semibold text-green-900 mb-1">
                  Akun Terverifikasi
                </h3>
                <p className="text-green-700 text-sm">
                  Selamat! Akun Anda sudah terverifikasi. Anda dapat menjual
                  olahan sampah ke Bank Sampah.
                </p>
              </div>
            </div>
          </div>
        )}

        {isPending && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5"
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
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">
                  Menunggu Peninjauan
                </h3>
                <p className="text-yellow-700 text-sm">
                  Permohonan verifikasi Anda sedang ditinjau oleh admin. Mohon
                  tunggu.
                </p>
                <p className="text-yellow-600 text-xs mt-2">
                  Diajukan pada:{" "}
                  {new Date(
                    verificationData.verificationRequestedAt!,
                  ).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
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
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  Permohonan Ditolak
                </h3>
                <p className="text-red-700 text-sm">
                  Permohonan verifikasi Anda ditolak. Silakan perbaiki dokumen
                  dan ajukan kembali.
                </p>
                {verificationData?.verificationNote && (
                  <div className="mt-2 p-2 bg-red-100 rounded">
                    <p className="text-red-900 text-sm font-medium">
                      Catatan Admin:
                    </p>
                    <p className="text-red-800 text-sm">
                      {verificationData.verificationNote}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Information Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Persyaratan Verifikasi
          </h3>
          <p className="text-blue-800 text-sm mb-3">
            Untuk menjadi pengguna terverifikasi dan dapat menjual olahan
            sampah, Anda perlu melampirkan:
          </p>
          <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
            <li>Surat pengantar dari kepala desa/kelurahan</li>
            <li>Sertifikat telah mengikuti sosialisasi pengolahan sampah</li>
          </ul>
          <p className="text-blue-600 text-xs mt-3">
            *Dokumen harus dalam format gambar atau PDF yang valid
          </p>
        </div>

        {/* Form - only show if not verified and not pending */}
        {!isVerified && !isPending && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold text-black mb-4">
              Form Pengajuan Verifikasi
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Surat dari Desa/Kelurahan{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={documentUrl}
                  onChange={(e) => setDocumentUrl(e.target.value)}
                  placeholder="https://example.com/surat-desa.pdf"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload dokumen ke layanan cloud (Google Drive, Dropbox, dll)
                  dan salin linknya di sini
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Sertifikat Sosialisasi{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={certificateUrl}
                  onChange={(e) => setCertificateUrl(e.target.value)}
                  placeholder="https://example.com/sertifikat.pdf"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload dokumen ke layanan cloud (Google Drive, Dropbox, dll)
                  dan salin linknya di sini
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? "Mengirim..." : "Ajukan Verifikasi"}
              </button>
            </form>
          </div>
        )}

        {/* Existing Documents - show if has documents */}
        {verificationData?.verificationDocument && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md mt-6">
            <h2 className="text-lg font-semibold text-black mb-4">
              Dokumen yang Diajukan
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Surat dari Desa:
                </label>
                <a
                  href={verificationData.verificationDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm">
                  Lihat Dokumen →
                </a>
              </div>
              {verificationData.verificationCertificate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sertifikat Sosialisasi:
                  </label>
                  <a
                    href={verificationData.verificationCertificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm">
                    Lihat Sertifikat →
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
