import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/user/points - Get user's current points and history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    // Get all point transactions
    const pointTransactions = await prisma.point.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    // Calculate current balance
    const currentPoints = pointTransactions.reduce((total, transaction) => {
      return transaction.type === "EARNED"
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);

    // Get pagination params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get paginated transactions
    const paginatedTransactions = pointTransactions.slice(skip, skip + limit);

    return NextResponse.json({
      currentPoints,
      data: paginatedTransactions,
      pagination: {
        total: pointTransactions.length,
        page,
        limit,
        totalPages: Math.ceil(pointTransactions.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching points:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data poin" },
      { status: 500 },
    );
  }
}
