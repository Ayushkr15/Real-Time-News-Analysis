import { NewsApiResponse } from "../types/news";

const API_KEY = "10b7b7086ace3f28a80bc28fc2e394ee";
const BASE_URL = "http://api.mediastack.com/v1";

export async function fetchTopHeadlines(
  countries = "us",
  category = "",
  limit = 100
): Promise<NewsApiResponse> {
  try {
    let url = `${BASE_URL}/news?access_key=${API_KEY}&countries=${countries}&limit=${limit}`;

    if (category) {
      url += `&categories=${category}`;
    }

    console.log(
      `Fetching news for countries: ${countries}, category: ${category}`
    );
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`API error: ${data.error.message}`);
    }

    // Transform mediastack response to match NewsApiResponse structure
    return {
      status: "ok",
      totalResults: data.pagination?.total || 0,
      articles:
        data.data?.map((article: any) => ({
          source: {
            id: null,
            name: article.source || "Unknown source",
          },
          author: article.author || "Unknown author",
          title: article.title || "",
          description: article.description || "",
          url: article.url || "",
          urlToImage: article.image || "",
          publishedAt: article.published_at || "",
          content: article.content || "",
        })) || [],
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    return {
      status: "error",
      totalResults: 0,
      articles: [],
    };
  }
}

export async function fetchEverything(
  query: string,
  limit = 100
): Promise<NewsApiResponse> {
  try {
    const url = `${BASE_URL}/news?access_key=${API_KEY}&keywords=${encodeURIComponent(
      query
    )}&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`API error: ${data.error.message}`);
    }

    return {
      status: "ok",
      totalResults: data.pagination?.total || 0,
      articles:
        data.data?.map((article: any) => ({
          source: {
            id: null,
            name: article.source || "Unknown source",
          },
          author: article.author || "Unknown author",
          title: article.title || "",
          description: article.description || "",
          url: article.url || "",
          urlToImage: article.image || "",
          publishedAt: article.published_at || "",
          content: article.content || "",
        })) || [],
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    return {
      status: "error",
      totalResults: 0,
      articles: [],
    };
  }
}

// Supported countries (2-letter codes) from mediastack docs
export const NEWS_COUNTRIES = [
  "af",
  "al",
  "ar",
  "au",
  "at",
  "bd",
  "be",
  "bg",
  "br",
  "ca",
  "cn",
  "co",
  "cu",
  "cz",
  "eg",
  "fr",
  "de",
  "gr",
  "hk",
  "hu",
  "in",
  "id",
  "ir",
  "ie",
  "il",
  "it",
  "jp",
  "kr",
  "lv",
  "lt",
  "my",
  "mx",
  "ma",
  "nl",
  "nz",
  "ng",
  "no",
  "pk",
  "pe",
  "ph",
  "pl",
  "pt",
  "ro",
  "ru",
  "sa",
  "rs",
  "sg",
  "sk",
  "si",
  "za",
  "es",
  "se",
  "ch",
  "tw",
  "th",
  "tr",
  "ua",
  "gb",
  "us",
  "ve",
  "vn",
];

export const NEWS_CATEGORIES = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
];
