import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "BANK_SAMPAH_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bankSampah = await prisma.bankSampah.findUnique({
      where: { adminId: session.user.id },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        image: true,
        status: true,
      },
    });

    if (!bankSampah) {
      return NextResponse.json(
        { error: "Bank Sampah not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(bankSampah);
  } catch (error) {
    console.error("Error fetching bank sampah:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
