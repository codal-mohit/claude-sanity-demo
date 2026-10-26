// PreToolUse hook for Bash. Exit code 2 blocks the command and shows the reason to Claude.
import { readFileSync } from 'node:fs';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const command = String(input?.tool_input?.command ?? '');

const RULES = [
  [/\brm\s+-[a-z]*r[a-z]*f|\brm\s+-[a-z]*f[a-z]*r/i, 'Recursive force delete is blocked. Delete specific files instead.'],
  [/\bgit\s+push\b.*(--force\b|-f\b|--force-with-lease)/, 'Force push is blocked.'],
  [/\bgit\s+reset\s+--hard\b/, 'git reset --hard discards work. Ask the user first.'],
  [/--no-verify\b/, 'Skipping git hooks is not allowed.'],
  [/\bsanity\s+dataset\s+(delete|import\b.*--replace)/, 'Destructive dataset commands need explicit user approval.'],
  [/--allow-production\b/, 'Writing seed data to production needs explicit user approval in this conversation.'],
  [/\bgit\s+add\b.*\.env/, 'Never stage .env files.'],
];

for (const [pattern, reason] of RULES) {
  if (pattern.test(command)) {
    console.error(`Blocked by .claude/hooks/guard-bash.mjs: ${reason}`);
    process.exit(2);
  }
}

// `next build` and `next dev` share .next; building while dev runs breaks the dev site.
if (/\b(npm run build|next build)\b/.test(command)) {
  const devRunning = await fetch('http://localhost:3000', { signal: AbortSignal.timeout(1500) })
    .then(() => true)
    .catch(() => false);
  if (devRunning) {
    console.error('Blocked: the dev server is running on :3000. Stop it before building (see CLAUDE.md).');
    // exitCode instead of exit(): exiting with an open socket crashes Node on Windows.
    process.exitCode = 2;
  }
}
