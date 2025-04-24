
import { useEffect, useState } from "react";
import { fetchTopHeadlines } from "@/services/newsApi";
import { 
  CategoryDistribution, 
  NewsArticle, 
  SentimentData, 
  SourceDistribution, 
  TopicTrend 
} from "@/types/news";
import { 
  getCategoryDistribution,
  getSourceDistribution, 
  getAggregatedSentiment, 
  getTrendingTopics
} from "@/utils/sentimentAnalysis";
import { useToast } from "@/hooks/use-toast";

import SourceBarChart from "@/components/Dashboard/SourceBarChart";
import SentimentChart from "@/components/Dashboard/SentimentChart";
import TopicsChart from "@/components/Dashboard/TopicsChart";
import CategoryPieChart from "@/components/Dashboard/CategoryPieChart";
import HeadlinesList from "@/components/Dashboard/HeadlinesList";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import KeywordCloud from "@/components/Dashboard/KeywordCloud";
import AnalyticsMetrics from "@/components/Dashboard/AnalyticsMetrics";
import TopicTimeline from "@/components/Dashboard/TopicTimeline";

// Available countries for news
export const AVAILABLE_COUNTRIES = {
  us: "United States",
  gb: "United Kingdom",
  fr: "France",
  de: "Germany",
  in: "India",
  au: "Australia",
  ca: "Canada",
  jp: "Japan"
};

const Index = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sourceData, setSourceData] = useState<SourceDistribution[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData>({ positive: 0, neutral: 0, negative: 0 });
  const [trendingTopics, setTrendingTopics] = useState<TopicTrend[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDistribution[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("us");
  const { toast } = useToast();

  const fetchNewsData = async (category = "all", country = selectedCountry) => {
    setIsLoading(true);
    try {
      const apiCategory = category === "all" ? "" : category;
      const response = await fetchTopHeadlines(country, apiCategory);
      
      if (response.status === "ok" && response.articles.length > 0) {
        setArticles(response.articles);
        
        const sources = getSourceDistribution(response.articles);
        const sentiment = getAggregatedSentiment(response.articles);
        const topics = getTrendingTopics(response.articles);
        const categories = getCategoryDistribution(response.articles);
        
        setSourceData(sources);
        setSentimentData(sentiment);
        setTrendingTopics(topics);
        setCategoryData(categories);
        
        toast({
          title: "News data updated",
          description: `Loaded ${response.articles.length} articles from ${AVAILABLE_COUNTRIES[country as keyof typeof AVAILABLE_COUNTRIES]}`,
        });
      } else {
        toast({
          title: "Error fetching news",
          description: "Could not load news data. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch news data:", error);
      toast({
        title: "Error fetching news",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchNewsData(category, selectedCountry);
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    fetchNewsData(selectedCategory, country);
  };

  const handleRefresh = () => {
    fetchNewsData(selectedCategory, selectedCountry);
  };

  useEffect(() => {
    fetchNewsData();
    const interval = setInterval(() => {
      fetchNewsData(selectedCategory, selectedCountry);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <DashboardHeader 
        onRefresh={handleRefresh} 
        isLoading={isLoading} 
        onCategoryChange={handleCategoryChange}
        onCountryChange={handleCountryChange}
        selectedCategory={selectedCategory}
        selectedCountry={selectedCountry}
        availableCountries={AVAILABLE_COUNTRIES}
      />
      
      {/* Analytics Metrics Cards */}
      <div className="mb-6">
        <AnalyticsMetrics 
          articles={articles} 
          sentimentData={sentimentData} 
          topicTrends={trendingTopics} 
          isLoading={isLoading} 
        />
      </div>
      
      {/* Main Charts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <SentimentChart data={sentimentData} isLoading={isLoading} />
        <TopicsChart data={trendingTopics} isLoading={isLoading} />
      </div>
      
      {/* Topic Timeline */}
      <div className="mb-6">
        <TopicTimeline 
          articles={articles} 
          topicTrends={trendingTopics} 
          isLoading={isLoading} 
        />
      </div>
      
      {/* Keyword Cloud */}
      <div className="mb-6">
        <KeywordCloud articles={articles} isLoading={isLoading} />
      </div>
      
      {/* Secondary Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SourceBarChart data={sourceData} isLoading={isLoading} />
        <CategoryPieChart data={categoryData} isLoading={isLoading} />
      </div>
      
      {/* Headlines List */}
      <HeadlinesList articles={articles} isLoading={isLoading} />
    </div>
  );
};

export default Index;
