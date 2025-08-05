/**
 * Returns a standardized log prefix for all log messages.
 *
 * @param level - The log level (e.g., 'DEBUG', 'INFO', 'WARN', 'ERROR').
 * @returns The formatted log prefix string.
 */
function stamp(level: string): string {
	return `[LangRoute][${level}]`;
}

/**
 * Logs a debug message in development or when NODE_ENV is not production.
 * Debug logs are automatically filtered out in production builds for performance.
 *
 * @param args - The arguments to log.
 */
export function logDebug(...args: unknown[]): void {
	if (process.env.NODE_ENV !== 'production') {
		console.debug(stamp('DEBUG'), ...args);
	}
}

/**
 * Logs an informational message.
 *
 * @param args - The arguments to log.
 */
export function logInfo(...args: unknown[]): void {
	console.info(stamp('INFO'), ...args);
}

/**
 * Logs a warning message.
 *
 * @param args - The arguments to log.
 */
export function logWarn(...args: unknown[]): void {
	console.warn(stamp('WARN'), ...args);
}

/**
 * Logs an error message.
 *
 * @param args - The arguments to log.
 */
export function logError(...args: unknown[]): void {
	console.error(stamp('ERROR'), ...args);
}
