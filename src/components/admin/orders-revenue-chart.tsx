
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
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
          <BarChart accessibilityLayer data={DUMMY_DATA}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis yAxisId="left" stroke="hsl(var(--chart-1))" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
            
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
             <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={4} yAxisId="left" />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} yAxisId="right" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
