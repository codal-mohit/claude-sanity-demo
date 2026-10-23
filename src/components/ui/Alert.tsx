import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type AlertTone = "info" | "emphasis";

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  tone?: AlertTone;
};

const toneClasses: Record<AlertTone, string> = {
  info: "border-border bg-surface",
  emphasis: "border-accent bg-accent/10",
};

/** Inline message box. `emphasis` draws attention with the accent color. */
export function Alert({ title, tone = "info", className, children, ...props }: AlertProps) {
  return (
    <div role="status" className={cn("rounded-lg border p-4", toneClasses[tone], className)} {...props}>
      <p className="font-sans text-sm font-semibold text-heading">{title}</p>
      {children && <div className="mt-1 font-sans text-sm leading-6 text-body">{children}</div>}
    </div>
  );
}
