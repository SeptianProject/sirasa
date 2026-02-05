import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/user/edukasi/[id] - Get edukasi detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      console.error("ID edukasi tidak valid:", id);
      return NextResponse.json(
        { error: "ID edukasi tidak valid" },
        { status: 400 },
      );
    }

    console.log("Fetching edukasi with ID:", id);

    const edukasi = await prisma.edukasi.findUnique({
      where: { id: id },
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
      console.error("Edukasi not found with ID:", id);
      return NextResponse.json(
        { error: "Edukasi tidak ditemukan" },
        { status: 404 },
      );
    }

    console.log("Edukasi found:", edukasi.title);
    return NextResponse.json({ data: edukasi });
  } catch (error) {
    console.error("Error fetching edukasi detail:", error);
    return NextResponse.json(
      { error: "Gagal mengambil detail edukasi" },
      { status: 500 },
    );
  }
}
