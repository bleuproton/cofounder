import path from "path";
import fs from "fs";

/**
 * Execute named block handlers sequentially.
 * A block handler receives ({ context, result }) and may return an object to merge into the result.
 * Errors are captured and returned rather than thrown to keep responses graceful.
 *
 * @param {Object} options
 * @param {string[]} options.blocks - Names of blocks to execute.
 * @param {Record<string, Function>} options.registry - Mapping of block name to async handler.
 * @param {Object} [options.context] - Arbitrary context passed to each block.
 * @param {Object} [options.initialResult] - Seed result object.
 * @returns {Promise<{ result: Object, errors: Array<{ block: string, message: string }> }>}
 */
export async function runBlocks({
	blocks = [],
	registry = {},
	context = {},
	initialResult = {},
} = {}) {
	const normalizedBlocks = Array.isArray(blocks) ? blocks : [];
	const result = { ...initialResult };
	const errors = [];

	for (const blockName of normalizedBlocks) {
		const handler = registry[blockName];
		if (typeof handler !== "function") {
			errors.push({ block: blockName, message: "handler not found" });
			continue;
		}

		try {
			const output = await handler({ context, result });
			if (output && typeof output === "object" && !Array.isArray(output)) {
				Object.assign(result, output);
			}
		} catch (error) {
			errors.push({
				block: blockName,
				message: error?.message || "block failed",
			});
		}
	}

	return { result, errors };
}

/**
 * Safely read a JSON file. Returns null if the file is missing or invalid.
 *
 * @param {string} filePath
 * @returns {any|null}
 */
export function readJsonIfExists(filePath) {
	try {
		if (!fs.existsSync(filePath)) return null;
		const raw = fs.readFileSync(filePath, "utf8");
		return JSON.parse(raw);
	} catch (error) {
		return null;
	}
}

/**
 * Resolve a path relative to a provided root. No-op when input is absolute.
 *
 * @param {string} root
 * @param {string} targetPath
 * @returns {string}
 */
export function resolveFrom(root, targetPath) {
	if (!targetPath) return targetPath;
	if (path.isAbsolute(targetPath)) return targetPath;
	return path.join(root, targetPath);
}
