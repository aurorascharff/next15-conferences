import { cookies } from 'next/headers';
import Image from 'next/image';
import React, { ViewTransition } from 'react';
import { resetEasterEgg, hideIntro } from '@/data/actions/cookie';
import Button from './Button';
import type { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center">
      <span className="text-primary mr-2">▶</span>
      <code className="bg-primary/10 rounded px-2 py-1 text-sm">{children}</code>
    </li>
  );
}

export default async function Wrapper({ children }: Props) {
  const shouldShowEasterEgg = (await cookies()).get('easterEgg')?.value === 'true';
  const showIntro = (await cookies()).get('hideIntro')?.value !== 'true';

  return (
    <>
      {showIntro ? (
        <WrapperCard>
          <span className="text-primary dark:text-primary mb-6 animate-bounce text-6xl select-none">🚀</span>
          <div className="text-primary-dark dark:text-primary mb-6 text-center text-2xl font-extrabold md:text-3xl lg:text-5xl">
            Modern React Patterns
            <br />
            <span className="from-primary to-primary-dark dark:from-primary-dark dark:to-primary bg-gradient-to-r bg-clip-text text-xl text-transparent md:text-2xl lg:text-4xl">
              Concurrent Rendering, Actions &amp; What&apos;s Next
            </span>
          </div>
          <div className="mb-8 text-center">
            <h3 className="text-accent-dark dark:text-accent-light mb-4 text-xl font-bold">
              🧭 What We&apos;ll Explore Today
            </h3>
            <ul className="text-accent-dark dark:text-accent-light inline-flex flex-wrap justify-center gap-2 text-lg sm:gap-4">
              <FeatureItem>useTransition</FeatureItem>
              <FeatureItem>useOptimistic</FeatureItem>
              <FeatureItem>useDeferredValue</FeatureItem>
              <FeatureItem>
                {'<'}ViewTransition{'>'}
              </FeatureItem>
            </ul>
          </div>
          <div className="mb-6 text-center">
            <div className="text-accent-dark dark:text-accent-light text-lg font-medium">@aurorascharff</div>
          </div>
          <form action={hideIntro} className="mt-4">
            <Button type="submit" className="px-8 py-3 text-lg">
              Let&apos;s Begin! 🎯
            </Button>
          </form>
        </WrapperCard>
      ) : shouldShowEasterEgg ? (
        <WrapperCard>
          <span className="animate-spin-slow text-accent dark:text-accent-light absolute -top-8 left-1/2 -translate-x-1/2 text-5xl select-none">
            🎊
          </span>
          <span className="text-primary dark:text-primary mb-4 animate-bounce text-6xl select-none">🕺</span>
          <div className="text-primary-dark dark:text-primary mb-2 text-center text-2xl font-extrabold md:text-4xl">
            Thank you
            <br />
            <span className="from-primary to-primary-dark dark:from-primary-dark dark:to-primary bg-gradient-to-r bg-clip-text text-transparent">
              Framsia Meetup 2025
            </span>
          </div>
          <div className="my-4 flex flex-col items-center">
            <div className="border-primary-dark bg-divider dark:border-primary dark:bg-divider-dark mb-2 flex h-36 w-36 items-center justify-center rounded-xl border-4 shadow-lg">
              <Image priority src={'/qr-code.png'} alt="QR Code" width={144} height={144} className="rounded-lg" />
            </div>
            <div className="text-accent-dark dark:text-accent-light text-lg font-medium">@aurorascharff</div>
            <a
              href="https://github.com/aurorascharff/next15-conferences"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary mt-1 text-lg underline transition-colors"
            >
              github.com/aurorascharff/next15-conferences
            </a>
          </div>
          <div className="text-accent-dark dark:text-accent-light mt-2 text-lg font-medium">
            <span className="text-accent dark:text-accent-light">See you next time! 👋</span>
          </div>
          <form action={resetEasterEgg} className="mt-6">
            <Button>Return</Button>
          </form>
        </WrapperCard>
      ) : (
        children
      )}
    </>
  );
}

function WrapperCard({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition exit="slide-down" enter="slide-up">
      <div className="bg-card/95 dark:bg-card/10 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
        <div className="border-primary relative mx-4 flex max-w-4xl flex-col items-center rounded-3xl border-4 bg-white px-6 py-8 shadow-2xl md:px-10 md:py-12 dark:bg-black">
          {children}
        </div>
      </div>
    </ViewTransition>
  );
}
