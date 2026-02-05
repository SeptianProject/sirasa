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

    if (!id) {
      console.error("ID bank sampah tidak valid:", id);
      return NextResponse.json(
        { error: "ID bank sampah tidak valid" },
        { status: 400 },
      );
    }

    console.log("Fetching bank sampah with ID:", id);

    const bankSampah = await prisma.bankSampah.findFirst({
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
      console.error("Bank sampah not found with ID:", id);
      return NextResponse.json(
        { error: "Bank sampah tidak ditemukan atau belum disetujui" },
        { status: 404 },
      );
    }

    console.log("Bank sampah found:", bankSampah.name);
    return NextResponse.json({ data: bankSampah });
  } catch (error) {
    console.error("Error fetching bank sampah detail:", error);
    return NextResponse.json(
      { error: "Gagal mengambil detail bank sampah" },
      { status: 500 },
    );
  }
}
