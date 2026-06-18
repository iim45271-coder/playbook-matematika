import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import supabase from "./supabase.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔥 SHUFFLE AMAN
function shuffleArray(arr = []) {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function shuffleOptions(data) {
  return (
    data
      .map((soal) => {
        if (!Array.isArray(soal.opsi)) {
          return null;
        }

        const correct = soal.jawaban;

        const shuffled = shuffleArray(soal.opsi);

        const normalize = (s) => s.toString().trim().toLowerCase();

        const answerIndex = shuffled.findIndex(
          (o) => normalize(o) === normalize(correct),
        );

        // 🔥 PROTEKSI
        if (answerIndex === -1) {
          return null;
        }

        return {
          ...soal,
          opsi: shuffled,
          jawaban: correct,
          jawabanIndex: answerIndex,
        };
      })

      // 🔥 FILTER NULL
      .filter(Boolean)
  );
}

// 👇 KODE KAMU YANG SUDAH ADA
app.post("/api/soal", async (req, res) => {
  const MAX_SOAL = 200;
  console.log("🔥 MASUK API /api/soal");

  try {
    // ✅ AMBIL DATA
    const { kelas, tema, level, email } = req.body;
    const jumlah = Number(req.body.jumlah);

    // 🚫 batas maksimal generate
    if (jumlah > MAX_SOAL) {
      return res.status(400).json({
        error: `Maksimal generate ${MAX_SOAL} soal`,
      });
    }

    // 🔥 TAMBAHKAN DI SINI
    const emailClean = email?.trim().toLowerCase() || "";

    // 🔥 TAMBAHKAN INI
    console.log("EMAIL ASLI:", email);
    console.log("EMAIL CLEAN:", emailClean);
    console.log("PANJANG EMAIL:", emailClean.length);

    console.log("EMAIL MASUK KE SERVER:", emailClean);

    // ❌ VALIDASI EMAIL
    if (!emailClean) {
      return res.status(400).json({ error: "Email wajib diisi" });
    }

    // ❌ VALIDASI JUMLAH
    if (!jumlah || jumlah < 1) {
      return res.status(400).json({ error: "Jumlah tidak valid" });
    }

    // 🔍 ambil user dari database
    const { data: user, error } = await supabase
      .from("users")
      .select("email,used,limit")
      .eq("email", emailClean)
      .single();

    if (error || !user) {
      return res.status(403).json({ error: "Email tidak terdaftar" });
    }

    // 🚫 cek limit
    if (user.used >= user.limit) {
      return res.status(403).json({ error: "Limit habis" });
    }

    // ➕ tambah usage
    const { error: updateError } = await supabase
      .from("users")
      .update({ used: user.used + 1 })
      .eq("email", emailClean);

    if (updateError) {
      throw updateError;
    }

    console.log(`USER ${emailClean} | ${user.used + 1}/${user.limit}`);

    // ✏️ DEBUG
    console.log("BODY:", {
      kelas,
      tema,
      level,
      jumlah,
      email: emailClean,
    });

    // 🔍 CEK DB
    let query = supabase
      .from("soal")
      .select("*")
      .eq("kelas", kelas)
      .eq("tema", tema)
      .eq("level", level);

    const { data: soalDB, error: dbError } = await query.limit(200);

    if (dbError) {
      throw dbError;
    }

    // ✅ Ambil langsung dari DB
    if (soalDB && soalDB.length > 0) {
      console.log("📦 Ambil dari Database");

      if (soalDB.length < jumlah) {
        return res.status(400).json({
          error: `Soal tersedia hanya ${soalDB.length}`,
        });
      }
      const selected = shuffleArray(soalDB).slice(0, jumlah);

      return res.json(shuffleOptions(selected));
    }

    // kalau tidak ada soal
    return res.status(404).json({
      error: "Soal tidak ditemukan",
    });
  } catch (err) {
    console.error("🔥 ERROR DETAIL:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// 👇 TAMBAHKAN DI SINI
app.get("/api/seed", async (req, res) => {
  res.json({ message: "seed jalan" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server jalan di port ${PORT}`);
});
