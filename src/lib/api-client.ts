/**
 * API Client untuk User Management
 * Berisi helper functions untuk memanggil API dari client-side
 */

import { UserRole, UserStatus } from "@prisma/client";
import {
  UserResponse,
  UserDetailResponse,
  UsersListResponse,
  CreateUserInput,
  UpdateUserInput,
  UpdateRoleStatusInput,
} from "@/types/api";

const BASE_URL = "/api/users";

/**
 * Fetch daftar users dengan filter dan pagination
 */
export async function getUsers(params?: {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}): Promise<UsersListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.role) searchParams.append("role", params.role);
  if (params?.status) searchParams.append("status", params.status);
  if (params?.search) searchParams.append("search", params.search);

  const response = await fetch(`${BASE_URL}?${searchParams}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch users");
  }

  return response.json();
}

/**
 * Fetch detail user berdasarkan ID
 */
export async function getUserById(
  id: string,
): Promise<{ user: UserDetailResponse }> {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch user");
  }

  return response.json();
}

/**
 * Buat user baru
 */
export async function createUser(
  data: CreateUserInput,
): Promise<{ user: UserResponse }> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create user");
  }

  return response.json();
}

/**
 * Update user
 */
export async function updateUser(
  id: string,
  data: UpdateUserInput,
): Promise<{ user: UserResponse }> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update user");
  }

  return response.json();
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete user");
  }

  return response.json();
}

/**
 * Update role dan status user (admin only)
 */
export async function updateUserRoleStatus(
  id: string,
  data: UpdateRoleStatusInput,
): Promise<{ message: string; user: UserResponse }> {
  const response = await fetch(`${BASE_URL}/${id}/role-status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update user role/status");
  }

  return response.json();
}

/**
 * Approve user (shortcut untuk update status ke APPROVED)
 */
export async function approveUser(id: string) {
  return updateUserRoleStatus(id, { status: "APPROVED" });
}

/**
 * Reject user (shortcut untuk update status ke REJECTED)
 */
export async function rejectUser(id: string) {
  return updateUserRoleStatus(id, { status: "REJECTED" });
}

/**
 * Promote user to admin
 */
export async function promoteToAdmin(id: string) {
  return updateUserRoleStatus(id, { role: "ADMIN" });
}

/**
 * Demote admin to user
 */
export async function demoteToUser(id: string) {
  return updateUserRoleStatus(id, { role: "USER" });
}
