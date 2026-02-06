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
        "Panduan lengkap membuat eco-enzyme yang bermanfaat dari sisa sampah organik rumah tangga - Mudah, ekonomis, dan ramah lingkungan!",
      content: `
# Cara Membuat Eco-Enzyme dari Sampah Organik 🌱

**⏱️ Durasi:** 3 bulan fermentasi | **📊 Tingkat Kesulitan:** Mudah | **💰 Biaya:** Sangat Murah

## Apa itu Eco-Enzyme?

Eco-enzyme adalah cairan hasil fermentasi sampah organik (kulit buah dan sayur) dengan gula merah dan air. Cairan ajaib ini memiliki banyak manfaat untuk membersihkan rumah, menyuburkan tanaman, dan mengurangi polusi!

---

## 📋 Bahan yang Diperlukan:

**Rasio Penting: 1:3:10**
- **1 bagian** Gula merah atau molases (contoh: 100 gram)
- **3 bagian** Sampah organik segar (contoh: 300 gram)
- **10 bagian** Air bersih (contoh: 1 liter)
- **1 buah** Wadah plastik bertutup rapat (minimal 1.5 liter)

### ✅ Sampah Organik yang Cocok:
- Kulit jeruk, lemon, nanas 🍊 (paling bagus!)
- Kulit apel, pir, mangga 🍎
- Kulit sayuran (wortel, kentang)
- Batang sayuran segar

### ❌ Hindari:
- Sisa makanan berlemak/berminyak
- Tulang atau daging
- Kulit sayuran yang layu/busuk
- Daun teh bekas

---

## 🎯 Langkah-langkah Pembuatan:

### Langkah 1: Persiapan Wadah
- Pilih wadah plastik (JANGAN gunakan kaca atau logam)
- Pastikan wadah bersih dan kering
- Ukuran minimal 1.5x dari total volume bahan
- **Alasan:** Perlu ruang untuk gas fermentasi

### Langkah 2: Larutkan Gula (5 menit)
- Masukkan air bersih ke dalam wadah
- Tambahkan gula merah/molases
- Aduk hingga gula larut sempurna
- **Tips:** Air suhu ruang lebih mudah melarutkan gula

### Langkah 3: Tambahkan Sampah Organik (10 menit)
- Cuci bersih kulit buah/sayur
- Potong kecil-kecil (sekitar 2-3 cm)
- Masukkan ke dalam larutan gula
- Tekan agar semua terendam
- **Penting:** Potongan kecil = fermentasi lebih cepat!

### Langkah 4: Tutup dan Simpan
- Tutup wadah dengan rapat
- **PENTING:** Biarkan 15-20% ruang kosong untuk gas
- Tulis tanggal pembuatan di wadah
- Simpan di tempat sejuk, gelap, dan berventilasi baik
- Jauhkan dari sinar matahari langsung

### Langkah 5: Perawatan Rutin

**Minggu 1-2 (Fase Aktif):**
- Buka tutup SETIAP HARI selama 30 detik
- Keluarkan gas yang terbentuk (akan berbau asam segar)
- Tutup kembali dengan rapat
- **Normal:** Wadah akan mengembung karena gas

**Minggu 3-12:**
- Buka tutup 2-3 kali seminggu
- Gas akan berkurang bertahap
- Cairan berubah warna menjadi coklat tua

### Langkah 6: Panen (Bulan ke-3)
- Saring cairan dengan saringan atau kain
- Ampas bisa digunakan sebagai kompos
- Simpan eco-enzyme dalam botol tertutup
- Bisa bertahan hingga 2 tahun!

---

## ✨ Cara Menggunakan Eco-Enzyme:

### 🧹 Sebagai Pembersih (1:1000)
- 10 ml eco-enzyme + 1 liter air
- Untuk mengepel lantai, membersihkan kamar mandi
- Aman dan wangi alami!

### 🌿 Sebagai Pupuk Tanaman (1:1000)
- 10 ml eco-enzyme + 1 liter air
- Semprotkan ke tanaman 1-2 kali seminggu
- Membuat tanaman lebih subur dan sehat

### 🪳 Sebagai Pengusir Serangga (1:500)
- 20 ml eco-enzyme + 1 liter air
- Semprotkan di area yang ada serangga
- Alami dan tidak berbahaya

### 🚿 Membersihkan Saluran Air (murni)
- Tuang 100-200 ml langsung ke saluran
- Menghilangkan bau dan mencegah tersumbat
- Lakukan 1 bulan sekali

---

## ⚠️ Peringatan Penting:

1. **Jika Eco-Enzyme Berbau Busuk:**
   - **Penyebab:** Terlalu banyak sampah atau kurang gula
   - **Solusi:** Tambahkan gula merah, aduk, tutup lagi

2. **Jika Muncul Ulat Kecil:**
   - **Penyebab:** Tutup tidak rapat atau ada lalat masuk
   - **Solusi:** Saring, buang ulat, lanjutkan fermentasi

3. **Jika Tidak Keluar Gas:**
   - **Normal:** Setelah bulan pertama gas berkurang drastis
   - **Tidak masalah:** Lanjutkan proses hingga 3 bulan

4. **Wadah Mengembung Terlalu Besar:**
   - **Segera:** Buka tutup untuk keluarkan gas
   - **Pencegahan:** Buka tutup lebih sering minggu pertama

---

## 💡 Tips & Trik Sukses:

✅ **Gunakan kulit jeruk/lemon untuk aroma segar**
✅ **Kombinasi berbagai kulit buah untuk hasil terbaik**
✅ **Simpan di dapur (jauh dari kompor) agar tidak lupa buka tutup**
✅ **Buat label tanggal mulai dan target selesai**
✅ **Mulai dari ukuran kecil dulu (1 liter) untuk belajar**
✅ **Cairan yang sudah matang bisa jadi starter untuk batch baru**

---

## 🌍 Manfaat untuk Lingkungan:

- Mengurangi sampah organik hingga 80%
- Mengurangi gas metana dari TPA
- Tidak perlu beli pembersih kimia (hemat + sehat)
- Menghasilkan ozon (O3) yang baik untuk lingkungan
- Satu keluarga bisa mengurangi 5-10 kg sampah/bulan!

---

## ❓ Pertanyaan Umum (FAQ):

**Q: Apakah boleh menggunakan gula pasir?**
A: Boleh, tapi gula merah/molases lebih baik karena mengandung nutrisi.

**Q: Berapa lama bisa disimpan?**
A: Eco-enzyme matang bisa disimpan 2-5 tahun asalkan tertutup rapat.

**Q: Apakah harus tepat 3 bulan?**
A: Minimal 3 bulan, tapi semakin lama (hingga 6 bulan) semakin bagus.

**Q: Bolehkah dicampur dengan sabun?**
A: Boleh, tapi gunakan sabun alami/organik untuk hasil maksimal.

**Q: Aman untuk kulit?**
A: Ya, tapi encerkan dulu (1:500) dan test di sedikit area kulit.

---

**🎉 Selamat Mencoba! Mari Bersama Mengurangi Sampah dan Merawat Bumi! 🌏**
`,
      category: "eco-enzyme",
      bankSampahId: bankSampah.id,
    },
    {
      title: "Membuat Kompos dari Sampah Dapur",
      description:
        "Tutorial mudah mengubah sampah dapur menjadi pupuk organik berkualitas - Hemat, subur, dan nol sampah!",
      content: `
# Cara Membuat Kompos dari Sampah Dapur 🌾

**⏱️ Durasi:** 3-6 minggu | **📊 Tingkat Kesulitan:** Mudah | **💰 Biaya:** Gratis - Rp 50.000

## Apa itu Kompos?

Kompos adalah pupuk organik super subur hasil penguraian sampah organik oleh mikroorganisme. Dengan membuat kompos, Anda mengubah "sampah" menjadi "emas hitam" untuk tanaman!

---

## 📋 Bahan & Alat yang Diperlukan:

### Bahan Utama:
- **Sampah Hijau (Nitrogen - 60%):**
  - Sisa sayuran dan buah 🥬
  - Sisa makanan (nasi, roti tanpa daging)
  - Rumput segar
  - Ampas kopi dan teh ☕

- **Sampah Coklat (Karbon - 40%):**
  - Daun kering 🍂
  - Ranting kecil
  - Kertas/kardus (sobek kecil)
  - Serbuk gergaji

- **Starter (Aktivator):**
  - 2 genggam tanah/kompos lama
  - EM4 / MOL (Mikroorganisme Lokal) - opsional
  - Air secukupnya

### Alat:
- Wadah komposter / ember berlubang / kardus tebal
- Sekop kecil atau cangkul mini
- Terpal atau penutup
- Sarung tangan

### ❌ HINDARI Bahan Ini:
- Daging, tulang, ikan (menarik hewan)
- Produk susu (keju, yogurt)
- Minyak dan lemak
- Kotoran hewan peliharaan
- Tanaman berpenyakit
- Plastik apapun

---

## 🎯 Langkah-langkah Pembuatan:

### Persiapan Awal (Hari 1):

**Langkah 1: Siapkan Wadah (15 menit)**
- Jika pakai ember: Lubangi bagian bawah & samping (diameter 1cm, jarak 10cm)
- Jika pakai kardus: Lapisi dalam dengan plastik berlubang
- Letakkan di tempat teduh, tidak hujan, ada sirkulasi udara
- **Ukuran ideal:** Minimal 40x40x40 cm

**Langkah 2: Lapisan Dasar (5 menit)**
- Masukkan ranting/kayu kecil di dasar (5-10 cm)
- Fungsi: Drainase dan sirkulasi udara
- Tambahkan segenggam tanah

**Langkah 3: Potong Sampah (20 menit)**
- Potong semua sampah ukuran 2-5 cm
- **Penting:** Makin kecil = makin cepat jadi!
- Pisahkan hijau dan coklat

**Langkah 4: Susun Berlapis (30 menit)**
- Lapisan 1: Sampah hijau (10 cm)
- Lapisan 2: Sampah coklat (5 cm)
- Lapisan 3: Taburi tanah tipis
- Siram air hingga lembap (seperti kain pel diperas)
- Ulangi hingga wadah hampir penuh
- Sisakan 10 cm dari atas

**Langkah 5: Aktivator (jika ada)**
- Larutkan 1 tutup botol EM4 dalam 1 liter air
- Siram merata ke seluruh tumpukan
- Atau: Taburkan MOL setiap lapisan

**Langkah 6: Tutup Rapat**
- Tutup dengan terpal/penutup
- Ikat atau tekan agar rapat
- **Tujuan:** Menjaga kelembapan & suhu

---

### Perawatan Rutin:

**Minggu 1-2:**
- **Hari 3:** Buka, aduk/balik semua bahan (10 menit)
- **Hari 7:** Aduk lagi, cek kelembapan
- Jika terlalu kering → siram sedikit air
- Jika terlalu basah → tambah sampah coklat
- **Normal:** Suhu naik (40-60°C), terasa hangat
- **Normal:** Bau asam seperti tanah basah

**Minggu 3-4:**
- Aduk setiap 5-7 hari
- Suhu mulai turun
- Warna berubah coklat kehitaman
- Volume menyusut 50%

**Minggu 5-6:**
- Aduk 1-2 kali saja
- Tekstur sudah gembur
- Bau seperti tanah hutan

---

## ✅ Tanda Kompos SUDAH MATANG:

1. ✓ Warna coklat tua kehitaman
2. ✓ Tekstur gembur seperti tanah
3. ✓ Bau wangi seperti tanah basah (TIDAK busuk!)
4. ✓ Suhu sudah dingin (suhu ruangan)
5. ✓ Tidak ada sisa sampah yang terlihat jelas
6. ✓ Jika diremas, remah dan tidak lengket

### 📝 Tes Sederhana:
- Ambil segenggam kompos
- Tanam biji cabai/kangkung
- Jika tumbuh bagus dalam 3-5 hari → Kompos SIAP!

---

## 🎨 Cara Menggunakan Kompos:

### Untuk Pot Tanaman:
- **Campuran:** 1 kompos : 2 tanah biasa
- Aduk rata, siap tanam!

### Untuk Kebun:
- Taburkan 2-5 cm di permukaan tanah
- Aduk dengan cangkul
- Siram, tunggu 1 minggu, baru tanam

### Sebagai Pupuk Tambahan:
- Taburkan 1 genggam di sekitar pohon
- 1-2 kali per bulan

### Pupuk Cair:
- 1 genggam kompos + 5 liter air
- Rendam 24 jam, aduk sesekali
- Saring, gunakan untuk menyiram

---

## ⚠️ Troubleshooting - Atasi Masalah:

### 🐛 **Problem: Muncul Belatung/Lalat**
- **Penyebab:** Ada sisa daging atau tidak tertutup rapat
- **Solusi:** 
  - Kubur belatung dengan tanah
  - Tutup rapat dan periksa celah
  - Tambahkan daun kering tebal di atas

### 😷 **Problem: Bau Busuk Menyengat**
- **Penyebab:** Terlalu basah atau terlalu banyak sampah hijau
- **Solusi:**
  - Tambah BANYAK sampah coklat (daun kering)
  - Aduk dan biarkan terbuka 1-2 jam
  - Tidak perlu disiram dulu

### 🔥 **Problem: Tidak Panas/Tidak Terurai**
- **Penyebab:** Terlalu kering atau kurang sampah hijau
- **Solusi:**
  - Siram dengan air hangat + EM4
  - Tambah sampah hijau segar
  - Aduk dan tutup rapat

### 🦠 **Problem: Ada Jamur Putih**
- **Status:** INI BAGUS! Jamur = pengurai aktif
- **Aksi:** Lanjutkan saja, aduk seperti biasa

### 🌫️ **Problem: Kering dan Tidak Mengurai**
- **Penyebab:** Kurang air
- **Solusi:**
  - Siram perlahan sambil diaduk
  - Tes: Jika diperas keluar 1-2 tetes air = pas!

---

## 💡 Tips Ahli untuk Hasil Maksimal:

✅ **Mulai dari Kecil:**
Pemula? Coba sampah 1 hari dulu. Sukses? Naikkan bertahap!

✅ **Buat Kompos Secara Berkelanjutan:**
Siapkan 2 wadah: 1 aktif diisi, 1 sedang matang

✅ **Campur dengan Kotoran Ternak:**
Ada kotoran kambing/sapi? Campur 20% = kompos super subur!

✅ **Simpan Daun Kering:**
Kumpulkan daun kering banyak-banyak untuk stok sampah coklat

✅ **Pakai Kardus Bekas:**
Kardus tebal bisa jadi komposter gratis! Sobek dan campur kalau sudah rusak

✅ **Ayak Kompos Sebelum Pakai:**
Gunakan ayakan untuk pisahkan yang halus dan kasar

✅ **Simpan Kompos dengan Benar:**
- Simpan di tempat kering dalam karung
- Bisa tahan 6-12 bulan
- Tetap tertutup agar nutrisi tidak hilang

---

## 🌍 Dampak Positif untuk Lingkungan:

- **Mengurangi Sampah:** 1 keluarga = 40-60% sampah dapur teratasi!
- **Mengurangi Gas Metana:** Sampah organik di TPA = gas rumah kaca
- **Hemat Uang:** Tidak perlu beli pupuk kimia
- **Tanaman Lebih Sehat:** Pupuk organik lebih tahan lama
- **Tanah Lebih Baik:** Struktur tanah membaik jangka panjang

📊 **Fakta:** 1 keluarga bisa mengolah 500 kg sampah/tahun menjadi 100 kg kompos!

---

## ❓ Pertanyaan yang Sering Ditanya:

**Q: Berapa lama kompos bisa digunakan?**
A: Minimal 3 minggu, ideal 6 minggu. Makin lama makin baik (maksimal 3 bulan).

**Q: Apakah harus pakai EM4?**
A: Tidak wajib! EM4 hanya mempercepat (dari 6 minggu jadi 3-4 minggu).

**Q: Bolehkah di dalam rumah?**
A: Boleh, asal tertutup rapat dan ada sirkulasi. Tapi lebih baik di luar.

**Q: Kalau hujan gimana?**
A: Tutup dengan terpal atau plastik. Jangan sampai terlalu basah.

**Q: Bisa untuk tanaman hias dalam pot?**
A: SANGAT bisa! Campurkan 30% kompos + 70% tanah.

**Q: Sampah buah naga/nanas boleh?**
A: Boleh, tapi potong kecil-kecil karena lama terurai.

**Q: Kalau di apartemen?**
A: Pakai komposter kecil (20L) di balkon. Atau coba metode Takakura/bokashi.

---

**🌱 Selamat Berkompos! Jadilah Pahlawan Lingkungan dari Dapur Anda! 🌱**
`,
      category: "kompos",
      bankSampahId: bankSampah.id,
    },
    {
      title: "Mengolah Sampah Plastik Menjadi Ecobrick",
      description:
        "Ubah botol plastik bekas menjadi bata ramah lingkungan - Kokoh, tahan lama, dan menyelamatkan planet!",
      content: `
# Cara Membuat Ecobrick - Bata dari Sampah Plastik 🧱

**⏱️ Durasi:** 1-4 jam per botol | **📊 Tingkat Kesulitan:** Mudah tapi butuh kesabaran | **💰 Biaya:** GRATIS

## Apa itu Ecobrick?

Ecobrick adalah botol plastik PET yang diisi padat dengan sampah plastik bersih dan kering hingga mencapai kepadatan tertentu. Ecobrick bisa digunakan sebagai bahan bangunan modular yang kuat, tahan lama, dan ramah lingkungan!

**💪 Fun Fact:** 1 ecobrick = menyelamatkan ±200 gram plastik dari lautan dan TPA!

---

## 📋 Alat & Bahan yang Diperlukan:

### Bahan Utama:
- **Botol Plastik PET:**
  - Botol minuman 600ml (paling umum) 🍾
  - Atau botol 1.5L untuk proyek besar
  - Bersih, kering, dengan tutup
  - Botol HARUS bening/transparan
  - **Syarat:** Semua botol harus ukuran SAMA untuk 1 proyek

- **Sampah Plastik:**
  - Kemasan snack/makanan 🍪
  - Kantong plastik (kresek)
  - Plastik kemasan bubblewrap
  - Label botol/kemasan
  - Sedotan plastik
  - Styrofoam (potong kecil)

### Alat:
- Tongkat kayu/bambu (diameter 1-2 cm, panjang 30 cm)
- Atau: Gagang sapu tua, pensil tebal, sumpit panjang
- Gunting
- Timbangan (opsional tapi sangat direkomendasikan)
- Spidol permanent (untuk label)

### ❌ JANGAN Masukkan:
- Plastik basah atau kotor
- Plastik biodegradable
- Baterai atau elektronik
- Kaca atau logam
- Kardus atau kertas
- Material beracun

---

## 🎯 Langkah-langkah Pembuatan:

### Tahap Persiapan:

**Langkah 1: Bersihkan Botol (5 menit)**
- Cuci botol dengan sabun
- Bilas sampai bersih
- Keringkan SEMPURNA (tunggu 24 jam atau jemur)
- Pastikan tidak ada air sedikitpun
- **Penting:** Botol basah = ecobrick gagal (jamuran/rusak)

**Langkah 2: Kumpulkan Plastik (ongoing)**
- Kumpulkan plastik bekas selama 1-2 minggu
- Cuci semua plastik yang kotor (bekas makanan)
- Keringkan semua plastik hingga KERING TOTAL
- Pisahkan menurut warna (opsional, untuk estetika)
- **Tips:** Siapkan wadah khusus untuk kumpulin plastik

**Langkah 3: Potong Plastik (30-60 menit)**
- Gunting plastik menjadi potongan 2-5 cm
- Plastik keras → potong lebih kecil (1-2 cm)
- Kantong kresek → bisa agak lebih besar
- **Tips:** Sambil nonton TV biar gak bosan! 📺

---

### Tahap Pengisian:

**Langkah 4: Plastik Pertama (10 menit)**
- Ambil plastik warna-warni yang bagus
- Tempelkan ke bagian dalam botol (untuk estetika)
- Susun melingkar mengikuti dinding botol
- Ini akan jadi "tampilan" ecobrick Anda
- **Creativitas:** Buat pola atau desain lucu!

**Langkah 5: Isi Bagian Bawah (15-20 menit)**
- Mulai isi dengan plastik kering
- Masukkan sedikit-sedikit (genggaman kecil)
- Tekan dengan tongkat setelah setiap genggaman
- **Teknik:** Putar-putar tongkat sambil menekan
- Target: SANGAT padat, keras seperti kayu
- Fokus: Isi bagian bawah dulu hingga padat

**Langkah 6: Isi Tengah (30-60 menit)**
- Lanjutkan mengisi dengan perlahan
- Tekan, tekan, tekan setiap genggaman!
- **Harus:** Tongkat harus susah masuk (artinya sudah padat)
- Jangan terburu-buru
- **Tips:** Istirahat sejenak kalau tangan pegal

**Langkah 7: Isi Hingga Penuh (30-45 menit)**
- Isi sampai 2-3 cm dari mulut botol
- 5-10 isi terakhir adalah yang TERBERAT
- Butuh tenaga ekstra untuk menekan
- **Ciri padat:** Tidak bisa ditekan sama sekali dengan tangan

**Langkah 8: Timbang & Tutup (5 menit)**
- **Standar Minimal:**
  - Botol 600ml → minimal 200 gram (ideal 250-300g)
  - Botol 1.5L → minimal 500 gram (ideal 600-750g)
- Jika kurang, tambah lagi dan tekan lebih kuat!
- Tutup botol dengan rapat
- Beri label: tanggal + berat + nama pembuat

---

## ✅ Standar Kualitas Ecobrick:

**Test Kepadatan:**
1. ✓ Jika ditekan dengan kedua tangan → TIDAK kempes
2. ✓ Dipukul dengan jari → bunyi "tok-tok" keras
3. ✓ Botol tidak bengkok atau penyok
4. ✓ Tidak ada ruang kosong di dalam
5. ✓ Beratnya memenuhi standar minimum

**Test Visual:**
- ✓ Plastik terdistribusi merata (tidak ada celah)
- ✓ Tidak ada warna botol yang terlihat dari samping
- ✓ Tutup terpasang rapat

---

## 🏗️ Kegunaan Ecobrick:

### 1. **Furniture Modular**
- Kursi outdoor (50-100 ecobrick)
- Meja kecil (80-150 ecobrick)
- Rak buku (30-50 ecobrick)
- Tempat tidur (200-400 ecobrick)

### 2. **Bangunan & Konstruksi**
- Dinding taman (100-500 ecobrick)
- Gazebo/saung (500-1000 ecobrick)
- Ruang kelas kecil (1000-2000 ecobrick)
- Peredam suara dinding

### 3. **Taman & Outdoor**
- Taman vertikal (20-50 ecobrick)
- Border taman
- Tangga taman
- Kolam hias

### 4. **Karya Seni**
- Instalasi seni publik
- Patung
- Playground anak

---

## 🔨 Cara Menggunakan Ecobrick:

### Metode Penyatuan:

**1. Dengan Semen (Permanent)**
- Susun ecobrick seperti batu bata
- Rekatkan dengan campuran semen
- Kuat dan tahan lama

**2. Dengan Tali/Ban (Modular)**
- Ikat ecobrick dengan tali nilon
- Bisa dibongkar pasang
- Cocok untuk furniture

**3. Dengan Jaring Kawat (Gabion)**
- Masukkan ecobrick ke jaring kawat
- Untuk dinding atau pagar
- Cepat dan mudah

**4. Dengan Bambu/Kayu**
- Sisipkan ecobrick di struktur bambu
- Untuk gazebo atau bangunan ringan

---

## ⚠️ Kesalahan Umum & Solusi:

### ❌ **Kesalahan: Ecobrick Lembek**
**Penyebab:** Tidak cukup padat
**Solusi:** Keluarkan sebagian plastik, potong lebih kecil, tekan lebih kuat

### ❌ **Kesalahan: Ada Celah/Ruang Kosong**
**Penyebab:** Plastik tidak merata
**Solusi:** Ketuk-ketuk botol sambil mengisi agar plastik menyebar

### ❌ **Kesalahan: Botol Penyok Saat Diisi**
**Penyebab:** Terlalu dipaksa atau botol tipis
**Solusi:** Tekan perlahan, pakai botol yang lebih tebal

### ❌ **Kesalahan: Berat Kurang**
**Penyebab:** Plastik tidak cukup padat
**Solusi:** Terus tekan, tambah plastik, ulangi

### ❌ **Kesalahan: Sulit Memasukkan Plastik**
**Penyebab:** Potongan terlalu besar
**Solusi:** Gunting lebih kecil, gunakan tongkat yang lebih ramping

---

## 💡 Tips Pro untuk Ecobrick Sempurna:

✅ **Pilih Botol yang Tepat:**
Botol air mineral lebih kuat dari botol soda (yang bergelombang)

✅ **Warna Plastik Pertama:**
Gunakan plastik cerah/warna-warni di bagian luar (tampilan cantik!)

✅ **Buat Sambil Nonton/Ngobrol:**
Aktivitas perfect saat santai, bisa sambil nonton atau ngobrol

✅ **Libatkan Keluarga:**
Setiap anggota keluarga buat 1 ecobrick per bulan = 48 ecobrick/tahun!

✅ **Kumpulkan Dulu Plastik:**
Lebih efisien kumpulkan 2-4 minggu, baru bikin sekaligus

✅ **Pakai Tongkat yang Pas:**
Coba berbagai tongkat untuk cari yang paling nyaman

✅ **Simpan dengan Benar:**
- Simpan di tempat teduh (tidak panas)
- Tidak terkena sinar UV langsung
- Bisa tahan puluhan tahun!

✅ **Label yang Jelas:**
Tulis: Tanggal, berat, nama, jenis plastik dominan

---

## 🌍 Dampak Positif Ecobrick:

### Untuk Lingkungan:
- **Mengurangi Sampah Plastik:** 1 ecobrick = ±250 gram plastik tidak ke TPA
- **Mengurangi Polusi Laut:** Plastik tidak masuk ke sungai/laut
- **Karbon Sequestration:** Plastik "terkunci" dan tidak mencemari
- **Awareness:** Menyadarkan orang tentang konsumsi plastik

### Untuk Masyarakat:
- **Bahan Bangunan Gratis:** Untuk sekolah atau rumah keluarga kurang mampu
- **Kreativitas:** Membuat seni dan furniture unik
- **Edukasi:** Mengajarkan anak-anak tentang daur ulang
- **Komunitas:** Membuat proyek bersama lingkungan

📊 **Statistik:** Jika 1 keluarga membuat 1 ecobrick/minggu = 13 kg plastik terselamatkan per tahun!

---

## 🌐 Bagaimana Menyumbangkan Ecobrick:

Ada banyak organisasi dan proyek yang menerima ecobrick:
- Sekolah-sekolah untuk proyek bangunan
- Komunitas lingkungan
- Taman kota
- Organisasi sosial

Cari "komunitas ecobrick" di kota Anda!

---

## ❓ Pertanyaan yang Sering Ditanya:

**Q: Berapa lama waktu membuat 1 ecobrick?**
A: Untuk pemula: 2-4 jam. Setelah terbiasa: 1-1.5 jam per botol.

**Q: Apakah ecobrick bisa rusak?**
A: Jika dibuat dengan benar dan disimpan baik, bisa tahan 100+ tahun!

**Q: Bolehkah pakai botol warna gelap?**
A: Tidak direkomendasikan. Botol bening = bisa lihat isinya = quality control.

**Q: Plastik apa yang paling bagus untuk isi?**
A: Kemasan snack dan kresek paling mudah dipadatkan.

**Q: Berapa ecobrick untuk buat kursi?**
A: Kursi sederhana perlu 50-80 ecobrick (tergantung desain).

**Q: Ecobrick bisa dicuci setelah jadi?**
A: Bisa! Lap dengan kain basah, jangan rendam dalam air.

**Q: Apakah ada standar internasional?**
A: Ya! Cek gea.ecobricks.org untuk standar lengkap.

**Q: Anak-anak berapa tahun bisa bikin?**
A: Usia 7+ bisa mulai dengan pengawasan. Usia 12+ bisa mandiri.

---

## 📱 Dokumentasi Ecobrick Anda:

- Photo ecobrick Anda!
- Timbang dan catat beratnya
- Share di media sosial dengan #ecobrick #zerowaste
- Log di situs GEA (Global Ecobrick Alliance)
- Inspirasi orang lain!

---

**🧱 Selamat Membuat Ecobrick! Satu Botol pada Satu Waktu, Kita Selamatkan Bumi! 🌏**

*"Be the change you want to see in the world" - Mahatma Gandhi*
`,
      category: "daur-ulang",
      bankSampahId: bankSampah.id,
    },
    {
      title: "Pemilahan Sampah yang Benar - Panduan Lengkap",
      description:
        "Belajar memilah sampah dengan tepat untuk memaksimalkan daur ulang dan mengurangi dampak lingkungan - Mudah dan praktis!",
      content: `
# Panduan Pemilahan Sampah yang Benar 🗑️

**⏱️ Waktu Setup:** 30 menit | **📊 Tingkat Kesulitan:** Sangat Mudah | **💵 Investasi:** Rp 0 - 100.000

## Mengapa Pemilahan Sampah Itu Penting?

Pemilahan sampah adalah **langkah PERTAMA dan TERPENTING** dalam pengelolaan sampah yang bertanggung jawab. Dengan memilah sampah dengan benar:

✅ **80-90%** sampah bisa didaur ulang atau dikompos
✅ Mengurangi sampah ke TPA hingga **75%**
✅ Menghemat biaya pengelolaan sampah
✅ Menciptakan nilai ekonomi dari "sampah"
✅ Mengurangi polusi tanah, air, dan udara

💡 **Ingat:** Sampah yang TIDAK dipilah = 100% jadi beban lingkungan. Sampah yang DIPILAH = sumber daya!

---

## 🗑️ Kategori Utama Sampah:

### 🌿 **1. SAMPAH ORGANIK (Hijau)**

#### Apa Itu?
Sampah yang berasal dari makhluk hidup dan bisa terurai secara alami.

#### ✅ Yang BOLEH:
- **Dari Dapur:**
  - Sisa sayuran dan buah-buahan 🥦
  - Kulit buah (pisang, jeruk, apel, dll)
  - Sisa nasi, roti, mie
  - Tulang ikan (kecil)
  - Ampas kopi dan teh ☕
  - Cangkang telur

- **Dari Kebun:**
  - Daun-daunan kering 🍂
  - Rumput potongan
  - Ranting kecil
  - Bunga layu

- **Lainnya:**
  - Kertas tisu (tidak warna)
  - Kertas makan berminyak
  - Kardus pizza (yang kotor)

#### ❌ Yang TIDAK BOLEH:
- Daging dan tulang besar (jika tidak bisa diolah)
- Minyak goreng bekas (pisahkan khusus)
- Popok sekali pakai
- Pembalut wanita
- Kotoran hewan peliharaan

#### 📦 Cara Kelola:
- Kumpulkan di tempat sampah terpisah
- Olah jadi **kompos** atau **eco-enzyme**
- Atau: Berikan ke petugas untuk pupuk

---

### 📦 **2. SAMPAH ANORGANIK (Biru/Kuning)**

Sampah yang tidak mudah terurai dan bisa didaur ulang.

#### A. PLASTIK 👜

**✅ Plastik yang BISA Didaur Ulang:**
- Botol air mineral PET (dengan logo daur ulang)
- Botol shampo, sabun, detergen
- Kemasan plastik bening
- Kantong kresek (bersih)
- Plastik kemasan makanan (dibersihkan)
- Gelas plastik
- Sedotan plastik
- Tutup botol

**🗑️ Persiapan Sebelum Didaur Ulang:**
1. Bersihkan dari sisa makanan
2. Bilas dengan air
3. Keringkan
4. Lepas label jika memungkinkan
5. Tekan/pijat untuk menghemat ruang

**❌ Plastik yang SULIT Didaur Ulang:**
- Plastik hitam (tidak bisa discan mesin)
- Plastik laminating
- Kemasan sachet berlapis (kopi, bumbu)
- Styrofoam (pisahkan khusus)

---

#### B. KERTAS & KARDUS 📄

**✅ Yang BISA Didaur Ulang:**
- Kertas HVS, buku, majalah
- Koran 📰
- Kardus coklat (bekas paket)
- Kemasan karton (susu, sereal)
- Amplop
- Paper bag
- Brosur & pamflet

**🗑️ Persiapan:**
1. Robek/lipat untuk menghemat space
2. Lepaskan lakban/plastik
3. Pastikan kering (tidak basah)
4. Kardus yang besar bisa dilipat

**❌ Yang TIDAK BISA:**
- Kertas berlapis plastik (kemasan snack)
- Kertas foto glossy
- Kertas carbon
- Tisu & kertas tissue (masuk organik)
- Kertas berminyak (masuk organik)

---

#### C. LOGAM 🪙

**✅ Semua Logam BISA Didaur Ulang:**
- Kaleng minuman (soda, bir) 🥤
- Kaleng makanan (kornet, sarden)
- Tutup botol logam
- Aluminium foil
- Kabel (ada tembaga di dalam)
- Paku, sekrup kecil
- Kemasan kaleng kue

**🗑️ Persiapan:**
1. Bilas hingga bersih
2. Keringkan
3. Ratakan kaleng (hemat ruang)
4. Pisahkan tutup dari kaleng jika berbeda

**💰 Bonus:** Logam punya nilai jual tertinggi di bank sampah!

---

#### D. KACA 🧴

**✅ Kaca yang Bisa Didaur Ulang:**
- Botol kaca (bening, hijau, coklat) 🍾
- Toples kaca
- Gelas kaca
- Jar kaca selai/madu

**🗑️ Persiapan:**
1. Bersihkan dari isi
2. Lepaskan tutup logam/plastik
3. Lepas label jika mudah
4. Pisahkan berdasarkan warna (jika diminta)

**⚠️ Perhatian:**
- Kaca pecah: bungkus koran + beri label "KACA PECAH"
- Pisahkan dari sampah lain agar tidak melukai

**❌ Yang TIDAK BISA:**
- Kaca jendela/cermin (komposisi berbeda)
- Lampu bohlam (B3)
- Kaca pyrex

---

### ⚠️ **3. SAMPAH B3 (Bahan Berbahaya & Beracun)** 

#### Apa Itu B3?
Sampah yang mengandung bahan kimia berbahaya dan harus dikelola khusus.

**❌ Contoh Sampah B3:**
- **Elektronik:**
  - Baterai (AA, AAA, lithium) 🔋
  - Charger rusak
  - Kabel elektronik
  - Lampu LED/neon (merkuri)

- **Medis:**
  - Obat kadaluarsa 💊
  - Jarum suntik (di container khusus)

- **Rumah Tangga:**
  - Cat & thinner
  - Pembasmi serangga/pestisida
  - Pembersih toilet
  - Aki motor/mobil
  - Minyak rem

**🛑 Cara Kelola:**
1. JANGAN CAMPUR dengan sampah lain!
2. Kumpulkan di wadah terpisah
3. Hubungi pihak berwenang (Dinas Lingkungan Hidup)
4. Cek apakah ada program penukaran (contoh: tukar baterai bekas)
5. Beberapa toko elektronik terima baterai bekas

**⚠️ Bahaya:** B3 bisa mencemari tanah & air hingga puluhan tahun!

---

### 🪥 **4. SAMPAH KHUSUS (Handling Tersendiri)**

#### A. Minyak Goreng Bekas
- **JANGAN** buang ke wastafel!
- Kumpulkan dalam botol plastik
- Bisa dijual ke pengepul untuk biodiesel
- Atau: Buat sabun cuci piring

#### B. Pakaian & Tekstil
- Pakaian layak pakai → donasi
- Pakaian rusak → jadi kain lap
- Kain perca → kerajinan
- Tekstil sangat rusak → cek bank sampah tertentu

#### C. Elektronik (E-Waste)
- HP, laptop, TV rusak
- Kumpulkan terpisah
- Cari penjual e-waste atau program tukar tambah

---

## 🏠 Setup Sistem Pemilahan di Rumah:

### Opsi 1: Sistem 3 Tempat (Basic)

**Tempat 1 - ORGANIK (🟢 Hijau):**
- Untuk: Sisa makanan, daun
- Wadah: Ember bertutup
- Tips: Lapisi kantong yang bisa dikompos

**Tempat 2 - ANORGANIK (🔵 Biru):**
- Untuk: Plastik, kertas, logam, kaca
- Wadah: Kotak/kardus besar
- Tips: Tidak perlu tutup (sampah kering)

**Tempat 3 - B3 & RESIDU (🟠 Kuning/Merah):**
- Untuk: Baterai, obat, sampah campur
- Wadah: Kantong kecil di wadah kaku

### Opsi 2: Sistem 5 Tempat (Advanced)

1. Organik 🟢
2. Plastik 🔵
3. Kertas 🏻
4. Logam/Kaca ⚪
5. B3 & Residu 🔴

### Dimana Menaruh Tempat Sampah?

**Di Dapur:**
- Tempat organik di bawah wastafel
- Tempat plastik di samping

**Di Luar Rumah:**
- Tempat anorganik di teras/belakang
- Lebih besar untuk kumpulan mingguan

**Tips Hemat:**
- Pakai kardus bekas untuk wadah anorganik
- Pakai ember cat bekas untuk organik
- Label dengan spidol besar atau stiker

---

## 📅 Rutinitas Pengelolaan:

### Harian:
- Buang sampah organik ke komposter (jika ada)
- Bilas dan keringkan kemasan anorganik
- Lipat kardus untuk hemat ruang

### Mingguan:
- Setor sampah anorganik ke bank sampah atau tunggu petugas
- Kompos: aduk dan cek kondisi

### Bulanan:
- Setor B3 ke tempat khusus
- Cek stok plastik untuk ecobrick
- Evaluasi: apakah sistem sudah efektif?

---

## 🚨 Kesalahan Umum & Cara Menghindarinya:

### ❌ **Kesalahan 1: Sampah Basah Campur Kering**
**Dampak:** Sampah kering jadi bau & tidak bisa didaur ulang
**Solusi:** Pisahkan dari awal, bilas sampah basah sebelum masuk anorganik

### ❌ **Kesalahan 2: Tidak Membersihkan Kemasan**
**Dampak:** Ditolak bank sampah, bau tidak sedap
**Solusi:** Bilas sebentar (cukup air bekas cucian piring)

### ❌ **Kesalahan 3: Plastik Berlapis Masuk Daur Ulang**
**Dampak:** Tidak bisa didaur ulang, merusak mesin
**Solusi:** Cek dengan "rip test" - jika tidak bisa disobek, tidak bisa didaur ulang

### ❌ **Kesalahan 4: Kompos Campur Plastik**
**Dampak:** Kompos gagal, plastik jadi mikroplastik
**Solusi:** Periksa teliti sebelum masuk komposter

### ❌ **Kesalahan 5: B3 Dicampur Sampah Biasa**
**Dampak:** Bahaya kesehatan & lingkungan serius!
**Solusi:** Wadah terpisah + label jelas

---

## 💸 Nilai Ekonomi Sampah Terpilah:

**Rata-rata Harga di Bank Sampah (2026):**

| Jenis Sampah              | Harga per Kg    |
|---------------------------|------------------|
| Botol Plastik PET Bersih  | Rp 3.000-5.000  |
| Kardus Coklat             | Rp 1.500-2.500  |
| Kertas HVS/Buku           | Rp 1.000-2.000  |
| Kaleng Aluminium          | Rp 8.000-12.000 |
| Besi/Logam                | Rp 4.000-6.000  |
| Kaca Bening               | Rp 500-1.000    |
| Plastik HD (ember, kursi) | Rp 2.000-3.000  |

**📊 Potensi Penghasilan:**
- Keluarga 4 orang = 5-10 kg sampah anorganik/bulan
- Nilai: Rp 15.000 - 50.000/bulan
- Setahun: Rp 180.000 - 600.000
- **Bonus:** Mengurangi biaya sampah!

---

## 🪧 Tips untuk Pemula:

👣 **Mulai Kecil:**
- Minggu 1: Pisahkan organik vs anorganik saja
- Minggu 2-3: Mulai detail (plastik, kertas, dll)
- Minggu 4+: Tambah pemilahan B3

👨‍👩‍👧‍👦 **Libatkan Keluarga:**
- Ajarkan anak sejak dini (gamification: beri sticker jika benar)
- Pembagian tugas: siapa yang bilas, siapa yang pilah
- Rayakan milestone (1 bulan sukses = pizza! 🍕)

📝 **Buat Cheat Sheet:**
- Print dan tempel di dinding dapur
- Gambar visual > teks (terutama untuk anak)
- Update jika ada aturan baru

🏛️ **Cari Bank Sampah Terdekat:**
- Google: "bank sampah [nama kota]"
- Tanya RT/RW
- Join grup zero waste di media sosial

---

## 🌍 Dampak Pemilahan Sampah:

### Untuk Lingkungan:
- **1 ton kertas didaur ulang = 17 pohon terselamatkan 🌳**
- **1 ton plastik didaur ulang = menghemat 5,774 kWh listrik ⚡**
- **Mengurangi emisi gas rumah kaca hingga 30%**
- **Menyelamatkan lautan dari 8 juta ton plastik/tahun**

### Untuk Masyarakat:
- Menciptakan lapangan kerja (pemulung, bank sampah)
- Mengurangi biaya pengelolaan sampah kota
- Kesadaran lingkungan meningkat
- Komunitas lebih peduli dan solid

### Untuk Anda:
- Rumah lebih bersih & rapi
- Sampah berkurang drastis (volume hingga 80%!)
- Penghasilan tambahan dari bank sampah
- Kepuasan berkontribusi untuk bumi 🌏❤️

---

## ❓ FAQ - Pertanyaan Umum:

**Q: Apakah sulit memulai pemilahan sampah?**
A: Tidak! 70% orang bilang "lebih mudah dari yang dikira". Kunci: konsisten 2 minggu pertama.

**Q: Butuh berapa tempat sampah?**
A: Minimal 2 (organik & anorganik). Ideal 3-5 tempat.

**Q: Gimana kalau asisten rumah tangga/keluarga tidak mau kooperatif?**
A: Edukasi pelan-pelan, tunjukkan manfaat ekonomi. Buat sistem semudah mungkin.

**Q: Di apartemen apakah bisa?**
A: Sangat bisa! Gunakan wadah kecil, manfaatkan balkon. Banyak apartemen kini punya program bank sampah.

**Q: Kalau lupa bilas kemasan, gimana?**
A: Tetap kumpulkan terpisah. Bilas sebelum setor ke bank sampah.

**Q: Apakah harus dicuci dengan sabun?**
A: Tidak perlu! Bilas dengan air biasa sudah cukup. Pakai air bekas cucian piring lebih hemat.

**Q: Berapa lama sampai jadi kebiasaan?**
A: Penelitian: 21-66 hari. Rata-rata 30 hari sudah otomatis!

**Q: Bagaimana mengajarkan anak-anak?**
A: - Gunakan tempat sampah warna-warni
- Buat permainan tebak sampah
- Reward system (sticker chart)
- Ajak ke bank sampah bersama

---

## 🎉 Challenge: #30HariPilahSampah

**Hari 1-7:** Pisahkan organik & anorganik
**Hari 8-14:** Detail pemilahan anorganik
**Hari 15-21:** Tambahkan pemilahan B3
**Hari 22-30:** Optimasi & ajak tetangga!

**Share progress di medsos dengan #PilahSampahAksi**

---

**🗑️ Pemilahan Sampah Bukan "Ribet" - Ini "Tanggung Jawab" Kita Bersama! 🌍❤️**

*"We don't need a handful of people doing zero waste perfectly. We need millions of people doing it imperfectly."*
`,
      category: "pemilahan",
      bankSampahId: bankSampah.id,
    },
    {
      title: "Prinsip 5R: Kunci Zero Waste Lifestyle",
      description:
        "Implementasi praktis prinsip 5R (Refuse, Reduce, Reuse, Recycle, Rot) dalam kehidupan sehari-hari - Dari teori ke aksi nyata!",
      content: `
# Prinsip 5R untuk Hidup Ramah Lingkungan 🌱

**⏱️ Waktu Adaptasi:** Bertahap  | **📊 Tingkat Kesulitan:** Mudah-Sedang | **💵 Investasi Awal:** Rp 50.000-500.000

## Apa itu Prinsip 5R?

Prinsip 5R adalah filosofi hidup ramah lingkungan yang diurutkan berdasarkan **prioritas dampak**:

1. **Refuse** (Menolak) - Paling powerful! 🚫
2. **Reduce** (Mengurangi) - Mindful consumption 📉
3. **Reuse** (Menggunakan Kembali) - Kreativitas! ♻️
4. **Recycle** (Daur Ulang) - Last resort sebelum buang 🔄
5. **Rot** (Kompos/Membusukkan) - Circle of life 🌿

**💡 Filosofi:** Semakin atas di piramida = makin besar dampak positifnya!

---

## 1️⃣ REFUSE - Menolak dengan Bijak 🚫

### Konsep:
**Tolak apa yang tidak Anda butuhkan SEBELUM masuk rumah!**

Ini adalah langkah PALING PENTING karena mencegah sampah dari awal.

### ❓ Kenapa Ini Paling Powerful?
- Tidak perlu energi untuk daur ulang
- Tidak ada sampah yang dihasilkan
- Mengirim sinyal ke produsen: "Kita tidak mau plastik!"
- Hemat uang (tidak beli yang tidak perlu)

---

### 🛍️ Apa yang Harus Di-REFUSE:

#### Di Toko/Supermarket:
❌ **Tolak kantong plastik sekali pakai**
  - Bawa tas belanja sendiri (totebag, goodie bag bekas)
  - Simpan tas belanja lipat di tas sehari-hari
  - **Tip:** Lupakan tas? Minta kotak kardus dari toko

❌ **Tolak sedotan plastik**
  - Minum langsung dari gelas/botol
  - Bawa sedotan reusable (stainless/bambu)
  - **Fakta:** 1 orang = ±1000 sedotan/tahun!

❌ **Tolak kemasan berlebihan**
  - Buah tidak perlu dibungkus plastik
  - Pilih produk tanpa kemasan atau kemasan minimal
  - Beli loose items (curah) bukan yang dikemas

#### Di Restoran/Kafe:
❌ **Tolak alat makan sekali pakai**
  - Bawa: tumbler, lunch box, sendok-garpu sendiri
  - Makan di tempat (bukan takeaway)
  - **Tip:** Pesan gojek? Tulis "no sendok garpu plastik"

❌ **Tolak tisu basah & tissue berlebihan**
  - Bawa sapu tangan kain
  - Minta tissue secukupnya saja

#### Di Kantor/Acara:
❌ **Tolak barang promosi plastik**
  - Pulpen, gantungan kunci, kipas plastik… usually ends up in trash
  - Lebih baik: minta e-voucher atau donasi

❌ **Tolak botol air kemasan di acara**
  - Bawa tumbler sendiri
  - Minta refill dari dispenser

#### Online Shopping:
❌ **Tolak bubble wrap berlebihan**
  - Tulis di notes: "Minimal packaging please"
  - Pilih seller yang ramah lingkungan

❌ **Tolak goodie bag tidak perlu**
  - Di wedding/acara: "Terima kasih, tidak perlu goodie bag"
  - Isi goodie bag sering tidak terpakai

---

### 💬 Cara Bilang "TIDAK" dengan Sopan:

**Di Kasir:**
- "Tidak perlu kantong, saya bawa tas sendiri. Terima kasih!"
- "Langsung masuk tas saya saja ya."

**Di Restoran:**
- "Tidak pakai sedotan ya. Saya minum langsung. Thanks!"
- "Bisa minta tanpa sendok plastik? Saya bawa sendiri."

**Saat Ditawari Sample/Brosur:**
- "Terima kasih, tapi saya tidak memerlukan."
- "Boleh kirim ke email saya saja?"

💪 **Ingat:** Anda punya HAK untuk menolak! Jangan sungkan.

---

### 🎯 Action Plan REFUSE:

**Minggu 1-2:** 
- ☑️ Beli 2-3 tas belanja kain (Rp 15.000/tas)
- ☑️ Simpan 1 tas lipat di tas sehari-hari
- ☑️ Praktik bilang "tidak perlu kantong"

**Minggu 3-4:**
- ☑️ Beli tumbler (Rp 50.000-150.000)
- ☑️ Bawa ke kantor/kampus/bepergian
- ☑️ Tolak botol plastik sekali pakai

**Bulan 2+:**
- ☑️ Set lengkap: lunch box, sendok garpu, sedotan reusable
- ☑️ Tolak goodie bag & barang-barang promo
- ☑️ Jadi role model: ajarkan ke keluarga/teman

**🏆 Target:** 90% situasi bisa refuse plastik sekali pakai!

---

## 2️⃣ REDUCE - Konsumsi Bijak 📉

### Konsep:
**Gunakan lebih sedikit. Beli yang benar-benar dibutuhkan.**

Jika tetap perlu konsumsi, lakukan dengan mindful dan minimal.

---

### 🛍️ Cara REDUCE dalam Berbagai Aspek:

#### A. Reduce Sampah Plastik:

✅ **Pilih kemasan besar (bulk buying)**
- 1 sabun cuci 5L > 5 sabun cuci 1L (less packaging)
- Refill stasiun (sabun, detergen, shampo)
- Hemat uang + kurangi sampah 70%!

✅ **Pilih produk tanpa kemasan**
- Sayur-buah di pasar tradisional (bukan supermarket)
- Sabun batang vs sabun cair
- Shampo bar vs shampo botolan

✅ **Hindari fast fashion**
- 1 kaos berkualitas > 5 kaos murahan
- Fast fashion = industri paling berpolusi ke-2 di dunia!

#### B. Reduce Sampah Makanan:

✅ **Meal planning**
- Rencanakan menu seminggu
- Beli sesuai kebutuhan (tidak impulse buying)
- **Fakta:** Indonesia buang 13 juta ton makanan/tahun! 🚨

✅ **Simpan makanan dengan benar**
- Sayuran di kulkas dalam container
- FIFO method: First In First Out
- Freeze makanan yang mau expired

✅ **Porsi secukupnya**
- Ambil sedikit dulu, mau nambah? Ambil lagi
- Better nambah than nyisa

#### C. Reduce Konsumsi Listrik & Air:

✅ **Listrik:**
- Cabut charger yang tidak dipakai
- Gunakan lampu LED (75% lebih hemat)
- AC cukup 24-26°C

✅ **Air:**
- Matikan keran saat sikat gigi/shampoo
- Kumpulkan air AC untuk menyiram tanaman
- Air bekas cuci beras untuk tanaman

#### D. Reduce Paperwork:

✅ **Digital first**
- E-receipt > struk kertas
- Digital notes > print document
- E-ticket > tiket cetak

✅ **Print bijak**
- Print bolak-balik (duplex)
- Print 2-4 halaman per lembar
- Draft mode untuk internal doc

---

### 💰 Dampak REDUCE:

**Finansial:**
- Hemat 20-40% pengeluaran bulanan
- Contoh: Refill sabun cuci (Rp 8.000/L) vs beli baru (Rp 25.000/L)

**Lingkungan:**
- Sampah rumah berkurang 30-50%
- Carbon footprint turun signifikan

---

### 🎯 Action Plan REDUCE:

**Start Small:**
- ☑️ Week 1: Meal planning untuk kurangi food waste
- ☑️ Week 2: Identifikasi barang yang sering dibeli impulsif
- ☑️ Week 3: Cari refill station terdekat
- ☑️ Week 4: Evaluasi tagihan listrik & air

**Level Up:**
- ☑️ Buat daftar "Do I really need this?" sebelum belanja
- ☑️ Terapkan "30 days rule": Mau beli? Tunggu 30 hari dulu
- ☑️ Track pengeluaran & sampah (awareness is key!)

---

## 3️⃣ REUSE - Maksimalkan Fungsi ♻️

### Konsep:
**Gunakan barang berkali-kali. Satu barang, banyak fungsi!**

Daripada beli baru atau buang, cari cara pakai ulang dengan kreatif.

---

### 🔄 Cara REUSE yang Kreatif:

#### A. Reuse Wadah & Kemasan:

✅ **Toples & gelas bekas:**
- Jar selai → tempat bumbu/rempah
- Botol kaca → vas bunga, tempat sikat gigi
- Kaleng bekas → pot tanaman, tempat pensil

✅ **Kardus & kotak:**
- Kardus susu → organizer laci
- Kotak sepatu → tempat kabel, penyimpanan
- Kardus besar → mainan anak, tempat sampah sementara

✅ **Kantong & tas:**
- Kantong beras → tas belanja pasar
- Goodie bag → bungkus kado, tas buku anak

#### B. Reuse Pakaian & Tekstil:

✅ **Baju lama:**
- Masih layak → donasi/jual secondhand
- Rusak sedikit → dijahit/tambal
- Sangat rusak → jadi kain lap/pel

✅ **Handuk lama:**
- Potong jadi lap dapur
- Lap kendaraan
- Alas kandang hewan

✅ **Kaus kaki bolong:**
- Sarung tangan debu (masukkan tangan, siap lap!)
- Pembersih kaca (tekstur soft)

#### C. Reuse vs Single-Use:

| Single-Use Item | Reusable Alternative | Saving/Tahun |
|----------------|---------------------|-------------|
| Tissue | Saputangan kain | Rp 200.000 |
| Kantong plastik | Tas belanja kain | Rp 150.000 |
| Botol air | Tumbler | Rp 500.000 |
| Sendok plastik | Sendok stainless | Rp 100.000 |
| Pembalut sekali pakai | Menstrual cup/kain | Rp 300.000 |
| Cotton bud | Cotton bud silikon | Rp 50.000 |

**Total Saving: Rp 1.3 JUTA/tahun!** 🤑

#### D. Reuse Kreatif:

✅ **Kertas bekas:**
- Backside jadi kertas coret-coret anak
- Kemasan kardus jadi bahan kerajinan

✅ **Botol plastik bekas:**
- Pot tanaman (lubangi bawah)
- Penyiram tanaman (lubangi tutup)
- Ecobrick (isi dengan plastik lain)

✅ **Furniture lama:**
- Cat ulang
- Reupholster
- Upcycle jadi yang baru (meja jadi rak, dll)

---

### 👨‍👩‍👧‍👦 Reuse Bareng Keluarga:

✅ **Toy swap party:**
- Tukar mainan dengan tetangga/teman
- Anak senang, ortu hemat, zero waste!

✅ **Clothing swap:**
- Tukar baju dengan komunitas
- Trendy sekarang: "swap party" 🎉

✅ **Tool library:**
- Pinjam alat dari tetangga (drill, tangga, dll)
- Gak perlu semua orang beli sendiri

---

### 🎯 Action Plan REUSE:

**Immediate:**
- ☑️ Investasi reusable items: tumbler, tas belanja, lunch box
- ☑️ Survei rumah: apa yang bisa di-reuse?

**This Month:**
- ☑️ Cuci & simpan 10 toples/jar untuk reuse
- ☑️ Kumpulkan kain lama untuk lap
- ☑️ Join komunitas swap (secondhand/toy swap)

**Long-term:**
- ☑️ Beli barang berkualitas (tahan lama)
- ☑️ Repair > replace: belajar jahit, lem, dan perbaiki
- ☑️ Share barang dengan komunitas (tool library concept)

---

## 4️⃣ RECYCLE - Daur Ulang Cerdas 🔄

### Konsep:
**Jika sudah tidak bisa di-refuse, reduce, atau reuse → RECYCLE!**

Recycle bukan solusi utama, tapi tetap penting untuk sampah yang inevitable.

---

### ♻️ Cara RECYCLE dengan Benar:

#### A. Pilah Sampah dengan Tepat:

Libat panduan lengkap "Pemilahan Sampah yang Benar" untuk detail!

**Basics:**
1. ✅ Bersihkan sampah (bilas kemasan)
2. ✅ Keringkan
3. ✅ Lepaskan label (jika mudah)
4. ✅ Pisahkan berdasarkan jenis (plastik, kertas, logam, kaca)
5. ✅ Setor ke bank sampah atau tunggu petugas

#### B. Kenali Simbol Daur Ulang:

**Plastik:**
- ♻️ Nomor 1 (PET) - Botol minuman ✅ Mudah didaur ulang
- ♻️ Nomor 2 (HDPE) - Botol shampo/detergen ✅ Mudah
- ♻️ Nomor 5 (PP) - Kotak makan ✅ Bisa didaur ulang
- ⚠️ Nomor 3,6,7 - Sulit/tidak bisa didaur ulang

**Tip:** Cek angka di dalam simbol ♻️ di kemasan!

#### C. Cara Maksimalkan Recycle:

✅ **Daftar ke bank sampah terdekat:**
- Biasanya ambil door-to-door 1-2x/bulan
- Atau: antar sendiri ke drop point

✅ **Kumpulkan hingga jumlah layak:**
- Minimal 2-5 kg (agar worth it transportnya)
- Simpan di wadah kering dan terpisah

✅ **Kreatif dengan sampah:**
- Plastik kemasan → ecobrick
- Botol kaca → kerajinan/dijual
- Kardus → organizer DIY

---

### 🚫 Yang TIDAK Bisa Didaur Ulang:

❌ Plastik berlapis (sachet kopi, bumbu)
❌ Styrofoam (beberapa tempat terima, tapi rare)
❌ Kertas tisu/tissue (sudah terkontaminasi)
❌ Kemasan tetra pak (sulit dipisah layer-nya)
❌ Plastik hitam (mesin tidak bisa deteksi)

**Solusi:** Hindari beli produk dengan kemasan ini (back to REFUSE!)

---

### 💸 Ekonomi Daur Ulang:

Lihat tabel harga di panduan "Pemilahan Sampah"!

**Average:** 5-10 kg sampah anorganik/bulan = Rp 15.000-50.000

**Bonus:** Poin di platform digitalsampah bisa ditukar reward!

---

## 5️⃣ ROT - Kompos dari Organik 🌿

### Konsep:
**Sampah organik jangan dibuang → kembalikan ke tanah!**

Sampah organik (40-60% dari total sampah rumah tangga) bisa jadi pupuk.

---

### 🥬 Cara ROT (Composting):

#### Opsi 1: Kompos Tradisional
- Lihat panduan lengkap "Cara Membuat Kompos"
- Durasi: 3-6 minggu
- Hasil: Pupuk padat untuk kebun

#### Opsi 2: Eco-Enzyme
- Lihat panduan lengkap "Cara Membuat Eco-Enzyme"
- Durasi: 3 bulan
- Hasil: Cairan serba guna (pembersih, pupuk cair)

#### Opsi 3: Komposter Takakura (Urban)
- Paket komposter (Rp 200.000-500.000)
- Cocok untuk apartemen
- Tidak bau!

#### Opsi 4: Vermicomposting (Cacing)
- Menggunakan cacing untuk urai sampah organik
- Lebih cepat (2-3 minggu)
- Hasil: Kascing (pupuk premium!)

#### Opsi 5: BSF (Black Soldier Fly)
- Budidaya maggot BSF
- Sangat cepat (1-2 minggu)
- Bonus: Maggot bisa dijual untuk pakan 🐟

---

### 🎯 Pilih Metode ROT yang Cocok:

| Situasi | Metode Terbaik |
|---------|---------------|
| Rumah dengan halaman | Kompos tradisional |
| Apartemen/kos | Takakura/vermicomposting |
| Banyak sisa buah | Eco-enzyme |
| Pengen cepat | BSF maggot |
| Pemula | Eco-enzyme (paling mudah!) |

---

### ✅ Manfaat ROT:

**Lingkungan:**
- Mengurangi sampah organik ke TPA (60%!)
- Mengurangi gas metana (gas rumah kaca)
- Pupuk organik = tanah lebih sehat

**Ekonomi:**
- Hemat beli pupuk (Rp 50.000-200.000/bulan)
- Tanaman lebih subur = hasil lebih banyak
- Bahkan bisa dijual pupuk/kompos!

---

## 📈 Roadmap 5R - 3 Bulan Pertama:

### 📅 Bulan 1: **REFUSE & REDUCE**

**Week 1:**
- ☑️ Beli tas belanja kain (3 pcs)
- ☑️ Beli tumbler
- ☑️ Praktik tolak kantong plastik & sedotan

**Week 2:**
- ☑️ Identifikasi barang yang sering dibeli impulsif
- ☑️ Meal planning untuk kurangi food waste
- ☑️ Cari refill station terdekat

**Week 3-4:**
- ☑️ Beli: lunch box, sendok-garpu reusable
- ☑️ Refill sabun/detergen untuk pertama kali
- ☑️ Track sampah selama 1 minggu (awareness!)

**🎯 Target:** Plastic consumption ↓ 50%

---

### 📅 Bulan 2: **REUSE & RECYCLE**

**Week 1:**
- ☑️ Kumpulkan toples/jar bekas untuk reuse
- ☑️ Setup sistem pemilahan sampah (3 tempat)
- ☑️ Daftar di bank sampah terdekat

**Week 2:**
- ☑️ Upcycle project: 1 item (contoh: jar jadi organizer)
- ☑️ Pilah sampah konsisten
- ☑️ Bersihkan & keringkan sampah anorganik

**Week 3-4:**
- ☑️ Setor sampah anorganik pertama kali!
- ☑️ Join komunitas swap/secondhand
- ☑️ Donasi barang tidak terpakai

**🎯 Target:** Waste to landfill ↓ 70%

---

### 📅 Bulan 3: **ROT & OPTIMIZE**

**Week 1:**
- ☑️ Mulai metode ROT (pilih: kompos/eco-enzyme/etc)
- ☑️ Setup tempat untuk composting

**Week 2-3:**
- ☑️ Rutinitas ROT berjalan
- ☑️ Evaluasi: area mana yang masih bisa improve?
- ☑️ Track savings: berapa hemat uang & kurangi sampah?

**Week 4:**
- ☑️ Share pengalaman ke teman/keluarga
- ☑️ Ajak 1-2 orang untuk join 5R
- ☑️ Rayakan! 🎉 Anda sudah 3 bulan konsisten!

**🎯 Target:** Organic waste ↓ 90%, Total waste ↓ 80%!

---

## 📊 Tracking Progress:

### Indikator Sukses:

☑️ **Visual:**
- Sampah rumah tangga muat di 1 kantong kecil/minggu
- Tempat sampah organik hampir tidak ada (karena dikompos)

☑️ **Finansial:**
- Tagihan sampah turun (jika bayar per kg)
- Hemat 20-40% belanja bulanan
- Penghasilan dari bank sampah

☑️ **Habit:**
- Otomatis bawa tas belanja
- Selalu tolak plastik tanpa ragu
- Mindful setiap konsumsi

---

## ❓ FAQ - Pertanyaan Umum:

**Q: Harus mulai dari mana?**
A: Mulai dari yang TERMUDAH: REFUSE kantong plastik. Success breeds success!

**Q: Apa tidak ribet?**
A: Minggu 1-2 terasa "ribet". Minggu 3-4 sudah kebiasaan. Bulan 2+ jadi otomatis!

**Q: Mahal tidak investasi awal?**
A: - Tas belanja: Rp 15.000 x 3 = Rp 45.000
- Tumbler: Rp 75.000
- Lunch box: Rp 50.000
- Sendok garpu: Rp 20.000
**Total: Rp 190.000** → Balik modal dalam 2-3 bulan!

**Q: Keluarga tidak mendukung?**
A: Start with yourself. Show results (uang hemat, sampah berkurang). Mereka akan follow!

**Q: Apakah harus sempurna?**
A: TIDAK! "Progress, not perfection". 80% konsisten > 100% sempurna tapi quit!

**Q: Berapa lama sampai zero waste?**
A: Realistis: 6-12 bulan untuk reduce waste 80-90%. True zero? Almost impossible, tapi that's okay!

---

## 🌍 Dampak Kolektif:

📊 **Jika 1 Keluarga (4 orang) Terapkan 5R:**

- Sampah berkurang: 15 kg/minggu → 3 kg/minggu (↓ 80%!)
- Setahun: 624 kg sampah TIDAK ke TPA! 🎉
- Carbon footprint: ↓ 1.2 ton CO2/tahun
- Setara: Menanam 55 pohon! 🌳

🌐 **Jika 1 Juta Keluarga Terapkan 5R:**

- 624,000 TON sampah berkurang/tahun
- Menyelamatkan 1.2 juta ton CO2
- Setara: Menanam 55 JUTA pohon! 🌲🌳🌴

**💬 Your action matters. Every small step counts!**

---

## 🎉 Challenge: #5RChallenge

**Join komunitas:**
- Instagram: #5RChallenge #ZeroWasteIndonesia
- Facebook groups: "Zero Waste Indonesia"
- Share progress, tips, dan saling support!

**Monthly challenges:**
- Bulan 1: #RefuseChallenge
- Bulan 2: #RecycleChallenge  
- Bulan 3: #RotChallenge

**Ajak teman & keluarga!**

---

## 📚 Resources & Inspirasi:

**Buku:**
- "Zero Waste Home" by Bea Johnson
- "101 Ways to Go Zero Waste" by Kathryn Kellogg

**Dokumenter:**
- "The Story of Stuff" (YouTube, 20 menit)
- "A Plastic Ocean" (Netflix)
- "Minimalism" (Netflix)

**Instagram:**
- @zerowasteid
- @sustaination.id
- @dietkantongplastik

**Website:**
- www.zerowasteindonesia.org
- www.sustaination.id

---

**🌱 Filosofi Penutup:**

*"We don't need a handful of people doing zero waste perfectly.*
*We need millions of people doing it imperfectly."*

🤝 **Start today. Start small. But START.**

🌍 Every time you REFUSE a plastic bag, you're voting for a better planet.
🌍 Every time you REDUCE consumption, you're choosing conscious living.
🌍 Every time you REUSE an item, you're being creative and responsible.
🌍 Every time you RECYCLE, you're turning "waste" into "resource".
🌍 Every time you ROT organic waste, you're completing the circle of life.

**♻️ Selamat Memulai Perjalanan 5R Anda! Bersama Kita Bisa Selamatkan Bumi! 🌎❤️**
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

  // Buat data rewards untuk bank sampah
  const rewardsData = [
    {
      name: "Gula 1kg",
      description: "Gula pasir kemasan 1 kilogram",
      image: "/assets/rewards/gula1kg.jpg",
      pointCost: 50,
      stock: 100,
      bankSampahId: bankSampah.id,
    },
    {
      name: "Minyak Goreng 1 Liter",
      description: "Minyak goreng kemasan 1 liter",
      image: "/assets/rewards/minyak1liter.jpg",
      pointCost: 100,
      stock: 80,
      bankSampahId: bankSampah.id,
    },
    {
      name: "Beras 5kg",
      description: "Beras premium kemasan 5 kilogram",
      image: "/assets/rewards/beras5kg.jpg",
      pointCost: 200,
      stock: 50,
      bankSampahId: bankSampah.id,
    },
    {
      name: "Uang Tunai 20.000",
      description: "Voucher uang tunai senilai Rp 20.000",
      image: "/assets/rewards/20ribu.jpg",
      pointCost: 150,
      stock: 30,
      bankSampahId: bankSampah.id,
    },
    {
      name: "Uang Tunai 50.000",
      description: "Voucher uang tunai senilai Rp 50.000",
      image: "/assets/rewards/50ribu.jpg",
      pointCost: 400,
      stock: 20,
      bankSampahId: bankSampah.id,
    },
    {
      name: "Uang Tunai 100.000",
      description: "Voucher uang tunai senilai Rp 100.000",
      image: "/assets/rewards/100ribu.jpg",
      pointCost: 800,
      stock: 10,
      bankSampahId: bankSampah.id,
    },
  ];

  for (const rewardData of rewardsData) {
    const reward = await prisma.reward.upsert({
      where: {
        id: `reward-${rewardData.name.toLowerCase().replace(/\s+/g, "-")}-${bankSampah.id}`,
      },
      update: {},
      create: {
        id: `reward-${rewardData.name.toLowerCase().replace(/\s+/g, "-")}-${bankSampah.id}`,
        ...rewardData,
      },
    });
    console.log(
      `✅ Reward created: ${reward.name} (${reward.pointCost} points)`,
    );
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
  console.log("\nRewards tersedia:");
  console.log("  - Gula 1kg (50 poin)");
  console.log("  - Minyak Goreng 1 Liter (100 poin)");
  console.log("  - Beras 5kg (200 poin)");
  console.log("  - Uang Tunai 20.000 (150 poin)");
  console.log("  - Uang Tunai 50.000 (400 poin)");
  console.log("  - Uang Tunai 100.000 (800 poin)");
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
