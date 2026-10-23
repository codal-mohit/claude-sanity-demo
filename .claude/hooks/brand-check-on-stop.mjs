#!/usr/bin/env node
// Stop hook: before Claude ends its turn, run the brand check on all of src.
// Exit 2 keeps Claude working until the violations are fixed.
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  try {
    // Already continuing because of this hook: let Claude stop to avoid a loop.
    if (JSON.parse(input.replace(/^﻿/, "")).stop_hook_active) process.exit(0);
  } catch {
    // No payload: run the check anyway.
  }

  const result = spawnSync(process.execPath, ["scripts/check-brand.mjs"], { cwd: projectDir, encoding: "utf8" });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(2);
  }
  process.exit(0);
});
