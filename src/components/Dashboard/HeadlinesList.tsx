
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsArticle } from "@/types/news";
import { analyzeSentiment, getSentimentColor } from "@/utils/sentimentAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HeadlinesListProps {
  articles: NewsArticle[];
  isLoading: boolean;
}

const HeadlinesList = ({ articles, isLoading }: HeadlinesListProps) => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredArticles = articles.filter(article => {
    if (activeTab === "all") return true;
    
    const text = `${article.title || ''} ${article.description || ''}`;
    const sentiment = analyzeSentiment(text);
    
    if (activeTab === "positive") return sentiment > 0.2;
    if (activeTab === "negative") return sentiment < -0.2;
    return sentiment >= -0.2 && sentiment <= 0.2; // neutral
  });

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Latest Headlines</CardTitle>
        <CardDescription>Recent news with sentiment analysis</CardDescription>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="positive">Positive</TabsTrigger>
            <TabsTrigger value="neutral">Neutral</TabsTrigger>
            <TabsTrigger value="negative">Negative</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="max-h-[350px] overflow-y-auto">
        {isLoading ? (
          <div className="h-[200px] w-full flex items-center justify-center">
            <div className="animate-pulse-slow text-muted-foreground">Loading headlines...</div>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="space-y-4">
            {filteredArticles.slice(0, 10).map((article, idx) => {
              const text = `${article.title || ''} ${article.description || ''}`;
              const sentiment = analyzeSentiment(text);
              const sentimentColor = getSentimentColor(sentiment);
              
              return (
                <div key={idx} className="border-b border-border pb-4 last:border-0">
                  <div className="flex justify-between mb-2">
                    <div className="text-sm text-muted-foreground">
                      {article.source.name} • {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                    <div className={`text-sm font-medium ${sentimentColor}`}>
                      {sentiment > 0.2 ? 'Positive' : sentiment < -0.2 ? 'Negative' : 'Neutral'}
                    </div>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold hover:text-primary transition-colors"
                  >
                    {article.title}
                  </a>
                  {article.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {article.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-[200px] w-full flex items-center justify-center">
            <div className="text-muted-foreground">No headlines available</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeadlinesList;
