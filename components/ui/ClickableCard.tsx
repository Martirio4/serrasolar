'use client';

import Link from 'next/link';
import { ListCard } from './ListCard';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ClickableCardProps {
  href: string;
  children: ReactNode;
}

export function ClickableCard({ href, children }: ClickableCardProps) {
  return (
    <Link href={href} className={cn('block hover:opacity-90 transition-opacity')}>
      <ListCard className="cursor-pointer hover:shadow-md transition-shadow">{children}</ListCard>
    </Link>
  );
}

