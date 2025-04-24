
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TopicTrend, NewsArticle } from "@/types/news";
import { extractTopics } from "@/utils/sentimentAnalysis";

interface TopicTimelineProps {
  articles: NewsArticle[];
  topicTrends: TopicTrend[];
  isLoading: boolean;
}

const TopicTimeline = ({ articles, topicTrends, isLoading }: TopicTimelineProps) => {
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    if (articles.length > 0 && !isLoading) {
      // Get top 3 topics
      const topTopics = topicTrends
        .slice(0, 3)
        .map(trend => trend.topic);
      
      setSelectedTopics(topTopics);
      
      // Group articles by date
      const articlesByDate = groupArticlesByDate(articles);
      
      // Create timeline data
      const timeline = generateTimelineData(articlesByDate, topTopics);
      setTimelineData(timeline);
    }
  }, [articles, topicTrends, isLoading]);

  // Group articles by date (past 7 days)
  const groupArticlesByDate = (articles: NewsArticle[]) => {
    const result: Record<string, NewsArticle[]> = {};
    const today = new Date();
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      result[dateStr] = [];
    }
    
    // Group articles
    articles.forEach(article => {
      const dateStr = new Date(article.publishedAt).toISOString().split('T')[0];
      if (result[dateStr]) {
        result[dateStr].push(article);
      }
    });
    
    return result;
  };

  // Generate timeline data for selected topics
  const generateTimelineData = (articlesByDate: Record<string, NewsArticle[]>, topics: string[]) => {
    return Object.entries(articlesByDate).map(([date, dayArticles]) => {
      const dataPoint: any = {
        date: formatDate(date)
      };
      
      // Count occurrences of each topic for this date
      topics.forEach(topic => {
        let count = 0;
        dayArticles.forEach(article => {
          const text = `${article.title || ''} ${article.description || ''}`;
          const articleTopics = extractTopics(text);
          if (articleTopics.includes(topic)) {
            count++;
          }
        });
        
        dataPoint[topic] = count;
      });
      
      return dataPoint;
    });
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Generate colors for topics
  const getTopicColor = (index: number) => {
    const colors = ["#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#f59e0b"];
    return colors[index % colors.length];
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Topic Trends Timeline</CardTitle>
        <CardDescription>How topics have evolved over the past week</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-pulse-slow text-muted-foreground">Loading timeline data...</div>
          </div>
        ) : timelineData.length > 0 && selectedTopics.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 30, 30, 0.9)',
                  borderColor: '#555',
                  color: '#eee'
                }}
              />
              <Legend />
              {selectedTopics.map((topic, index) => (
                <Line
                  key={topic}
                  type="monotone"
                  dataKey={topic}
                  name={topic}
                  stroke={getTopicColor(index)}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-muted-foreground">No timeline data available</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicTimeline;
