"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OlahanSubmissionResponse, PaginationMeta } from "@/types/api";
import { OlahanStatus } from "../../../../../generated/prisma/enums";
import Image from "next/image";

export default function SubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<OlahanSubmissionResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchSubmissions = async (page = 1, status = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(status && { status }),
      });

      const response = await fetch(`/api/user/submissions?${params}`);
      if (!response.ok) throw new Error("Gagal mengambil data");

      const result = await response.json();
      setSubmissions(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengambil data submission");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(pagination.page, selectedStatus);
  }, []);

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    fetchSubmissions(1, status);
  };

  const handlePageChange = (newPage: number) => {
    fetchSubmissions(newPage, selectedStatus);
  };

  const getStatusBadge = (status: OlahanStatus) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };

    const labels = {
      PENDING: "Menunggu Verifikasi",
      ACCEPTED: "Diterima",
      REJECTED: "Ditolak",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Riwayat Submission
        </h1>
        <p className="text-gray-600">
          Lihat status dan riwayat submission produk olahan sampah Anda
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => handleStatusFilter("")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedStatus === ""
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}>
          Semua
        </button>
        <button
          onClick={() => handleStatusFilter("PENDING")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedStatus === "PENDING"
              ? "bg-yellow-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}>
          Menunggu
        </button>
        <button
          onClick={() => handleStatusFilter("ACCEPTED")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedStatus === "ACCEPTED"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}>
          Diterima
        </button>
        <button
          onClick={() => handleStatusFilter("REJECTED")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedStatus === "REJECTED"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}>
          Ditolak
        </button>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
          <p className="text-gray-600 mb-4">Belum ada submission</p>
          <button
            onClick={() => router.push("/dashboard/user/bank-sampah")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Buat Submission Baru
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="w-full md:w-48 h-48 flex-shrink-0">
                    {submission.image ? (
                      <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <Image
                          src={submission.image}
                          alt={submission.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          {submission.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(submission.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        {getStatusBadge(submission.status)}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">
                      {submission.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                          />
                        </svg>
                        <span>Berat: {submission.weight} kg</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
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
                        <span>{submission.bankSampah.name}</span>
                      </div>
                    </div>

                    {submission.status === OlahanStatus.ACCEPTED &&
                      submission.pointsEarned && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-green-800 font-medium">
                            🎉 Poin diperoleh: {submission.pointsEarned} poin
                          </p>
                        </div>
                      )}

                    {submission.status === OlahanStatus.REJECTED &&
                      submission.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-800 font-medium mb-1">
                            Alasan Penolakan:
                          </p>
                          <p className="text-red-700 text-sm">
                            {submission.rejectionReason}
                          </p>
                        </div>
                      )}

                    {submission.status === OlahanStatus.PENDING && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-800 text-sm">
                          ⏳ Submission sedang diverifikasi oleh bank sampah
                        </p>
                      </div>
                    )}
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

          {/* Create New Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/dashboard/user/bank-sampah")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
              Buat Submission Baru
            </button>
          </div>
        </>
      )}
    </div>
  );
}
