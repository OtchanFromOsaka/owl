import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	timeout: 30 * 1000,
	expect: {
		timeout: 5000,
	},
	forbidOnly: true,
	retries: 2,
	workers: 3,
	reporter: "list",
	use: {
		baseURL: "http://localhost:5173",
		headless: true,
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],
	outputDir: "./tests/e2e/results",
	webServer: [
		{
			command: "pnpm dev",
			port: 5173,
			reuseExistingServer: false,
		},
	],
});
