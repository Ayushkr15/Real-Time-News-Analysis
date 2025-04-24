
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeywordData } from "@/types/news";
import { NewsArticle } from "@/types/news";

interface KeywordCloudProps {
  articles: NewsArticle[];
  isLoading: boolean;
}

const KeywordCloud = ({ articles, isLoading }: KeywordCloudProps) => {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);

  useEffect(() => {
    if (articles.length > 0 && !isLoading) {
      const extractedKeywords = extractKeywords(articles);
      setKeywords(extractedKeywords);
    }
  }, [articles, isLoading]);

  const extractKeywords = (articles: NewsArticle[]): KeywordData[] => {
    const stopWords = new Set([
      "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", 
      "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", 
      "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", 
      "having", "he", "her", "here", "hers", "herself", "him", "himself", "his", "how", "i", "if", "in", 
      "into", "is", "it", "its", "itself", "just", "me", "more", "most", "my", "myself", "no", "nor", 
      "not", "now", "of", "off", "on", "once", "only", "or", "other", "our", "ours", "ourselves", "out", 
      "over", "own", "same", "she", "should", "so", "some", "such", "than", "that", "the", "their", "theirs", 
      "them", "themselves", "then", "there", "these", "they", "this", "those", "through", "to", "too", 
      "under", "until", "up", "very", "was", "we", "were", "what", "when", "where", "which", "while", 
      "who", "whom", "why", "will", "with", "would", "you", "your", "yours", "yourself", "yourselves"
    ]);

    const wordCounts: Record<string, number> = {};
    
    articles.forEach(article => {
      const text = `${article.title || ''} ${article.description || ''}`;
      const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.has(word));
      
      words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
    });
    
    return Object.entries(wordCounts)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 30);
  };

  const getFontSize = (count: number): string => {
    const max = Math.max(...keywords.map(k => k.value));
    const min = Math.min(...keywords.map(k => k.value));
    const normalized = (count - min) / (max - min || 1);
    const baseSize = 14;
    const maxSize = 36;
    return `${baseSize + normalized * (maxSize - baseSize)}px`;
  };

  const getColor = (index: number): string => {
    const colors = [
      "text-blue-500", "text-green-500", "text-red-500", 
      "text-purple-500", "text-yellow-500", "text-indigo-500",
      "text-pink-500", "text-teal-500", "text-orange-500"
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Keyword Cloud</CardTitle>
        <CardDescription>Most frequent terms in current news</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        {isLoading ? (
          <div className="animate-pulse-slow text-muted-foreground">Loading keywords...</div>
        ) : keywords.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-center items-center p-4">
            {keywords.map((keyword, index) => (
              <span
                key={keyword.text}
                className={`${getColor(index)} font-medium hover:opacity-80 transition-opacity cursor-default`}
                style={{ fontSize: getFontSize(keyword.value) }}
                title={`${keyword.text}: mentioned ${keyword.value} times`}
              >
                {keyword.text}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">No keywords available</div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordCloud;
