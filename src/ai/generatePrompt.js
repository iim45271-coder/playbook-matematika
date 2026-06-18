export function generatePrompt({ kelas, tema, level, jumlah }) {
  return `
Buat ${jumlah} soal matematika untuk siswa kelas ${kelas} SD.

Topik: ${tema}
Tingkat kesulitan: ${level}

Gunakan kurikulum merdeka Indonesia.

Format JSON:
[
  {
    "tanya": "Soal",
    "opsi": ["A", "B", "C", "D"],
    "jawaban": "A",
    "pembahasan": "Penjelasan"
  }
]
`;
}