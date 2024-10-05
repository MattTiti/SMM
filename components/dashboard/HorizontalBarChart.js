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

const HorizontalBarChart = ({ data, dataKey }) => {
  return (
    <>
      {data.length <= 1 ? (
        <div className="text-center text-sm text-black p-12 sm:p-24">
          Not enough data available
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="my-2">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ right: 50, left: 0 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey={dataKey}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey={dataKey} />}
            />
            <XAxis type="number" hide />
            <Bar
              dataKey="cost"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey={dataKey === "label" ? "" : dataKey}
                position="right"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </>
  );
};

export default HorizontalBarChart;
