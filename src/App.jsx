import { useState, useEffect } from "react";

const formatNumber = (num) => {
  return new Intl.NumberFormat("id-ID").format(Number(num));
};

const dummySoal = [
  {
    tanya: "2 + 3 = ?",
    opsi: ["4", "5", "6", "7"],
    jawaban: "5",
    pembahasan: "2 + 3 = 5",
  },
  {
    tanya: "5 + 1 = ?",
    opsi: ["6", "7", "5", "4"],
    jawaban: "6",
    pembahasan: "5 + 1 = 6",
  },
];
const stylesGlobal = `
@keyframes brainBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.brain {
  animation: brainBounce 1.5s ease-in-out infinite;
}
@keyframes peekOut {
  0% {
    transform: translate(40px, 40px);
    opacity: 0;
  }
  100% {
    transform: translate(0, 0);
    opacity: 0.25;
  }
}

@keyframes floaty {
  0% { transform: translateY(0); }
  50% { transform: translateY(-40px); }
  100% { transform: translateY(0); }
}

/* wrapper untuk keluar dari card */
.characterWrapper {
  position: absolute;
  right: -150px;
  bottom: 50px;
  animation: peekOut 0.6s ease-out;
}

/* karakter untuk bounce */
.character {
  font-size: 120px;
  opacity: 0,75;
  animation: floaty 2s ease-in-out infinite;
}
@keyframes fireworkPop {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

@keyframes sparkFly1 {
  0% { transform: translate(0,0); opacity: 1; }
  100% { transform: translate(-20px,-20px); opacity: 0; }
}

@keyframes sparkFly2 {
  0% { transform: translate(0,0); opacity: 1; }
  100% { transform: translate(20px,-15px); opacity: 0; }
}

@keyframes sparkFly3 {
  0% { transform: translate(0,0); opacity: 1; }
  100% { transform: translate(-10px,20px); opacity: 0; }
}

.firework {
  position: relative;
  display: inline-block;
  animation: fireworkPop 0.6s ease-out;
}

/* partikel */
.spark {
  position: absolute;
  font-size: 12px;
}

.spark1 {
  animation: sparkFly1 1s ease-out infinite;
}

.spark2 {
  animation: sparkFly2 1s ease-out infinite;
  animation-delay: 0.2s;
}

.spark3 {
  animation: sparkFly3 1s ease-out infinite;
  animation-delay: 0.4s;
}
`;

const temaMap = {
  1: [
    "Bilangan Cacah",
    "Operasi Hitung",
    "Pola",
    "Pengukuran",
    "Bangun Datar",
    "Data",
  ],
  2: [
    "Bilangan Cacah",
    "Operasi Hitung",
    "Pengukuran",
    "Bangun Datar & Ruang",
    "Data",
  ],
  3: [
    "Bilangan Cacah",
    "Operasi Hitung",
    "Kelipatan & Faktor",
    "Pecahan & Desimal",
    "Pengukuran",
    "Bangun Datar & Ruang",
    "Data",
  ],
  4: [
    "Bilangan Cacah Besar",
    "Operasi Hitung",
    "Pembagian & Strategi Hitung",
    "Pecahan & Desimal",
    "Pengukuran",
    "Bangun Datar & Ruang",
    "Data & Statistik",
    "Bilangan Bulat",
  ],
  5: [
    "Bilangan Cacah Besar",
    "Operasi Hitung",
    "Operasi Campuran",
    "Pecahan & Desimal",
    "Pengukuran",
    "Bangun Datar & Ruang",
    "Data & Statistik",
    "Perbandingan & Skala",
    "Waktu & Kecepatan",
    "Bilangan Bulat",
    "Peluang",
  ],
  6: [
    "Bilangan & Operasi Lanjutan",
    "Pecahan, Desimal & Persen",
    "Operasi Campuran",
    "Pengukuran",
    "Bangun Datar & Ruang",
    "Data & Statistik",
    "Perbandingan & Skala",
    "Kecepatan",
    "Bilangan Bulat",
    "Peluang",
    "Problem Solving",
  ],
};

const soalMap = {
  Mudah: [10],
  Sedang: [10, 20],
  Sulit: [10, 20, 25],
};

const styles = {
  root: {
    minHeight: "100dvh",
    background:
      "linear-gradient(145deg, #3d0b6e 0%, #6a1fa0 30%, #c2386c 70%, #ff6b9d 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "24px 16px 48px",
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
  },
  phone: {
    width: "100%",
    maxWidth: 520,
  },
  glass: {
    background: "rgba(255,255,255,0.15)",
    border: "1.5px solid rgba(255,255,255,0.35)",
    borderRadius: 24,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    padding: "20px 18px",
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: 900,
    color: "#fff",
    textAlign: "center",
    lineHeight: 1.25,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: 600,
  },
  label: {
    fontSize: 11,
    fontWeight: 800,
    color: "rgba(255,255,255,0.8)",
    letterSpacing: "0.5px",
    marginBottom: 8,
    display: "block",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.15)",
    border: "1.5px solid rgba(255,255,255,0.4)",
    borderRadius: 14,
    padding: "13px 14px",
    fontSize: 15,
    fontWeight: 700,
    color: "#fff",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  btnGold: {
    width: "100%",
    background: "linear-gradient(135deg, #FFD93D, #FF9500)",
    border: "none",
    borderRadius: 16,
    padding: "15px",
    fontSize: 16,
    fontWeight: 900,
    color: "#5A2D00",
    cursor: "pointer",
    letterSpacing: "0.3px",
    marginTop: 14,
    fontFamily: "inherit",
    boxShadow: "0 6px 20px rgba(255,180,0,0.35)",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 800,
    color: "rgba(255,255,255,0.65)",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 900,
    color: "#fff",
    textAlign: "center",
    marginBottom: 2,
  },
  greetingSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: 600,
  },
  backBtn: {
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: 10,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 700,
    color: "#fff",
    cursor: "pointer",
    marginBottom: 12,
    fontFamily: "inherit",
    display: "inline-block",
  },
  statsRow: {
    display: "flex",
    gap: 8,
    marginTop: 4,
  },
  statCard: {
    flex: 1,
    background: "rgba(255,255,255,0.13)",
    border: "1.5px solid rgba(255,255,255,0.3)",
    borderRadius: 16,
    padding: "10px 6px",
    textAlign: "center",
  },
  statNum: {
    fontSize: 20,
    fontWeight: 900,
    color: "#FFD93D",
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    fontWeight: 700,
  },
  charWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 4,
  },
};

function CharacterSVG() {
  return (
    <svg
      width="100%"
      height="auto"
      viewBox="0 0 180 155"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        maxWidth: 180,
      }}
    >
      <ellipse cx="90" cy="95" rx="42" ry="14" fill="rgba(255,220,80,0.18)" />
      <g opacity="0.35">
        <line
          x1="90"
          y1="90"
          x2="46"
          y2="28"
          stroke="#FFE066"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="90"
          y1="90"
          x2="63"
          y2="20"
          stroke="#FFE066"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="90"
          y1="90"
          x2="90"
          y2="16"
          stroke="#FFE066"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="90"
          y1="90"
          x2="118"
          y2="20"
          stroke="#FFE066"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="90"
          y1="90"
          x2="135"
          y2="28"
          stroke="#FFE066"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <ellipse cx="90" cy="118" rx="18" ry="6" fill="rgba(255,220,80,0.4)" />
      <g opacity="0.9">
        <rect
          x="8"
          y="30"
          width="36"
          height="28"
          rx="5"
          fill="#FFD97A"
          opacity=".85"
        />
        <rect
          x="12"
          y="36"
          width="20"
          height="3"
          rx="2"
          fill="#B87A00"
          opacity=".7"
        />
        <rect
          x="12"
          y="41"
          width="14"
          height="2"
          rx="1"
          fill="#B87A00"
          opacity=".5"
        />
        <rect
          x="12"
          y="45"
          width="17"
          height="2"
          rx="1"
          fill="#B87A00"
          opacity=".5"
        />
      </g>
      <g opacity="0.9">
        <rect
          x="52"
          y="10"
          width="30"
          height="24"
          rx="5"
          fill="#FFD97A"
          opacity=".9"
        />
        <circle cx="60" cy="20" r="5" fill="#C47A00" opacity=".7" />
        <rect
          x="68"
          y="17"
          width="10"
          height="2"
          rx="1"
          fill="#B87A00"
          opacity=".6"
        />
        <rect
          x="68"
          y="21"
          width="8"
          height="2"
          rx="1"
          fill="#B87A00"
          opacity=".5"
        />
      </g>
      <g opacity="0.9">
        <rect
          x="98"
          y="10"
          width="30"
          height="22"
          rx="5"
          fill="#FFD97A"
          opacity=".9"
        />
        <rect
          x="102"
          y="16"
          width="22"
          height="2"
          rx="1"
          fill="#B87A00"
          opacity=".6"
        />
        <rect
          x="102"
          y="20"
          width="16"
          height="2"
          rx="1"
          fill="#B87A00"
          opacity=".5"
        />
      </g>
      <g opacity="0.9">
        <rect
          x="136"
          y="28"
          width="34"
          height="26"
          rx="5"
          fill="#FFD97A"
          opacity=".85"
        />
        <rect
          x="140"
          y="34"
          width="18"
          height="2"
          rx="1"
          fill="#B87A00"
          opacity=".6"
        />
        <rect
          x="140"
          y="38"
          width="22"
          height="2"
          rx="1"
          fill="#B87A00"
          opacity=".5"
        />
        <rect
          x="140"
          y="42"
          width="14"
          height="2"
          rx="1"
          fill="#B87A00"
          opacity=".5"
        />
      </g>
      <text x="47" y="62" fill="#FFE066" fontSize="12" opacity=".9">
        ✦
      </text>
      <text x="128" y="66" fill="#FFE066" fontSize="10" opacity=".8">
        ✦
      </text>
      <ellipse cx="90" cy="148" rx="34" ry="16" fill="#4A86D0" opacity=".9" />
      <rect x="63" y="100" width="54" height="46" rx="14" fill="#4A86D0" />
      <polygon points="82,100 98,100 93,116 87,116" fill="#fff" opacity=".9" />
      <polygon points="88,106 92,106 91,122 89,122" fill="#FF4560" />
      <rect x="44" y="106" width="22" height="30" rx="8" fill="#D8E6FF" />
      <rect x="114" y="106" width="22" height="30" rx="8" fill="#D8E6FF" />
      <ellipse cx="64" cy="136" rx="10" ry="8" fill="#F5B8A0" />
      <ellipse cx="116" cy="136" rx="10" ry="8" fill="#F5B8A0" />
      <rect x="72" y="120" width="36" height="26" rx="5" fill="#2a1840" />
      <rect
        x="74"
        y="122"
        width="32"
        height="22"
        rx="3"
        fill="#FFE066"
        opacity=".65"
      />
      <ellipse cx="90" cy="70" rx="28" ry="28" fill="#F5B8A0" />
      <ellipse cx="90" cy="48" rx="24" ry="14" fill="#2D3A5A" />
      <ellipse
        cx="64"
        cy="84"
        rx="9"
        ry="16"
        fill="#2D3A5A"
        transform="rotate(-10 64 84)"
      />
      <ellipse
        cx="116"
        cy="84"
        rx="9"
        ry="16"
        fill="#2D3A5A"
        transform="rotate(10 116 84)"
      />
      <path
        d="M66 62 Q70 42 90 40 Q110 42 114 62 Q108 48 90 46 Q72 48 66 62Z"
        fill="#2D3A5A"
      />
      <path
        d="M80 46 Q84 40 90 39"
        stroke="#4A5C88"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="80" cy="68" rx="7" ry="7" fill="#fff" />
      <ellipse cx="100" cy="68" rx="7" ry="7" fill="#fff" />
      <ellipse cx="80" cy="68" rx="5" ry="5" fill="#2D8A44" />
      <ellipse cx="100" cy="68" rx="5" ry="5" fill="#2D8A44" />
      <ellipse cx="80" cy="68" rx="3" ry="3" fill="#111" />
      <ellipse cx="100" cy="68" rx="3" ry="3" fill="#111" />
      <ellipse cx="82" cy="66" rx="1.5" ry="1.5" fill="#fff" opacity=".9" />
      <ellipse cx="102" cy="66" rx="1.5" ry="1.5" fill="#fff" opacity=".9" />
      <path
        d="M73 60 Q80 56 86 59"
        stroke="#2D3A5A"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M94 59 Q100 56 107 60"
        stroke="#2D3A5A"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="90" cy="75" rx="2" ry="1.2" fill="#E8997A" opacity=".6" />
      <path
        d="M83 81 Q90 87 97 81"
        stroke="#C87850"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M85 82 Q90 86 95 82"
        stroke="#fff"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity=".6"
      />
      <ellipse cx="72" cy="76" rx="5" ry="3" fill="#F08080" opacity=".3" />
      <ellipse cx="108" cy="76" rx="5" ry="3" fill="#F08080" opacity=".3" />
      <ellipse cx="62" cy="70" rx="4" ry="5" fill="#F5B8A0" />
      <ellipse cx="118" cy="70" rx="4" ry="5" fill="#F5B8A0" />
    </svg>
  );
}

function LandingPage({ onMulai }) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState(""); // ✅ TAMBAHKAN DI SINI

  const handleMulai = () => {
    if (!nama.trim() || !email.trim()) {
      alert("Isi nama dan email dulu!");
      return;
    }

    onMulai(nama.trim(), email.trim()); // ✅ kirim 2 data
  };

  return (
    <div style={styles.phone}>
      <div style={styles.charWrap}>
        <CharacterSVG />
      </div>

      <div style={styles.glass}>
        <div style={styles.title}>
          📚 Latihan Soal Matematika Interaktif (AI)
        </div>
        <div style={styles.subtitle}>
          Soal otomatis + pembahasan langsung sesuai level
        </div>
        <label style={styles.label}>Nama Kamu</label>
        <input
          style={styles.input}
          type="text"
          placeholder="Tulis namamu di sini..."
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleMulai()}
        />
        <label style={styles.label}>Email Kamu</label>
        <input
          style={styles.input}
          type="email"
          placeholder="Masukkan email kamu..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleMulai}
          style={{
            ...styles.btnGold,
            marginTop: 20,
          }}
        >
          🚀 Mulai Belajar
        </button>
      </div>

      <div style={styles.statsRow}>
        {[
          ["6", "Kelas"],
          ["50+", "Tema"],
          ["3", "Level"],
        ].map(([num, lbl]) => (
          <div key={lbl} style={styles.statCard}>
            <div style={styles.statNum}>{num}</div>
            <div style={styles.statLabel}>{lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParameterPage({ nama, onBack, goSoal }) {
  const [kelas, setKelas] = useState(null);
  const [tema, setTema] = useState(null);
  const [level, setLevel] = useState(null);
  const [jumlah, setJumlah] = useState(null);
  const isSiapMulai = kelas && tema && level && jumlah;

  const handleKelas = (k) => {
    setKelas(k);
    setTema(null);
  };

  const handleLevel = (lv) => {
    setLevel(lv);
    setJumlah(null);
  };

  const handleMulaiSoal = () => {
    if (!isSiapMulai) return; // ✅ tetap ada

    goSoal({
      kelas,
      tema,
      level,
      jumlah,
    });
  };

  const kelasBtn = (k) => ({
    aspectRatio: "1",
    minWidth: 40,
    minHeight: 40,
    borderRadius: 12,
    border:
      kelas === k ? "2px solid #fff" : "1.5px solid rgba(255,255,255,0.35)",
    background:
      kelas === k ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.12)",
    color: kelas === k ? "#6a1fa0" : "rgba(255,255,255,0.85)",
    fontFamily: "inherit",
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  });

  const temaChip = (t) => ({
    background: tema === t ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.12)",
    border:
      tema === t
        ? "2px solid transparent"
        : "1.5px solid rgba(255,255,255,0.3)",
    borderRadius: 50,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 700,
    color: tema === t ? "#6a1fa0" : "rgba(255,255,255,0.85)",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
  });

  const levelConfig = [
    {
      id: "Mudah",
      icon: "🟢",
      color: "#6FDB8A",
      bg: "rgba(111,219,138,0.2)",
      border: "rgba(111,219,138,0.5)",
    },
    {
      id: "Sedang",
      icon: "🟡",
      color: "#FFBD59",
      bg: "rgba(255,189,89,0.2)",
      border: "rgba(255,189,89,0.5)",
    },
    {
      id: "Sulit",
      icon: "🔴",
      color: "#FF7A7A",
      bg: "rgba(255,122,122,0.2)",
      border: "rgba(255,122,122,0.5)",
    },
  ];

  const levelBtn = (cfg) => ({
    flex: 1,
    padding: "12px 6px",
    borderRadius: 14,
    border:
      level === cfg.id
        ? `2px solid ${cfg.border}`
        : "1.5px solid rgba(255,255,255,0.25)",
    background: level === cfg.id ? cfg.bg : "rgba(255,255,255,0.1)",
    fontFamily: "inherit",
    fontSize: 12,
    fontWeight: 800,
    color: cfg.color,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    transition: "all 0.15s",
  });

  const soalBtn = (n) => ({
    flex: 1,
    padding: "12px 6px",
    borderRadius: 14,
    border:
      jumlah === n
        ? "2px solid transparent"
        : "1.5px solid rgba(255,255,255,0.25)",
    background:
      jumlah === n ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)",
    fontFamily: "inherit",
    fontSize: 16,
    fontWeight: 900,
    color: jumlah === n ? "#6a1fa0" : "rgba(255,255,255,0.85)",
    cursor: "pointer",
    transition: "all 0.15s",
  });

  const canStart = kelas && level && jumlah;

  return (
    <div style={styles.phone}>
      <button style={styles.backBtn} onClick={onBack}>
        ← Kembali
      </button>

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={styles.greeting}>Halo, {nama}! 👋</div>
        <div style={styles.greetingSub}>Yuk, atur sesi belajarmu dulu</div>
      </div>

      {/* A: Pilih Kelas */}
      <div style={styles.glass}>
        <div style={styles.sectionTitle}>🏫 Pilih Kelas</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(48px,1fr))",
            gap: 8,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <button key={k} style={kelasBtn(k)} onClick={() => handleKelas(k)}>
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* B: Pilih Tema */}
      <div style={styles.glass}>
        <div style={styles.sectionTitle}>📖 Pilih Tema</div>
        {!kelas ? (
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              fontStyle: "italic",
              fontWeight: 600,
            }}
          >
            Pilih kelas terlebih dahulu
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {temaMap[kelas].map((t) => (
              <button key={t} style={temaChip(t)} onClick={() => setTema(t)}>
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* C: Pilih Level */}
      <div style={styles.glass}>
        <div style={styles.sectionTitle}>⚡ Pilih Level</div>
        <div style={{ display: "flex", gap: 8 }}>
          {levelConfig.map((cfg) => (
            <button
              key={cfg.id}
              style={levelBtn(cfg)}
              onClick={() => handleLevel(cfg.id)}
            >
              <span style={{ fontSize: 20 }}>{cfg.icon}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                }}
              >
                {cfg.id.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* D: Jumlah Soal (Adaptif) */}
      {level && (
        <div style={styles.glass}>
          <div style={styles.sectionTitle}>🔢 Jumlah Soal</div>
          <div style={{ display: "flex", gap: 8 }}>
            {soalMap[level].map((n) => (
              <button key={n} style={soalBtn(n)} onClick={() => setJumlah(n)}>
                {n} Soal
              </button>
            ))}
          </div>
        </div>
      )}

      {/* E: Tombol Mulai Soal */}
      <button
        onClick={() =>
          isSiapMulai &&
          goSoal({
            kelas,
            tema,
            level,
            jumlah,
          })
        }
        disabled={!isSiapMulai}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "16px",
          border: "none",
          background: isSiapMulai ? "#FF7A00" : "gray",
          color: "white",
          fontWeight: "bold",
          cursor: isSiapMulai ? "pointer" : "not-allowed",
          opacity: isSiapMulai ? 1 : 0.6,
          marginTop: 20,
        }}
      >
        🚀 Mulai Soal
      </button>

      {/* Summary chip */}
      {(kelas || level || jumlah) && (
        <div
          style={{
            marginTop: 12,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 14,
            padding: "10px 14px",
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {kelas && <Chip label={`Kelas ${kelas}`} />}
          {tema && <Chip label={tema} />}
          {level && <Chip label={level} />}
          {jumlah && <Chip label={`${jumlah} Soal`} />}
        </div>
      )}
    </div>
  );
}

function Chip({ label }) {
  return (
    <span
      style={{
        background: "rgba(255,220,80,0.2)",
        border: "1px solid rgba(255,220,80,0.45)",
        borderRadius: 50,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 800,
        color: "#FFE566",
        letterSpacing: "0.4px",
      }}
    >
      {label}
    </span>
  );
}

function renderQuestion(text) {
  // kalau tidak ada tabel
  if (!text.includes("|")) {
    return (
      <div
        style={{
          lineHeight: 1.6,
          textAlign: "center",
          fontSize: "clamp(16px, 4vw, 22px)",
          wordBreak: "break-word",
        }}
      >
        {text}
      </div>
    );
  }

  // pecahkan per baris
  const lines = text.split("\n");

  // ambil baris tabel
  const tableLines = lines.filter((l) => l.includes("|") && !l.includes("---"));

  // ambil teks soal biasa
  const soalText = lines.filter((l) => !l.includes("|")).join(" ");

  // ubah tabel jadi rows
  const rows = tableLines.map((line) =>
    line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean),
  );

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      {/* TEKS SOAL */}
      <div
        style={{
          marginBottom: 20,
          lineHeight: 1.6,
          textAlign: "center",
          fontSize: "clamp(16px, 4vw, 24px)",
          fontWeight: "bold",
          wordBreak: "break-word",
          whiteSpace: "normal",
        }}
      >
        {soalText}
      </div>

      {/* WRAPPER MOBILE */}
      <div
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: 12,
        }}
      >
        {/* TABEL */}
        <table
          style={{
            width: "100%",
            minWidth: 320,
            marginBottom: 20,
            borderCollapse: "collapse",
            background: "white",
            color: "#333",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={{
                      border: "1px solid #ddd",
                      padding: window.innerWidth < 480 ? 8 : 12,
                      textAlign: "center",
                      fontWeight: i === 0 ? "bold" : "normal",
                      fontSize: "clamp(12px, 3vw, 16px)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  function formatNumber(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
  }

  function formatAngkaDiTeks(text) {
    // 🔥 jangan ubah format jam
    if (/\d{1,2}\.\d{2}/.test(text)) {
      return text;
    }

    return text.replace(/\d+(\.\d+)?/g, (num) => {
      const clean = num.replace(/\./g, "");
      return Number(clean).toLocaleString("id-ID");
    });
  }

  const normalize = (s) => (s ?? "").toString().trim().toLowerCase();

  const [page, setPage] = useState("landing");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showPembahasan, setShowPembahasan] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [benar, setBenar] = useState(0);
  const [salah, setSalah] = useState(0);
  const [soalList, setSoalList] = useState([]);
  const [animatedNilai, setAnimatedNilai] = useState(0);
  const [loading, setLoading] = useState(false);
  const getSoalAI = async ({ kelas, tema, level, jumlah, email }) => {
    try {
      console.log("KIRIM:", {
        kelas,
        tema,
        level,
        jumlah,
        email,
      });

      const res = await fetch(
  "https://playbook-matematika.onrender.com/api/soal",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kelas,
      tema,
      level,
      jumlah,
      email,
    }),
  }
);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal ambil soal");
      }

      console.log("HASIL AI:", data);

      return data;
    } catch (err) {
      console.error("GAGAL AMBIL AI:", err);
      throw err; // 🔥 TAMBAHKAN INI
    } finally {
      setLoading(false);
    }
  };

  const handleJawab = (opsi) => {
    if (showResult) return;

    setSelected(opsi);
    setShowResult(true);
    setShowPopup(true); // ✅ FIX penting

    const selectedIndex = soalList[current]?.opsi.findIndex(
      (o) => normalize(o) === normalize(opsi),
    );

    const benar = selectedIndex === soalList[current]?.jawabanIndex;

    if (benar) {
      setBenar((prev) => prev + 1);
      setScore((prev) => prev + 1); // 🔥 TAMBAH INI
    } else {
      setSalah((prev) => prev + 1);
    }
  };

  const handleMulai = (n, e) => {
    setNama(n);
    setEmail(e); // 🔥 INI YANG PENTING
    setPage("parameter");
  };

  const goSoal = async ({ kelas, tema, level, jumlah }) => {
    setLoading(true);

    try {
      // 🔥 TAMBAHKAN DI SINI
      console.log("EMAIL DI goSoal:", email);

      const data = await getSoalAI({
        kelas,
        tema,
        level,
        jumlah,
        email,
      });

      const normalize = (s) =>
        s?.toString().replace(/\s+/g, " ").trim().toLowerCase();

      if (!Array.isArray(data)) {
        throw new Error(data?.error || "Response tidak valid");
      }

      const validData = data
        .map((s) => {
          let opsi = s.opsi;

          // 🔥 FIX: parse kalau string
          if (typeof opsi === "string") {
            try {
              opsi = JSON.parse(opsi);
            } catch {
              return null;
            }
          }

          return {
            ...s,
            opsi,
          };
        })
        .filter((s) => {
          if (!s?.tanya || !Array.isArray(s?.opsi) || s.opsi.length !== 4)
            return false;
          if (!s?.jawaban || !s?.pembahasan) return false;

          return s.opsi.map(normalize).includes(normalize(s.jawaban));
        });

      if (validData.length === 0) {
        throw new Error("Semua soal tidak valid");
      }

      setSoalList(validData);
    } catch (err) {
      console.error("ERROR goSoal:", err);

      const msg = (err && err.message && err.message.toLowerCase()) || "";

      if (msg.includes("email")) {
        alert("❌ Email tidak terdaftar.\nSilakan hubungi admin.");
      } else if (msg.includes("limit")) {
        alert("⚠️ Limit penggunaan sudah habis.");
      } else {
        alert("Terjadi kesalahan.");
      }

      setLoading(false);
      return;
    }

    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setShowPembahasan(false);
    setShowPopup(false);

    setPage("soal");
    setLoading(false);
  };

  const nilai =
    soalList.length === 0 ? 0 : Math.round((score / soalList.length) * 100);

  const soal = soalList?.[current];

  useEffect(() => {
    if (page !== "hasil") return; // ✅ FIX

    setAnimatedNilai(0);

    let start = 0;
    const end = nilai;

    const duration = 1500;
    const stepTime = 30;
    const increment = Math.max(1, end / (duration / stepTime));

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        start = end;
        clearInterval(timer);
      }

      setAnimatedNilai(Math.round(start));
    }, stepTime);

    return () => clearInterval(timer);
  }, [page, nilai]);

  let motivasi = "";

  if (nilai === 100) motivasi = "🔥 Sempurna!";
  else if (nilai >= 80) motivasi = "🔥 Hebat!";
  else if (nilai >= 50) motivasi = "👍 Bagus!";
  else motivasi = "💪 Jangan menyerah!";

  return (
    <>
      <style>{stylesGlobal}</style>

      <div style={{ ...styles.root, fontFamily: "Poppins, sans-serif" }}>
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "70vh",
              color: "white",
              textAlign: "center",
            }}
          >
            {/* ROBOT BESAR */}
            <div
              style={{
                fontSize: 80,
                animation: "brainBounce 1.5s infinite",
              }}
            >
              🤖
            </div>

            {/* TEXT UTAMA */}
            <div
              style={{
                marginTop: 20,
                fontSize: "clamp(16px, 3.8vw, 24px)",
                fontWeight: "bold",
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              AI sedang membuat soal...
            </div>

            {/* SUB TEXT */}
            <div
              style={{
                marginTop: 10,
                fontSize: 14,
                opacity: 0.8,
              }}
            >
              Tunggu sebentar ya 😊
            </div>
          </div>
        )}

        {!loading && (
          <>
            {page === "landing" && <LandingPage onMulai={handleMulai} />}

            {page === "parameter" && (
              <ParameterPage
                nama={nama}
                onBack={() => setPage("landing")}
                goSoal={goSoal}
              />
            )}

            {/* ================= SOAL ================= */}
            {/* ================= SOAL (VERSI CLEAN + FLOATING BRAIN) ================= */}
            {page === "soal" && (
              <>
                {!soal ? (
                  <div
                    style={{
                      color: "white",
                      textAlign: "center",
                      marginTop: 100,
                    }}
                  >
                    ⏳ Memuat soal...
                  </div>
                ) : (
                  <div
                    style={{
                      maxWidth: 420,
                      width: "92%",
                      margin: "40px auto",
                    }}
                  >
                    <div
                      style={{
                        background: "linear-gradient(135deg,#6d28d9,#9333ea)",
                        borderRadius: 28,
                        padding: 24,
                        color: "white",
                        position: "relative",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                      }}
                    >
                      {/* Progress */}
                      <div
                        style={{
                          height: 6,
                          background: "#22c55e",
                          borderRadius: 10,
                          width: `${((current + 1) / soalList.length) * 100}%`,
                        }}
                      />

                      {/* Header */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 10,
                        }}
                      >
                        <div>
                          Soal {current + 1} / {soalList.length}
                        </div>
                        <button onClick={() => setPage("landing")}>🏠</button>
                      </div>

                      {/* 🧠 FLOATING BRAIN */}
                      <div style={{ textAlign: "center", margin: "14px 0" }}>
                        <div className="brain" style={{ fontSize: 38 }}>
                          🧠
                        </div>
                      </div>

                      {/* SOAL */}
                      <div
                        style={{
                          textAlign: "center",
                          marginBottom: 20,
                          fontSize: "clamp(16px, 3.8vw, 24px)",
                          fontWeight: "bold",
                        }}
                      >
                        {renderQuestion(formatAngkaDiTeks(soal.tanya))}
                      </div>

                      {/* OPSI (CLEAN STYLE) */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                        }}
                      >
                        {soal.opsi.map((opsi, i) => {
                          const isCorrect =
                            normalize(opsi) === normalize(soal.jawaban);

                          const isSelected =
                            normalize(opsi) === normalize(selected);

                          let bg = "#eee";
                          let color = "#333";

                          if (showResult) {
                            if (isCorrect) {
                              bg = "#22c55e";
                              color = "white";
                            } else if (isSelected) {
                              bg = "#ef4444";
                              color = "white";
                            }
                          }

                          return (
                            <button
                              key={i}
                              onClick={() => handleJawab(opsi)}
                              disabled={showResult}
                              style={{
                                padding: 14,
                                borderRadius: 14,
                                border: "none",
                                fontWeight: "bold",
                                background: bg,
                                color,
                                fontSize: 16,
                                transition: "0.2s",

                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                lineHeight: 1.4,
                              }}
                            >
                              {String.fromCharCode(65 + i)}.{" "}
                              {(() => {
                                const cleanOpsi = opsi.replace(
                                  /^[A-D]\.\s*/,
                                  "",
                                );

                                // 🔥 WAJIB TAMBAH INI
                                if (cleanOpsi.includes("/")) {
                                  return cleanOpsi;
                                }

                                if (cleanOpsi.includes(" dan ")) {
                                  return cleanOpsi;
                                }

                                const soalText = soalList[current]?.tanya || "";
                                const soalLower = soalText.toLowerCase();

                                const isRupiah =
                                  soalLower.includes("rp ") ||
                                  soalLower.includes("rp.") ||
                                  soalLower.includes("rupiah");

                                // 🔥 CEGAH TEKS DIJADIIN ANGKA (HARUS DI ATAS)
                                if (!/\d/.test(cleanOpsi)) {
                                  return cleanOpsi;
                                }

                                const angka = cleanOpsi
                                  .replace(/[^\d.,]/g, "")
                                  .replace(/\./g, "") // hapus titik ribuan
                                  .replace(/,/g, ".");

                                const num = Number(angka);

                                if (isNaN(num)) return cleanOpsi;

                                // ✅ TAMBAH DI SINI
                                const isWaktu =
                                  soalLower.includes("pukul") ||
                                  soalLower.includes("jam") ||
                                  soalLower.includes("menit");

                                const isPecahan = cleanOpsi.includes("/");

                                const isSatuan =
                                  cleanOpsi.includes("liter") ||
                                  cleanOpsi.includes("kg") ||
                                  cleanOpsi.includes("meter") ||
                                  cleanOpsi.includes("cm") ||
                                  cleanOpsi.includes("menit") ||
                                  cleanOpsi.includes("jam");

                                // 🔥 STOP FORMAT kalau tipe ini
                                if (isWaktu) {
                                  // 🔥 paksa titik untuk waktu
                                  return cleanOpsi.replace(",", ".");
                                }

                                if (isPecahan) {
                                  return cleanOpsi;
                                }

                                if (isSatuan) {
                                  const formatted = num.toLocaleString("id-ID");

                                  return cleanOpsi.replace(angka, formatted);
                                }
                                if (isRupiah) {
                                  return cleanOpsi;
                                }

                                return formatAngkaDiTeks(cleanOpsi);
                              })()}
                            </button>
                          );
                        })}
                      </div>

                      {/* STATUS */}
                      {showResult && (
                        <div
                          style={{
                            marginTop: 16,
                            textAlign: "center",
                            background: "rgba(255,255,255,0.2)",
                            padding: 10,
                            borderRadius: 10,
                          }}
                        >
                          {normalize(selected) === normalize(soal.jawaban)
                            ? "🎉 Jawaban benar!"
                            : "❌ Jawaban salah!"}
                        </div>
                      )}

                      {/* BUTTON */}
                      {showResult && (
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            marginTop: 16,
                          }}
                        >
                          <button
                            onClick={() => setShowPembahasan(true)}
                            style={{
                              flex: 1,
                              padding: 12,
                              borderRadius: 12,
                              border: "none",
                              background: "#3b82f6",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            📖 Pembahasan
                          </button>

                          <button
                            onClick={() => {
                              if (current + 1 < soalList.length) {
                                setCurrent(current + 1);
                                setSelected(null);
                                setShowResult(false);
                                setShowPembahasan(false);
                              } else {
                                setPage("hasil");
                              }
                            }}
                            style={{
                              flex: 1,
                              padding: 12,
                              borderRadius: 12,
                              border: "none",
                              background: "#f59e0b",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            ➡️ Lanjut
                          </button>
                        </div>
                      )}

                      {/* PEMBAHASAN (TULISAN TANGAN) */}
                      {/* PEMBAHASAN */}
                      {showPembahasan && (
                        <div
                          style={{
                            marginTop: 16,
                            padding: 14,
                            borderRadius: 14,
                            background: "rgba(255,255,255,0.15)",
                            fontFamily: "'Patrick Hand', cursive",
                            fontSize: 20,
                          }}
                        >
                          <div>✏️ {soal.pembahasan}</div>

                          <div
                            style={{
                              marginTop: 14,
                              padding: 10,
                              borderRadius: 10,
                              background: "rgba(0,0,0,0.2)",
                              fontWeight: "bold",
                              color: "#7CFF7C",
                            }}
                          >
                            ✅ Jawaban benar adalah{" "}
                            {String.fromCharCode(65 + soal.jawabanIndex)}.{" "}
                            {soal.jawaban}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ================= HASIL ================= */}
            {page === "hasil" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100dvh",
                  color: "white",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg,#6d28d9,#9333ea)",
                    padding: 30,
                    borderRadius: 28,
                    width: 320,
                    textAlign: "center",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
                  }}
                >
                  <h1 style={{ marginBottom: 10 }}>🎉 Selesai!</h1>

                  {/* INFO */}
                  <div style={{ opacity: 0.8, marginBottom: 20 }}>
                    Skor kamu dari {soalList.length} soal
                  </div>

                  {/* SCORE BULAT */}
                  <div
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: "50%",
                      margin: "0 auto",
                      background: "rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 42,
                      fontWeight: "bold",
                    }}
                  >
                    {animatedNilai}
                  </div>

                  <div style={{ marginTop: 10, opacity: 0.8 }}>Score kamu</div>
                  <div style={{ marginTop: 12, fontSize: 14, opacity: 0.9 }}>
                    <div>✅ Benar: {benar}</div>
                    <div>❌ Salah: {salah}</div>
                  </div>

                  {/* MOTIVASI */}
                  <div
                    style={{
                      marginTop: 20,
                      padding: 12,
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.15)",
                    }}
                  >
                    {motivasi}
                  </div>

                  <button
                    onClick={() => {
                      setShowResult(false);
                      setShowPembahasan(false);
                      setSelected(null);
                      setCurrent(0);
                      setScore(0);
                      setBenar(0);
                      setSalah(0);
                      setSoalList([]);
                      setPage("parameter");
                    }}
                    style={{
                      marginTop: 24,
                      width: "100%",
                      padding: "18px", // ⬅️ lebih tinggi
                      borderRadius: 16,
                      border: "none",
                      background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "18px", // ⬅️ tulisan lebih besar
                      cursor: "pointer",
                      boxShadow: "0 8px 24px rgba(245,158,11,0.5)",
                      display: "flex", // ⬅️ biar icon + text rapi
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px", // ⬅️ jarak icon & text
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>🔄</span>
                    Ulangi
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
