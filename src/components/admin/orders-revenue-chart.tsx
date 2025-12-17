
"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const DUMMY_DATA = [
    { month: "Jan", orders: Math.floor(Math.random() * 50) + 10, revenue: Math.floor(Math.random() * 5000) + 1000 },
    { month: "Feb", orders: Math.floor(Math.random() * 50) + 10, revenue: Math.floor(Math.random() * 5000) + 1000 },
    { month: "Mar", orders: Math.floor(Math.random() * 50) + 10, revenue: Math.floor(Math.random() * 5000) + 1000 },
    { month: "Apr", orders: Math.floor(Math.random() * 50) + 10, revenue: Math.floor(Math.random() * 5000) + 1000 },
    { month: "May", orders: Math.floor(Math.random() * 50) + 10, revenue: Math.floor(Math.random() * 5000) + 1000 },
    { month: "Jun", orders: Math.floor(Math.random() * 50) + 10, revenue: Math.floor(Math.random() * 5000) + 1000 },
    { month: "Jul", orders: Math.floor(Math.random() * 50) + 10, revenue: Math.floor(Math.random() * 5000) + 1000 },
    { month: "Aug", orders: Math.floor(Math.random() * 50) + 10, revenue: Math.floor(Math.random() * 5000) + 1000 },
    { month: "Sep", orders: Math.floor(Math.random() * 50) + 10, revenue: Math.floor(Math.random() * 5000) + 1000 },
    { month: "Oct", orders: Math.floor(Math.random() * 50) + 10, revenue: Math.floor(Math.random() * 5000) + 1000 },
    { month: "Nov", orders: Math.floor(Math.random() * 50) + 10, revenue: Math.floor(Math.random() * 5000) + 1000 },
    { month: "Dec", orders: Math.floor(Math.random() * 50) + 10, revenue: Math.floor(Math.random() * 5000) + 1000 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function OrdersRevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders & Revenue Overview</CardTitle>
        <CardDescription>Last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <LineChart accessibilityLayer data={DUMMY_DATA}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="var(--color-orders)"
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--color-revenue)"
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="orders"
              type="monotone"
              stroke="var(--color-orders)"
              strokeWidth={2}
              dot={true}
              yAxisId="left"
            />
            <Line
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={true}
              yAxisId="right"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
