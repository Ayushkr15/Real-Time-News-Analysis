
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NEWS_CATEGORIES } from "@/services/newsApi";
import { Globe, RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  onCategoryChange: (category: string) => void;
  onCountryChange: (country: string) => void;
  selectedCategory: string;
  selectedCountry: string;
  availableCountries: Record<string, string>;
}

const DashboardHeader = ({ 
  onRefresh, 
  isLoading, 
  onCategoryChange, 
  onCountryChange,
  selectedCategory,
  selectedCountry,
  availableCountries
}: DashboardHeaderProps) => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (!isLoading) {
      setLastUpdated(new Date());
    }
  }, [isLoading]);

  return (
    <div className="flex flex-wrap justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">News Trend Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Real-Time Topic Modeling and Analysis for News Articles
        </p>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4 mt-4 sm:mt-0">
        <Select value={selectedCountry} onValueChange={onCountryChange}>
          <SelectTrigger className="w-[180px]">
            <Globe className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(availableCountries).map(([code, name]) => (
              <SelectItem key={code} value={code}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {NEWS_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
