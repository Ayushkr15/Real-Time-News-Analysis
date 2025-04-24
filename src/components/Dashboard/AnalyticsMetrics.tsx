
import { Card } from "@/components/ui/card";
import { NewsArticle, SentimentData, TopicTrend } from "@/types/news";
import { TrendingUp, BarChart3, Globe, Clock } from "lucide-react";

interface AnalyticsMetricsProps {
  articles: NewsArticle[];
  sentimentData: SentimentData;
  topicTrends: TopicTrend[];
  isLoading: boolean;
}

const AnalyticsMetrics = ({ articles, sentimentData, topicTrends, isLoading }: AnalyticsMetricsProps) => {
  // Calculate metrics
  const totalArticles = articles.length;
  const uniqueSources = new Set(articles.map(article => article.source.name)).size;
  const topTopic = topicTrends.length > 0 ? topicTrends[0].topic : "N/A";
  
  // Calculate sentiment ratio (positive:negative)
  const sentimentRatio = sentimentData.negative > 0 
    ? (sentimentData.positive / sentimentData.negative).toFixed(2)
    : sentimentData.positive > 0 ? "∞" : "0";
  
  // Calculate freshness (how many articles are from the last 24 hours)
  const last24Hours = new Date();
  last24Hours.setHours(last24Hours.getHours() - 24);
  const freshArticles = articles.filter(article => 
    new Date(article.publishedAt) >= last24Hours
  ).length;

  const freshPercentage = totalArticles > 0 
    ? Math.round((freshArticles / totalArticles) * 100)
    : 0;

  const metrics = [
    {
      title: "Total Sources",
      value: uniqueSources,
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      description: "Unique news sources"
    },
    {
      title: "Leading Topic",
      value: topTopic,
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      description: "Most discussed subject"
    },
    {
      title: "Content Freshness",
      value: `${freshPercentage}%`,
      icon: <Clock className="h-8 w-8 text-purple-500" />,
      description: "Articles < 24 hours old"
    },
    {
      title: "Sentiment Ratio",
      value: sentimentRatio,
      icon: <BarChart3 className="h-8 w-8 text-orange-500" />,
      description: "Positive:Negative ratio"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-6 flex flex-col items-center justify-center text-center">
          {metric.icon}
          <h3 className="mt-4 text-2xl font-bold">{isLoading ? "-" : metric.value}</h3>
          <p className="font-medium text-lg">{metric.title}</p>
          <p className="text-sm text-muted-foreground">{metric.description}</p>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsMetrics;
