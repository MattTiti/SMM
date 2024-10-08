import { PieChart, Pie, Cell, Label } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

const CustomPieChart = ({
  data,
  dataKey = "totalSpending",
  nameKey = "month",
  totalLabel = "Total Spending",
  formatLabel = formatCurrency,
}) => {
  const totalSpending = data.reduce((acc, entry) => acc + entry[dataKey], 0);

  return (
    <>
      {data.length === 0 || totalSpending === 0 ? (
        <div className="text-center text-sm text-black p-12 sm:p-24">
          Not enough data available
        </div>
      ) : (
        <ChartContainer className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
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
                          className="fill-black/80 text-xl font-bold"
                        >
                          {formatLabel(totalSpending)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-black/60"
                        >
                          {totalLabel}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      )}
    </>
  );
};

export default CustomPieChart;
