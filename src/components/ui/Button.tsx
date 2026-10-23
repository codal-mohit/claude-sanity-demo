import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-contrast hover:opacity-90",
  secondary: "border border-accent text-accent hover:bg-accent/10",
};

/** Shared by `Button` and `ButtonLink` so both stay visually identical. */
export function buttonClasses(variant: ButtonVariant = "primary") {
  return cn(
    "inline-flex items-center justify-center rounded-md px-4 py-2 font-sans text-sm font-medium transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
  );
}

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonClasses(variant), className)} {...props} />;
}
