#!/usr/bin/env node
/**
 * Brand-token check. Fails when component code uses raw colors or
 * off-brand fonts instead of the tokens defined in src/app/globals.css.
 *
 * Usage: node scripts/check-brand.mjs [paths...]   (defaults to src)
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const TOKEN_FILE = join("src", "app", "globals.css");
const EXTENSIONS = new Set([".ts", ".tsx", ".css"]);

const RULES = [
  { name: "raw hex color", pattern: /#[0-9a-fA-F]{3,8}\b/g },
  { name: "raw rgb/hsl color", pattern: /\b(?:rgb|rgba|hsl|hsla)\(/g },
  { name: "arbitrary Tailwind color", pattern: /\b(?:bg|text|border|outline|ring|fill|stroke)-\[#/g },
  {
    name: "default Tailwind palette color",
    pattern:
      /\b(?:bg|text|border|outline|ring|fill|stroke)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-\d{2,3})?\b/g,
  },
  { name: "off-brand font", pattern: /\b(?:Geist|Inter|Roboto|Arial|Helvetica)\b/g },
  { name: "off-brand font utility", pattern: /\bfont-serif\b/g },
];

function walk(path, files = []) {
  if (statSync(path).isDirectory()) {
    for (const entry of readdirSync(path)) walk(join(path, entry), files);
  } else if (EXTENSIONS.has(extname(path))) {
    files.push(path);
  }
  return files;
}

const roots = process.argv.slice(2);
const files = (roots.length ? roots : ["src"]).flatMap((root) => walk(root));
const violations = [];

for (const file of files) {
  if (relative(".", file) === TOKEN_FILE) continue;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const rule of RULES) {
      for (const match of line.matchAll(rule.pattern)) {
        violations.push(`${relative(".", file)}:${index + 1}  ${rule.name}: ${match[0]}`);
      }
    }
  });
}

if (violations.length) {
  console.error(`Brand check failed (${violations.length}):\n${violations.join("\n")}`);
  console.error(`\nUse the tokens from ${TOKEN_FILE} (bg-surface, text-heading, text-body, text-accent, border-border).`);
  process.exit(1);
}
console.log(`Brand check passed (${files.length} files).`);
