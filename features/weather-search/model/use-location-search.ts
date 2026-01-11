import { useState, useEffect } from "react";
import { searchLocations, type Location } from "@/entities/location";

/**
 * 위치 검색 로직 관리
 * - 디바운싱된 검색
 * - 검색 결과 상태 관리
 */
export function useLocationSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const search = () => {
      if (query.trim().length < 1) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = searchLocations(query, 10);
        setResults(searchResults);
      } catch (error) {
        console.error("검색 실패:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return {
    query,
    setQuery,
    results,
    isLoading,
    clearSearch,
  };
}
