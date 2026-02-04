import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Middleware helper untuk memverifikasi user adalah admin
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 },
      ),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 },
      ),
    };
  }

  return { authorized: true, session };
}

/**
 * Middleware helper untuk memverifikasi user sudah login
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 },
      ),
    };
  }

  return { authorized: true, session };
}

/**
 * Middleware helper untuk memverifikasi user adalah pemilik resource atau admin
 */
export async function requireOwnerOrAdmin(userId: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 },
      ),
    };
  }

  const isOwner = session.user.id === userId;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error:
            "Forbidden. You don't have permission to access this resource.",
        },
        { status: 403 },
      ),
    };
  }

  return { authorized: true, session, isOwner, isAdmin };
}

/**
 * Middleware helper untuk memverifikasi user memiliki status APPROVED
 */
export async function requireApprovedUser() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 },
      ),
    };
  }

  if (session.user.status !== "APPROVED") {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Your account is not approved yet. Please contact admin." },
        { status: 403 },
      ),
    };
  }

  return { authorized: true, session };
}
