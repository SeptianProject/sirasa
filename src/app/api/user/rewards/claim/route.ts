import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/user/rewards/claim - Claim a reward
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { rewardId } = body;

    if (!rewardId) {
      return NextResponse.json(
        { error: "Reward ID diperlukan" },
        { status: 400 },
      );
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

    // Get reward details
    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      return NextResponse.json(
        { error: "Reward tidak ditemukan" },
        { status: 404 },
      );
    }

    // Check if reward has stock
    if (reward.stock <= 0) {
      return NextResponse.json({ error: "Stok reward habis" }, { status: 400 });
    }

    // Calculate current user points
    const pointTransactions = await prisma.point.findMany({
      where: { userId: user.id },
    });

    const currentPoints = pointTransactions.reduce((total, transaction) => {
      return transaction.type === "EARNED"
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);

    // Check if user has enough points
    if (currentPoints < reward.pointCost) {
      return NextResponse.json(
        {
          error: "Poin tidak mencukupi",
          currentPoints,
          requiredPoints: reward.pointCost,
        },
        { status: 400 },
      );
    }

    // Create redemption and deduct points in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create point deduction record
      const pointDeduction = await tx.point.create({
        data: {
          userId: user.id,
          amount: reward.pointCost,
          type: "REDEEMED",
          description: `Penukaran reward: ${reward.name}`,
        },
      });

      // Create redemption record
      const redemption = await tx.pointRedemption.create({
        data: {
          userId: user.id,
          rewardId: reward.id,
          pointsUsed: reward.pointCost,
          status: "PENDING",
        },
        include: {
          reward: true,
        },
      });

      // Decrease reward stock
      await tx.reward.update({
        where: { id: reward.id },
        data: {
          stock: {
            decrement: 1,
          },
        },
      });

      return { redemption, pointDeduction };
    });

    return NextResponse.json({
      message: "Reward berhasil diklaim",
      redemption: result.redemption,
      remainingPoints: currentPoints - reward.pointCost,
    });
  } catch (error) {
    console.error("Error claiming reward:", error);
    return NextResponse.json(
      { error: "Gagal mengklaim reward" },
      { status: 500 },
    );
  }
}
