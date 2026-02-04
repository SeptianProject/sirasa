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
  createdAt: string;
}

export default function SuperAdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("all");

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
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  if (session?.user?.role !== "SUPER_ADMIN") {
    return null;
  }

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

  return (
    <DashboardLayout
      sidebar={<DashboardSidebar items={sidebarItems} title="Super Admin" />}>
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Kelola Pengguna</h1>
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 text-black bg-white focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="USER">User</option>
                      <option value="VERIFIED_USER">Verified User</option>
                      <option value="BANK_SAMPAH_ADMIN">
                        Bank Sampah Admin
                      </option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
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
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateUserStatus(user.id, "APPROVED")}
                          className="bg-primary text-white px-3 py-1 rounded hover:bg-opacity-90 transition-colors">
                          Terima
                        </button>
                        <button
                          onClick={() => updateUserStatus(user.id, "REJECTED")}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-opacity-90 transition-colors">
                          Tolak
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Tidak ada pengguna yang ditemukan
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
