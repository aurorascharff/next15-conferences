import 'server-only';

import { prisma } from '@/db';
import type { FilterOptions, FilterType } from '@/types/filters';
import type { TalksResult } from '@/types/talk';
import type { Prisma } from '@prisma/client';

export async function getTalks(
  filters: FilterType = {},
  page: number = 1,
  pageSize: number = 30,
): Promise<TalksResult> {
  const where: Prisma.TalkWhereInput = {};

  const validSpeakers = processFilterValues(filters.speaker);
  if (validSpeakers.length > 0) {
    where.speaker =
      validSpeakers.length === 1
        ? { contains: validSpeakers[0], mode: 'insensitive' }
        : { in: validSpeakers, mode: 'insensitive' };
  }

  const validYears = processYearValues(filters.year);
  if (validYears.length > 0) {
    where.year = validYears.length === 1 ? validYears[0] : { in: validYears };
  }

  const validTags = processFilterValues(filters.tag);
  if (validTags.length > 0) {
    where.tag =
      validTags.length === 1 ? { equals: validTags[0], mode: 'insensitive' } : { in: validTags, mode: 'insensitive' };
  }

  const validConferences = processFilterValues(filters.conference);
  if (validConferences.length > 0) {
    where.conference =
      validConferences.length === 1
        ? { contains: validConferences[0], mode: 'insensitive' }
        : { in: validConferences, mode: 'insensitive' };
  }

  const [talks, total] = await Promise.all([
    prisma.talk.findMany({
      orderBy: { title: 'asc' },
      select: {
        conference: true,
        createdAt: true,
        description: true,
        duration: true,
        id: true,
        longDescription: true,
        slides: true,
        speaker: true,
        tag: true,
        title: true,
        videoUrl: true,
        year: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
    }),
    prisma.talk.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  return { talks, totalPages };
}

export async function getTalkFilterOptions(): Promise<FilterOptions> {
  const [conferences, speakers, tags, years] = await Promise.all([
    prisma.talk.findMany({
      distinct: ['conference'],
      orderBy: { conference: 'asc' },
      select: { conference: true },
    }),
    prisma.talk.findMany({
      distinct: ['speaker'],
      orderBy: { speaker: 'asc' },
      select: { speaker: true },
    }),
    prisma.talk.findMany({
      distinct: ['tag'],
      orderBy: { tag: 'asc' },
      select: { tag: true },
      where: { tag: { not: null } },
    }),
    prisma.talk.findMany({
      distinct: ['year'],
      orderBy: { year: 'desc' },
      select: { year: true },
    }),
  ]);

  return {
    conferences: conferences.map(({ conference }) => {
      return { label: conference, value: conference };
    }),
    speakers: speakers.map(({ speaker }) => {
      return { label: speaker, value: speaker };
    }),
    tags: tags.map(({ tag }) => {
      return { label: tag!, value: tag! };
    }),
    years: years.map(({ year }) => {
      return { label: year.toString(), value: year.toString() };
    }),
  };
}

function processFilterValues(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const values = Array.isArray(value) ? value : [value];
  return values
    .filter(Boolean)
    .map(v => {
      return v.trim();
    })
    .filter(Boolean);
}

function processYearValues(value: string | string[] | undefined): number[] {
  if (!value) return [];
  const values = Array.isArray(value) ? value : [value];
  return values
    .filter(Boolean)
    .map(y => {
      return typeof y === 'string' ? parseInt(y.trim()) : y;
    })
    .filter(y => {
      return !isNaN(y);
    });
}
