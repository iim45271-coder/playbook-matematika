export const getSoalAI = async ({ kelas, tema, level, jumlah }) => {
  const res = await fetch("http://localhost:3000/api/soal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kelas,
      tema,
      level,
      jumlah,
    }),
  });

  const data = await res.json();
  return data;
};