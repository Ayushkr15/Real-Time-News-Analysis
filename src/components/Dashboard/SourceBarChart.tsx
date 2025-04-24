
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceDistribution } from "@/types/news";

interface SourceBarChartProps {
  data: SourceDistribution[];
  isLoading: boolean;
}

const SourceBarChart = ({ data, isLoading }: SourceBarChartProps) => {
  const [chartData, setChartData] = useState<SourceDistribution[]>([]);

  useEffect(() => {
    // Process data for the chart
    if (data.length > 0) {
      // Limit to top 10 sources if more exist
      setChartData(data.slice(0, 10));
    }
  }, [data]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>News Sources Distribution</CardTitle>
        <CardDescription>Top sources by article count</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-pulse-slow text-muted-foreground">Loading chart data...</div>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 70,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={70}
                stroke="#aaa"
                tick={{ fill: '#aaa', fontSize: 12 }}
              />
              <YAxis stroke="#aaa" tick={{ fill: '#aaa' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 30, 30, 0.9)',
                  borderColor: '#555',
                  color: '#eee'
                }}
              />
              <Legend wrapperStyle={{ color: '#eee' }} />
              <Bar dataKey="count" name="Article Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-muted-foreground">No source data available</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SourceBarChart;
