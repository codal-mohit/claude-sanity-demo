import { formatPrice } from "@/lib/format";

export type PriceProps = {
  amount: number;
  /** Original price. Shown struck through when higher than `amount`. */
  compareAt?: number;
};

export function Price({ amount, compareAt }: PriceProps) {
  const onSale = compareAt !== undefined && compareAt > amount;
  return (
    <p className="flex items-baseline gap-2 font-sans text-sm">
      <span className={onSale ? "font-semibold text-accent" : "font-semibold text-heading"}>
        {onSale && <span className="sr-only">Sale price </span>}
        {formatPrice(amount)}
      </span>
      {onSale && (
        <s className="text-body">
          <span className="sr-only">Original price </span>
          {formatPrice(compareAt)}
        </s>
      )}
    </p>
  );
}
