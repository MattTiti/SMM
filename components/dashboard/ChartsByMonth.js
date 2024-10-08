import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomBarChart from "./CustomBarChart";
import CustomPieChart from "./CustomPieChart";
import CustomLineChart from "./CustomLineChart";
import { capitalizeFirstLetter } from "@/lib/utils";

const ChartsByMonth = ({ yearlyExpenses, selectedMonth }) => {
  const [selectedChart, setSelectedChart] = useState("line");

  const chartConfig = {
    totalSpending: {
      label: "Cost",
    },
  };

  const monthsOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Aggregate total spending per month
  const monthlySpending = yearlyExpenses
    .map((monthData) => {
      const totalSpending = monthData?.expenses?.reduce(
        (acc, expense) => acc + parseFloat(expense.cost || 0),
        0
      );
      return {
        month: capitalizeFirstLetter(monthData?.month),
        totalSpending,
        fill: `hsl(var(--color-${monthData?.month?.toLowerCase()}))`,
      };
    })
    .sort(
      (a, b) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month)
    );

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
    ? ((selectedMonthData.totalSpending - previousMonthData.totalSpending) /
        previousMonthData.totalSpending) *
      100
    : null;

  const renderChart = () => {
    switch (selectedChart) {
      case "bar":
        return (
          <CustomBarChart
            data={monthlySpending}
            selectedMonth={selectedMonth}
            dataKey="totalSpending"
            chartConfig={chartConfig}
          />
        );
      case "pie":
        return (
          <CustomPieChart
            data={monthlySpending}
            dataKey="totalSpending"
            nameKey="month"
          />
        );
      case "line":
        return (
          <CustomLineChart
            data={monthlySpending}
            selectedKey="month"
            dataKey="totalSpending"
            chartConfig={chartConfig}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex justify-between">
        <div className="flex w-full justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl">
              Spending by Month
            </CardTitle>
            <CardDescription>Yearly Spending Overview</CardDescription>
          </div>
          <Select onValueChange={setSelectedChart} value={selectedChart}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Select Chart" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="pie">Pie</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {percentageChange !== null && (
          <div className="flex gap-2 font-medium leading-none">
            {percentageChange >= 0 ? (
              <>
                <span className="text-black/80">
                  Trending up by {percentageChange.toFixed(2)}% this month
                </span>
                <TrendingUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span className="text-black/80">
                  Trending down by {Math.abs(percentageChange).toFixed(2)}% this
                  month
                </span>
                <TrendingDown className="h-4 w-4" />
              </>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ChartsByMonth;
