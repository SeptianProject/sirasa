import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/user/edukasi/[id] - Get edukasi detail
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const edukasi = await prisma.edukasi.findUnique({
      where: { id: params.id },
      include: {
        bankSampah: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          },
        },
      },
    });

    if (!edukasi) {
      return NextResponse.json(
        { error: "Edukasi tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: edukasi });
  } catch (error) {
    console.error("Error fetching edukasi detail:", error);
    return NextResponse.json(
      { error: "Gagal mengambil detail edukasi" },
      { status: 500 },
    );
  }
}
