import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { BankSampahStatus } from "../../../../../../generated/prisma/enums";

// GET /api/user/bank-sampah/[id] - Get bank sampah detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const bankSampah = await prisma.bankSampah.findUnique({
      where: {
        id: id,
        status: BankSampahStatus.APPROVED,
      },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!bankSampah) {
      return NextResponse.json(
        { error: "Bank sampah tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: bankSampah });
  } catch (error) {
    console.error("Error fetching bank sampah detail:", error);
    return NextResponse.json(
      { error: "Gagal mengambil detail bank sampah" },
      { status: 500 },
    );
  }
}
