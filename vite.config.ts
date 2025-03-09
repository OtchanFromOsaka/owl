import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import honox from "honox/vite";
import adapter from "@hono/vite-dev-server/cloudflare";
import build from "@hono/vite-build/cloudflare-workers";

export default defineConfig({
	plugins: [
		honox({
			devServer: { adapter },
			client: { input: ["./app/style.css"] },
		}),
		build(),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./app", import.meta.url)),
		},
	},
	server: {
		host: true,
		watch: {
			usePolling: true,
		},
	},
});
