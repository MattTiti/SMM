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

const DashboardPieChart = ({ rows = [], selectedMonth }) => {
  // Aggregate spending by category
  const spendingByCategory = React.useMemo(() => {
    const categoryMap = {};

    rows?.forEach((row) => {
      const category = row.category || "Other";
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
  }, [rows]);

  const totalSpending = React.useMemo(() => {
    return spendingByCategory.reduce((acc, curr) => acc + curr.cost, 0);
  }, [spendingByCategory]);

  const capitalizeFirstLetter = (string) => {
    if (!string) return ""; // Handle empty strings or undefined
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalSpending.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
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
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing spending by category for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default DashboardPieChart;
