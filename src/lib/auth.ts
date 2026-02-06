/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password harus diisi");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Email atau password salah");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Email atau password salah");
        }

        return {
          id: user.id,
          email: user.email || "",
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      // Hanya fetch dari database saat user baru login atau update
      if (user) {
        token.id = user.id;
        // Fetch user role and status on first login
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id as string },
          select: {
            role: true,
            status: true,
          },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.status = dbUser.status;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Check user status
      if (user?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id as string },
          select: { status: true, role: true },
        });

        // Blok login jika status PENDING atau REJECTED (kecuali untuk admin dan super admin)
        if (
          dbUser?.role !== "SUPER_ADMIN" &&
          dbUser?.role !== "BANK_SAMPAH_ADMIN"
        ) {
          if (dbUser?.status === "PENDING") {
            throw new Error("Akun Anda masih menunggu persetujuan dari admin");
          }

          if (dbUser?.status === "REJECTED") {
            throw new Error(
              "Akun Anda ditolak oleh admin. Silakan hubungi admin untuk informasi lebih lanjut",
            );
          }
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Jika URL sudah spesifik (bukan baseUrl atau root), gunakan URL tersebut
      if (url.startsWith(baseUrl) && url !== baseUrl && url !== `${baseUrl}/`) {
        return url;
      }

      // Jika URL relatif, tambahkan baseUrl
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Default ke homepage
      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth", // Redirect ke halaman role selection
    error: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const authHandler = NextAuth(authOptions);
