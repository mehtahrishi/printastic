
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartTooltipContent } from "@/components/ui/chart"

export interface SalesChartProps {
    data: Array<{date: string, sales: number}>;
}

export function SalesChart({data}: SalesChartProps) {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data}>
                  <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                  />
                  <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip
                      content={<ChartTooltipContent />}
                      cursor={{ fill: "hsl(var(--muted))" }}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
              </ResponsiveContainer>
        </CardContent>
    </Card>
  )
}
