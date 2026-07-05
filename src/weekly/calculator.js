import {
  bakeryMenus,
  beanSalesRules,
  dessertMenus,
  drinkMenus,
  newDrinkMenus,
  singleBeanMenus,
  singleOriginMenus,
} from "./rules.js";

export function calculateWeekly(rows) {
  const beanSales = calculateBeanSales(rows);
  const drinkPreference = calculateDrinkPreference(rows);
  const newDrinks = calculateNewDrinks(rows);
  const singleOrigin = calculateSingleOrigin(rows);
  const singleBeans = calculateSingleBeans(rows);
  const dessert = calculateDessert(rows);

  return {
    beanSales,
    drinkPreference,
    newDrinks,
    singleOrigin,
    singleBeans,
    dessert,
  };
}

function calculateBeanSales(rows) {
  const result = Object.fromEntries(
    Object.entries(beanSalesRules).map(([key, rule]) => [
      key,
      {
        label: rule.label,
        count: 0,
      },
    ]),
  );

  rows.forEach((row) => {
    const name = getProductName(row);
    const count = getRealSales(row);

    if (!name || count === 0) return;

    Object.entries(beanSalesRules).forEach(([key, rule]) => {
      const hasKeyword = rule.keywords.some((keyword) =>
        name.includes(keyword),
      );
      const hasExcludeKeyword = rule.excludeKeywords?.some((keyword) =>
        name.includes(keyword),
      );

      if (!hasKeyword || hasExcludeKeyword) return;

      result[key].count += count;
    });
  });

  return result;
}

function calculateDrinkPreference(rows) {
  const counts = createCountMap(drinkMenus);

  rows.forEach((row) => {
    const name = getProductName(row);
    const count = getRealSales(row);

    if (!name || count === 0) return;
    if (isExcludedFromDrinkPreference(name)) return;
    if (name.includes("세트")) return;

    const matchedMenu = findMatchedMenu(name, drinkMenus);

    if (!matchedMenu) return;

    counts[matchedMenu] += count;
  });

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function calculateNewDrinks(rows) {
  const counts = createCountMap(newDrinkMenus);

  rows.forEach((row) => {
    const name = getProductName(row);
    const count = getRealSales(row);

    if (!name || count === 0) return;

    const matchedMenu = findMatchedMenu(name, newDrinkMenus);

    if (!matchedMenu) return;

    counts[matchedMenu] += count;
  });

  const items = newDrinkMenus
    .map((name) => ({
      name,
      count: counts[name] ?? 0,
    }))
    .sort((a, b) => b.count - a.count);

  const totalCount = items.reduce((sum, item) => sum + item.count, 0);

  return {
    items,
    totalCount,
  };
}

function calculateSingleOrigin(rows) {
  const items = singleOriginMenus.map((menu) => {
    const matchedRows = rows.filter((row) => {
      const name = getProductName(row);
      const isMatched = menu.keywords.some((keyword) => name.includes(keyword));

      return isMatched;
    });

    const count = matchedRows.reduce((sum, row) => sum + getRealSales(row), 0);
    const amount = matchedRows.reduce((sum, row) => sum + getNetAmount(row), 0);

    return {
      name: menu.name,
      count,
      amount,
      percent: 0,
    };
  });

  const totalCount = items.reduce((sum, item) => sum + item.count, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  const itemsWithPercent = items.map((item) => ({
    ...item,
    percent: totalAmount > 0 ? item.amount / totalAmount : 0,
  }));

  return {
    items: itemsWithPercent,
    totalCount,
    totalAmount,
  };
}

function calculateSingleBeans(rows) {
  const items = singleBeanMenus.map((menu) => {
    const count = rows.reduce((sum, row) => {
      const name = getProductName(row);
      const isSingleBeanProduct = name.startsWith("원두:");
      const isMatched = menu.keywords.some((keyword) => name.includes(keyword));

      if (!isSingleBeanProduct || !isMatched) return sum;

      return sum + getRealSales(row);
    }, 0);

    return {
      name: menu.name,
      count,
    };
  });

  const totalCount = items.reduce((sum, item) => sum + item.count, 0);

  return {
    totalCount,
    items,
  };
}

function calculateDessert(rows) {
  const dessertItems = createSalesItems(dessertMenus);
  const bakeryItems = createSalesItems(bakeryMenus);

  rows.forEach((row) => {
    const name = getProductName(row);
    const count = getRealSales(row);

    if (!name || count === 0) return;

    const matchedDessertMenu = findMatchedMenu(name, dessertMenus);

    if (matchedDessertMenu) {
      addSalesToItem(dessertItems, matchedDessertMenu, count, getNetAmount(row));
      return;
    }

    const matchedBakeryMenu = findMatchedMenu(name, bakeryMenus);

    if (matchedBakeryMenu) {
      addSalesToItem(bakeryItems, matchedBakeryMenu, count, getNetAmount(row));
    }
  });

  const dessertTotalCount = sumCount(dessertItems);
  const dessertTotalAmount = sumAmount(dessertItems);
  const bakeryTotalCount = sumCount(bakeryItems);
  const bakeryTotalAmount = sumAmount(bakeryItems);

  return {
    totalCount: dessertTotalCount + bakeryTotalCount,
    totalAmount: dessertTotalAmount + bakeryTotalAmount,
    dessertTotalCount,
    dessertTotalAmount,
    bakeryTotalCount,
    bakeryTotalAmount,
    dessertItems: sortSoldItems(dessertItems),
    bakeryItems: sortSoldItems(bakeryItems),
    items: sortSoldItems([...dessertItems, ...bakeryItems]),
  };
}

function createSalesItems(menus) {
  return menus.map((menu) => ({
    name: menu,
    count: 0,
    amount: 0,
  }));
}

function addSalesToItem(items, menuName, count, amount) {
  const target = items.find((item) => item.name === menuName);

  if (!target) return;

  target.count += count;
  target.amount += amount;
}

function sumCount(items) {
  return items.reduce((sum, item) => sum + item.count, 0);
}

function sumAmount(items) {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

function sortSoldItems(items) {
  return items
    .filter((item) => item.count > 0 || item.amount > 0)
    .sort((a, b) => b.count - a.count);
}

function createCountMap(menus) {
  return Object.fromEntries(menus.map((menu) => [menu, 0]));
}

function isExcludedFromDrinkPreference(name) {
  return (
    name.includes("원두") ||
    name.includes("드립백") ||
    name.includes("파우치") ||
    name.includes("에비앙") ||
    name.includes("산펠레그리노") ||
    name.includes("노아주스") ||
    name.includes("아쿠아파나")
  );
}

function findMatchedMenu(productName, menuList) {
  const normalizedProductName = normalizeName(productName);
  const sortedMenus = [...menuList].sort((a, b) => b.length - a.length);

  return sortedMenus.find((menu) =>
    normalizedProductName.includes(normalizeName(menu)),
  );
}

function getProductName(row) {
  return row["제품이름"]?.trim() || "";
}

function getRealSales(row) {
  return toNumber(row["판매량"]) - toNumber(row["반품 수"]);
}

function getNetAmount(row) {
  return toNumber(row["결제금액"]) - toNumber(row["환불금액"]);
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") return 0;

  return Number(String(value).replaceAll(",", "")) || 0;
}

function normalizeName(value) {
  return String(value)
    .replaceAll(" ", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("아포가또", "아포가토")
    .replaceAll("잉글리시", "잉글리쉬")
    .replaceAll("캐모마일티", "캐모마일")
    .replaceAll("카페라떼", "라떼")
    .replaceAll("트로피컬망고스무디", "트로피컬망고스무디")
    .replaceAll("너티크림라떼", "너티크림라떼")
    .replaceAll("자몽민트에이드", "자몽민트에이드");
}
