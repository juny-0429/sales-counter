import { menuRules } from "./menuRules.js";

export function createSalesTable(result) {
  let rows = "";

  menuRules.coffee.forEach((menu) => {
    const item = result.coffee[menu];

    const total = item.N + item.F + item.D;

    rows += `
            <tr>
                <td>${menu}</td>
                <td>${item.N}</td>
                <td>${item.F}</td>
                <td>${item.D}</td>
                <td>${total}</td>
            </tr>
        `;
  });

  document.querySelector("#result").innerHTML = `
        <table class="sales-table">

            <thead>
                <tr>
                    <th>커피</th>
                    <th>N</th>
                    <th>F</th>
                    <th>D</th>
                    <th>합계</th>
                </tr>
            </thead>

            <tbody>

                ${rows}

            </tbody>

        </table>
    `;
}
