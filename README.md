<h1 align="center"><a href="https://bluewavelabs.ca" target="_blank">LangRoute</a></h1>

<p align="center"><strong>An LLM proxy server built with Next.js, shadcn/ui, Node.js, Express and PostgreSQL. </strong></p>

<img width="1463" alt="image" src="https://github.com/user-attachments/assets/e5df3a9c-c948-42d4-b260-d7086ccb4650" />

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Configuration and scripts](#configuration-and-scripts)
- [Testing](#testing)
- [CI/CD and deployment](#ci-cd-and-deployment)
- [Conventions](#conventions)
- [Security and disclosures](#security-and-disclosures)
- [Troubleshooting / FAQ](#troubleshooting--faq)
- [License](#license)

## Overview  
LangRoute is a flexible LLM proxy that routes, throttles, and logs calls across multiple model providers. Core logic runs on Node.js, Express, and PostgreSQL, while a Next.js + shadcn UI lets admins tweak configs and watch metrics. One endpoint in, the best model out.

See the [architecture document](docs/architecture.md) (coming soon) for a deeper dive into system design.

## Features  
- **Multi-model support**  
  - Connect OpenAI, Anthropic, Cohere, Azure OpenAI, or any local model.  
- **Smart routing**  
  - Pick the fastest, cheapest, or most accurate model on every request.  
  - Auto-retry with multi-provider fallback when a vendor hiccups.  
- **Rate limits**  
  - Enforce per-key and per-tenant caps. Default limiter is in-memory; Redis is plug-and-play.  
- **Logging & monitoring**  
  - Track latency, token spend, and full request metadata (prompts redacted in privacy mode).  
  - Ship metrics straight to Prometheus or Grafana.  
- **Security & privacy**  
  - Tenant isolation via row-level security.  
  - Keys encrypted at rest and stripped from logs.  
- **Admin & dev tools**  
  - Web playground for side-by-side model tests.  
  - Hot-reload configs without downtime.  
  - Toggle cache, rate limits, and routing rules from the dashboard.

## Architecture  
1. **Unified API** – Send a standard `/v1/chat/completions` call.  
2. **Routing engine** – Reads weights, prices, and health stats, then decides which adapter fires.  
3. **Provider adapters** – Translate the internal format to OpenAI, Anthropic, Cohere, Azure, or your local endpoint.  
4. **Middleware chain** – Handles auth, validation, caching, and token counting.  
5. **Async workers** – Push logs and metrics to Postgres and observability backends.

## Tech stack  
| Layer | Tooling |
|-------|---------|
| HTTP server | Node.js, Express |
| Admin UI | Next.js, React, shadcn/ui, Radix UI components |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Data store | PostgreSQL (Redis optional) |
| Auth | next-auth with Prisma adapter |
| State & data | @tanstack/react-query, Zustand |

## Quick start
### Prerequisites
- Node.js 20+ (recommended)
- npm (bundled with Node)

### Environment
- Copy and adjust [`env/.env.example`](env/.env.example) before running the app. Critical variables include:
  - `DATABASE_URL` – PostgreSQL connection string.
  - `AUTH_SECRET` – Secret for NextAuth.
  - `AUTH_URL` – Base URL for auth callbacks.
  - `REDIS_URL` – Optional Redis connection.

### Commands
```bash
npm install               # Install dependencies
npm run env               # Generate .env from env/ templates
npm run db boot           # (Optional) start local Postgres via Docker
npm run dev               # Start Next.js dev server with Turbopack
npm run build             # Build for production
npm start                 # Start production server
npm run lint              # Run ESLint
npm run check             # Type-check and lint
```

See [docs/getting-started.md](docs/getting-started.md) (coming soon) for workflows and additional setup notes.

## Project structure
```
.
├─ docs/                  # Additional project documentation
├─ env/                   # Environment templates
├─ prisma/                # Prisma schema & seeds
├─ scripts/               # Helper scripts (dev, env, db)
├─ src/
│  ├─ app/                # Next.js routes and API handlers
│  ├─ db/                 # Prisma client wrapper
│  ├─ lib/                # Shared models, config, utils, middleware
│  └─ shadcn-ui/          # Reusable UI components
├─ docker/                # Docker compose for Postgres
├─ public/                # Static assets
└─ ...
```

## Configuration and scripts
Key configuration files:
- [`next.config.ts`](next.config.ts) – Next.js configuration.
- [`tailwind.config.js`](tailwind.config.js) – Tailwind CSS settings.
- [`tsconfig.json`](tsconfig.json) – TypeScript compiler options.
- [`eslint.config.mjs`](eslint.config.mjs) – ESLint setup.
- [`.prettierrc`](.prettierrc) – Prettier rules.

Common npm scripts:

| Script | Description |
|--------|-------------|
| `dev` | Start the development server (selects target env) |
| `dev:boot` | Run checks, prepare env, boot DB, start dev server |
| `build` | Build the app for production |
| `start` | Start the built app |
| `lint` | Run ESLint |
| `check` | Run TypeScript `tsc --noEmit` and lint |
| `db` | Manage Dockerized Postgres (`npm run db help`) |
| `env` | Generate a consolidated `.env` file |

## Testing
No test suite is currently defined. Running `npm test` yields no tests (TODO). Linting and type checks can be run with `npm run lint` and `npm run check`.

## CI/CD and deployment
No GitHub workflows or deployment configuration are present yet (TODO).

## Conventions
- TypeScript with strict compiler options.
- ESLint (`next/core-web-vitals`) and Prettier enforce style.
- Import sorting and Tailwind class ordering via Prettier plugins.
- See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
- This project adheres to our [Code of Conduct](CODE_OF_CONDUCT.md).

## Security and disclosures
Security issues can be reported via our [Security Policy](SECURITY.md).

## Troubleshooting / FAQ
- Use Node.js 20+ to match the TypeScript and Next.js setup.
- Run `npm run env` if `.env` is missing or outdated.
- Start the local database with `npm run db boot` before running the app.
- Ensure required environment variables like `DATABASE_URL` and `AUTH_SECRET` are set.
- Set `REDIS_URL` if enabling Redis-backed rate limiting.
- Docker must be running for database scripts to succeed.

## License
No license file is currently included (TODO). Ownership and licensing terms are undecided.

