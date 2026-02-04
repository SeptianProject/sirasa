import { UserRole, UserStatus } from "../../generated/prisma/enums";

/**
 * Validasi email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validasi password strength
 * Minimal 8 karakter
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Validasi role
 */
export function isValidRole(role: string): role is UserRole {
  return ["USER", "ADMIN"].includes(role);
}

/**
 * Validasi status
 */
export function isValidStatus(status: string): status is UserStatus {
  return ["PENDING", "APPROVED", "REJECTED"].includes(status);
}

/**
 * Sanitize user input
 */
export function sanitizeString(input: string): string {
  return input.trim();
}

/**
 * Validasi pagination parameters
 */
export function validatePagination(
  page?: string | null,
  limit?: string | null,
) {
  const defaultPage = 1;
  const defaultLimit = 10;
  const maxLimit = 100;

  const parsedPage = page ? parseInt(page) : defaultPage;
  const parsedLimit = limit ? parseInt(limit) : defaultLimit;

  return {
    page: isNaN(parsedPage) || parsedPage < 1 ? defaultPage : parsedPage,
    limit:
      isNaN(parsedLimit) || parsedLimit < 1
        ? defaultLimit
        : Math.min(parsedLimit, maxLimit),
  };
}

/**
 * Format error message
 */
export function formatErrorMessage(error: any): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (error?.message) return error.message;
  return "An unexpected error occurred";
}

/**
 * Validasi CUID format
 */
export function isValidCuid(id: string): boolean {
  // CUID starts with 'c' and is 25 characters long
  return /^c[a-z0-9]{24}$/.test(id);
}
