import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 },
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        role: "USER",
        status: "APPROVED", // Auto approve untuk user biasa
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json(
      {
        message: "Registrasi berhasil",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mendaftar" },
      { status: 500 },
    );
  }
}
