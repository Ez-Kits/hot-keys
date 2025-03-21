import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	outExtension(ctx) {
		return {
			js: ctx.format === "esm" ? ".mjs" : ".cjs",
		};
	},
	splitting: true,
	sourcemap: false,
	treeshake: true,
	clean: true,
	dts: true,
	skipNodeModulesBundle: true,
	minify: false,
	external: ["vue", "async-validator"],
	tsconfig: "./tsconfig.json",
	keepNames: true,
	esbuildOptions: (options) => {
		options.target = "es2015";
	},
});
