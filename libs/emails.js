export async function formatWeeklyReport(data) {
  const {
    totalSpent,
    budget,
    remaining,
    percentageSpent,
    categorySpending,
    expenses,
  } = data;

  // Format the HTML content
  const html = `
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body>
        <h1>Weekly Expense Report</h1>
        <h2>Summary</h2>
        <p>Total Spent: $${totalSpent.toFixed(2)}</p>
        <p>Budget: $${budget.toFixed(2)}</p>
        <p>Remaining: $${remaining.toFixed(2)}</p>
        <p>Percentage Spent: ${percentageSpent.toFixed(2)}%</p>

        <h2>Category-wise Spending</h2>
        <canvas id="pieChart" width="400" height="200"></canvas>
        <canvas id="barChart" width="400" height="200"></canvas>

        <h2>Recent Expenses</h2>
        <table>
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Category</th>
          </tr>
          ${expenses
            .slice(0, 10)
            .map(
              (exp) => `
            <tr>
              <td>${exp.name}</td>
              <td>$${parseFloat(exp.cost).toFixed(2)}</td>
              <td>${exp.category}</td>
            </tr>
          `
            )
            .join("")}
        </table>

        <script>
          const categoryData = ${JSON.stringify(categorySpending)};
          const categories = Object.keys(categoryData);
          const values = Object.values(categoryData);

          new Chart(document.getElementById('pieChart'), {
            type: 'pie',
            data: {
              labels: categories,
              datasets: [{
                data: values,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 206, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
                ],
              }]
            },
          });

          new Chart(document.getElementById('barChart'), {
            type: 'bar',
            data: {
              labels: categories,
              datasets: [{
                label: 'Spending by Category',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        </script>
      </body>
    </html>
  `;

  return html;
}

async function generatePieChart(data) {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 400, height: 400 });

  const configuration = {
    type: "pie",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          data: Object.values(data),
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
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

async function generateBarChart(data) {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 600, height: 400 });

  const configuration = {
    type: "bar",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Spending by Category",
          data: Object.values(data),
          backgroundColor: "rgba(75, 192, 192, 0.8)",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}
