import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST: User mengajukan verifikasi
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { verificationDocument, verificationCertificate } = body;

    if (!verificationDocument || !verificationCertificate) {
      return NextResponse.json(
        { error: "Dokumen verifikasi dan sertifikat wajib dilampirkan" },
        { status: 400 },
      );
    }

    // Update user dengan dokumen verifikasi dan status pending
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        verificationDocument,
        verificationCertificate,
        verificationRequestedAt: new Date(),
        status: "PENDING", // Set status menjadi pending untuk review admin
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        verificationDocument: true,
        verificationCertificate: true,
        verificationRequestedAt: true,
      },
    });

    return NextResponse.json({
      message: "Permohonan verifikasi berhasil diajukan",
      user,
    });
  } catch (error) {
    console.error("Error submitting verification:", error);
    return NextResponse.json(
      { error: "Gagal mengajukan verifikasi" },
      { status: 500 },
    );
  }
}

// GET: Cek status verifikasi user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        verificationDocument: true,
        verificationCertificate: true,
        verificationRequestedAt: true,
        verificationNote: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching verification status:", error);
    return NextResponse.json(
      { error: "Gagal mengambil status verifikasi" },
      { status: 500 },
    );
  }
}
