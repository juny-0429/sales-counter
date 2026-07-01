export async function copyWeeklyTable() {
  const rows = [...document.querySelectorAll("#resultTable tr")];

  const plainText = rows
    .map((row) => [...row.children].map((cell) => cell.innerText).join("\t"))
    .join("\n");

  const htmlRows = rows
    .map((row) => {
      const cells = [...row.children]
        .map((cell) => {
          const colspan = cell.colSpan > 1 ? ` colspan="${cell.colSpan}"` : "";
          return `<td${colspan} style="text-align:center;">${escapeHTML(cell.innerText)}</td>`;
        })
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  const html = `<table>${htmlRows}</table>`;

  await navigator.clipboard.write([
    new ClipboardItem({
      "text/plain": new Blob([plainText], { type: "text/plain" }),
      "text/html": new Blob([html], { type: "text/html" }),
    }),
  ]);

  alert("주간 통계가 복사되었습니다.");
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
