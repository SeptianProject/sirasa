"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardSidebar from "@/components/DashboardSidebar";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  verificationDocument?: string | null;
  verificationCertificate?: string | null;
  verificationRequestedAt?: string | null;
  verificationNote?: string | null;
  createdAt: string;
}

export default function SuperAdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationNote, setVerificationNote] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.role !== "SUPER_ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === "SUPER_ADMIN") {
      fetchUsers();
    }
  }, [session, filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users?filter=${filter}`);
      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Gagal mengubah role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Terjadi kesalahan saat mengubah role");
    }
  };

  const updateUserStatus = async (
    userId: string,
    newStatus: string,
    note?: string,
  ) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          verificationNote: note,
        }),
      });

      if (response.ok) {
        fetchUsers();
        setShowVerificationModal(false);
        setVerificationNote("");
        setSelectedUser(null);
      } else {
        const data = await response.json();
        alert(data.error || "Gagal mengubah status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Terjadi kesalahan saat mengubah status");
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchUsers();
        setShowDeleteModal(false);
        setSelectedUser(null);
      } else {
        const data = await response.json();
        alert(data.error || "Gagal menghapus user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Terjadi kesalahan saat menghapus user");
    }
  };

  const toggleVerification = async (user: User) => {
    const newRole = user.role === "VERIFIED_USER" ? "USER" : "VERIFIED_USER";
    const newStatus = user.role === "VERIFIED_USER" ? "PENDING" : "APPROVED";

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: newRole,
          status: newStatus,
        }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Gagal mengubah verifikasi");
      }
    } catch (error) {
      console.error("Error toggling verification:", error);
      alert("Terjadi kesalahan saat mengubah verifikasi");
    }
  };

  const sidebarItems = [
    {
      label: "Overview",
      href: "/dashboard/super-admin",
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
      label: "Kelola Pengguna",
      href: "/dashboard/super-admin/users",
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];

  // Early returns for auth checks
  if (status === "loading") {
    return (
      <DashboardLayout
        sidebar={<DashboardSidebar items={sidebarItems} title="Super Admin" />}>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-black">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (session?.user?.role !== "SUPER_ADMIN") {
    return null;
  }

  return (
    <DashboardLayout
      sidebar={<DashboardSidebar items={sidebarItems} title="Super Admin" />}>
      {loading ? (
        <div className="flex items-center justify-center min-h-100">
          <div className="text-black">Loading...</div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            Kelola Pengguna
          </h1>
          <p className="text-gray-600 mb-6">
            Verifikasi dan kelola pengguna sistem
          </p>

          {/* Filter Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={() => setFilter("all")}
                className={`pb-2 px-1 font-medium ${
                  filter === "all"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-black"
                }`}>
                Semua Pengguna
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`pb-2 px-1 font-medium ${
                  filter === "pending"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-black"
                }`}>
                Menunggu Verifikasi
              </button>
              <button
                onClick={() => setFilter("verified")}
                className={`pb-2 px-1 font-medium ${
                  filter === "verified"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-black"
                }`}>
                Terverifikasi
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pengguna
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-black">
                          {user.name || "Tidak ada nama"}
                        </div>
                        {user.verificationRequestedAt && (
                          <div className="text-xs text-gray-500">
                            Mengajukan verifikasi
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "VERIFIED_USER"
                              ? "bg-blue-100 text-blue-800"
                              : user.role === "BANK_SAMPAH_ADMIN"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                          }`}>
                          {user.role === "VERIFIED_USER"
                            ? "User Terverifikasi"
                            : user.role === "BANK_SAMPAH_ADMIN"
                              ? "Admin Bank Sampah"
                              : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : user.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}>
                          {user.status === "APPROVED"
                            ? "Disetujui"
                            : user.status === "PENDING"
                              ? "Menunggu"
                              : "Ditolak"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2 flex-wrap">
                          {/* Tombol untuk USER/VERIFIED_USER role */}
                          {(user.role === "USER" ||
                            user.role === "VERIFIED_USER") && (
                            <button
                              onClick={() => toggleVerification(user)}
                              className={`px-3 py-1 rounded text-white transition-colors ${
                                user.role === "VERIFIED_USER"
                                  ? "bg-orange-500 hover:bg-orange-600"
                                  : "bg-blue-500 hover:bg-blue-600"
                              }`}
                              title={
                                user.role === "VERIFIED_USER"
                                  ? "Batalkan Verifikasi"
                                  : "Verifikasi User"
                              }>
                              {user.role === "VERIFIED_USER" ? (
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
                              ) : (
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
                              )}
                            </button>
                          )}

                          {/* Tombol lihat dokumen verifikasi */}
                          {user.verificationDocument && (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowVerificationModal(true);
                              }}
                              className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition-colors"
                              title="Lihat Dokumen">
                              <svg
                                className="w-4 h-4"
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
                            </button>
                          )}

                          {/* Tombol hapus user */}
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                            title="Hapus User">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Tidak ada pengguna yang ditemukan
              </div>
            )}
          </div>

          {/* Modal Dokumen Verifikasi */}
          {showVerificationModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-black mb-4">
                  Dokumen Verifikasi - {selectedUser.name}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surat dari Desa:
                    </label>
                    {selectedUser.verificationDocument ? (
                      <a
                        href={selectedUser.verificationDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline">
                        Lihat Dokumen →
                      </a>
                    ) : (
                      <p className="text-gray-500">Belum diunggah</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sertifikat Sosialisasi:
                    </label>
                    {selectedUser.verificationCertificate ? (
                      <a
                        href={selectedUser.verificationCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline">
                        Lihat Sertifikat →
                      </a>
                    ) : (
                      <p className="text-gray-500">Belum diunggah</p>
                    )}
                  </div>

                  {selectedUser.verificationNote && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catatan Admin:
                      </label>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedUser.verificationNote}
                      </p>
                    </div>
                  )}

                  {selectedUser.status === "PENDING" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catatan (Opsional):
                      </label>
                      <textarea
                        value={verificationNote}
                        onChange={(e) => setVerificationNote(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                        rows={3}
                        placeholder="Tulis catatan untuk user..."
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  {selectedUser.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => {
                          updateUserStatus(
                            selectedUser.id,
                            "APPROVED",
                            verificationNote,
                          );
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                        Terima Verifikasi
                      </button>
                      <button
                        onClick={() => {
                          updateUserStatus(
                            selectedUser.id,
                            "REJECTED",
                            verificationNote,
                          );
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                        Tolak Verifikasi
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setShowVerificationModal(false);
                      setVerificationNote("");
                      setSelectedUser(null);
                    }}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition-colors">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Konfirmasi Hapus */}
          {showDeleteModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold text-black mb-4">
                  Konfirmasi Hapus User
                </h2>
                <p className="text-gray-700 mb-6">
                  Apakah Anda yakin ingin menghapus user{" "}
                  <strong>{selectedUser.name}</strong> ({selectedUser.email})?
                  <br />
                  <span className="text-red-600 text-sm">
                    Tindakan ini tidak dapat dibatalkan!
                  </span>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => deleteUser(selectedUser.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex-1">
                    Ya, Hapus
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedUser(null);
                    }}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition-colors flex-1">
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
