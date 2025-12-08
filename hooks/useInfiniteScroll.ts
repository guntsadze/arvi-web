import { useState, useEffect, useCallback } from "react";

export function useInfiniteScroll<T>(
  fetchFn: (page: number) => Promise<any>,
  deps: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetchFn(page);
      const newData = response.data.data || response.data;

      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setData((prev) => [...prev, ...newData]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchFn]);

  // Load initial data
  useEffect(() => {
    loadMore();
  }, deps);

  // Infinite scroll observer
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  const refresh = () => {
    setData([]);
    setPage(1);
    setHasMore(true);
  };

  return { data, loading, hasMore, loadMore, refresh };
}
