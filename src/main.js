import { parseCSV } from "./shared/parser.js";
import { calculate } from "./month/calculator.js";
import { renderTable } from "./month/renderer.js";
import { copyTable } from "./month/copy.js";
import { calculateWeekly } from "./weekly/calculator.js";
import { renderWeeklyTable } from "./weekly/renderer.js";

let currentMode = null;

const modeSection = document.getElementById("modeSection");
const monthModeBtn = document.getElementById("monthModeBtn");
const weeklyModeBtn = document.getElementById("weeklyModeBtn");
const backToModeBtn = document.getElementById("backToModeBtn");
const homeBtn = document.getElementById("homeBtn");
const fileInput = document.getElementById("csvFile");
const copyBtn = document.getElementById("copyBtn");
const resetBtn = document.getElementById("resetBtn");
const uploadSection = document.getElementById("uploadSection");
const resultSection = document.getElementById("resultSection");
const fileName = document.getElementById("fileName");
const resultEyebrow = document.getElementById("resultEyebrow");
const resultTableBody = document.querySelector("#resultTable tbody");
const statusMessage = document.getElementById("statusMessage");
const unknownMenus = document.getElementById("unknownMenus");
const modeEyebrow = document.getElementById("modeEyebrow");
const uploadTitle = document.getElementById("uploadTitle");
const uploadDescription = document.getElementById("uploadDescription");

const requiredColumns = ["제품이름", "판매량", "반품 수"];

monthModeBtn.addEventListener("click", () => {
  currentMode = "month";
  modeEyebrow.innerText = "월말 판매 집계";
  uploadTitle.innerText = "월말 판매 집계 CSV 업로드";
  uploadDescription.innerText =
    "제품 리포트 CSV 파일을 업로드하면 월말 통계 양식에 맞춰 자동으로 계산합니다.";
  showUploadSection();
});

weeklyModeBtn.addEventListener("click", () => {
  currentMode = "weekly";
  copyBtn.disabled = true;
  modeEyebrow.innerText = "주간 통계";
  uploadTitle.innerText = "주간 통계 CSV 업로드";
  uploadDescription.innerText =
    "제품 리포트 CSV 파일을 업로드하면 주간 보고 양식에 맞춰 자동으로 계산합니다.";
  showUploadSection();
});

backToModeBtn.addEventListener("click", () => {
  resetAll();
  showModeSection();
});

homeBtn.addEventListener("click", () => {
  resetAll();
  showModeSection();
});

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];

  if (!file) return;

  if (!currentMode) {
    showError("먼저 작업 종류를 선택하세요.");
    return;
  }

  try {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      throw new Error("CSV 파일만 업로드할 수 있습니다.");
    }

    const text = await file.text();
    const rows = parseCSV(text);

    validateRows(rows);

    if (currentMode === "month") {
      resultSection.dataset.mode = "month";
      resultEyebrow.innerText = "업로드 파일";
      const { result, unknownMenus: unknown } = calculate(rows);
      renderTable(result);
      renderStatus(unknown);
    }

    if (currentMode === "weekly") {
      resultSection.dataset.mode = "weekly";
      resultEyebrow.innerText = "주간 통계용";
      const result = calculateWeekly(rows);
      renderWeeklyTable(result);
      renderStatus([]);
    }

    copyBtn.disabled = currentMode === "weekly";

    fileName.innerText = file.name;
    uploadSection.hidden = true;
    resultSection.hidden = false;
  } catch (error) {
    resultTableBody.innerHTML = "";
    copyBtn.disabled = true;
    resultSection.dataset.mode = "";
    resultEyebrow.innerText = "업로드 파일";
    fileName.innerText = file.name;
    uploadSection.hidden = true;
    resultSection.hidden = false;
    showError(error.message);
  }
});

copyBtn.addEventListener("click", () => {
  if (currentMode === "weekly") {
    return;
  }

  copyTable();
});

resetBtn.addEventListener("click", () => {
  resetResult();
  showUploadSection();
});

function showModeSection() {
  modeSection.hidden = false;
  uploadSection.hidden = true;
  resultSection.hidden = true;
}

function showUploadSection() {
  modeSection.hidden = true;
  uploadSection.hidden = false;
  resultSection.hidden = true;
}

function resetResult() {
  fileInput.value = "";
  fileName.innerText = "선택된 파일 없음";
  resultTableBody.innerHTML = "";
  copyBtn.disabled = true;
  resultSection.dataset.mode = "";
  resultEyebrow.innerText = "업로드 파일";
  statusMessage.hidden = true;
  unknownMenus.hidden = true;
  statusMessage.innerHTML = "";
  unknownMenus.innerHTML = "";
}

function resetAll() {
  currentMode = null;
  resetResult();
}

function validateRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("CSV 안에 읽을 수 있는 데이터가 없습니다.");
  }

  const firstRow = rows[0];
  const missingColumns = requiredColumns.filter(
    (column) => !(column in firstRow),
  );

  if (missingColumns.length > 0) {
    throw new Error(`필수 컬럼이 없습니다: ${missingColumns.join(", ")}`);
  }
}

function renderStatus(unknown) {
  statusMessage.hidden = true;
  statusMessage.innerHTML = "";

  if (unknown.length === 0) {
    unknownMenus.hidden = true;
    unknownMenus.innerHTML = "";
    return;
  }

  unknownMenus.hidden = false;
  unknownMenus.className = "unknownMenus statusWarning";
  unknownMenus.innerHTML = `
    <strong>통계에 포함되지 않은 상품 ${unknown.length}개</strong>
    <ul>
      ${unknown.map((menu) => `<li>${escapeHTML(menu)}</li>`).join("")}
    </ul>
  `;
}

function showError(message) {
  statusMessage.hidden = false;
  statusMessage.className = "statusMessage statusError";
  statusMessage.innerText = message;

  unknownMenus.hidden = true;
  unknownMenus.innerHTML = "";
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
