import { startTransition, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export function useInfiniteScroll<T>(
  initialData: T[],
  loadMoreAction: (pageNumber: number) => Promise<T[]>,
  numberOfPages: number,
) {
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);

  const { ref } = useInView({
    delay: 1000,
    onChange: inView => {
      if (inView) {
        loadMore();
      }
    },
  });

  const loadMore = () => {
    if (loading || pageNumber >= numberOfPages) return;
    setLoading(true);
    startTransition(async () => {
      const scrollPosition = window.scrollY;
      const newData: T[] = await loadMoreAction(pageNumber + 1);
      setData(prevData => {
        return [...prevData, ...newData];
      });
      setPageNumber(prev => {
        return prev + 1;
      });
      if (window.scrollY === scrollPosition) {
        window.scrollTo(0, scrollPosition);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(initialData);
    setPageNumber(1);
  }, [initialData]);

  return { data, loadMore, loading, pageNumber, ref };
}
