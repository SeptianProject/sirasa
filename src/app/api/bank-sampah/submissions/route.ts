import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "BANK_SAMPAH_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const statusFilter = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const bankSampah = await prisma.bankSampah.findUnique({
      where: { adminId: session.user.id },
    });

    if (!bankSampah) {
      return NextResponse.json({
        data: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      });
    }

    const where: any = {
      bankSampahId: bankSampah.id,
    };

    if (statusFilter && statusFilter !== "ALL") {
      where.status = statusFilter;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [submissions, total] = await Promise.all([
      prisma.olahanSubmission.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.olahanSubmission.count({ where }),
    ]);

    return NextResponse.json({
      data: submissions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data submission" },
      { status: 500 },
    );
  }
}
