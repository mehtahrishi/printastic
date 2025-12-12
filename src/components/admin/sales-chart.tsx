"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function SalesChart() {
  const [data, setData] = useState<Array<{date: string, sales: number}>>([]);

  useEffect(() => {
      const generatedData = months.map(month => ({
          date: month,
          sales: Math.floor(Math.random() * 5000) + 1000
      }));
      setData(generatedData);
  }, []);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
            {data.length > 0 ? (
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
                      tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                      content={<ChartTooltipContent />}
                      cursor={{ fill: "hsl(var(--muted))" }}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-[350px]" />
            )}
        </CardContent>
    </Card>
  )
}
