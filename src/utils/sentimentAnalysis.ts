
import { NewsArticle, SentimentData, SourceDistribution, TopicTrend, CategoryDistribution } from "../types/news";

// Simple sentiment analysis based on common positive and negative words
const POSITIVE_WORDS = [
  "good", "great", "excellent", "positive", "success", "win", "happy", "best", 
  "hope", "improve", "better", "rise", "growth", "progress", "advance", "gain",
  "boost", "recover", "breakthrough", "celebrate", "achievement", "support"
];

const NEGATIVE_WORDS = [
  "bad", "fail", "poor", "negative", "worse", "worst", "problem", "crisis", 
  "trouble", "risk", "fear", "concern", "decline", "drop", "loss", "danger", 
  "threat", "warning", "crash", "disaster", "conflict", "accident", "violence"
];

// Topic extraction based on common topics
const TOPICS = {
  "politics": ["president", "government", "election", "congress", "senate", "democrat", "republican", "policy", "vote"],
  "technology": ["tech", "apple", "google", "microsoft", "ai", "artificial intelligence", "software", "app", "device", "digital"],
  "health": ["covid", "pandemic", "health", "disease", "vaccine", "hospital", "doctor", "medical", "medicine", "treatment"],
  "economy": ["economy", "market", "stock", "inflation", "financial", "bank", "price", "investment", "trade", "economic"],
  "climate": ["climate", "environment", "warming", "green", "carbon", "emission", "sustainable", "pollution", "energy"],
  "sports": ["sports", "game", "player", "team", "win", "championship", "tournament", "league", "match", "score"],
  "entertainment": ["film", "movie", "music", "celebrity", "star", "actor", "actress", "hollywood", "show", "award"]
};

export function analyzeSentiment(text: string): number {
  if (!text) return 0;
  
  const lowercaseText = text.toLowerCase();
  let score = 0;
  
  // Count positive words
  POSITIVE_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowercaseText.match(regex);
    if (matches) {
      score += matches.length;
    }
  });
  
  // Count negative words
  NEGATIVE_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowercaseText.match(regex);
    if (matches) {
      score -= matches.length;
    }
  });
  
  // Normalize score between -1 and 1
  const normalizedScore = Math.max(-1, Math.min(1, score / 5));
  return normalizedScore;
}

export function extractTopics(text: string): string[] {
  if (!text) return [];
  
  const lowercaseText = text.toLowerCase();
  const foundTopics = new Set<string>();
  
  Object.entries(TOPICS).forEach(([topic, keywords]) => {
    for (const keyword of keywords) {
      if (lowercaseText.includes(keyword)) {
        foundTopics.add(topic);
        break;
      }
    }
  });
  
  return Array.from(foundTopics);
}

export function getAggregatedSentiment(articles: NewsArticle[]): SentimentData {
  let positive = 0;
  let neutral = 0;
  let negative = 0;
  
  articles.forEach(article => {
    const text = `${article.title || ''} ${article.description || ''} ${article.content || ''}`;
    const score = analyzeSentiment(text);
    
    if (score > 0.2) positive++;
    else if (score < -0.2) negative++;
    else neutral++;
  });
  
  return { positive, neutral, negative };
}

export function getSourceDistribution(articles: NewsArticle[]): SourceDistribution[] {
  const sourceCounts: Record<string, number> = {};
  
  articles.forEach(article => {
    const sourceName = article.source.name;
    if (sourceName) {
      sourceCounts[sourceName] = (sourceCounts[sourceName] || 0) + 1;
    }
  });
  
  // Convert to array and sort by count
  return Object.entries(sourceCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 sources
}

export function getTrendingTopics(articles: NewsArticle[]): TopicTrend[] {
  const topicCounts: Record<string, { count: number, sentimentSum: number }> = {};
  
  articles.forEach(article => {
    const text = `${article.title || ''} ${article.description || ''} ${article.content || ''}`;
    const topics = extractTopics(text);
    const sentiment = analyzeSentiment(text);
    
    topics.forEach(topic => {
      if (!topicCounts[topic]) {
        topicCounts[topic] = { count: 0, sentimentSum: 0 };
      }
      topicCounts[topic].count += 1;
      topicCounts[topic].sentimentSum += sentiment;
    });
  });
  
  // Convert to array and calculate average sentiment
  return Object.entries(topicCounts)
    .map(([topic, { count, sentimentSum }]) => ({
      topic,
      count,
      sentiment: count > 0 ? sentimentSum / count : 0
    }))
    .sort((a, b) => b.count - a.count);
}

export function getCategoryDistribution(articles: NewsArticle[]): CategoryDistribution[] {
  const categories = ["politics", "technology", "health", "economy", "climate", "sports", "entertainment", "other"];
  const categoryCounts: Record<string, number> = categories.reduce((acc, cat) => ({...acc, [cat]: 0}), {});
  
  articles.forEach(article => {
    const text = `${article.title || ''} ${article.description || ''} ${article.content || ''}`;
    const topics = extractTopics(text);
    
    if (topics.length > 0) {
      topics.forEach(topic => {
        if (categories.includes(topic)) {
          categoryCounts[topic] += 1;
        }
      });
    } else {
      categoryCounts.other += 1;
    }
  });
  
  return Object.entries(categoryCounts)
    .map(([name, value]) => ({ name, value }));
}

export function getSentimentColor(sentiment: number): string {
  if (sentiment > 0.2) return "text-green-500";
  if (sentiment < -0.2) return "text-red-500";
  return "text-yellow-500";
}
