'use client';

import { Button } from './Button';
import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { PlusIcon } from '@heroicons/react/24/outline';

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  breadcrumb?: string[];
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export function PageHeader({
  title,
  breadcrumb,
  actionLabel,
  onAction,
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)} {...props}>
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="mb-4 text-sm text-gray-500">
          {breadcrumb.map((item, index) => (
            <span key={index}>
              {index > 0 && <span className="mx-2">/</span>}
              <span>{item}</span>
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
          {children}
        </div>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="flex items-center gap-2">
            {actionLabel.toLowerCase().includes('new') || actionLabel.toLowerCase().includes('create') ? (
              <PlusIcon className="h-4 w-4" />
            ) : null}
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
