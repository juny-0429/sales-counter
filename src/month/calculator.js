import { menuRules } from "./menuRules.js";

export function calculate(rows) {
  const result = createInitialResult();
  const unknownMenus = new Set();

  rows.forEach((row) => {
    const name = row["제품이름"]?.trim() || "";

    if (!name) return;
    if (name.includes("합계")) return;

    const sales = toNumber(row["판매량"]);
    const returns = toNumber(row["반품 수"]);
    const realSales = sales - returns;

    if (realSales === 0) return;

    let matched = false;

    Object.entries(menuRules).forEach(([categoryKey, menuList]) => {
      const matchedMenu = findMatchedMenu(name, menuList);

      if (!matchedMenu) return;

      matched = true;

      if (categoryKey === "coffee") {
        const beanType = getCoffeeBeanType(name, matchedMenu);

        if (!beanType) return;

        result.coffee[matchedMenu][beanType] += realSales;
        result.coffee[matchedMenu].total += realSales;

        return;
      }

      result[categoryKey][matchedMenu] += realSales;
    });

    if (!matched) {
      unknownMenus.add(name);
    }
  });

  return {
    result,
    unknownMenus: [...unknownMenus],
  };
}

function createInitialResult() {
  const result = {};

  Object.entries(menuRules).forEach(([categoryKey, menuList]) => {
    result[categoryKey] = {};

    menuList.forEach((menu) => {
      if (categoryKey === "coffee") {
        result[categoryKey][menu] = {
          N: 0,
          F: 0,
          D: 0,
          total: 0,
        };

        return;
      }

      result[categoryKey][menu] = 0;
    });
  });

  return result;
}

function findMatchedMenu(productName, menuList) {
  const normalizedProductName = normalizeName(productName);
  const sortedMenus = [...menuList].sort((a, b) => b.length - a.length);

  return sortedMenus.find((menu) =>
    normalizedProductName.includes(normalizeName(menu)),
  );
}

function getCoffeeBeanType(productName, menuName) {
  if (menuName === "오늘의 커피" || productName.includes("오늘의 커피")) {
    return "N";
  }

  if (productName.includes("너티브라운")) return "N";
  if (productName.includes("프루티 선라이트")) return "F";
  if (productName.includes("디카페인")) return "D";

  return null;
}

function normalizeName(value) {
  return String(value)
    .replaceAll(" ", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("아포가또", "아포가토")
    .replaceAll("잉글리시", "잉글리쉬")
    .replaceAll("캐모마일티", "캐모마일");
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") return 0;

  return Number(String(value).replaceAll(",", "")) || 0;
}
