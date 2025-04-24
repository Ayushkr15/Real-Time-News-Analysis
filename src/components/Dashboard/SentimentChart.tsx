
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SentimentData } from "@/types/news";

interface SentimentChartProps {
  data: SentimentData;
  isLoading: boolean;
}

const SentimentChart = ({ data, isLoading }: SentimentChartProps) => {
  const chartData = [
    { name: "Positive", value: data.positive, color: "#10b981" },
    { name: "Neutral", value: data.neutral, color: "#eab308" },
    { name: "Negative", value: data.negative, color: "#ef4444" },
  ];

  const totalArticles = data.positive + data.neutral + data.negative;

  return (
    <Card className="col-span-4 md:col-span-2 lg:col-span-2">
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
        <CardDescription>Emotional tone of news articles</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-pulse-slow text-muted-foreground">Loading sentiment data...</div>
          </div>
        ) : totalArticles > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} articles`, 'Count']}
                contentStyle={{
                  backgroundColor: 'rgba(30, 30, 30, 0.9)',
                  borderColor: '#555',
                  color: '#eee'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-muted-foreground">No sentiment data available</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SentimentChart;
