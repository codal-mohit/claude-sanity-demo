import { Alert } from "@/components/ui";
import { checks } from "@/data/docs";
import { SectionHeading } from "./SectionHeading";

export function SampleTask() {
  return (
    <section id="sample" aria-labelledby="sample-heading" className="flex scroll-mt-8 flex-col gap-6">
      <SectionHeading
        id="sample-heading"
        title="Sample task"
        description="Request: “Add an Alert component with info and emphasis tones.” Claude built it with the new-component skill, including tests. Both tones render live below, followed by the checks every change must pass."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Alert title="Info tone">Neutral message on the page background.</Alert>
        <Alert title="Emphasis tone" tone="emphasis">
          Draws attention with the accent color.
        </Alert>
      </div>
      <ul className="grid gap-3 sm:grid-cols-4">
        {checks.map((check) => (
          <li key={check.name} className="flex flex-col gap-1 rounded-lg border border-border p-4">
            <span className="font-sans text-sm font-semibold text-heading">{check.name}</span>
            <code className="font-mono text-xs text-body">{check.command}</code>
          </li>
        ))}
      </ul>
    </section>
  );
}
