import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type TagProps = HTMLAttributes<HTMLSpanElement>;

/** Small label. Uses DM Mono per brand rules for tags. */
export function Tag({ className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border border-border px-2.5 py-0.5 font-mono text-xs uppercase tracking-wide text-accent",
        className,
      )}
      {...props}
    />
  );
}
