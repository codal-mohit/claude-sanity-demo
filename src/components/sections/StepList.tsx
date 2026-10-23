import { steps } from "@/data/docs";
import { SectionHeading } from "./SectionHeading";

export function StepList() {
  return (
    <section id="how-it-works" aria-labelledby="steps-heading" className="flex scroll-mt-8 flex-col gap-6">
      <SectionHeading id="steps-heading" title="How it works" />
      <ol className="grid gap-6 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-2 border-t-2 border-accent pt-4">
            <span className="font-mono text-xs text-accent">Step {index + 1}</span>
            <h3 className="font-sans text-lg font-semibold text-heading">{step.title}</h3>
            <p className="font-sans text-sm leading-6 text-body">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
