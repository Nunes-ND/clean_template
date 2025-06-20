import swc from "unplugin-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		root: ".",
		include: ["src/**/*.{spec,test}.ts", "tests/**/*.{spec,test}.ts"],
		exclude: ["dist/**/*", "node_modules/**/*"],
		environment: "node",
		pool: "threads",
		poolOptions: {
			threads: {
				singleThread: false,
				minThreads: 1,
				maxThreads: 4,
			},
		},
		testTimeout: 10000,
		hookTimeout: 10000,
	},
	plugins: [
		swc.vite({
			module: { type: "es6" },
			jsc: {
				parser: {
					syntax: "typescript",
					decorators: true,
					tsx: false,
				},
				target: "es2020",
				transform: {
					decoratorMetadata: true,
					legacyDecorator: true,
				},
				keepClassNames: true,
				externalHelpers: false,
			},
			minify: false,
			sourceMaps: true,
		}),
		tsconfigPaths({
			projects: ["./tsconfig.test.json"],
		}),
	],
	esbuild: false,
});
