import { useState, useEffect, useCallback, useRef } from "react";

export function useInfiniteScroll<T extends { id: string }>(
  fetchFn: (page: number) => Promise<any>,
  deps: any[] = [],
  containerRef?: any,
) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadedPages = useRef<Set<number>>(new Set());

  const mergeUnique = (prev: T[], next: T[]) => {
    const map = new Map<string, T>();
    [...prev, ...next].forEach((item) => map.set(item.id, item));
    return Array.from(map.values());
  };

  const loadPage = useCallback(
    async (pageNumber: number) => {
      if (loading || !hasMore) return;
      if (loadedPages.current.has(pageNumber)) return;

      loadedPages.current.add(pageNumber);
      setLoading(true);

      try {
        const response = await fetchFn(pageNumber);
        const newData = response.data?.data || response.data || response;

        console.log("Loaded data:", newData);

        if (!newData || newData.length === 0) {
          setHasMore(false);
          return;
        }

        setData((prev) => mergeUnique(prev, newData));
        setPage(pageNumber + 1);
      } catch (error) {
        console.error("InfiniteScroll error:", error);
        setError(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, loading, hasMore],
  );

  // Reset და თავიდან ჩატვირთვა როცა deps იცვლება
  useEffect(() => {
    loadedPages.current.clear();
    setData([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
    loadPage(1);
  }, deps);

  useEffect(() => {
    const target = containerRef?.current ?? window;
    let lastCall = 0;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastCall < 300) return;
      lastCall = now;

      const el = containerRef?.current;
      if (el) {
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
          loadPage(page);
        }
      } else {
        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 800
        ) {
          loadPage(page);
        }
      }
    };

    target.addEventListener("scroll", handleScroll);
    return () => target.removeEventListener("scroll", handleScroll);
  }, [loadPage, page, containerRef]);

  const refresh = useCallback(() => {
    loadedPages.current.clear();
    setData([]);
    setPage(1);
    setHasMore(true);
    loadPage(1);
  }, [loadPage]);

  return { data, loading, hasMore, refresh, error };
}
