"use client"

import { useEffect, useState } from "react"
import { SalesChart } from "@/components/admin/sales-chart";
import { Skeleton } from "@/components/ui/skeleton";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function SalesChartClient() {
  const [data, setData] = useState<Array<{date: string, sales: number}>>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
      setIsMounted(true);
      const generatedData = months.map(month => ({
          date: month,
          sales: Math.floor(Math.random() * 5000) + 1000
      }));
      setData(generatedData);
  }, []);

  if (!isMounted) {
    return <Skeleton className="h-[438px]" />;
  }

  return <SalesChart data={data} />;
}
