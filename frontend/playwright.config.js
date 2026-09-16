const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
	testDir: './e2e',
	fullyParallel: false,
	workers: 1,
	timeout: 90_000,
	expect: { timeout: 10_000 },
	reporter: 'list',
	use: {
		...devices['Desktop Chrome'],
		baseURL: 'http://127.0.0.1:3100/playwright/gallery/',
		serviceWorkers: 'block',
		trace: 'retain-on-failure',
	},
	webServer: {
		command: 'npm run e2e:gallery',
		url: 'http://127.0.0.1:3100/playwright/gallery/',
		reuseExistingServer: false,
	},
});
