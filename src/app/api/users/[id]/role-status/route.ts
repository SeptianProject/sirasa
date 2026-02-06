import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PATCH: Update role dan status user (khusus admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    // Hanya admin yang bisa update role dan status
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { role, status } = body;

    // Validasi input
    if (!role && !status) {
      return NextResponse.json(
        { error: "Role or status is required" },
        { status: 400 },
      );
    }

    // Validasi nilai role
    if (role && !["USER", "ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be USER or ADMIN" },
        { status: 400 },
      );
    }

    // Validasi nilai status
    if (status && !["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be PENDING, APPROVED, or REJECTED" },
        { status: 400 },
      );
    }

    // Build update data
    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (status !== undefined) updateData.status = status;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "User role and status updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user role/status:", error);
    return NextResponse.json(
      { error: "Failed to update user role/status" },
      { status: 500 },
    );
  }
}
