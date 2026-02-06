"use client";

import { useSession } from "next-auth/react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import EdukasiSection from "@/components/landing/EdukasiSection";
import BankSampahSection from "@/components/landing/BankSampahSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <EdukasiSection />
      <BankSampahSection />
      <BenefitsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
