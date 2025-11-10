'use client';

import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState, useTransition } from 'react';
import type { TalksResult } from '@/types/talk';
import TalksGrid, { TalksGridSkeleton } from './TalksGrid';
import Button from './ui/Button';
import SearchField from './ui/SearchField';

type Props = {
  talksPromise: Promise<TalksResult>;
};

export default function TalksExplorer({ talksPromise }: Props) {
  const [search, setSearch] = useState('');
  const searchParams = useSearchParams();

  return (
    <>
      <SearchField
        value={search}
        name="search"
        placeholder="Search by title, description, speaker, conference, or tag..."
        onChange={e => {
          setSearch(e.currentTarget.value);
        }}
      />
      <ActiveFilters />
      <Suspense fallback={<TalksGridSkeleton />}>
        <TalksGrid key={searchParams.toString()} talksPromise={talksPromise} search={search} />
      </Suspense>
    </>
  );
}

function ActiveFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const filterGroups = new Map<string, string[]>();
  if (searchParams) {
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        if (!filterGroups.has(key)) {
          filterGroups.set(key, []);
        }
        filterGroups.get(key)!.push(value);
      }
    });
  }

  return (
    filterGroups.size > 0 && (
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {Array.from(filterGroups.entries()).map(([key, values]) => {
            return (
              <span
                key={key}
                className="bg-primary/20 text-primary inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium"
              >
                <span className="capitalize">{key}: </span>
                <span>{values.join(', ')}</span>
              </span>
            );
          })}
        </div>
        <Button
          loading={isPending}
          onClick={() => {
            startTransition(() => {
              router.push('/?');
            });
          }}
          variant="secondary"
          type="button"
        >
          <div className="flex items-center gap-2">
            <X width={16} height={16} aria-hidden="true" />
            Clear
          </div>
        </Button>
      </div>
    )
  );
}
