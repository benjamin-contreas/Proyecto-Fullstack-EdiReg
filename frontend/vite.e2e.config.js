const path = require('node:path');
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

module.exports = defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@auth0/auth0-react': path.resolve(__dirname, 'e2e/support/auth0.js'),
		},
	},
	define: {
		'process.env': JSON.stringify({
			NODE_ENV: 'test',
			REACT_APP_API_URL: 'http://127.0.0.1:4100',
			REACT_APP_AUTH0_ROLES_CLAIM: 'https://edireg.app/roles',
		}),
	},
	server: { host: '127.0.0.1', port: 3100 },
});
