import * as React from 'react';

import { cn } from '@/utils';

const Card = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      className={cn(
        'border-secondary-200 dark:border-secondary-700 dark:bg-secondary-800 rounded-2xl border bg-white p-6',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<'h2'>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      data-slot="card-title"
      className={cn('text-secondary-900 text-lg font-semibold dark:text-white', className)}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn('text-secondary-700 mt-1 text-sm dark:text-secondary-200', className)}
      {...props}
    />
  ),
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="card-content" className={cn('mt-4', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

export { Card, CardTitle, CardDescription, CardContent };
