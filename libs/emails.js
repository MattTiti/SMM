import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { writeFile } from "fs/promises";
import path from "path";

const width = 400;
const height = 300;
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour: "white",
});

async function generateChart(type, data, options) {
  const configuration = {
    type,
    data,
    options: {
      ...options,
      animation: false,
      responsive: false,
    },
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  const fileName = `chart-${Date.now()}.png`;
  const filePath = path.join(process.cwd(), "public", fileName);
  await writeFile(filePath, image);
  return `/${fileName}`;
}

export async function formatWeeklyReport(data) {
  const {
    totalSpent,
    budget,
    remaining,
    percentageSpent,
    categorySpending,
    labelSpending,
    monthlySpending,
    expenses,
  } = data;

  const categoryChartUrl = await generateChart(
    "pie",
    {
      labels: Object.keys(categorySpending),
      datasets: [
        {
          data: Object.values(categorySpending),
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
          ],
        },
      ],
    },
    { plugins: { title: { display: true, text: "Spending by Category" } } }
  );

  const labelChartUrl = await generateChart(
    "pie",
    {
      labels: Object.keys(labelSpending),
      datasets: [
        {
          data: Object.values(labelSpending),
          backgroundColor: [
            "rgba(255, 159, 64, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(201, 203, 207, 0.8)",
          ],
        },
      ],
    },
    { plugins: { title: { display: true, text: "Spending by Label" } } }
  );

  const monthlyChartUrl = await generateChart(
    "bar",
    {
      labels: Object.keys(monthlySpending),
      datasets: [
        {
          label: "Monthly Spending",
          data: Object.values(monthlySpending),
          backgroundColor: "rgba(75, 192, 192, 0.8)",
        },
      ],
    },
    {
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Amount Spent ($)" },
        },
        x: { title: { display: true, text: "Month" } },
      },
      plugins: { title: { display: true, text: "Spending by Month" } },
    }
  );

  const html = `
    <html>
      <body>
        <h1>Weekly Expense Report</h1>
        <h2>Summary</h2>
        <p>Total Spent: $${totalSpent.toFixed(2)}</p>
        <p>Budget: $${budget.toFixed(2)}</p>
        <p>Remaining: $${remaining.toFixed(2)}</p>
        <p>Percentage Spent: ${percentageSpent.toFixed(2)}%</p>

        <h2>Spending by Category</h2>
        <img src="${categoryChartUrl}" alt="Category Spending Chart" />

        <h2>Spending by Label</h2>
        <img src="${labelChartUrl}" alt="Label Spending Chart" />

        <h2>Spending by Month</h2>
        <img src="${monthlyChartUrl}" alt="Monthly Spending Chart" />

        <h2>Recent Expenses</h2>
        <table>
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Category</th>
            <th>Label</th>
          </tr>
          ${expenses
            .slice(0, 10)
            .map(
              (exp) => `
            <tr>
              <td>${exp.name}</td>
              <td>$${parseFloat(exp.cost).toFixed(2)}</td>
              <td>${exp.category}</td>
              <td>${exp.label || "N/A"}</td>
            </tr>
          `
            )
            .join("")}
        </table>
      </body>
    </html>
  `;

  return html;
}
