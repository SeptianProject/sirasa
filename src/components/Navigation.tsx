"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  if (status === "loading") {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Sirasa</span>
          </Link>

          {/* Navigation Links & User Menu */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                {/* Role-specific navigation */}
                {session.user.role === "SUPER_ADMIN" && (
                  <Link
                    href="/dashboard/super-admin"
                    className="text-black hover:text-primary font-medium">
                    Dashboard Admin
                  </Link>
                )}

                {session.user.role === "BANK_SAMPAH_ADMIN" && (
                  <Link
                    href="/dashboard/bank-sampah"
                    className="text-black hover:text-primary font-medium">
                    Dashboard Bank Sampah
                  </Link>
                )}

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-black">
                      {session.user.name || session.user.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.user.role?.replace("_", " ")}
                    </p>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                    Keluar
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/auth/login"
                  className="text-black hover:text-primary font-medium px-4 py-2">
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90">
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
