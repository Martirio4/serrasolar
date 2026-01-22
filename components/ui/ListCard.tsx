'use client';

import { Card, CardContent } from './Card';
import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ListCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClick?: () => void;
}

export function ListCard({ className, children, onClick, ...props }: ListCardProps) {
  return (
    <Card
      className={cn(
        'mb-4',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
      {...props}
    >
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}
