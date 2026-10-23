#!/usr/bin/env node
// PostToolUse hook: run the brand check on the file Claude just edited.
// Exit 2 sends the violations back to Claude so it fixes them right away.
import { spawnSync } from "node:child_process";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let filePath;
  try {
    filePath = JSON.parse(input.replace(/^﻿/, "")).tool_input?.file_path;
  } catch {
    process.exit(0);
  }
  if (!filePath || ![".ts", ".tsx", ".css"].includes(extname(filePath))) process.exit(0);
  if (!/[\\/]src[\\/]/.test(filePath)) process.exit(0);

  const result = spawnSync(process.execPath, ["scripts/check-brand.mjs", filePath], {
    cwd: projectDir,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(2);
  }
  process.exit(0);
});
