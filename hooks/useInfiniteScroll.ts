import { useState, useEffect, useCallback, useRef } from "react";

export function useInfiniteScroll<T>(
  fetchFn: (page: number) => Promise<any>,
  deps: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(page);
  pageRef.current = page;

  // მთავარი loadMore scroll-ისთვის
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetchFn(pageRef.current);
      const newData = response.data.data || response.data;

      if (!newData || newData.length === 0) {
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
  }, [fetchFn, loading, hasMore]);

  // ფუნქცია explicit page-ის ჩასატვირთად
  const fetchPage = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
      try {
        const response = await fetchFn(pageNumber);
        const newData = response.data.data || response.data;

        setData((prev) => [...prev, ...newData]);
        setPage(pageNumber + 1);
        setHasMore(newData.length > 0);
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn]
  );

  // Initial load
  useEffect(() => {
    loadMore();
  }, deps);

  // Infinite scroll
  useEffect(() => {
    let lastCall = 0;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastCall < 300) return; // 300ms throttle
      lastCall = now;

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

  // Refresh ფუნქცია
  const refresh = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    fetchPage(1); // პირველად იტვირთება პირველი გვერდი
  }, [fetchPage]);

  return { data, loading, hasMore, loadMore, fetchPage, refresh };
}
