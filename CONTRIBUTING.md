# Contributing to LangRoute

Thanks for your interest in improving LangRoute! We welcome bug fixes, documentation updates, new features, and thoughtful refactors. By participating, you agree to follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting set up
- Follow the [Getting Started guide](./docs/getting-started.md) to install dependencies, prepare environment files, and run the app locally.
- Copy environment defaults from [env/.env.example](./env/.env.example) and regenerate the root `.env` with `npm run env`.
- Common scripts:
  - `npm run dev` – start the development server.
  - `npm run db boot` – start the PostgreSQL container.
  - `npm run check` – type-check and lint the project.

## How to contribute
### Report bugs
Open an issue and include steps to reproduce, expected vs. actual behavior, and any relevant logs (omit secrets).

### Request features
Create an issue that explains the problem, proposed solution, and any API or UX notes.

### Improve documentation
Small fixes can go straight to a PR. For larger restructures, start with an issue to discuss scope.

## Picking up work
- Review existing issues before starting. Labels such as `good first issue` or `help wanted` may indicate where to begin.
- If no issue exists, open one to align on scope before investing significant effort.

## Branching and workflow
- Fork the repository (or create a branch if you have write access) and base your work on the default branch (`master`).
- Name branches with a prefix:
  - `feature/your-feature`
  - `fix/your-bug`
  - `refactor/your-change`
  - `chore/your-update`
- Keep branches focused and rebase on the latest default branch before opening a PR.

## Commit messages
Use [Conventional Commit](https://www.conventionalcommits.org/) style:
```
feat(auth): add OAuth provider
fix(db): correct migration path
docs(readme): clarify setup instructions
```
Write small, self-contained commits.

## Code style and standards
- TypeScript uses strict mode; avoid `any` and non-null assertions unless absolutely necessary.
- Validate all API inputs with [Zod](https://github.com/colinhacks/zod) and infer types with `z.infer`.
- Keep API routes thin: parse input → call a service → return a response. Avoid direct Prisma access in route handlers.
- Prefer Tailwind CSS for styling and compose classes with the `cn()` helper.
- UI components and hooks belong under `src/app/(client)`. Server-side logic and side effects live in `src/app/(server)/services`.
- Run `npm run check` before committing; ESLint and Prettier are enforced via pre-commit hooks.

## Testing and quality
- `npm run check` performs type checking and linting; ensure it passes before pushing.
- The automated test suite is not yet available. You are not required to add or update tests at this time. If you have suggestions for testing approaches, please discuss them in your issue or pull request.
- Husky runs lint-staged on commit to format staged files automatically.

## Pull requests
- Open a PR once a coherent slice of work is ready.
- Link related issues using `Closes #123` in the description.
- Include screenshots for UI changes and call out any breaking changes or migration steps.
- Keep PRs focused; avoid unrelated refactors.

## Review process
- Automated checks must pass before review. *(TODO: document CI checks once configured.)*
- Address reviewer feedback with follow-up commits and resolve open discussions.

## Security disclosures
Do **not** file public issues for security vulnerabilities. Follow our [security policy](./SECURITY.md) instead.

## License
*(TODO: add license information once a LICENSE file is available.)*

## Code of Conduct
Participation in this project implies acceptance of the [Code of Conduct](./CODE_OF_CONDUCT.md).

For project overview and architecture details, see the [README](./README.md) and [Architecture guide](./docs/architecture.md).
