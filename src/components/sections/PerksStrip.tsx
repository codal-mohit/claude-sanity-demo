import { perks } from "@/data/store";

export function PerksStrip() {
  return (
    <section id="perks" aria-labelledby="perks-heading" className="scroll-mt-8">
      <h2 id="perks-heading" className="sr-only">
        Why shop with us
      </h2>
      <ul className="grid grid-cols-2 gap-4 rounded-lg border border-border p-6 md:grid-cols-4">
        {perks.map((perk) => (
          <li key={perk.title} className="flex flex-col gap-1">
            <span className="font-sans text-sm font-semibold text-heading">{perk.title}</span>
            <span className="font-sans text-sm text-body">{perk.description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
