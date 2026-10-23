import { Card } from "@/components/ui";
import { features } from "@/data/docs";
import { SectionHeading } from "./SectionHeading";

export function FeatureGrid() {
  return (
    <section id="configured" aria-labelledby="features-heading" className="flex scroll-mt-8 flex-col gap-6">
      <SectionHeading id="features-heading" title="What is configured" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ items, ...feature }) => (
          <Card
            key={feature.title}
            {...feature}
            footer={
              <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-body">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            }
          />
        ))}
      </div>
    </section>
  );
}
