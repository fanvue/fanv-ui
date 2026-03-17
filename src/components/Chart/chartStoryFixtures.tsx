import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip, ChartTooltipContent } from "./ChartTooltip";
import type { ChartConfig } from "./types";

export function AreaGradient({ id, color }: { id: string; color: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
      <stop offset="95%" stopColor={color} stopOpacity={0.1} />
    </linearGradient>
  );
}

export const earningsConfig = {
  earnings: { label: "Earnings", color: "var(--color-special-chart-teal)" },
} satisfies ChartConfig;

export const simpleLineConfig = earningsConfig;

export const simpleLineData = [
  { day: "Mon", earnings: 142 },
  { day: "Tue", earnings: 189 },
  { day: "Wed", earnings: 234 },
  { day: "Thu", earnings: 178 },
  { day: "Fri", earnings: 295 },
];

export function SimpleLineChart({ config = simpleLineConfig }: { config?: ChartConfig }) {
  return (
    <ChartContainer config={config} className="h-48 w-full">
      <LineChart accessibilityLayer data={simpleLineData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="earnings"
          stroke="var(--color-earnings)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
