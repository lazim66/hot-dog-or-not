'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AnalyzeResponse } from '@/types';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

interface StatsChartProps {
  analyses: AnalyzeResponse[];
}

export function StatsChart({ analyses }: StatsChartProps) {
  if (analyses.length === 0) {
    return null;
  }

  // Calculate statistics
  const hotDogCount = analyses.filter(a => a.isHotDog).length;
  const notHotDogCount = analyses.length - hotDogCount;
  const avgConfidence = analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length;

  const pieData = [
    { name: 'Hot Dog', value: hotDogCount, fill: 'hsl(var(--chart-1))' },
    { name: 'Not Hot Dog', value: notHotDogCount, fill: 'hsl(var(--chart-2))' },
  ];

  const chartConfig = {
    value: {
      label: 'Count',
    },
    hotdog: {
      label: 'Hot Dog',
      color: 'hsl(var(--chart-1))',
    },
    nothotdog: {
      label: 'Not Hot Dog',
      color: 'hsl(var(--chart-2))',
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Total Analyses</CardTitle>
          <CardDescription>All time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{analyses.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hot Dogs Detected</CardTitle>
          <CardDescription>
            {analyses.length > 0 ? `${((hotDogCount / analyses.length) * 100).toFixed(1)}% of total` : 'N/A'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600">{hotDogCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Confidence</CardTitle>
          <CardDescription>Across all analyses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{avgConfidence.toFixed(1)}%</div>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Detection Breakdown</CardTitle>
          <CardDescription>Hot Dog vs Not Hot Dog</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
