import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  cost: {
    label: "Cost",
    color: "hsl(var(--chart-1))",
  },
};

const DashboardHorizontalBar = ({ data }) => {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={data} layout="vertical" margin={{ right: 16 }}>
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="category"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          hide
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent nameKey="category" />}
        />
        <XAxis type="number" hide />
        <Bar
          dataKey="cost"
          layout="vertical"
          fill="var(--color-desktop)"
          radius={4}
        >
          <LabelList
            dataKey="category"
            position="insideLeft"
            offset={8}
            className="fill-[--color-label]"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default DashboardHorizontalBar;
