export function validateSoal(data) {
  if (!Array.isArray(data)) return false;

  return data.every((item) => {
    return (
      item.tanya &&
      Array.isArray(item.opsi) &&
      item.opsi.length === 4 &&
      item.jawaban &&
      item.pembahasan
    );
  });
}