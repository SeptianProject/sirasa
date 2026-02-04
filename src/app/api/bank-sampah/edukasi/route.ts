import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "../../../../../generated/prisma/enums";

// GET /api/bank-sampah/edukasi - Get all edukasi from bank sampah
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { bankSampah: true },
    });

    if (!user || user.role !== UserRole.BANK_SAMPAH_ADMIN || !user.bankSampah) {
      return NextResponse.json(
        { error: "Unauthorized - Bukan admin bank sampah" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const skip = (page - 1) * limit;

    const where: any = {
      bankSampahId: user.bankSampah.id,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    const [edukasiList, total] = await Promise.all([
      prisma.edukasi.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.edukasi.count({ where }),
    ]);

    return NextResponse.json({
      data: edukasiList,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching edukasi:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data edukasi" },
      { status: 500 },
    );
  }
}

// POST /api/bank-sampah/edukasi - Create new edukasi
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { bankSampah: true },
    });

    if (!user || user.role !== UserRole.BANK_SAMPAH_ADMIN || !user.bankSampah) {
      return NextResponse.json(
        { error: "Unauthorized - Bukan admin bank sampah" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { title, description, content, category, image } = body;

    // Validate required fields
    if (!title || !description || !content || !category) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    const edukasi = await prisma.edukasi.create({
      data: {
        title,
        description,
        content,
        category,
        image: image || null,
        bankSampahId: user.bankSampah.id,
      },
    });

    return NextResponse.json(
      {
        message: "Edukasi berhasil dibuat",
        data: edukasi,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating edukasi:", error);
    return NextResponse.json(
      { error: "Gagal membuat edukasi" },
      { status: 500 },
    );
  }
}
