"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            SIRASA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#cara-kerja"
              className="text-foreground hover:text-primary transition">
              Cara Kerja
            </Link>
            <Link
              href="#edukasi"
              className="text-foreground hover:text-primary transition">
              Edukasi
            </Link>
            <Link
              href="#bank-sampah"
              className="text-foreground hover:text-primary transition">
              Bank Sampah
            </Link>
            <Link
              href="#benefits"
              className="text-foreground hover:text-primary transition">
              Manfaat
            </Link>
            <Link
              href="#faq"
              className="text-foreground hover:text-primary transition">
              FAQ
            </Link>
            {session ? (
              <Link
                href={
                  session.user.role === "SUPER_ADMIN"
                    ? "/dashboard/super-admin"
                    : session.user.role === "BANK_SAMPAH_ADMIN"
                      ? "/dashboard/bank-sampah"
                      : "/dashboard/user"
                }
                className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition">
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-foreground hover:text-primary transition">
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition">
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 space-y-4">
              <Link
                href="#cara-kerja"
                className="block text-foreground hover:text-primary transition"
                onClick={() => setMobileMenuOpen(false)}>
                Cara Kerja
              </Link>
              <Link
                href="#edukasi"
                className="block text-foreground hover:text-primary transition"
                onClick={() => setMobileMenuOpen(false)}>
                Edukasi
              </Link>
              <Link
                href="#bank-sampah"
                className="block text-foreground hover:text-primary transition"
                onClick={() => setMobileMenuOpen(false)}>
                Bank Sampah
              </Link>
              <Link
                href="#benefits"
                className="block text-foreground hover:text-primary transition"
                onClick={() => setMobileMenuOpen(false)}>
                Manfaat
              </Link>
              <Link
                href="#faq"
                className="block text-foreground hover:text-primary transition"
                onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </Link>
              {session ? (
                <Link
                  href={
                    session.user.role === "SUPER_ADMIN"
                      ? "/dashboard/super-admin"
                      : session.user.role === "BANK_SAMPAH_ADMIN"
                        ? "/dashboard/bank-sampah"
                        : "/dashboard/user"
                  }
                  className="block bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition text-center">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block text-foreground hover:text-primary transition">
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition text-center">
                    Daftar
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
