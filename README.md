# SIRASA - User Management System

Sistem manajemen user untuk bank sampah dengan role-based access control (RBAC) dan approval workflow.

## 🚀 Features

- ✅ **User Authentication** dengan NextAuth
- 👥 **Role Management** (USER & ADMIN)
- ✔️ **User Approval Workflow** (PENDING, APPROVED, REJECTED)
- 🔐 **Password Hashing** dengan bcrypt
- 🔑 **Google OAuth** (optional)
- 📊 **RESTful API** untuk CRUD operations
- 🎯 **Type-safe** dengan TypeScript
- 💾 **PostgreSQL** dengan Prisma ORM
- 🛡️ **API Middleware** untuk authorization

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm atau yarn

## 🛠️ Installation & Setup

### 1. Clone & Install Dependencies

```bash
cd d:/coding/next/sirasa
npm install
```

### 2. Setup Database

Buat file `.env` dari template:

```bash
cp .env.example .env
```

Update `DATABASE_URL` dengan kredensial PostgreSQL Anda:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/sirasa?schema=public"
```

Generate `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

Copy hasilnya ke `.env`.

### 3. Run Database Migration

```bash
npx prisma migrate dev --name init_user_model
```

### 4. Seed Database (Optional)

Buat admin dan sample users:

```bash
npm run seed
```

Credentials setelah seed:

- **Admin**: admin@sirasa.com / admin123
- **User 1**: user1@example.com / password123 (APPROVED)
- **User 2**: user2@example.com / password123 (PENDING)
- **User 3**: user3@example.com / password123 (REJECTED)

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **Setup Guide**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **API Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🏗️ Project Structure

```
sirasa/
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Database seeder
│   └── migrations/          # Database migrations
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── auth/        # NextAuth endpoints
│   │       └── users/       # User CRUD API
│   │           ├── route.ts         # GET, POST users
│   │           └── [id]/
│   │               ├── route.ts     # GET, PUT, DELETE user
│   │               └── role-status/ # PATCH role/status
│   ├── lib/
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── prisma.ts        # Prisma client instance
│   │   ├── api-middleware.ts # API authorization helpers
│   │   ├── api-client.ts    # Client-side API helpers
│   │   └── validation.ts    # Input validation utilities
│   └── types/
│       ├── next-auth.d.ts   # NextAuth type extensions
│       └── api.ts           # API types
├── .env.example             # Environment variables template
└── package.json
```

## 🔑 API Endpoints

### Authentication

- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session

### User Management

- `GET /api/users` - List users (Admin only)
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get user detail
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user (Admin only)
- `PATCH /api/users/[id]/role-status` - Update role/status (Admin only)

Lihat [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) untuk detail lengkap.

## 👤 User Roles

### USER (Default)

- Pengguna biasa bank sampah
- Bisa melihat dan update profile sendiri
- Tidak bisa akses dashboard admin

### ADMIN

- Admin bank sampah
- Full access ke semua user management
- Bisa approve/reject user baru
- Bisa update role dan status user

## 📊 User Status

### PENDING (Default)

- User baru yang belum disetujui
- Tidak bisa login
- Menunggu approval dari admin

### APPROVED

- User yang sudah disetujui admin
- Bisa login dan akses sistem

### REJECTED

- User yang ditolak admin
- Tidak bisa login
- Perlu contact admin untuk info lebih lanjut

## 💻 Usage Examples

### Client-side API Calls

```typescript
import { getUsers, approveUser, promoteToAdmin } from "@/lib/api-client";

// Get all users with filters
const { users, pagination } = await getUsers({
  page: 1,
  limit: 10,
  status: "PENDING",
  search: "john",
});

// Approve a user
await approveUser("user_id");

// Promote user to admin
await promoteToAdmin("user_id");
```

### Server-side with Middleware

```typescript
import { requireAdmin } from "@/lib/api-middleware";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  // Your admin-only logic here
}
```

## 🧪 Testing

### Manual Testing dengan cURL

**Create User:**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Users (with auth):**

```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migration

## 🛡️ Security Features

- Password hashing dengan bcrypt (salt rounds: 10)
- JWT session dengan NextAuth
- Role-based access control (RBAC)
- API route protection dengan middleware
- Input validation dan sanitization
- CSRF protection (built-in NextAuth)

## 🐛 Troubleshooting

Lihat section Troubleshooting di [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting)

## 📝 Next Steps

Setelah setup selesai, Anda bisa:

1. **Dashboard Admin** - Buat UI untuk mengelola users
2. **User Profile Page** - Buat halaman profile untuk user
3. **Email Notifications** - Kirim email saat user approved/rejected
4. **Password Reset** - Implementasi fitur reset password
5. **Campus & Industry Models** - Tambah relasi ke Campus dan Industry

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is private.

---

**Built with ❤️ for Bank Sampah Management System**
