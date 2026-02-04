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

  // Buat data edukasi untuk bank sampah
  const edukasiData = [
    {
      title: "Cara Membuat Eco-Enzyme dari Sampah Organik",
      description:
        "Panduan lengkap membuat eco-enzyme yang bermanfaat dari sisa sampah organik rumah tangga",
      content: `
# Cara Membuat Eco-Enzyme

Eco-enzyme adalah cairan hasil fermentasi sampah organik yang memiliki banyak manfaat.

## Bahan yang Diperlukan:
- 3 bagian sampah organik (kulit buah/sayur)
- 1 bagian gula merah/molases
- 10 bagian air bersih
- Wadah plastik bertutup

## Langkah Pembuatan:
1. Siapkan wadah plastik dengan tutup
2. Masukkan gula merah dan air, aduk hingga larut
3. Tambahkan sampah organik yang sudah dipotong kecil
4. Tutup wadah, biarkan 15% ruang kosong untuk gas
5. Simpan di tempat sejuk dan gelap
6. Buka tutup setiap hari untuk melepaskan gas (minggu pertama)
7. Diamkan selama 3 bulan

## Manfaat:
- Pembersih alami
- Pupuk tanaman
- Pengusir hama
- Mengurangi sampah organik

## Tips:
- Gunakan sampah organik yang segar
- Hindari sampah yang berminyak
- Pastikan rasio bahan tepat
`,
      category: "eco-enzyme",
      bankSampahId: bankSampah.id,
    },
    {
      title: "Membuat Kompos dari Sampah Dapur",
      description:
        "Tutorial mudah mengubah sampah dapur menjadi kompos berkualitas untuk tanaman",
      content: `
# Cara Membuat Kompos

Kompos adalah pupuk organik yang dibuat dari sampah organik yang terdekomposisi.

## Bahan yang Diperlukan:
- Sampah organik (sisa sayur, buah, daun)
- Tanah/kompos jadi (sebagai starter)
- EM4 atau MOL (opsional)
- Wadah komposter atau lubang tanah

## Langkah Pembuatan:
1. Pilih dan kumpulkan sampah organik
2. Potong-potong sampah menjadi ukuran kecil
3. Masukkan lapisan sampah organik ke wadah
4. Taburi tanah/kompos jadi
5. Siram dengan larutan EM4/MOL
6. Tutup rapat
7. Aduk setiap 3-5 hari
8. Tunggu 3-4 minggu hingga matang

## Ciri Kompos Matang:
- Berwarna kehitaman
- Tekstur gembur
- Tidak berbau busuk
- Suhu sudah dingin

## Manfaat:
- Menyuburkan tanaman
- Memperbaiki struktur tanah
- Mengurangi sampah organik
- Ramah lingkungan
`,
      category: "kompos",
      bankSampahId: bankSampah.id,
    },
    {
      title: "Mengolah Sampah Plastik Menjadi Ecobrick",
      description:
        "Kreasi unik mengubah sampah plastik menjadi ecobrick yang berguna",
      content: `
# Cara Membuat Ecobrick

Ecobrick adalah botol plastik yang diisi padat dengan sampah plastik bersih dan kering.

## Bahan yang Diperlukan:
- Botol plastik bening (ukuran sama)
- Sampah plastik bersih dan kering
- Tongkat/stik untuk menekan

## Langkah Pembuatan:
1. Kumpulkan dan bersihkan sampah plastik
2. Keringkan sampah plastik
3. Potong plastik menjadi potongan kecil
4. Masukkan plastik ke dalam botol
5. Tekan dengan tongkat hingga padat
6. Isi hingga botol keras seperti batu
7. Timbang (minimal 200g untuk botol 600ml)
8. Tutup rapat

## Kegunaan:
- Bahan bangunan (dinding, furniture)
- Taman vertikal
- Pagar
- Meja dan kursi

## Tips:
- Plastik harus bersih dan kering
- Isi hingga benar-benar padat
- Gunakan botol ukuran sama untuk proyek tertentu
`,
      category: "daur-ulang",
      bankSampahId: bankSampah.id,
    },
    {
      title: "Pemilahan Sampah yang Benar",
      description:
        "Panduan lengkap memilah sampah sesuai jenisnya untuk daur ulang optimal",
      content: `
# Cara Memilah Sampah

Pemilahan sampah adalah langkah awal dalam pengelolaan sampah yang baik.

## Jenis-jenis Sampah:

### 1. Sampah Organik
- Sisa makanan
- Kulit buah dan sayur
- Daun-daunan
- Kertas tisu

### 2. Sampah Anorganik
#### Plastik:
- Botol plastik
- Kemasan plastik
- Kantong plastik

#### Kertas:
- Kardus
- Kertas koran
- Majalah

#### Logam:
- Kaleng minuman
- Kemasan logam

#### Kaca:
- Botol kaca
- Pecahan kaca

### 3. Sampah B3 (Bahan Berbahaya)
- Baterai
- Lampu
- Obat kadaluarsa
- Kemasan pestisida

## Tips Pemilahan:
- Sediakan tempat sampah terpisah
- Bersihkan sampah sebelum dibuang
- Keringkan kemasan sebelum didaur ulang
- Pisahkan label dari botol
`,
      category: "pemilahan",
      bankSampahId: bankSampah.id,
    },
    {
      title: "Mengurangi Sampah dengan Prinsip 5R",
      description:
        "Implementasi prinsip 5R (Refuse, Reduce, Reuse, Recycle, Rot) dalam kehidupan sehari-hari",
      content: `
# Prinsip 5R dalam Pengelolaan Sampah

## 1. Refuse (Menolak)
Menolak menggunakan produk yang menghasilkan sampah berlebihan:
- Tolak sedotan plastik
- Tolak kantong plastik
- Tolak packaging berlebihan

## 2. Reduce (Mengurangi)
Mengurangi penggunaan barang yang tidak perlu:
- Bawa botol minum sendiri
- Bawa tas belanja sendiri
- Cetak dokumen seperlunya

## 3. Reuse (Menggunakan Kembali)
Gunakan kembali barang yang masih layak:
- Gunakan wadah makanan berulang
- Manfaatkan botol bekas untuk tempat penyimpanan
- Donasi barang yang tidak terpakai

## 4. Recycle (Daur Ulang)
Mendaur ulang sampah menjadi produk baru:
- Kirim sampah ke bank sampah
- Pisahkan sampah sesuai jenisnya
- Buat kerajinan dari barang bekas

## 5. Rot (Membusukkan)
Mengolah sampah organik:
- Buat kompos
- Buat eco-enzyme
- Budidaya maggot BSF

## Manfaat 5R:
- Mengurangi volume sampah
- Menghemat sumber daya
- Mengurangi polusi
- Menciptakan ekonomi sirkular
`,
      category: "tips-umum",
      bankSampahId: bankSampah.id,
    },
  ];

  for (const edukasi of edukasiData) {
    const created = await prisma.edukasi.upsert({
      where: {
        id: `edukasi-${edukasi.category}-${bankSampah.id}`,
      },
      update: {},
      create: {
        id: `edukasi-${edukasi.category}-${bankSampah.id}`,
        ...edukasi,
      },
    });
    console.log(`✅ Edukasi created: ${created.title}`);
  }

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
