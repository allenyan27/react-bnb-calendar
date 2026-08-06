import { defineConfig } from "tsup";
import { sassPlugin } from "esbuild-sass-plugin";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: false,
    splitting: false,
    sourcemap: true,
    clean: true,
    injectStyle: false,
    esbuildPlugins: [sassPlugin()],
    banner: {
        js: '"use client";',
    },
});
