import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET: Mendapatkan daftar users dengan pagination dan filter
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Hanya admin yang bisa melihat daftar users
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          image: true,
          campusId: true,
          industryId: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

// POST: Membuat user baru (untuk admin atau registration)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const { name, email, password, role, status, campusId, industryId } = body;

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Cek apakah email sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Jika ada session dan user adalah admin, bisa set role dan status
    const userData: any = {
      name,
      email,
      password: hashedPassword,
      campusId,
      industryId,
    };

    if (session?.user.role === "ADMIN") {
      if (role) userData.role = role;
      if (status) userData.status = status;
    }

    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        image: true,
        campusId: true,
        industryId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
