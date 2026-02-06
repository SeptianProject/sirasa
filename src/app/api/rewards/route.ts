import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/rewards - Get all available rewards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bankSampahId = searchParams.get("bankSampahId");

    const where: any = {
      stock: {
        gt: 0, // Only show rewards with available stock
      },
    };

    if (bankSampahId) {
      where.bankSampahId = bankSampahId;
    }

    const rewards = await prisma.reward.findMany({
      where,
      orderBy: {
        pointCost: "asc", // Sort by points ascending
      },
      include: {
        bankSampah: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ data: rewards });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data reward" },
      { status: 500 },
    );
  }
}
