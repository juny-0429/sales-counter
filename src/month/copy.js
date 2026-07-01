export async function copyTable() {
  const rows = [...document.querySelectorAll("#resultTable tr")].slice(1);

  const plainText = rows
    .map((row) => {
      const cells = [...row.children];
      const coffeeMenu = cells[0]?.innerText ?? "";

      const coffeeN = coffeeMenu ? toNumber(cells[1]?.innerText) : "";
      const coffeeF = coffeeMenu ? toNumber(cells[2]?.innerText) : "";
      const coffeeD = coffeeMenu ? toNumber(cells[3]?.innerText) : "";
      const coffeeTotal = coffeeMenu ? coffeeN + coffeeF + coffeeD : "";

      return [
        coffeeMenu,
        coffeeN,
        coffeeF,
        coffeeD,
        coffeeTotal,

        cells[5]?.innerText ?? "",
        cells[6]?.innerText ?? "",

        cells[7]?.innerText ?? "",
        cells[8]?.innerText ?? "",

        cells[9]?.innerText ?? "",
        cells[10]?.innerText ?? "",

        cells[11]?.innerText ?? "",
        cells[12]?.innerText ?? "",

        cells[13]?.innerText ?? "",
        cells[14]?.innerText ?? "",

        cells[15]?.innerText ?? "",
        cells[16]?.innerText ?? "",

        cells[17]?.innerText ?? "",
        cells[18]?.innerText ?? "",
      ].join("\t");
    })
    .join("\n");

  const htmlRows = plainText
    .split("\n")
    .map((row) => {
      const cells = row
        .split("\t")
        .map((cell) => `<td style="text-align:center;">${cell}</td>`)
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

  alert(
    "복사되었습니다.\n\n구글 시트에서 매장명 아래 첫 번째 셀을 선택한 뒤 붙여넣으세요.",
  );
}

function toNumber(value) {
  return Number(String(value ?? "").replaceAll(",", "")) || 0;
}
