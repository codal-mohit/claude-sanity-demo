import { cn } from "@/lib/cn";

export type ImagePlaceholderProps = {
  label: string;
  className?: string;
};

/** Stand-in for product imagery until real assets exist. Announced as an image. */
export function ImagePlaceholder({ label, className }: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex aspect-square items-center justify-center rounded-lg bg-accent/10 font-mono text-xs uppercase tracking-wide text-accent",
        className,
      )}
    >
      <span aria-hidden="true">{label}</span>
    </div>
  );
}
