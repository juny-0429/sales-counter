const sheetLayout = [
  [
    "",
    "커피\n(N)",
    "커피\n(F)",
    "커피\n(D)",
    "합계",
    "시그니처",
    "",
    "논커피 & 티",
    "",
    "싱글",
    "",
    "칵테일",
    "",
    "디저트",
    "",
    "베이커리",
    "",
    "RTD",
    "",
  ],
  [
    "아메리카노",
    "남산",
    "딸기 말차 라떼",
    "의식의 흐름",
    "아이리시 커피",
    "티라미수",
    "플레인 휘낭시에",
    "에비앙",
  ],
  [
    "라떼",
    "안국",
    "딸기 라떼",
    "과테말라 게이샤",
    "에스프레소 마티니",
    "생망고 케이크",
    "슈가코트 휘낭시에",
    "산펠레그리노",
  ],
  [
    "바닐라 라떼",
    "그랑핸드",
    "우지 말차 라떼",
    "에티오피아 내추럴",
    "",
    "생딸기 케이크",
    "통밀 후추 잼 쿠키",
    "노아주스 (오렌지)",
  ],
  [
    "카푸치노",
    "너티 크림라떼",
    "레몬진저 에이드",
    "과테말라 핀카 워시드",
    "",
    "바스크 치즈 케이크",
    "크루아상",
    "노아주스 (애플)",
  ],
  [
    "코르타도",
    "크림라떼",
    "레몬 진저 티",
    "브라질 로즈다이아",
    "",
    "생딸기 쇼콜라 컵케이크",
    "크리미팥 모찌",
    "노아주스 (ABC)",
  ],
  [
    "에스프레소",
    "콜드브루",
    "트로피컬 망고스무디",
    "콜롬비아 파라이소",
    "",
    "생망고 빙수 2인",
    "소금빵",
    "노아주스 (자몽)",
  ],
  [
    "콘파냐",
    "바닐라 콜드브루 라떼",
    "차이라떼",
    "봄 블렌드",
    "",
    "생망고 빙수 4인",
    "공주 밤 식빵",
    "노아주스 (진저)",
  ],
  [
    "아포가토",
    "시청",
    "쇼콜라 밀크",
    "",
    "",
    "생딸기 홀케이크",
    "올리브 치아바타",
    "아쿠아파나",
  ],
  [
    "카페모카",
    "리저브 콜드브루",
    "미숫가루 라떼",
    "",
    "",
    "생망고 홀케이크",
    "먹물 치아바타",
    "",
  ],
  ["오늘의 커피", "", "마살라 차이", "", "", "그랑핸드 아이스크림", "", ""],
  ["시나몬라떼", "", "밀크티", "", "", "초코 쉬폰 케이크", "", ""],
  ["", "", "생망고 주스", "", "", "시트러스 그라니따", "", ""],
  ["", "", "스트로베리 블랙티", "", "", "팥빙수 2인", "", ""],
  ["", "", "애플 시나몬", "", "", "", "", ""],
  ["", "", "얼그레이", "", "", "", "", ""],
  ["", "", "우유", "", "", "", "", ""],
  ["", "", "잉글리쉬 브렉퍼스트", "", "", "", "", ""],
  ["", "", "캐모마일 티", "", "", "", "", ""],
  ["", "", "피치블랙티", "", "", "", "", ""],
  ["", "", "피치 파라다이스", "", "", "", "", ""],
  ["", "", "히비스커스", "", "", "", "", ""],
  ["", "", "자몽민트에이드", "", "", "", "", ""],
  ["", "", "바질 토마토 에이드", "", "", "", "", ""],
  ["", "", "페퍼민트", "", "", "", "", ""],
];

export function renderTable(result) {
  const tbody = document.querySelector("#resultTable tbody");

  tbody.innerHTML = "";

  sheetLayout.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");

    if (rowIndex === 0) {
      row.forEach((cell) => {
        const th = document.createElement("th");
        th.innerText = cell;
        tr.appendChild(th);
      });

      tbody.appendChild(tr);
      return;
    }

    const [
      coffee,
      signature,
      nonCoffeeTea,
      single,
      cocktail,
      dessert,
      bakery,
      rtd,
    ] = row;

    appendCoffeeCells(tr, result, coffee);
    appendMenuPairCells(tr, result.signature, signature);
    appendMenuPairCells(tr, result.nonCoffeeTea, nonCoffeeTea);
    appendMenuPairCells(tr, result.single, single);
    appendMenuPairCells(tr, result.cocktail, cocktail);
    appendMenuPairCells(tr, result.dessert, dessert);
    appendMenuPairCells(tr, result.bakery, bakery);
    appendMenuPairCells(tr, result.rtd, rtd);

    tbody.appendChild(tr);
  });
}

function appendCoffeeCells(tr, result, menu) {
  if (!menu) {
    appendCell(tr, "");
    appendCell(tr, "");
    appendCell(tr, "");
    appendCell(tr, "");
    appendCell(tr, "");
    return;
  }

  const data = result.coffee?.[menu];

  appendCell(tr, menu);
  appendCell(tr, data?.N ?? 0);
  appendCell(tr, data?.F ?? 0);
  appendCell(tr, data?.D ?? 0);
  appendCell(tr, data?.total ?? 0);
}

function appendMenuPairCells(tr, categoryData, menu) {
  appendCell(tr, menu);
  appendCell(tr, menu ? (categoryData?.[menu] ?? 0) : "");
}

function appendCell(tr, value) {
  const td = document.createElement("td");
  td.innerText = value;
  tr.appendChild(td);
}
