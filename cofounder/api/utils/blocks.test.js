import { describe, it } from "node:test";
import assert from "assert";
import { runBlocks } from "./blocks.js";

const makeBlock = (name, data) => async () => ({ [name]: data });

describe("runBlocks", () => {
	it("merges block outputs in order", async () => {
		const { result, errors } = await runBlocks({
			blocks: ["alpha", "beta"],
			registry: {
				alpha: makeBlock("alpha", { value: 1 }),
				beta: ({ result: partial }) => ({
					beta: partial.alpha.value + 1,
				}),
			},
		});

		assert.deepStrictEqual(errors, []);
		assert.deepStrictEqual(result, {
			alpha: { value: 1 },
			beta: 2,
		});
	});

	it("records missing handlers without throwing", async () => {
		const { result, errors } = await runBlocks({
			blocks: ["alpha", "missing"],
			registry: {
				alpha: makeBlock("alpha", true),
			},
		});

		assert.deepStrictEqual(result.alpha, true);
		assert.strictEqual(errors.length, 1);
		assert.strictEqual(errors[0].block, "missing");
	});

	it("captures handler exceptions", async () => {
		const { errors, result } = await runBlocks({
			blocks: ["alpha", "broken"],
			registry: {
				alpha: makeBlock("alpha", true),
				broken: () => {
					throw new Error("boom");
				},
			},
		});

		assert.deepStrictEqual(result.alpha, true);
		assert.strictEqual(errors.length, 1);
		assert.strictEqual(errors[0].block, "broken");
		assert.strictEqual(errors[0].message, "boom");
	});
});
