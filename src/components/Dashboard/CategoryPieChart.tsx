
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryDistribution } from "@/types/news";

interface CategoryPieChartProps {
  data: CategoryDistribution[];
  isLoading: boolean;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#eab308', '#ef4444', '#94a3b8'];

const CategoryPieChart = ({ data, isLoading }: CategoryPieChartProps) => {
  
  const filteredData = data.filter(item => item.value > 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
        <CardDescription>Articles by category</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-pulse-slow text-muted-foreground">Loading category data...</div>
          </div>
        ) : filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name }) => name}
                labelLine={true}
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            <div className="text-muted-foreground">No category data available</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;
