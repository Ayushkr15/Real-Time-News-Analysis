
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopicTrend } from "@/types/news";
import { getSentimentColor } from "@/utils/sentimentAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TopicsChartProps {
  data: TopicTrend[];
  isLoading: boolean;
}

const TopicsChart = ({ data, isLoading }: TopicsChartProps) => {
  const [sortedTopics, setSortedTopics] = useState<TopicTrend[]>([]);
  const [sortBy, setSortBy] = useState<"count" | "sentiment">("count");

  useEffect(() => {
    if (data.length > 0) {
      // Sort topics based on selected criteria
      const sorted = [...data].sort((a, b) => {
        if (sortBy === "count") {
          return b.count - a.count;
        } else {
          return b.sentiment - a.sentiment;
        }
      });
      
      setSortedTopics(sorted.slice(0, 10));
    }
  }, [data, sortBy]);

  const getSentimentLabel = (sentiment: number): string => {
    if (sentiment > 0.5) return "Very Positive";
    if (sentiment > 0.2) return "Positive";
    if (sentiment < -0.5) return "Very Negative";
    if (sentiment < -0.2) return "Negative";
    return "Neutral";
  };

  const getSentimentEmoji = (sentiment: number): string => {
    if (sentiment > 0.5) return "😁";
    if (sentiment > 0.2) return "🙂";
    if (sentiment < -0.5) return "😠";
    if (sentiment < -0.2) return "🙁";
    return "😐";
  };

  return (
    <Card className="col-span-4 md:col-span-2 lg:col-span-2">
      <CardHeader>
        <CardTitle>Trending Topics</CardTitle>
        <CardDescription>Most discussed subjects with sentiment analysis</CardDescription>
        <Tabs defaultValue="count" onValueChange={(value) => setSortBy(value as "count" | "sentiment")}>
          <TabsList>
            <TabsTrigger value="count">By Volume</TabsTrigger>
            <TabsTrigger value="sentiment">By Sentiment</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-pulse-slow text-muted-foreground">Loading topic data...</div>
          </div>
        ) : sortedTopics.length > 0 ? (
          <div className="space-y-5 p-1">
            {sortedTopics.map((topic) => {
              const width = `${Math.min(100, (topic.count / sortedTopics[0].count) * 100)}%`;
              const sentimentColor = getSentimentColor(topic.sentiment);
              const sentimentLabel = getSentimentLabel(topic.sentiment);
              const sentimentEmoji = getSentimentEmoji(topic.sentiment);
              
              return (
                <div key={topic.topic} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="capitalize font-semibold text-md flex items-center gap-2">
                      {topic.topic}
                      <span className={`text-xs ${sentimentColor}`}>
                        {sentimentEmoji} {sentimentLabel}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">{topic.count} articles</div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        topic.sentiment > 0.2 ? "bg-green-500" : 
                        topic.sentiment < -0.2 ? "bg-red-500" : 
                        "bg-yellow-500"
                      }`} 
                      style={{ width }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-muted-foreground">No topic data available</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicsChart;
