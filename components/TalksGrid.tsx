'use client';

import { useSearchParams } from 'next/navigation';
import React, { use, useRef, useState } from 'react';
import { getTalksAction } from '@/data/actions/talk';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { TalksResult } from '@/types/talk';
import { TalkCard } from './talk/TalkCard';
import { TalkDetails } from './talk/TalkDetails';
import Skeleton from './ui/Skeleton';
import Spinner from './ui/Spinner';
import type { Talk } from '@prisma/client';

type Props = {
  talksPromise: Promise<TalksResult>;
  search: string;
};

export default function TalksGrid({ talksPromise, search }: Props) {
  const { talks: initialTalks, totalPages } = use(talksPromise);
  const searchParams = useSearchParams();
  const activeFilters = Object.fromEntries(searchParams.entries());
  const normalizedSearch = search.trim().toLowerCase();
  const [expandedTalkId, setExpandedTalkId] = useState<string | null>(null);
  const scrollPositionRef = useRef<number>(0);

  const {
    data: talks,
    ref,
    pageNumber,
    loading,
  } = useInfiniteScroll<Talk>(
    initialTalks,
    async () => {
      const talksResult = await getTalksAction(activeFilters, pageNumber + 1);
      return talksResult.talks;
    },
    totalPages,
  );

  const filteredTalks = talks.filter(talk => {
    return (
      talk.title.toLowerCase().includes(normalizedSearch) ||
      talk.speaker.toLowerCase().includes(normalizedSearch) ||
      talk.conference.toLowerCase().includes(normalizedSearch) ||
      (talk.tag && talk.tag.toLowerCase().includes(normalizedSearch))
    );
  });

  return expandedTalkId ? (
    <TalkDetails
      talk={
        filteredTalks.find(talk => {
          return talk.id === expandedTalkId;
        }) || null
      }
      onClose={() => {
        setExpandedTalkId(null);
        scrollToPosition(scrollPositionRef.current);
      }}
    />
  ) : (
    <>
      <div suppressHydrationWarning className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {filteredTalks.map(talk => {
          return (
            <TalkCard
              talk={talk}
              key={talk.id}
              onSelect={() => {
                scrollPositionRef.current = window.scrollY;
                setExpandedTalkId(talk.id);
              }}
            />
          );
        })}
      </div>
      {filteredTalks.length === 0 && (
        <div className="py-16 text-center text-gray-500 dark:text-gray-400">
          <div className="mb-3 text-5xl">🔍</div>
          <p className="mb-2 text-xl">No talks found</p>
          <p className="text-sm">Try adjusting your filters or search terms</p>
        </div>
      )}
      <div suppressHydrationWarning className="flex h-5 justify-center pt-5" ref={ref}>
        {loading && <Spinner />}
      </div>
    </>
  );
}

export function TalksGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
}

function scrollToPosition(position: number) {
  setTimeout(() => {
    window.scrollTo({ behavior: 'smooth', top: position });
  }, 100);
}
