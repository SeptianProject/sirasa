import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting seed...");

  // Hash password untuk super admin
  const superAdminPassword = await bcrypt.hash("superadmin123", 10);

  // Buat atau update super admin user
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@sirasa.com" },
    update: {},
    create: {
      email: "superadmin@sirasa.com",
      name: "Super Admin Sirasa",
      password: superAdminPassword,
      role: "SUPER_ADMIN",
      status: "APPROVED",
    },
  });

  console.log("✅ Super Admin created/updated:", {
    id: superAdmin.id,
    email: superAdmin.email,
    role: superAdmin.role,
  });

  // Hash password untuk bank sampah admin
  const bankAdminPassword = await bcrypt.hash("banksampah123", 10);

  // Buat atau update bank sampah admin user
  const bankAdmin = await prisma.user.upsert({
    where: { email: "admin@banksampah1.com" },
    update: {},
    create: {
      email: "admin@banksampah1.com",
      name: "Admin Bank Sampah Hijau",
      password: bankAdminPassword,
      role: "BANK_SAMPAH_ADMIN",
      status: "APPROVED",
    },
  });

  console.log("✅ Bank Sampah Admin created/updated:", {
    id: bankAdmin.id,
    email: bankAdmin.email,
    role: bankAdmin.role,
  });

  // Buat bank sampah untuk admin tersebut
  const bankSampah = await prisma.bankSampah.upsert({
    where: { adminId: bankAdmin.id },
    update: {},
    create: {
      name: "Bank Sampah Hijau Lestari",
      description:
        "Bank sampah yang berkomitmen untuk lingkungan bersih dan hijau",
      address: "Jl. Lingkungan Hijau No. 123, Jakarta",
      phone: "081234567890",
      adminId: bankAdmin.id,
      status: "APPROVED",
    },
  });

  console.log("✅ Bank Sampah created/updated:", {
    id: bankSampah.id,
    name: bankSampah.name,
    status: bankSampah.status,
  });

  // Buat beberapa sample users untuk testing
  const sampleUsers = [
    {
      email: "user1@example.com",
      name: "User Satu",
      role: "USER" as const,
      status: "APPROVED" as const,
    },
    {
      email: "user2@example.com",
      name: "User Dua",
      role: "USER" as const,
      status: "PENDING" as const,
    },
    {
      email: "user3@example.com",
      name: "User Tiga",
      role: "USER" as const,
      status: "REJECTED" as const,
    },
  ];

  for (const userData of sampleUsers) {
    const hashedUserPassword = await bcrypt.hash("password123", 10);

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: hashedUserPassword,
      },
    });

    console.log(
      `✅ Sample user created/updated: ${user.email} (${user.status})`,
    );
  }

  console.log("\n📋 Seed Summary:");
  console.log("================");
  console.log("Super Admin credentials:");
  console.log("  Email: superadmin@sirasa.com");
  console.log("  Password: superadmin123");
  console.log("\nBank Sampah Admin credentials:");
  console.log("  Email: admin@banksampah1.com");
  console.log("  Password: banksampah123");
  console.log("\nSample users:");
  console.log("  user1@example.com - APPROVED (password: password123)");
  console.log("  user2@example.com - PENDING (password: password123)");
  console.log("  user3@example.com - REJECTED (password: password123)");
  console.log("================\n");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
