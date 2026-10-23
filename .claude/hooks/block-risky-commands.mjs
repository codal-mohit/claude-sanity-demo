#!/usr/bin/env node
// PreToolUse hook: stop destructive shell commands before they run.
// Exit 2 blocks the call and tells Claude why.
const RISKY = [
  { pattern: /\brm\s+-[a-z]*r[a-z]*f|\brm\s+-[a-z]*f[a-z]*r/i, reason: "recursive force delete" },
  { pattern: /\brm\b(?=.*\s(?:-[a-z]*r|--recursive)\b)(?=.*\s(?:-[a-z]*f|--force)\b)/i, reason: "recursive force delete" },
  { pattern: /\bRemove-Item\b(?=.*-Recurse)(?=.*-Force)/i, reason: "recursive force delete" },
  { pattern: /\bgit\s+reset\s+--hard\b/, reason: "git reset --hard discards work" },
  { pattern: /\bgit\s+push\b.*(?:--force|-f\b|\s\+\S)/, reason: "force push rewrites shared history" },
  { pattern: /\bgit\s+clean\s+-[a-z]*f/, reason: "git clean deletes untracked files" },
  { pattern: /\bnpm\s+run\s+build\b/, reason: "build breaks a running dev server (see CLAUDE.md)" },
];

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let command;
  try {
    command = JSON.parse(input.replace(/^﻿/, "")).tool_input?.command;
  } catch {
    // Fail open: this is a guard, not a sandbox. Say so, so the gap is visible.
    process.stderr.write("block-risky-commands: could not parse hook input, command allowed");
    process.exit(0);
  }
  const hit = typeof command === "string" && RISKY.find((rule) => rule.pattern.test(command));
  if (hit) {
    process.stderr.write(`Blocked by project hook: ${hit.reason}. Ask the user to run it themselves if it is intended.`);
    process.exit(2);
  }
  process.exit(0);
});
