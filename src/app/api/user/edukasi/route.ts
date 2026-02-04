import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/user/edukasi - List all edukasi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(category && { category }),
    };

    const [edukasiList, total] = await Promise.all([
      prisma.edukasi.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          bankSampah: {
            select: {
              id: true,
              name: true,
            },
          },
        },
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
