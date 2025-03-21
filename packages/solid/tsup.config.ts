import { defineConfig } from "tsup";
import * as preset from "tsup-preset-solid";

const preset_options: preset.PresetOptions = {
	entries: [
		{
			entry: "src/index.ts",
		},
	],
	// Set to `true` to remove all `console.*` calls and `debugger` statements in prod builds
	drop_console: false,
	// Set to `true` to generate a CommonJS build alongside ESM
	cjs: true,
};

export default defineConfig(async () => {
	const parsed_data = preset.parsePresetOptions(preset_options);

	return {
		...preset.generateTsupOptions(parsed_data)[0],
		format: ["cjs", "esm"],
		outExtension(ctx) {
			return {
				js: ctx.format === "esm" ? ".mjs" : ".cjs",
			};
		},
		splitting: true,
		sourcemap: false,
		clean: true,
		treeshake: true,
		dts: true,
		skipNodeModulesBundle: true,
		minify: false,
		external: ["solid-js", "@niku/ez-form-core"],
		injectStyle: false,
		keepNames: true,
		esbuildOptions: (options) => {
			options.target = "es2015";
		},
	};
});
