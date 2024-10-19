import * as fs from 'fs';
import * as path from 'path';

const checkForPluginFile = (dir: string, results: string[] = []) => {
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory() && file !== 'node_modules') {
			checkForPluginFile(fullPath, results);
		} else if (stat.isFile() && /app\.plugin\.(js|ts)$/.test(file)) {
			results.push(dir);
			break;
		}
	}

	return results;
};

const main = () => {
	const nodeModulesPath = path.join(process.cwd(), 'node_modules');
	if (!fs.existsSync(nodeModulesPath)) {
		console.error('node_modules folder not found in the current working directory.');
		return;
	}

	const modules = fs.readdirSync(nodeModulesPath);
	const results: string[] = [];

	for (const module of modules) {
		const modulePath = path.join(nodeModulesPath, module);
		if (fs.statSync(modulePath).isDirectory()) {
			checkForPluginFile(modulePath, results);
		}
	}

	console.log('Modules containing app.plugin.(js|ts):');
	results.forEach(result => console.log(result));
};

main();