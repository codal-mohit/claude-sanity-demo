import { Alert, Breadcrumb, Card, Tag } from "@/components/ui";

const steps = [
  {
    title: "Write the rules once",
    description: "Architecture, brand tokens and coding standards live in the repo, where Claude Code reads them before writing code.",
  },
  {
    title: "Ask for a feature",
    description: "A one-line request or slash command. Claude reads the closest existing component and follows the same pattern.",
  },
  {
    title: "Verify automatically",
    description: "A hook blocks off-brand colors after every edit, and one command runs lint, types, brand check and tests.",
  },
];

const features = [
  {
    tag: "Rules",
    title: "Project instructions",
    description: "CLAUDE.md and path-scoped rules keep generated code aligned with the architecture and brand tokens.",
    items: "coding-standards · brand-tokens · testing",
  },
  {
    tag: "Skills",
    title: "Reusable skills",
    description: "Packaged workflows Claude loads on demand for common jobs.",
    items: "new-component · brand-check · write-tests · repo-overview",
  },
  {
    tag: "Commands",
    title: "Slash commands",
    description: "One-line shortcuts for repetitive workflows, so every developer gets the same result.",
    items: "/component · /verify · /review · /commit",
  },
  {
    tag: "Agents",
    title: "Specialized agents",
    description: "Focused subagents for analysis, implementation and review, each with scoped tools.",
    items: "code-analyzer · implementer · code-reviewer",
  },
  {
    tag: "Hooks",
    title: "Automatic guards",
    description: "Block risky shell commands before they run, and reject off-brand colors or fonts after every edit.",
    items: "block-risky-commands · brand-check-on-edit · brand-check-on-stop",
  },
];

const checks = [
  { name: "Lint", command: "npm run lint" },
  { name: "Types", command: "npm run typecheck" },
  { name: "Brand", command: "npm run check:brand" },
  { name: "Tests", command: "npm run test" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <nav
          aria-label="Main"
          className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-8"
        >
          <span className="font-sans text-base font-semibold text-heading">Claude Code Demo</span>
          <ul className="flex gap-4 font-mono text-xs">
            <li>
              <a href="#how-it-works" className="text-accent hover:underline">
                How it works
              </a>
            </li>
            <li>
              <a href="#configured" className="text-accent hover:underline">
                Setup
              </a>
            </li>
            <li>
              <a href="#sample" className="text-accent hover:underline">
                Sample
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-20 px-4 py-12 sm:px-8 sm:py-16">
        <section aria-labelledby="hero-heading" className="flex flex-col gap-6">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Demo" }]} />
          <Tag className="self-start">AI-assisted development</Tag>
          <h1
            id="hero-heading"
            className="max-w-3xl font-sans text-4xl font-bold tracking-tight text-heading sm:text-5xl"
          >
            On-brand code from an AI teammate, checked automatically
          </h1>
          <p className="max-w-2xl font-sans text-lg leading-8 text-body">
            This project shows how Claude Code follows a team&apos;s architecture, design tokens and coding
            standards, so generated code needs less review and rework.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 font-sans text-sm font-medium text-accent-contrast hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              See how it works
            </a>
            <a
              href="#sample"
              className="inline-flex items-center justify-center rounded-md border border-accent px-4 py-2 font-sans text-sm font-medium text-accent hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              View sample result
            </a>
          </div>
        </section>

        <section id="how-it-works" aria-labelledby="steps-heading" className="flex scroll-mt-8 flex-col gap-6">
          <h2 id="steps-heading" className="font-sans text-2xl font-semibold text-heading">
            How it works
          </h2>
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

        <section id="configured" aria-labelledby="features-heading" className="flex scroll-mt-8 flex-col gap-6">
          <h2 id="features-heading" className="font-sans text-2xl font-semibold text-heading">
            What is configured
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ items, ...feature }) => (
              <Card
                key={feature.title}
                {...feature}
                footer={<p className="font-mono text-xs text-body">{items}</p>}
              />
            ))}
          </div>
        </section>

        <section id="sample" aria-labelledby="sample-heading" className="flex scroll-mt-8 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="sample-heading" className="font-sans text-2xl font-semibold text-heading">
              Sample task
            </h2>
            <p className="max-w-2xl font-sans text-base leading-7 text-body">
              Request: &ldquo;Add an Alert component with info and emphasis tones.&rdquo; Claude built it with the
              new-component skill, including tests. Both tones render live below, followed by the checks every change must pass.
            </p>
          </div>
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
      </main>

      <footer className="border-t border-border">
        <p className="mx-auto max-w-5xl px-4 py-6 font-mono text-xs text-body sm:px-8">
          Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · Vitest
        </p>
      </footer>
    </div>
  );
}
