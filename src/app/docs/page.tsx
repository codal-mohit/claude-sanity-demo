import type { Metadata } from "next";
import { FeatureGrid, SampleTask, StepList } from "@/components/sections";
import { Breadcrumb } from "@/components/ui";

export const metadata: Metadata = {
  title: "Docs | Demo Store",
  description: "Rules, skills, commands, agents, hooks and integrations configured in this project",
};

export default function DocsPage() {
  return (
    <>
      <header className="flex flex-col gap-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Docs" }]} />
        <h1 className="font-sans text-4xl font-bold tracking-tight text-heading">How this project is set up</h1>
        <p className="max-w-2xl font-sans text-lg leading-8 text-body">
          The demo store on the home page was built with Claude Code. This page shows every capability configured in
          the repo, and a sample task that shows them working together.
        </p>
      </header>
      <StepList />
      <FeatureGrid />
      <SampleTask />
    </>
  );
}
