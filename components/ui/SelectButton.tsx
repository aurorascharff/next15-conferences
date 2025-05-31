import React from 'react';
import { cn } from '@/utils/cn';

export type Props = {
  children?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

export default function SelectButton({
  children,
  className,
  type = 'button',
  ...otherProps
}: Props & React.HTMLProps<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(
        'bg-primary hover:bg-primary-dark border-primary aria-expanded:hover:bg-card aria-expanded:focus-visible:outline-primary dark:aria-expanded:hover:bg-card-dark rounded-2xl border px-4 py-2 text-white shadow-md outline-offset-1 focus-visible:outline focus-visible:-outline-offset-4 focus-visible:outline-white aria-expanded:bg-white aria-expanded:text-black aria-expanded:focus-visible:outline-2 aria-expanded:focus-visible:-outline-offset-1 dark:aria-expanded:bg-black dark:aria-expanded:text-white',
        className,
      )}
      {...otherProps}
    >
      {children}
    </button>
  );
}
