import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils';

const buttonVariants = cva(
  [
    'group relative inline-flex h-max shrink-0 cursor-pointer items-center justify-center whitespace-nowrap',
    'border border-transparent font-semibold',
    'transition-colors duration-200 ease-linear',
    'focus-visible:ring-primary-500/50 focus-visible:ring-offset-1 focus-visible:outline-none focus-visible:ring-2',
    'dark:focus-visible:ring-offset-secondary-900',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary not-disabled:hover:bg-primary-800 text-white',
        secondary: [
          'bg-secondary-100 not-disabled:hover:bg-secondary-200 dark:bg-secondary-700 dark:not-disabled:hover:bg-secondary-600',
          'text-secondary-700 not-disabled:hover:text-secondary-900 dark:text-secondary-200 dark:not-disabled:hover:text-secondary-50',
        ],
        outline: [
          'border-secondary-200 dark:border-secondary-700',
          'not-disabled:hover:bg-secondary-100 dark:not-disabled:hover:bg-secondary-700 bg-white dark:bg-transparent',
          'text-secondary-700 not-disabled:hover:text-secondary-900 dark:text-secondary-200 dark:not-disabled:hover:text-secondary-50',
        ],
        ghost: [
          'not-disabled:hover:bg-secondary-100 dark:not-disabled:hover:bg-secondary-700',
          'text-secondary-700 not-disabled:hover:text-secondary-900 dark:text-secondary-300 dark:not-disabled:hover:text-white',
        ],
        link: [
          'border-none p-0! underline-offset-4 not-disabled:hover:underline',
          'text-primary not-disabled:hover:text-primary-700 dark:text-primary-500 dark:not-disabled:hover:text-primary-300',
        ],
      },
      // Each size carries its default radius; the `radius` variant (declared after) overrides it
      size: {
        xs: 'gap-1 rounded-lg px-2.5 py-1.5 text-sm leading-4.5 [&>svg]:size-3',
        sm: 'gap-1 rounded-xl px-3 py-2 text-sm leading-4.5 [&>svg]:size-4',
        md: 'gap-1 rounded-xl px-3.5 py-2.5 text-sm leading-4.5 [&>svg]:size-5',
        default:
          'gap-1 rounded-2xl px-3.5 py-2.5 text-sm leading-4.5 lg:gap-1.5 lg:px-4 lg:text-base lg:leading-5.5 [&>svg]:size-5',
        lg: 'gap-1.5 rounded-2xl px-4 py-2.5 text-base leading-5.5 lg:px-4.5 lg:py-3 lg:text-lg lg:leading-6 [&>svg]:size-5 lg:[&>svg]:size-6',
        xl: 'gap-1.5 rounded-2xl px-4.5 py-3 text-lg leading-6 lg:px-5 lg:py-3.5 [&>svg]:size-6',
      },
      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        full: 'rounded-full',
      },
      isIconOnly: {
        true: 'aspect-square',
        false: '',
      },
    },
    compoundVariants: [
      // Square padding for icon-only buttons (`!` beats the responsive lg:px-* of the size)
      { isIconOnly: true, size: ['xs', 'sm'], className: 'p-2.25!' },
      { isIconOnly: true, size: ['md', 'default'], className: 'p-2.75!' },
      { isIconOnly: true, size: 'lg', className: 'p-3!' },
      { isIconOnly: true, size: 'xl', className: 'p-3.5!' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      isIconOnly: false,
    },
  },
);

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<'button'>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, radius, isIconOnly, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, radius, isIconOnly }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
