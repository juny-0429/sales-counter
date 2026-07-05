export function renderWeeklyTable(result) {
  const tbody = document.querySelector("#resultTable tbody");
  tbody.innerHTML = "";

  appendTitleRow(tbody, "원두 판매", 4);
  appendRow(tbody, ["너티", "프루티", "디카페인", "드립백"], true);
  appendRow(tbody, [
    `${result.beanSales.nutty.count}개`,
    `${result.beanSales.fruity.count}개`,
    `${result.beanSales.decaf.count}개`,
    `${result.beanSales.dripbag.count}개`,
  ]);

  appendSpacerRow(tbody, 4);

  appendTitleRow(tbody, "싱글 원두 판매량", 2);
  appendRow(tbody, ["금주 총 판매량", `${result.singleBeans.totalCount}개`], true);
  appendRow(tbody, ["제품", "수량"], true);
  result.singleBeans.items.forEach((item) => {
    appendRow(tbody, [item.name, `${item.count}개`]);
  });

  appendSpacerRow(tbody, 2);

  appendTitleRow(tbody, "음료 선호도 TOP 10", 3);
  appendRow(tbody, ["순위", "메뉴", "수량"], true);
  result.drinkPreference.forEach((item, index) => {
    appendRow(tbody, [`${index + 1}위`, item.name, `${item.count}개`]);
  });

  appendSpacerRow(tbody, 3);

  appendTitleRow(tbody, "신규음료", 2);
  appendRow(tbody, ["메뉴", "수량"], true);
  result.newDrinks.items.forEach((item) => {
    appendRow(tbody, [item.name, `${item.count}개`]);
  });
  appendRow(tbody, ["총 판매 건수", `${result.newDrinks.totalCount}개`], true);

  appendSpacerRow(tbody, 3);

  appendTitleRow(tbody, "싱글 오리진 판매량", 2);
  appendSingleOriginSummary(tbody, result.singleOrigin);

  appendSpacerRow(tbody, 3);

  appendTitleRow(tbody, "디저트 / 베이커리", 2);
  appendRow(tbody, ["총 판매 수", `${result.dessert.totalCount}개`], true);
  appendRow(
    tbody,
    ["총 판매 금액", formatCurrency(result.dessert.totalAmount)],
    true,
  );
  appendRow(
    tbody,
    ["베이커리 매출", formatCurrency(result.dessert.bakeryTotalAmount)],
    true,
  );
  appendRow(
    tbody,
    ["디저트 매출", formatCurrency(result.dessert.dessertTotalAmount)],
    true,
  );

  appendRow(tbody, ["메뉴", "판매수"], true);

  if (result.dessert.items.length === 0) {
    appendRow(tbody, ["판매된 디저트 / 베이커리 없음", "0개"]);
    return;
  }

  result.dessert.items.forEach((item) => {
    appendRow(tbody, [item.name, `${item.count}개`]);
  });
}

function appendSingleOriginSummary(tbody, singleOrigin) {
  appendRow(tbody, ["총 판매 건수", `${singleOrigin.totalCount}개`], true);
  appendRow(
    tbody,
    ["총 판매 금액", formatCurrency(singleOrigin.totalAmount)],
    true,
  );

  singleOrigin.items.forEach((item) => {
    const tr1 = document.createElement("tr");
    const nameCell = document.createElement("td");
    const countCell = document.createElement("td");

    nameCell.rowSpan = 3;
    nameCell.innerText = item.name;
    nameCell.className = "weeklyNameCell";

    countCell.innerText = `${item.count}개`;

    tr1.appendChild(nameCell);
    tr1.appendChild(countCell);
    tbody.appendChild(tr1);

    const tr2 = document.createElement("tr");
    appendCell(tr2, formatCurrency(item.amount));
    tbody.appendChild(tr2);

    const tr3 = document.createElement("tr");
    appendCell(tr3, formatPercent(item.percent));
    tbody.appendChild(tr3);
  });
}

function appendTitleRow(tbody, title, colspan) {
  const tr = document.createElement("tr");
  const td = document.createElement("td");

  td.colSpan = colspan;
  td.innerText = title;
  td.className = "weeklyTitleCell";

  tr.appendChild(td);
  tbody.appendChild(tr);
}

function appendSpacerRow(tbody, colspan) {
  const tr = document.createElement("tr");
  const td = document.createElement("td");

  td.colSpan = colspan;
  td.innerText = "";
  td.className = "weeklySpacerCell";

  tr.appendChild(td);
  tbody.appendChild(tr);
}

function appendRow(tbody, values, isHeader = false) {
  const tr = document.createElement("tr");

  values.forEach((value) => {
    const td = document.createElement("td");
    td.innerText = value;

    if (isHeader) {
      td.className = "weeklyHeaderCell";
    }

    tr.appendChild(td);
  });

  tbody.appendChild(tr);
}

function appendCell(tr, value) {
  const td = document.createElement("td");
  td.innerText = value;
  tr.appendChild(td);
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString();
}

function formatPercent(value) {
  return `${((value || 0) * 100).toFixed(2)}%`;
}
