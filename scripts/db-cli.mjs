// Cross-platform DB helper for Dockerized Postgres.
// Usage: npm run db up|down|reset|nuke|logs|status|psql|seed|shutdown|boot|help
// No external deps; uses built-in child_process.
import { execSync } from 'node:child_process';
import os from 'node:os';

const COMPOSE = 'docker/docker-compose.db.yml';
const CONTAINER = 'langroute-db';
const VOLUME = 'langroute_pgdata';
const NETWORK = 'langroute-net';

function sh(cmd, opts = {}) {
	execSync(cmd, { stdio: 'inherit', shell: true, ...opts });
}

function shCapture(cmd) {
	try {
		return execSync(cmd, {
			stdio: ['ignore', 'pipe', 'ignore'],
			shell: true,
			encoding: 'utf8',
		}).trim();
	} catch {
		return '';
	}
}

function getContainerEnv(varName, fallback) {
	const out = shCapture(`docker exec ${CONTAINER} printenv ${varName}`);
	return out || fallback;
}

function stopAllRunningContainers() {
	const ids = shCapture('docker ps -q')
		.split(/\r?\n/)
		.map((s) => s.trim())
		.filter(Boolean);
	if (ids.length === 0) return;
	for (const id of ids) {
		try {
			sh(`docker stop ${id}`);
		} catch {}
	}
}

function hasDesktopCLI() {
	// Docker Desktop CLI (>= 4.37) provides: docker desktop start|stop|status
	// https://docs.docker.com/desktop/features/desktop-cli/
	try {
		sh('docker desktop version');
		return true;
	} catch {
		return false;
	}
}

function desktopStatus() {
	const out = shCapture('docker desktop status'); // "Running" | "Stopped"
	return out || '';
}

function waitFor(fn, label, timeoutMs = 120000, intervalMs = 1500) {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		try {
			if (fn()) return true;
		} catch {}
		Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, intervalMs); // sleep cross-platform
	}
	throw new Error(`Timeout waiting for ${label}`);
}

function startDockerDesktopFallback() {
	if (os.platform() === 'win32') {
		const exe = `"${process.env.ProgramFiles}\\Docker\\Docker\\Docker Desktop.exe"`;
		try {
			sh(`powershell -NoProfile -Command Start-Process ${exe}`);
		} catch {}
	} else if (os.platform() === 'darwin') {
		try {
			sh('open -a "Docker"');
		} catch {}
	}
}

function stopDockerDesktopFallback() {
	if (os.platform() === 'win32') {
		// Graceful first, then soft kill if needed
		try {
			sh(
				'powershell -NoProfile -Command "Get-Process \'Docker Desktop\' -ErrorAction SilentlyContinue | Stop-Process"',
			);
		} catch {}
	} else if (os.platform() === 'darwin') {
		try {
			sh('osascript -e \'tell application "Docker" to quit\'');
		} catch {}
	}
}

function isDockerProcessRunning() {
	if (os.platform() === 'win32') {
		const count = shCapture(
			'powershell -NoProfile -Command "(Get-Process \\"Docker Desktop\\" -ErrorAction SilentlyContinue | Measure-Object).Count"',
		);
		return count && count !== '0';
	} else if (os.platform() === 'darwin') {
		// pgrep exits non-zero if not running; shCapture returns ''
		const pid = shCapture('pgrep -x Docker');
		return !!pid;
	}
	// Linux desktop isn’t typical here; treat plugin status as best effort
	const st = desktopStatus().toLowerCase();
	return st !== '' && st !== 'stopped';
}

function engineIsReachable() {
	try {
		sh('docker info --format "{{.ServerVersion}}"');
		return true;
	} catch {
		return false;
	}
}

function isContainerRunning(name = CONTAINER) {
	const names = shCapture(`docker ps --filter "name=${name}" --format "{{.Names}}"`);
	return names.split(/\r?\n/).some((n) => n.trim() === name);
}

const cmds = {
	up: () => sh(`docker compose -f ${COMPOSE} up -d`),
	down: () => sh(`docker compose -f ${COMPOSE} down`),

	reset: () => {
		sh(`docker compose -f ${COMPOSE} down`);
		sh(`docker compose -f ${COMPOSE} up -d --force-recreate`);
	},
	nuke: () => {
		// Stop and delete containers + compose-managed volumes + orphans
		try {
			sh(`docker compose -f ${COMPOSE} down -v --remove-orphans`);
		} catch {}

		// Extra safety: remove any lingering resources by explicit name
		try {
			sh(`docker rm -f ${CONTAINER}`);
		} catch {}
		try {
			sh(`docker volume rm -f ${VOLUME}`);
		} catch {}
		try {
			sh(`docker network rm ${NETWORK}`);
		} catch {}

		// Start fresh
		sh(`docker compose -f ${COMPOSE} up -d`);
	},

	logs: () => sh(`docker logs -f ${CONTAINER}`),
	status: () => sh(`docker ps --filter name=${CONTAINER}`),

	psql: () => {
		// Resolve from container if running; fall back to common defaults.
		const db = getContainerEnv('POSTGRES_DB', process.env.POSTGRES_DB || 'langroute');
		const user = getContainerEnv('POSTGRES_USER', process.env.POSTGRES_USER || 'postgres');
		sh(`docker exec -it ${CONTAINER} psql -U ${user} -d ${db}`);
	},

	// Seed via ts-node; keep quoting compatible with Powershell/CMD/Git Bash.
	seed: () =>
		sh(
			`npx ts-node --transpile-only --compiler-options {\\\"module\\\":\\\"commonjs\\\"} prisma/seed.ts`,
		),

	// Graceful shutdown for Windows/WSL users:
	// 1) bring down compose for this project
	// 2) stop any other running containers
	// 3) stop Docker Desktop cleanly (official CLI if available)
	// 4) Windows-only: shutdown WSL to avoid next-boot warnings
	shutdown: () => {
		const desktopRunning = isDockerProcessRunning();
		const engineUp = desktopRunning && engineIsReachable();

		// 1) Stop this project's stack (only if engine reachable)
		if (engineUp) {
			if (isContainerRunning()) {
				try {
					sh(`docker compose -f ${COMPOSE} down`);
				} catch {}
			} else {
				console.log('ℹ️  langroute-db already stopped.');
			}
			// 2) Stop any other running containers
			stopAllRunningContainers();
		} else {
			console.log('ℹ️  Docker engine not reachable; skipping container stop.');
		}

		// 3) Stop Docker Desktop (only if it’s actually running)
		if (desktopRunning) {
			if (hasDesktopCLI()) {
				try {
					sh('docker desktop stop');
				} catch {}
			} else {
				stopDockerDesktopFallback();
			}

			// 4) Wait for the Desktop process to exit (don’t poll the plugin here)
			try {
				waitFor(() => !isDockerProcessRunning(), 'Docker Desktop process to exit', 90000, 1000);
			} catch {
				/* if it times out, continue anyway */
			}

			if (os.platform() === 'win32') {
				// Will stop docker-desktop and docker-desktop-data distros as well
				try {
					sh('wsl --shutdown');
				} catch {}
				console.log('🔴 WSL stopped');
			} else {
				console.log('ℹ️  Non-Windows host detected; skipped WSL shutdown.');
			}

			console.log('🔴 Docker Desktop stopped cleanly.');
		} else {
			console.log('ℹ️  Docker Desktop already stopped. Nothing to do.');
		}
	},

	// Cross-platform boot:
	// 1) start Docker Desktop (CLI if present, otherwise OS fallback)
	// 2) wait until Docker is actually usable
	// 3) start the DB compose service
	boot: () => {
		const alreadyRunning = isDockerProcessRunning() && engineIsReachable();
		if (alreadyRunning && isContainerRunning()) {
			console.log('ℹ️  Docker Desktop and langroute-db are already running. Nothing to do.');
			return;
		}

		if (hasDesktopCLI()) {
			const st = desktopStatus().toLowerCase();
			if (st !== 'running') {
				try {
					sh('docker desktop start');
				} catch {}
			}
		} else {
			startDockerDesktopFallback();
		}

		// Wait for engine to be ready
		try {
			waitFor(
				() => {
					try {
						sh('docker info --format "{{.ServerVersion}}"');
						return true;
					} catch {
						return false;
					}
				},
				'Docker engine to be ready',
				180000,
				1500,
			);
		} catch (e) {
			console.error(String(e));
			process.exit(1);
		}
		if (isContainerRunning()) {
			console.log('ℹ️  langroute-db already up. Skipping compose.');
			return;
		}
		// Finally, bring up the DB
		sh(`docker compose -f ${COMPOSE} up -d`);

		console.log('🟢 Docker Desktop is running and langroute-db is up.');
	},

	help: () => {
		console.log(`
	>>================================================================================<<
	||                                                                                ||
	|| ██╗      █████╗ ███╗   ██╗ ██████╗ ██████╗  ██████╗ ██╗   ██╗████████╗███████╗ ||
	|| ██║     ██╔══██╗████╗  ██║██╔════╝ ██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝ ||
	|| ██║     ███████║██╔██╗ ██║██║  ███╗██████╔╝██║   ██║██║   ██║   ██║   █████╗   ||
	|| ██║     ██╔══██║██║╚██╗██║██║   ██║██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝   ||
	|| ███████╗██║  ██║██║ ╚████║╚██████╔╝██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗ ||
	|| ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝ ||
	||                                                                                ||
	>>================================================================================<<
				==================================
				 Open-source LLM Gateway & Proxy
				==================================

	DB Helper Commands:
	------------------------------------------------------------
	npm run db up         | 🟢  Start Postgres (detached)
	npm run db down       | 🔴  Stop Postgres (keeps volume)
	npm run db reset      | 🔄  Recreate containers without deleting volumes (keeps data)
	npm run db nuke       | ☢️  STOP + DELETE volumes/network + START (⚠  Destructive, dev only)
	npm run db logs       | 📜  Tail container logs
	npm run db status     | 📊  Show running container info
	npm run db psql       | 🐘  Open psql inside the container
	npm run db seed       | 🌱  Run prisma/seed.ts (ts-node)
	npm run db shutdown   | 🛑  Stop compose + containers, stop Docker Desktop, (Windows) WSL shutdown
	npm run db boot       | 🚀  Start Docker Desktop; wait until ready; start DB
	npm run db help       | ❓  Show this help

`);
	},
};

const cmd = process.argv[2] || 'help';
if (!cmds[cmd]) {
	console.error(`Unknown command: ${cmd}\n`);
	cmds.help();
	process.exit(1);
}
cmds[cmd]();
