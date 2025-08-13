// 'scripts/dev.mjs'
//
// Development entrypoint wrapper.
// Purpose: decide target environment per-run (default "local"), generate root .env,
// then start Next.js dev server. Avoids CLI flags and sticky env vars.
//
// Usage:
//   npm run dev              -> local
//   npm run dev -- prod      -> prod (single run; next run defaults to local)
//   npm run dev -- supabase  -> supabase
//
// Notes:
// - Positional arg is *consumed here* and NOT forwarded to Next.js.
// - Only this script decides LR_TARGET_ENV for the child prepare step.
import { spawn, spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

function pickTargetEnv() {
	// First non-empty positional arg becomes the target env name.
	const arg = process.argv.slice(2).find((a) => a && !String(a).startsWith('-'));
	if (arg && /^[a-z0-9_-]+$/i.test(arg)) return arg.toLowerCase();
	return 'local';
}

function runPrepareEnv(target) {
	const scriptPath = join(rootDir, 'scripts', 'prepare-env.mjs');
	const childEnv = { ...process.env, LR_TARGET_ENV: target };
	const res = spawnSync(process.execPath, [scriptPath], {
		env: childEnv,
		stdio: 'inherit',
	});
	if (res.status !== 0) {
		process.exitCode = res.status ?? 1;
		process.exit(process.exitCode);
	}
}

function startNextDev() {
	const nextBin = join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next');
	const child = spawn(process.execPath, [nextBin, 'dev', '--turbopack'], {
		stdio: 'inherit',
	});
	child.on('exit', (code) => {
		process.exitCode = code ?? 0;
	});
}

const target = pickTargetEnv();
runPrepareEnv(target);
startNextDev();
