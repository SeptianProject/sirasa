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
    const status = searchParams.get("status") || "PENDING";

    const bankSampah = await prisma.bankSampah.findUnique({
      where: { adminId: session.user.id },
    });

    if (!bankSampah) {
      return NextResponse.json([]);
    }

    const submissions = await prisma.olahanSubmission.findMany({
      where: {
        bankSampahId: bankSampah.id,
        status: status.toUpperCase() as "PENDING" | "ACCEPTED" | "REJECTED",
      },
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
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json([]);
  }
}
