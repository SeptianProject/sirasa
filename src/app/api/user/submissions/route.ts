import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "../../../../../generated/prisma/enums";

// GET /api/user/submissions - Get user's submission history
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const statusParam = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    const where: any = {
      userId: user.id,
    };

    if (statusParam) {
      where.status = statusParam;
    }

    const [submissions, total] = await Promise.all([
      prisma.olahanSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          bankSampah: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      }),
      prisma.olahanSubmission.count({ where }),
    ]);

    return NextResponse.json({
      data: submissions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data submission" },
      { status: 500 },
    );
  }
}

// POST /api/user/submissions - Create new submission (verified users only)
export async function POST(request: NextRequest) {
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

    // Check if user is verified
    if (user.role !== UserRole.VERIFIED_USER) {
      return NextResponse.json(
        { error: "Hanya user terverifikasi yang dapat mengirim submission" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { title, description, image, weight, bankSampahId } = body;

    // Validate required fields
    if (!title || !description || !weight || !bankSampahId) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    // Validate weight
    if (weight <= 0) {
      return NextResponse.json(
        { error: "Berat harus lebih dari 0" },
        { status: 400 },
      );
    }

    // Check if bank sampah exists and is approved
    const bankSampah = await prisma.bankSampah.findUnique({
      where: { id: bankSampahId },
    });

    if (!bankSampah || bankSampah.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Bank sampah tidak valid" },
        { status: 400 },
      );
    }

    // Create submission
    const submission = await prisma.olahanSubmission.create({
      data: {
        title,
        description,
        image: image || null,
        weight: parseFloat(weight),
        userId: user.id,
        bankSampahId,
      },
      include: {
        bankSampah: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Submission berhasil dibuat",
        data: submission,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { error: "Gagal membuat submission" },
      { status: 500 },
    );
  }
}
