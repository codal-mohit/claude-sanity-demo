// PostToolUse hook for Edit and Write. After schema or query changes, reminds Claude
// to regenerate Sanity types so code never uses stale result types.
import { readFileSync } from 'node:fs';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const file = String(input?.tool_input?.file_path ?? '').replaceAll('\\', '/');

const touchesSanityTypes = /src\/sanity\/(schema\/|queries\.ts$)/.test(file);
if (touchesSanityTypes) {
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: `${file} defines Sanity schema or GROQ. Run \`npm run typegen\` before using the result types, then \`npm run verify\`.`,
      },
    }),
  );
}
process.exit(0);
