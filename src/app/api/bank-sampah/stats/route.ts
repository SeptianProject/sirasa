import { NextResponse } from "next/server";
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
    });

    if (!bankSampah) {
      return NextResponse.json(
        {
          totalSubmissions: 0,
          pendingSubmissions: 0,
          acceptedSubmissions: 0,
          rejectedSubmissions: 0,
          totalEdukasi: 0,
        },
        { status: 200 },
      );
    }

    // Get total submissions count
    const totalSubmissions = await prisma.olahanSubmission.count({
      where: { bankSampahId: bankSampah.id },
    });

    // Get pending submissions count
    const pendingSubmissions = await prisma.olahanSubmission.count({
      where: {
        bankSampahId: bankSampah.id,
        status: "PENDING",
      },
    });

    // Get accepted submissions count
    const acceptedSubmissions = await prisma.olahanSubmission.count({
      where: {
        bankSampahId: bankSampah.id,
        status: "ACCEPTED",
      },
    });

    // Get rejected submissions count
    const rejectedSubmissions = await prisma.olahanSubmission.count({
      where: {
        bankSampahId: bankSampah.id,
        status: "REJECTED",
      },
    });

    // Get edukasi count
    const totalEdukasi = await prisma.edukasi.count({
      where: { bankSampahId: bankSampah.id },
    });

    return NextResponse.json({
      totalSubmissions,
      pendingSubmissions,
      acceptedSubmissions,
      rejectedSubmissions,
      totalEdukasi,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      {
        totalSubmissions: 0,
        pendingSubmissions: 0,
        acceptedSubmissions: 0,
        rejectedSubmissions: 0,
        totalEdukasi: 0,
      },
      { status: 500 },
    );
  }
}
