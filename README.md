# Claude Code Demo

Demo project for AI-assisted development with Claude Code. It shows project rules, skills, slash commands, specialized agents and hooks working on a branded Next.js app.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run verify   # lint, typecheck, brand check, tests
```

## Docs

- [Setup guide](docs/setup-guide.md): what is configured and how to use it
- [Repository overview](docs/repository-overview.md): architecture and conventions
- [Validation results](docs/validation-results.md): sample task and test results
- [Website flow](docs/website-flow.md): home page flow, module by module

## Claude Code at a glance

| Type | Items |
|---|---|
| Rules | coding-standards, brand-tokens, testing |
| Skills | new-component, brand-check, write-tests, repo-overview |
| Commands | `/verify`, `/review`, `/component`, `/commit` |
| Agents | code-analyzer, implementer, code-reviewer |
| Hook | brand check after every edit in `src/` |
