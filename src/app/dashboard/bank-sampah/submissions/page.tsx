"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardSidebar from "@/components/DashboardSidebar";

interface OlahanSubmission {
  id: string;
  title: string;
  description: string;
  image: string | null;
  weight: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  pointsEarned: number | null;
  rejectionReason: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

export default function SubmissionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<OlahanSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "ALL" | "PENDING" | "ACCEPTED" | "REJECTED"
  >("ALL");
  const [selectedSubmission, setSelectedSubmission] =
    useState<OlahanSubmission | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<"ACCEPT" | "REJECT" | null>(
    null,
  );
  const [points, setPoints] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.role !== "BANK_SAMPAH_ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === "BANK_SAMPAH_ADMIN") {
      fetchSubmissions();
    }
  }, [session]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bank-sampah/submissions");
      const data = await response.json();
      if (response.ok) {
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (
    submission: OlahanSubmission,
    type: "ACCEPT" | "REJECT",
  ) => {
    setSelectedSubmission(submission);
    setActionType(type);
    setShowModal(true);
    setPoints("");
    setRejectionReason("");
  };

  const handleSubmit = async () => {
    if (!selectedSubmission || !actionType) return;

    if (actionType === "ACCEPT" && !points) {
      alert("Mohon masukkan poin yang diberikan");
      return;
    }

    if (actionType === "REJECT" && !rejectionReason) {
      alert("Mohon masukkan alasan penolakan");
      return;
    }

    try {
      const response = await fetch(
        `/api/bank-sampah/submissions/${selectedSubmission.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: actionType === "ACCEPT" ? "ACCEPTED" : "REJECTED",
            pointsEarned: actionType === "ACCEPT" ? parseInt(points) : null,
            rejectionReason: actionType === "REJECT" ? rejectionReason : null,
          }),
        },
      );

      if (response.ok) {
        alert(
          `Pengajuan berhasil ${actionType === "ACCEPT" ? "diterima" : "ditolak"}`,
        );
        setShowModal(false);
        fetchSubmissions();
      } else {
        const data = await response.json();
        alert(data.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error updating submission:", error);
      alert("Terjadi kesalahan");
    }
  };

  const filteredSubmissions =
    filter === "ALL"
      ? submissions
      : submissions.filter((s) => s.status === filter);

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
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
          Pengajuan Olahan
        </h1>
        <p className="text-gray-600 mb-6">
          Kelola pengajuan olahan sampah dari pengguna
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["ALL", "PENDING", "ACCEPTED", "REJECTED"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}>
              {f === "ALL"
                ? "Semua"
                : f === "PENDING"
                  ? "Menunggu"
                  : f === "ACCEPTED"
                    ? "Diterima"
                    : "Ditolak"}
              <span className="ml-2 text-sm">
                (
                {f === "ALL"
                  ? submissions.length
                  : submissions.filter((s) => s.status === f).length}
                )
              </span>
            </button>
          ))}
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Tidak ada pengajuan</p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  {submission.image && (
                    <div className="w-full sm:w-32 h-32 flex-shrink-0">
                      <img
                        src={submission.image}
                        alt={submission.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-black">
                          {submission.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Oleh: {submission.user.name || submission.user.email}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit ${
                          submission.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : submission.status === "ACCEPTED"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}>
                        {submission.status === "PENDING"
                          ? "Menunggu"
                          : submission.status === "ACCEPTED"
                            ? "Diterima"
                            : "Ditolak"}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-3">
                      {submission.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
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
                        {submission.weight} kg
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(submission.createdAt).toLocaleDateString(
                          "id-ID",
                        )}
                      </span>
                    </div>

                    {submission.status === "ACCEPTED" &&
                      submission.pointsEarned && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                          <p className="text-sm text-green-800">
                            <strong>Poin diberikan:</strong>{" "}
                            {submission.pointsEarned} poin
                          </p>
                        </div>
                      )}

                    {submission.status === "REJECTED" &&
                      submission.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <p className="text-sm text-red-800">
                            <strong>Alasan penolakan:</strong>{" "}
                            {submission.rejectionReason}
                          </p>
                        </div>
                      )}

                    {/* Actions */}
                    {submission.status === "PENDING" && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleAction(submission, "ACCEPT")}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Terima
                        </button>
                        <button
                          onClick={() => handleAction(submission, "REJECT")}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Tolak
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-black mb-4">
              {actionType === "ACCEPT" ? "Terima Pengajuan" : "Tolak Pengajuan"}
            </h3>

            {actionType === "ACCEPT" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poin yang diberikan
                </label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Masukkan jumlah poin"
                  min="0"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alasan penolakan
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Masukkan alasan penolakan"
                  rows={4}
                />
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className={`flex-1 px-4 py-2 text-white rounded-lg ${
                  actionType === "ACCEPT"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}>
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
