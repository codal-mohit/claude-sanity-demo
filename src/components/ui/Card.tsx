import type { ReactNode } from "react";
import { Tag } from "./Tag";

export type CardProps = {
  title: string;
  description: string;
  tag?: string;
  footer?: ReactNode;
};

export function Card({ title, description, tag, footer }: CardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6">
      {tag && (
        <div>
          <Tag>{tag}</Tag>
        </div>
      )}
      <h3 className="font-sans text-lg font-semibold text-heading">{title}</h3>
      <p className="font-sans text-sm leading-6 text-body">{description}</p>
      {footer && <div className="mt-auto pt-2">{footer}</div>}
    </article>
  );
}
