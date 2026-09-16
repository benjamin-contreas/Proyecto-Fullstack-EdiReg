const { run } = require('./demoData');

const mode = process.argv[2];
if (!['seed', 'reset'].includes(mode)) {
	console.error('Usage: node scripts/demoDataCli.js <seed|reset>');
	process.exitCode = 1;
} else {
	run(mode).catch((error) => {
		console.error(`Unable to ${mode} demo data:`, error.message);
		process.exitCode = 1;
	});
}
