import Papa from "papaparse";

export function parseCSV(text) {
  const cleanText = text.replace(/^\uFEFF/, "");

  const parsed = Papa.parse(cleanText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.replace(/^\uFEFF/, "").trim(),
    transform: (value) => value.trim(),
  });

  if (parsed.errors.length > 0) {
    console.warn("CSV 파싱 경고:", parsed.errors);
  }

  console.log("CSV 컬럼명:", parsed.meta.fields);
  console.log("CSV 첫 번째 행:", parsed.data[0]);

  return parsed.data;
}
