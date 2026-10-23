export type SectionHeadingProps = {
  id: string;
  title: string;
  description?: string;
};

/** h2 plus optional intro. `id` is what the parent section's `aria-labelledby` points at. */
export function SectionHeading({ id, title, description }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 id={id} className="font-sans text-2xl font-semibold text-heading">
        {title}
      </h2>
      {description && <p className="max-w-2xl font-sans text-base leading-7 text-body">{description}</p>}
    </div>
  );
}
