import {
  UserRole,
  UserStatus,
  BankSampahStatus,
  OlahanStatus,
} from "../../generated/prisma/enums";

// User Types
export interface UserResponse {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  status: UserStatus;
  image: string | null;
  campusId: string | null;
  industryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDetailResponse extends UserResponse {
  emailVerified: Date | null;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// User List Response
export interface UsersListResponse {
  users: UserResponse[];
  pagination: PaginationMeta;
}

// User Filter Types
export interface UserFilterParams {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  page?: number;
  limit?: number;
}

// User Create/Update Types
export interface CreateUserInput {
  name?: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
  campusId?: string | null;
  industryId?: string | null;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
  campusId?: string | null;
  industryId?: string | null;
  image?: string | null;
}

export interface UpdateRoleStatusInput {
  role?: UserRole;
  status?: UserStatus;
}

// API Error Response
export interface ApiError {
  error: string;
  details?: any;
}

// API Success Response
export interface ApiSuccess<T = any> {
  message?: string;
  data?: T;
}

// Bank Sampah Types
export interface BankSampahResponse {
  id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankSampahDetailResponse extends BankSampahResponse {
  admin: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface BankSampahListResponse {
  data: BankSampahResponse[];
  pagination: PaginationMeta;
}

// Olahan Submission Types
export interface OlahanSubmissionResponse {
  id: string;
  title: string;
  description: string;
  image: string | null;
  weight: number;
  status: OlahanStatus;
  pointsEarned: number | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  bankSampah: {
    id: string;
    name: string;
    address: string;
  };
}

export interface OlahanSubmissionListResponse {
  data: OlahanSubmissionResponse[];
  pagination: PaginationMeta;
}

export interface CreateOlahanSubmissionInput {
  title: string;
  description: string;
  image?: string;
  weight: number;
  bankSampahId: string;
}

export interface OlahanSubmissionFilterParams {
  status?: OlahanStatus;
  page?: number;
  limit?: number;
}
