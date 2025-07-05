import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export function useInfiniteScroll<T>(initialData: T[], loadMoreAction: () => Promise<T[]>, numberOfPages: number) {
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState<T[]>(initialData);
  const { ref } = useInView({
    delay: 1000,
    onChange: inView => {
      if (inView) {
        loadMore();
      }
    },
  });

  const loadMore = async () => {
    const scrollPosition = window.scrollY;
    if (pageNumber >= numberOfPages) return;
    const newData: T[] = await loadMoreAction();
    setData(prevData => {
      return [...prevData, ...newData];
    });
    setPageNumber(prev => {
      return prev + 1;
    });
    if (window.scrollY === scrollPosition) {
      window.scrollTo(0, scrollPosition);
    }
  };

  useEffect(() => {
    setData(initialData);
    setPageNumber(1);
  }, [initialData]);

  return { data, loadMore, pageNumber, ref };
}
