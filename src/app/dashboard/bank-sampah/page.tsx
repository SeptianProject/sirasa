"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BankSampahDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/bank-sampah/overview");
  }, [router]);

  return null;
}
