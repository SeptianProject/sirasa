"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import Navigation from "@/components/Navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <Navigation />
      {children}
    </NextAuthSessionProvider>
  );
}
