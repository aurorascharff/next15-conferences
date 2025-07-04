import Link from 'next/link';
import React, { use, unstable_ViewTransition as ViewTransition } from 'react';
import Badge from './ui/Badge';
import Card from './ui/Card';
import Skeleton from './ui/Skeleton';
import type { Talk } from '@prisma/client';

type Props = {
  talksPromise: Promise<Talk[]>;
  search: string;
};

export default function TalksList({ talksPromise, search }: Props) {
  const talks = use(talksPromise);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredTalks = talks.filter(talk => {
    return (
      talk.title.toLowerCase().includes(normalizedSearch) ||
      talk.speaker.toLowerCase().includes(normalizedSearch) ||
      talk.conference.toLowerCase().includes(normalizedSearch) ||
      (talk.tag && talk.tag.toLowerCase().includes(normalizedSearch))
    );
  });

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTalks.map(talk => {
          return (
            <ViewTransition key={talk.id}>
              <TalkItem talk={talk} />
            </ViewTransition>
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
    </>
  );
}

function TalkItem({ talk }: { talk: Talk }) {
  return (
    <Card>
      <div>
        <h3 className="mb-4 text-lg leading-tight font-semibold text-gray-900 dark:text-white">{talk.title}</h3>
        <div className="mb-4 space-y-2 text-sm">
          <TalkDetail label="Speaker">{talk.speaker}</TalkDetail>
          <TalkDetail label="Conference">{talk.conference}</TalkDetail>
          <TalkDetail label="Year">{talk.year}</TalkDetail>
        </div>
        <div className="flex flex-wrap gap-2">
          {talk.tag && <Badge variant="primary">🏷️ {talk.tag}</Badge>}
          {talk.duration && <Badge variant="secondary">⏱️ {talk.duration}m</Badge>}
          {talk.videoUrl && (
            <Link href={talk.videoUrl} target="_blank" rel="noopener noreferrer">
              <Badge variant="accent">🎥 Video</Badge>
            </Link>
          )}
          {talk.slides && (
            <Link href={talk.slides} target="_blank" rel="noopener noreferrer">
              <Badge variant="accent">📊 Slides</Badge>
            </Link>
          )}
        </div>
        {talk.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {talk.description}
          </p>
        )}
      </div>
    </Card>
  );
}
function TalkDetail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className="text-gray-700 dark:text-gray-300">
      <span className="text-gray-900 dark:text-gray-100">{label}:</span> {children}
    </p>
  );
}

export function TalksListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
}
