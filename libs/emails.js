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

        <h2>Spending by Category</h2>
        <canvas id="categoryPieChart" width="400" height="200"></canvas>

        <h2>Spending by Label</h2>
        <canvas id="labelPieChart" width="400" height="200"></canvas>

        <h2>Spending by Month</h2>
        <canvas id="monthlyBarChart" width="600" height="300"></canvas>

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

        <script>
          // Category Pie Chart
          new Chart(document.getElementById('categoryPieChart'), {
            type: 'pie',
            data: {
              labels: ${JSON.stringify(Object.keys(categorySpending))},
              datasets: [{
                data: ${JSON.stringify(Object.values(categorySpending))},
                backgroundColor: [
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 206, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
                ],
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Spending by Category'
                }
              }
            }
          });

          // Label Pie Chart
          new Chart(document.getElementById('labelPieChart'), {
            type: 'pie',
            data: {
              labels: ${JSON.stringify(Object.keys(labelSpending))},
              datasets: [{
                data: ${JSON.stringify(Object.values(labelSpending))},
                backgroundColor: [
                  'rgba(255, 159, 64, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
                  'rgba(201, 203, 207, 0.8)',
                ],
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Spending by Label'
                }
              }
            }
          });

          // Monthly Bar Chart
          new Chart(document.getElementById('monthlyBarChart'), {
            type: 'bar',
            data: {
              labels: ${JSON.stringify(Object.keys(monthlySpending))},
              datasets: [{
                label: 'Monthly Spending',
                data: ${JSON.stringify(Object.values(monthlySpending))},
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
              }]
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Amount Spent ($)'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Month'
                  }
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
