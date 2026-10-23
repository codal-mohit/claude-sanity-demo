export type ConfiguredFeature = {
  tag: string;
  title: string;
  description: string;
  items: string[];
};

export type Step = {
  title: string;
  description: string;
};

export const steps: Step[] = [
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
    description: "Hooks guard every edit, and one command runs lint, types, brand check and tests.",
  },
];

export type Check = {
  name: string;
  command: string;
};

export const features: ConfiguredFeature[] = [
  {
    tag: "Rules",
    title: "Project instructions",
    description: "CLAUDE.md and path-scoped rules keep generated code aligned with the architecture and brand tokens.",
    items: ["coding-standards", "brand-tokens", "testing"],
  },
  {
    tag: "Skills",
    title: "Reusable skills",
    description: "Packaged workflows Claude loads on demand for common jobs.",
    items: ["new-component", "brand-check", "write-tests", "repo-overview"],
  },
  {
    tag: "Commands",
    title: "Slash commands",
    description: "One-line shortcuts for repetitive workflows, so every developer gets the same result.",
    items: ["/component", "/verify", "/review", "/commit"],
  },
  {
    tag: "Agents",
    title: "Specialized agents",
    description: "Focused subagents for analysis, implementation and review, each with scoped tools.",
    items: ["code-analyzer", "implementer", "code-reviewer"],
  },
  {
    tag: "Hooks",
    title: "Automatic guards",
    description: "Block risky shell commands before they run, and reject off-brand colors or fonts after every edit.",
    items: ["block-risky-commands", "brand-check-on-edit", "brand-check-on-stop"],
  },
  {
    tag: "Integrations",
    title: "MCP and CI",
    description: "An Atlassian MCP server for Jira and Confluence, and a headless Claude review on every pull request.",
    items: [".mcp.json", "claude-review.yml"],
  },
];

export const checks: Check[] = [
  { name: "Lint", command: "npm run lint" },
  { name: "Types", command: "npm run typecheck" },
  { name: "Brand", command: "npm run check:brand" },
  { name: "Tests", command: "npm run test" },
];
