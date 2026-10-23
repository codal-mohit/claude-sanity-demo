'use client';

import { cn } from '@/utils';
import * as React from 'react';
import { ChevronIcon, ChevronRightIcon, EllipsisIcon } from '@/icons';



export type BreadcrumbItem = {
  href?: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  dropdownItems?: {
    href: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
  }[];
};

export interface BreadcrumbsProps extends React.ComponentPropsWithoutRef<'nav'> {
  items: BreadcrumbItem[];
  dividerType?: 'slash' | 'chevron' | 'dot';
  separator?: React.ReactNode;
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
}

export const Breadcrumbs = ({
  items,
  dividerType = 'slash',
  separator,
  maxItems,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  className,
  ...props
}: BreadcrumbsProps) => {
  const [activeDropdownIndex, setActiveDropdownIndex] = React.useState<number | null>(null);
  const [activeCollapsedDropdown, setActiveCollapsedDropdown] = React.useState(false);
  const navRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdownIndex(null);
        setActiveCollapsedDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalItems = items.length;
  const shouldCollapse = maxItems !== undefined && totalItems > maxItems;

  const startItems = shouldCollapse ? items.slice(0, itemsBeforeCollapse) : items;
  const endItems = shouldCollapse ? items.slice(totalItems - itemsAfterCollapse) : [];
  const collapsedItems = shouldCollapse
    ? items.slice(itemsBeforeCollapse, totalItems - itemsAfterCollapse)
    : [];

  const renderList: (
    | { type: 'item'; item: BreadcrumbItem; originalIndex: number }
    | { type: 'collapsed'; originalIndex: number }
  )[] = [];

  startItems.forEach((item, idx) => {
    renderList.push({ type: 'item', item, originalIndex: idx });
  });

  if (shouldCollapse && collapsedItems.length > 0) {
    renderList.push({ type: 'collapsed', originalIndex: itemsBeforeCollapse });
  }

  endItems.forEach((item, idx) => {
    renderList.push({
      type: 'item',
      item,
      originalIndex: totalItems - itemsAfterCollapse + idx,
    });
  });

  return (
    <nav
      ref={navRef}
      aria-label="Breadcrumb"
      className={cn('flex items-center text-sm font-medium', className)}
      {...props}
    >
      <ol className="text-secondary-500 dark:text-secondary-400 flex flex-wrap items-center gap-2">
        {renderList.map((node, index) => {
          const isLast = index === renderList.length - 1;

          return (
            <li key={index} className="relative inline-flex items-center gap-2">
              {index > 0 && (
                <div
                  role="presentation"
                  className="text-secondary-300 dark:text-secondary-650 flex items-center justify-center font-normal select-none"
                >
                  {separator ? separator : <Divider type={dividerType} />}
                </div>
              )}

              {node.type === 'collapsed' ? (
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => setActiveCollapsedDropdown(!activeCollapsedDropdown)}
                    className="hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-500 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 flex size-6 cursor-pointer items-center justify-center rounded-md transition-colors"
                    aria-label="Show collapsed breadcrumbs"
                  >
                    <EllipsisIcon className="size-4" />
                  </button>

                  {/* Collapsed dropdown menu */}
                  {activeCollapsedDropdown && (
                    <div className="border-secondary-200 dark:border-secondary-700 dark:bg-secondary-800 animate-in fade-in-0 zoom-in-95 absolute top-full left-0 z-50 mt-1.5 min-w-40 rounded-lg border bg-white p-1.5 shadow-lg duration-100">
                      {collapsedItems.map((item, cIdx) => (
                        <a
                          key={cIdx}
                          href={item.href || '#'}
                          className="text-secondary-700 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-700/60 flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors"
                        >
                          {item.icon && (
                            <span className="flex size-4 shrink-0 items-center justify-center">
                              {item.icon}
                            </span>
                          )}
                          <span>{item.label}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <BreadcrumbLink
                  item={node.item}
                  isLast={isLast}
                  index={node.originalIndex}
                  activeDropdownIndex={activeDropdownIndex}
                  setActiveDropdownIndex={setActiveDropdownIndex}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const BreadcrumbLink = ({
  item,
  isLast,
  index,
  activeDropdownIndex,
  setActiveDropdownIndex,
}: {
  item: BreadcrumbItem;
  isLast: boolean;
  index: number;
  activeDropdownIndex: number | null;
  setActiveDropdownIndex: (idx: number | null) => void;
}) => {
  const isDropdownOpen = activeDropdownIndex === index;
  const hasDropdown = item.dropdownItems && item.dropdownItems.length > 0;

  if (hasDropdown) {
    return (
      <div className="relative inline-block text-left">
        <button
          onClick={() => setActiveDropdownIndex(isDropdownOpen ? null : index)}
          className={cn(
            'flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors duration-200 select-none',
            isLast
              ? 'text-secondary-900 dark:text-secondary-100 font-semibold'
              : 'text-secondary-500 dark:text-secondary-450 hover:text-primary-600 dark:hover:text-primary-400',
          )}
        >
          {item.icon && (
            <span className="flex size-4 shrink-0 items-center justify-center">{item.icon}</span>
          )}
          <span>{item.label}</span>
          <ChevronIcon className="ml-0.5 size-3 shrink-0 opacity-70" />
        </button>

        {isDropdownOpen && (
          <div className="border-secondary-200 dark:border-secondary-700 dark:bg-secondary-800 animate-in fade-in-0 zoom-in-95 absolute top-full left-0 z-50 mt-1.5 min-w-40 rounded-lg border bg-white p-1.5 shadow-lg duration-100">
            {item.dropdownItems!.map((dropdownItem, dIdx) => (
              <a
                key={dIdx}
                href={dropdownItem.href}
                className="text-secondary-700 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-700/60 flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors"
              >
                {dropdownItem.icon && (
                  <span className="flex size-4 shrink-0 items-center justify-center">
                    {dropdownItem.icon}
                  </span>
                )}
                <span>{dropdownItem.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (isLast || !item.href) {
    return (
      <span
        aria-current="page"
        className="text-secondary-900 dark:text-secondary-100 flex items-center gap-1.5 font-semibold"
      >
        {item.icon && (
          <span className="flex size-4 shrink-0 items-center justify-center">{item.icon}</span>
        )}
        <span>{item.label}</span>
      </span>
    );
  }

  return (
    <a
      href={item.href}
      className="text-secondary-500 dark:text-secondary-450 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1.5 transition-colors duration-200"
    >
      {item.icon && (
        <span className="flex size-4 shrink-0 items-center justify-center">{item.icon}</span>
      )}
      <span>{item.label}</span>
    </a>
  );
}

const Divider = ({ type }: { type: BreadcrumbsProps['dividerType'] }) => {
  switch (type) {
    case 'chevron':
      return <ChevronRightIcon className="text-secondary-300 dark:text-secondary-600 size-4 shrink-0" />;
    case 'dot':
      return <span className="bg-secondary-300 dark:bg-secondary-600 size-1 rounded-full" />;
    case 'slash':
    default:
      return <span className="text-secondary-300 dark:text-secondary-600 font-light">/</span>;
  }
}
