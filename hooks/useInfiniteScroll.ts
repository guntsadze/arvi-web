import { useState, useEffect, useCallback, useRef } from "react";

export function useInfiniteScroll<T extends { id: string }>(
  fetchFn: (page: number) => Promise<any>,
  deps: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadedPages = useRef<Set<number>>(new Set());
  const isInitialLoaded = useRef(false);

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
        const newData = response.data.data || response.data;

        if (!newData || newData.length === 0) {
          setHasMore(false);
          return;
        }

        setData((prev) => mergeUnique(prev, newData));
        setPage(pageNumber + 1);
      } catch (error) {
        console.error("InfiniteScroll error:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, loading, hasMore]
  );

  // Initial load (მხოლოდ ერთხელ)
  useEffect(() => {
    if (isInitialLoaded.current) return;
    isInitialLoaded.current = true;
    loadPage(1);
  }, deps);

  // Scroll listener
  useEffect(() => {
    let lastCall = 0;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastCall < 300) return;
      lastCall = now;

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 800
      ) {
        loadPage(page);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadPage, page]);

  // Refresh
  const refresh = useCallback(() => {
    loadedPages.current.clear();
    isInitialLoaded.current = false;
    setData([]);
    setPage(1);
    setHasMore(true);
    loadPage(1);
  }, [loadPage]);

  return { data, loading, hasMore, refresh };
}
