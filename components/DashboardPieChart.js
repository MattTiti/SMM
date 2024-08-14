import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { capitalizeFirstLetter, formatCurrency } from "@/lib/utils";

const DashboardPieChart = ({ monthlyExpenses = [], selectedMonth }) => {
  // Aggregate spending by category
  const spendingByCategory = React.useMemo(() => {
    const categoryMap = {};

    monthlyExpenses?.forEach((row) => {
      const category = capitalizeFirstLetter(row.category) || "Other";
      const cost = parseFloat(row.cost || 0);

      if (categoryMap[category]) {
        categoryMap[category] += cost;
      } else {
        categoryMap[category] = cost;
      }
    });

    return Object.entries(categoryMap).map(([category, cost]) => ({
      category,
      cost,
      fill: `hsl(var(--color-${category.toLowerCase()}))`,
    }));
  }, [monthlyExpenses]);

  // Calculate total spending
  const totalSpending = React.useMemo(() => {
    return spendingByCategory.reduce((acc, curr) => acc + curr.cost, 0);
  }, [spendingByCategory]);

  // Find highest and lowest expense categories
  const highestCategory = React.useMemo(() => {
    return spendingByCategory.reduce(
      (max, curr) => (curr.cost > max.cost ? curr : max),
      spendingByCategory[0] || { category: "N/A", cost: 0 }
    );
  }, [spendingByCategory]);

  const lowestCategory = React.useMemo(() => {
    return spendingByCategory.reduce(
      (min, curr) => (curr.cost < min.cost ? curr : min),
      spendingByCategory[0] || { category: "N/A", cost: 0 }
    );
  }, [spendingByCategory]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>
          {capitalizeFirstLetter(selectedMonth)} 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={spendingByCategory}
              dataKey="cost"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          {formatCurrency(totalSpending)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Spending
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Highest expense category — {highestCategory.category} ({formatCurrency(highestCategory.cost)})
        </div>
        <div className="leading-none text-muted-foreground">
          Lowest expense category — {lowestCategory.category} ({formatCurrency(lowestCategory.cost)})
        </div>
      </CardFooter>
    </Card>
  );
};

export default DashboardPieChart;
