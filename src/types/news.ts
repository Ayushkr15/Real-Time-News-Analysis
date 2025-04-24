
export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface SourceDistribution {
  name: string;
  count: number;
}

export interface CategoryDistribution {
  name: string;
  value: number;
}

export interface TopicTrend {
  topic: string;
  count: number;
  sentiment: number;
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

export interface KeywordData {
  text: string;
  value: number;
}

export interface TopicTimelinePoint {
  date: string;
  count: number;
  topic: string;
}

export interface EntityData {
  name: string;
  type: string;
  count: number;
  sentiment: number;
}

export interface TopicCluster {
  id: string;
  name: string;
  keywords: string[];
  articles: number;
  sentiment: number;
}
