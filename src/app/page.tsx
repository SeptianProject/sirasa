"use client";

import Navigation from "@/components/Navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-linear-to-br from-primary to-green-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">
                Selamat Datang di Sirasa
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Sistem Informasi Pengelolaan Sampah Terintegrasi
              </p>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-white/80">
                Bergabunglah dalam gerakan pengelolaan sampah yang
                berkelanjutan. Pelajari cara mengolah sampah dan dapatkan reward
                dari kontribusi Anda.
              </p>

              {!session && (
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/auth/register"
                    className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Daftar Sekarang
                  </Link>
                  <Link
                    href="/auth/login"
                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                    Masuk
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black text-center mb-12">
              Fitur Utama
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
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
                <h3 className="text-xl font-semibold text-black mb-2">
                  Edukasi Pengolahan Sampah
                </h3>
                <p className="text-gray-600">
                  Pelajari cara mengolah sampah menjadi produk berguna seperti
                  eco-enzyme, kompos, dan lainnya.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
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
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  Ajukan Olahan Sampah
                </h3>
                <p className="text-gray-600">
                  User terverifikasi dapat mengajukan hasil olahan sampah ke
                  bank sampah terdekat.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  Dapatkan Poin & Reward
                </h3>
                <p className="text-gray-600">
                  Kumpulkan poin dari setiap kontribusi Anda dan tukarkan dengan
                  reward menarik.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Role-based Dashboard Links */}
        {session && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-black text-center mb-12">
                Dashboard Anda
              </h2>

              <div className="flex justify-center">
                {session.user.role === "SUPER_ADMIN" && (
                  <Link
                    href="/dashboard/super-admin"
                    className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-colors text-center">
                    Buka Dashboard Super Admin
                  </Link>
                )}

                {session.user.role === "BANK_SAMPAH_ADMIN" && (
                  <Link
                    href="/dashboard/bank-sampah"
                    className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-colors text-center">
                    Buka Dashboard Bank Sampah
                  </Link>
                )}

                {(session.user.role === "VERIFIED_USER" ||
                  session.user.role === "USER") && (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      {session.user.role === "USER"
                        ? "Jelajahi bank sampah dan pelajari cara mengolah sampah"
                        : "Anda dapat mengajukan olahan sampah ke bank sampah"}
                    </p>
                    <Link
                      href="/bank-sampah"
                      className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-colors inline-block">
                      Lihat Bank Sampah
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        {!session && (
          <section className="py-16 bg-primary text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Mulai Berkontribusi Hari Ini
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Daftar sekarang dan jadilah bagian dari solusi pengelolaan
                sampah yang berkelanjutan
              </p>
              <Link
                href="/auth/register"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
                Daftar Gratis
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
