import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/user/rewards - Get user's reward redemption history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const statusParam = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    const where: any = {
      userId: user.id,
    };

    if (statusParam) {
      where.status = statusParam;
    }

    const [redemptions, total] = await Promise.all([
      prisma.pointRedemption.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          reward: {
            select: {
              id: true,
              name: true,
              description: true,
              image: true,
              pointCost: true,
            },
          },
        },
      }),
      prisma.pointRedemption.count({ where }),
    ]);

    return NextResponse.json({
      data: redemptions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reward history:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data riwayat reward" },
      { status: 500 },
    );
  }
}
