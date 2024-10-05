import { LineChart, Line, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const CustomLineChart = ({
  data,
  selectedKey = "month",
  dataKey = "totalSpending",
  chartConfig,
}) => {
  if (data.length <= 1) {
    return (
      <div className="text-center text-sm text-black p-12 sm:p-24">
        Not enough data available
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, left: 20, right: 20 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={selectedKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Line
          dataKey={dataKey}
          type="natural"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--color-chart-1))" }}
          activeDot={{ r: 6 }}
        ></Line>
      </LineChart>
    </ChartContainer>
  );
};

export default CustomLineChart;
