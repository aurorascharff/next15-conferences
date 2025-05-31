import './globals.css';

import { Geist } from 'next/font/google';
import SubmitButton from '@/components/ui/SubmitButton';
import { logIn } from '@/data/actions/auth';
import { isAuthenticated } from '@/data/services/auth';
import { cn } from '@/utils/cn';
import type { Metadata } from 'next';

const GeistSans = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  description: 'Next.js 15 Contact List using Server Functions, React 19, Ariakit and Prisma',
  title: 'Next.js 15 Contact List',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await isAuthenticated();

  return (
    <html lang="en">
      <body className={cn(GeistSans.className, 'mb-12 flex grow flex-col p-4 sm:p-10 xl:px-40 2xl:px-96')}>
        <main>
          {isAuth ? (
            children
          ) : (
            <div className="flex flex-col items-center justify-center pt-20">
              <form action={logIn.bind(null, 'jane.smith@personal.com')}>
                <SubmitButton>Log in as Jane Smith</SubmitButton>
              </form>
            </div>
          )}
        </main>
      </body>
    </html>
  );
}
