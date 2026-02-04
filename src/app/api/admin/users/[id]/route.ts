import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { Prisma } from "@/../../generated/prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { role, status, verificationNote } = body;

    // Cek user yang akan diupdate
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Super admin tidak boleh mengelola super admin lain
    if (targetUser.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Tidak dapat mengelola Super Admin" },
        { status: 403 },
      );
    }

    const updateData: Prisma.UserUpdateInput = {};

    if (role) {
      updateData.role = role;
    }

    if (status) {
      updateData.status = status;
    }

    if (verificationNote !== undefined) {
      updateData.verificationNote = verificationNote;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE: Hapus user (hanya super admin dan tidak bisa hapus super admin lain)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super Admin access required." },
        { status: 401 },
      );
    }

    const { id } = await params;

    // Tidak boleh menghapus diri sendiri
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Tidak dapat menghapus akun sendiri" },
        { status: 400 },
      );
    }

    // Cek user yang akan dihapus
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true, email: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Super admin tidak boleh menghapus super admin lain
    if (targetUser.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Tidak dapat menghapus Super Admin lain" },
        { status: 403 },
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "User berhasil dihapus",
      email: targetUser.email,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Gagal menghapus user" },
      { status: 500 },
    );
  }
}
