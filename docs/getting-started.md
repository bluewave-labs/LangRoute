# Getting Started

A step-by-step guide to running **LangRoute** locally for development and testing.

## Prerequisites

- **Node.js 20+** – required by the Next.js 15 toolchain
- **npm** – this repository uses the npm CLI and includes a `package-lock.json`
- **Docker Desktop** – PostgreSQL runs in a Docker container

## Environment setup

1. Copy the template environment file:
   ```bash
   cp env/.env.example env/.env.local
   ```
2. Edit `env/.env.local` with your own values.
3. Generate the root `.env` file (overwritten on each run):
   ```bash
   npm run env
   ```
   This merges `.env.base` (optional) and `.env.local` into a single root `.env`.

### Key variables
| Variable                                    | Purpose                                      |
| ------------------------------------------- | -------------------------------------------- |
| `DATABASE_URL`                              | PostgreSQL connection string                 |
| `POSTGRES_USER`                             | Database user for local Docker container     |
| `POSTGRES_PASSWORD`                         | Password for `POSTGRES_USER`                 |
| `POSTGRES_DB`                               | Database name used by the app                |
| `DEBUG_LOGS`                                | Enable Prisma debug logging (`true`/`false`) |
| `AUTH_SECRET`                               | Secret used by NextAuth                      |
| `AUTH_URL`                                  | Base URL for authentication callbacks        |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth credentials (optional)                 |
| `REDIS_URL`                                 | Redis connection string (optional)           |

See [`env/.env.example`](../env/.env.example) for the full list of variables.

## Database

PostgreSQL is managed via a Docker Compose file.

Start the database:
```bash
npm run db boot
```
Other useful commands:
- `npm run db shutdown` – stop the container and Docker Desktop
- `npm run db reset` – recreate containers without dropping volumes
- `npm run db nuke` – destroy all volumes and start fresh (destructive)

After the database is running and `.env` is generated:
```bash
npx prisma generate
npx prisma migrate dev
```
Prisma uses the `DATABASE_URL` defined in the environment file.

## Run the application

**Fast path** – boot DB, generate env, run checks, and start the dev server:
```bash
npm run dev:boot
```

**Alternative** – if the DB is already running:
```bash
npm run dev
```

**Production build** – compile and run a production build locally:
```bash
npm run build
npm run start
```

## Common scripts

| Script                | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| `npm run dev`         | Start the Next.js dev server (regenerates `.env`)              |
| `npm run dev:boot`    | Lint & type-check, prepare env, boot DB, then run dev server   |
| `npm run env`         | Manually regenerate the root `.env`                            |
| `npm run db boot`     | Start Docker Desktop and the Postgres container                |
| `npm run db shutdown` | Stop the Postgres container and attempt to stop Docker Desktop |
| `npm run db reset`    | Recreate containers without deleting volumes                   |
| `npm run db nuke`     | Stop and remove volumes/network, then restart (destructive)    |
| `npm run check`       | Type-check and lint the codebase                               |
| `npm run build`       | Build the app for production                                   |

## Troubleshooting

- **Docker not running** – ensure Docker Desktop is running or start it with `npm run db boot`.
- **Port 5432 already in use** – stop local services using the port or change the mapping in `docker/docker-compose.db.yml`.
- **Prisma migrate errors** – confirm the DB is running and the root `.env` exists, then re-run `npx prisma generate` and `npx prisma migrate dev`.
- **Environment changes not applied** – re-run `npm run env` or restart with `npm run dev` to regenerate `.env`.
- **Node version mismatch** – use Node.js 20+.
- **Stale database data** – `npm run db reset` recreates containers; `npm run db nuke` wipes volumes.

## Platform notes

The DB helper attempts to manage Docker Desktop on Windows and macOS; on Windows, ensure WSL2 is enabled for the Docker CLI.

## Next steps

- [Project overview](../README.md)
- [Architecture](./architecture.md)
- [Contributing](../CONTRIBUTING.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)
- [Security policy](../SECURITY.md)

