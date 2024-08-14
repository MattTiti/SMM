import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { capitalizeFirstLetter, formatCurrency } from "@/lib/utils";
import { Cell } from "recharts";
const DashboardBarChart = ({ yearlyExpenses, selectedMonth }) => {
  const chartConfig = {
    totalSpending: {
      label: "Total Spending",
      color: "hsl(var(--chart-1))",
    },
  };
  
  // Aggregate total spending per month
  const monthlySpending = yearlyExpenses.map((monthData) => {
    const totalSpending = monthData?.expenses?.reduce(
      (acc, expense) => acc + parseFloat(expense.cost || 0),
      0
    );
    return {
      month: capitalizeFirstLetter(monthData?.month),
      totalSpending,
    };
  });

  // Find the selected month's data and previous month's data
  const selectedMonthData = monthlySpending.find(
    (data) => data.month === capitalizeFirstLetter(selectedMonth)
  );
  
  const selectedMonthIndex = monthlySpending.findIndex(
    (data) => data.month === capitalizeFirstLetter(selectedMonth)
  );
  
  const previousMonthData =
    selectedMonthIndex > 0 ? monthlySpending[selectedMonthIndex - 1] : null;

  // Calculate the percentage change
  const percentageChange = previousMonthData
    ? ((selectedMonthData.totalSpending - previousMonthData.totalSpending) / previousMonthData.totalSpending) * 100
    : null;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <CardTitle>Spending by Month</CardTitle>
        <CardDescription>Yearly Spending Overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={monthlySpending}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="totalSpending" radius={8}>
              {monthlySpending.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.month === capitalizeFirstLetter(selectedMonth)
                      ? "hsl(var(--chart-2))" // Highlighted color for selected month
                      : "hsl(var(--chart-1))" // Default color
                  }
                />
              ))}
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value) => formatCurrency(value)}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {percentageChange !== null && (
          <div className="flex gap-2 font-medium leading-none">
            {percentageChange >= 0 ? (
              <>
                Trending up by {percentageChange.toFixed(2)}% this month
                <TrendingUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Trending down by {Math.abs(percentageChange).toFixed(2)}% this month
                <TrendingDown className="h-4 w-4" />
              </>
            )}
          </div>
        )}

      </CardFooter>
    </Card>
  );
};

export default DashboardBarChart;
