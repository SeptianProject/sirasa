import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get total users count
    const totalUsers = await prisma.user.count();

    // Get pending users count
    const pendingUsers = await prisma.user.count({
      where: { status: "PENDING" },
    });

    // Get verified users count
    const verifiedUsers = await prisma.user.count({
      where: { role: "VERIFIED_USER" },
    });

    // Get bank sampah admins count
    const bankSampahAdmins = await prisma.user.count({
      where: { role: "BANK_SAMPAH_ADMIN" },
    });

    return NextResponse.json({
      totalUsers,
      pendingUsers,
      verifiedUsers,
      bankSampahAdmins,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      {
        totalUsers: 0,
        pendingUsers: 0,
        verifiedUsers: 0,
        bankSampahAdmins: 0,
      },
      { status: 500 },
    );
  }
}
