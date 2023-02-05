import fs from 'fs/promises';
import path from 'path';
import { prompt } from 'enquirer';
import { packageNameToKebab, findUp } from '../util';

export default async function main() {
    const { projectName } = await prompt({
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
    });
    if (!projectName) {
        throw new Error('Missing valid project name.');
    }

    // Find rush.json
    const rushPath = await findUp('rush.json');
    if (!rushPath) {
        throw new Error(`Cannot find 'rush.json' in parent directory.`);
    }

    // Add to rush.json
    let rushData = await fs.readFile(rushPath);
    let rushLines = rushData.toString().split('\n');
    let anchorString = '#milque-dev!libs';
    let i = rushLines.findIndex((v) => v.trim().endsWith(anchorString));
    if (i < 0) {
        throw new Error(`Cannot find '// ${anchorString}' in 'rush.json'.`);
    }
    let anchorLine = rushLines[i];
    let j = anchorLine.lastIndexOf('//');
    let newLines = [
        '{',
        `  "packageName": "@milque/${projectName}",`,
        `  "projectFolder": "libs/${projectName}",`,
        `  "reviewCategory": "production"`,
        '},'
    ].map(line => ' '.repeat(j) + line);
    let result = [
        ...rushLines.slice(0, i + 1),
        ...newLines,
        ...rushLines.slice(i + 1),
    ];
    await fs.writeFile(rushPath, result.join('\n'));

    // Create project dir in libs
    const projectPath = path.join(rushPath, '..', 'libs', projectName);
    await fs.mkdir(projectPath, { recursive: true });

    // Create package.json
    const packageJsonPath = path.join(projectPath, 'package.json');
    let packageJson;
    try {
        let data = await fs.readFile(packageJsonPath);
        packageJson = JSON.parse(data);
    } catch (e) {
        packageJson = {};
    }
    const packageName = '@milque/' + projectName;
    const outputName = packageNameToKebab(packageName);
    const cjsOutput = 'dist/' + outputName + '.cjs.js';
    const esmOutput = 'dist/' + outputName + '.esm.js';
    const newPackageJson = {
        name: packageName,
        version: packageJson.version || '1.0.0',
        description: packageJson.description || '',
        main: cjsOutput,
        module: esmOutput,
        types: 'dist/index.d.ts',
        exports: {
            '.': {
                require: './' + cjsOutput,
                import: './' + esmOutput,
            },
            './package.json': './package.json',
            ...(packageJson.exports || {})
        },
        globals: {
            [packageName]: 'milque.' + projectName,
            ...(packageJson.globals || {})
        },
        scripts: {
            build: 'milque-dev build',
            ...(packageJson.scripts || {})
        },
        keywords: Array.from(new Set([
            'milque',
            ...(packageJson.keywords || [])
        ])),
        author: 'Andrew Kuo <andrewbkuo@gmail.com>',
        license: 'MIT',
        devDependencies: {
            'milque-dev': 'workspace:*',
            ...(packageJson.devDependencies || {})
        }
    };
    await fs.writeFile(packageJsonPath, JSON.stringify({
        ...packageJson,
        ...newPackageJson
    }, null, 2));

    // Create src/index.js
    const indexJsPath = path.join(projectPath, 'src', 'index.js');
    try {
        await fs.stat(indexJsPath);
        // Otherwise, it already exists!
    } catch {
        await fs.mkdir(path.dirname(indexJsPath), { recursive: true });
        await fs.writeFile(indexJsPath, '');
    }
}
