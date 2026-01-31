'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AnalyzeResponse } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

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

  // Pie chart data
  const pieData = [
    { name: 'Hot Dog', value: hotDogCount, fill: 'hsl(142, 71%, 45%)' },
    { name: 'Not Hot Dog', value: notHotDogCount, fill: 'hsl(0, 84%, 60%)' },
  ];

  // Daily breakdown data
  const dailyBreakdown = analyses.reduce((acc, analysis) => {
    const date = new Date(analysis.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!acc[date]) {
      acc[date] = { date, hotDog: 0, notHotDog: 0 };
    }
    if (analysis.isHotDog) {
      acc[date].hotDog += 1;
    } else {
      acc[date].notHotDog += 1;
    }
    return acc;
  }, {} as Record<string, { date: string; hotDog: number; notHotDog: number }>);

  const dailyData = Object.values(dailyBreakdown).slice(-7); // Last 7 days

  const pieChartConfig = {
    value: {
      label: 'Count',
    },
  };

  const barChartConfig = {
    hotDog: {
      label: 'Hot Dog',
      color: 'hsl(142, 71%, 45%)',
    },
    notHotDog: {
      label: 'Not Hot Dog',
      color: 'hsl(0, 84%, 60%)',
    },
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide font-medium">Total Analyses</CardDescription>
            <CardTitle className="text-sm text-muted-foreground font-normal">All time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight">{analyses.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide font-medium">Hot Dogs Detected</CardDescription>
            <CardTitle className="text-sm text-muted-foreground font-normal">
              {analyses.length > 0 ? `${((hotDogCount / analyses.length) * 100).toFixed(1)}% of total` : 'N/A'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight">{hotDogCount}</div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide font-medium">Average Confidence</CardDescription>
            <CardTitle className="text-sm text-muted-foreground font-normal">Across all analyses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight">{avgConfidence.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pie Chart */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Detection Breakdown</CardTitle>
            <CardDescription>Hot Dog vs Not Hot Dog</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    cursor={false}
                  />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(142,71%,45%)]" />
                <span className="text-sm text-muted-foreground">Hot Dog: {hotDogCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(0,84%,60%)]" />
                <span className="text-sm text-muted-foreground">Not Hot Dog: {notHotDogCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Daily Breakdown */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Daily Breakdown</CardTitle>
            <CardDescription>Last {dailyData.length} days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} stackOffset="none">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="hotDog" stackId="a" fill="hsl(142, 71%, 45%)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="notHotDog" stackId="a" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[hsl(142,71%,45%)]" />
                <span className="text-sm text-muted-foreground">Hot Dog</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[hsl(0,84%,60%)]" />
                <span className="text-sm text-muted-foreground">Not Hot Dog</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
