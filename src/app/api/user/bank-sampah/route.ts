import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { BankSampahStatus } from "../../../../../generated/prisma/enums";

// GET /api/user/bank-sampah - List all approved bank sampah
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where = {
      status: BankSampahStatus.APPROVED,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { address: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [bankSampahList, total] = await Promise.all([
      prisma.bankSampah.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          phone: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.bankSampah.count({ where }),
    ]);

    return NextResponse.json({
      data: bankSampahList,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching bank sampah:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data bank sampah" },
      { status: 500 },
    );
  }
}
