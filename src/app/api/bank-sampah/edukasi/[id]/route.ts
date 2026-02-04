import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "../../../../../../generated/prisma/enums";

// GET /api/bank-sampah/edukasi/[id] - Get edukasi detail
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { bankSampah: true },
    });

    if (!user || user.role !== UserRole.BANK_SAMPAH_ADMIN || !user.bankSampah) {
      return NextResponse.json(
        { error: "Unauthorized - Bukan admin bank sampah" },
        { status: 403 },
      );
    }

    const edukasi = await prisma.edukasi.findFirst({
      where: {
        id: params.id,
        bankSampahId: user.bankSampah.id,
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
    console.error("Error fetching edukasi:", error);
    return NextResponse.json(
      { error: "Gagal mengambil detail edukasi" },
      { status: 500 },
    );
  }
}

// PATCH /api/bank-sampah/edukasi/[id] - Update edukasi
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { bankSampah: true },
    });

    if (!user || user.role !== UserRole.BANK_SAMPAH_ADMIN || !user.bankSampah) {
      return NextResponse.json(
        { error: "Unauthorized - Bukan admin bank sampah" },
        { status: 403 },
      );
    }

    // Check if edukasi exists and belongs to this bank sampah
    const existingEdukasi = await prisma.edukasi.findFirst({
      where: {
        id: params.id,
        bankSampahId: user.bankSampah.id,
      },
    });

    if (!existingEdukasi) {
      return NextResponse.json(
        { error: "Edukasi tidak ditemukan" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { title, description, content, category, image } = body;

    const edukasi = await prisma.edukasi.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(content && { content }),
        ...(category && { category }),
        ...(image !== undefined && { image: image || null }),
      },
    });

    return NextResponse.json({
      message: "Edukasi berhasil diupdate",
      data: edukasi,
    });
  } catch (error) {
    console.error("Error updating edukasi:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate edukasi" },
      { status: 500 },
    );
  }
}

// DELETE /api/bank-sampah/edukasi/[id] - Delete edukasi
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { bankSampah: true },
    });

    if (!user || user.role !== UserRole.BANK_SAMPAH_ADMIN || !user.bankSampah) {
      return NextResponse.json(
        { error: "Unauthorized - Bukan admin bank sampah" },
        { status: 403 },
      );
    }

    // Check if edukasi exists and belongs to this bank sampah
    const existingEdukasi = await prisma.edukasi.findFirst({
      where: {
        id: params.id,
        bankSampahId: user.bankSampah.id,
      },
    });

    if (!existingEdukasi) {
      return NextResponse.json(
        { error: "Edukasi tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.edukasi.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Edukasi berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting edukasi:", error);
    return NextResponse.json(
      { error: "Gagal menghapus edukasi" },
      { status: 500 },
    );
  }
}
