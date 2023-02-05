'use strict';

var fs = require('fs/promises');
var path = require('path');
var rollup = require('rollup');
var nodePolyfills = require('rollup-plugin-polyfill-node');
var nodeResolve = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');
var terser = require('@rollup/plugin-terser');
var dts = require('rollup-plugin-dts');
var rollupPluginString = require('rollup-plugin-string');
var enquirer = require('enquirer');

/**
 * @param {string} name
 */
function packageNameToKebab(name) {
    return name.replace(/[@!]/g, '').replace(/\//g, '-');
}

/**
 * @param {string} name
 */
function kebabToPascal(name) {
    return name.split('-').map(s => `${s[0].toUpperCase()}${s.slice(1)}`).join('');
}

/**
 * @param {string} name
 */
function packageNameToPascal(name) {
    return kebabToPascal(packageNameToKebab(name));
}

/**
 * @param {string} dir
 */
async function clearDir(dir) {
    let items;
    try {
        items = await fs.readdir(dir);
    } catch (e) {
        await fs.mkdir(dir, { recursive: true });
        return;
    }
    return Promise.all(items.map(i => fs.rm(path.join(dir, i), { recursive: true, force: true })));
}

/**
 * @param {string} name
 */
async function findUp(name) {
    let dir = path.resolve('');
    const { root } = path.parse(dir);
    const stopPath = path.resolve(dir, root);
    let matcher = async (cwd) => {
        let p = path.resolve(cwd, name);
        try {
            let s = await fs.stat(p);
            if (s.isFile()) {
                return p;
            }
        } catch {
            return null;
        }
        return null;
    };
    
    while(true) {
        let found = await matcher(dir);
        if (found) {
            return path.resolve(dir, found);
        }

        if (dir === stopPath) {
            break;
        }
        
        dir = path.dirname(dir);
    }

    return null;
}

function rollupConfig({
    packageName,
    outputName,
    input,
    dependencies = {},
    peerDependencies = {},
    umdGlobals = {},
}) {
    const buildPlugins = [
        // TODO: https://github.com/micromatch/picomatch/pull/73
        nodePolyfills(),
        nodeResolve({ preferBuiltins: true }),
        commonjs(),
        rollupPluginString.string({
            include: [
                '**/*.html',
                '**/*.css',
            ]
        }),
    ];
    const buildExternals = [
        ...Object.keys(dependencies),
        ...Object.keys(peerDependencies),
    ];
    const {
        // The global scope module id for this package.
        [packageName]: umdName = packageNameToPascal(packageName),
        ...umdGlobalsWithoutSelf
    } = umdGlobals;
    // All external module ids to named global scope (ie. `{ 'react-dom': 'ReactDOM' }`).
    const umdGlobalsWithDependencies = {
        ...Object.keys(peerDependencies).reduce((prev, curr) => {
            prev[curr] = packageNameToPascal(curr);
        }, {}),
        ...umdGlobalsWithoutSelf,
    };
    // All external module ids not included in the build for UMD.
    const umdExternals = Object.keys(umdGlobalsWithDependencies);

    const outputPlugins = [];

    return {
        buildInput: input,
        buildPlugins,
        buildExternals,
        umdName,
        umdGlobals: umdGlobalsWithDependencies,
        umdExternals,
        outputName,
        outputPlugins,
    };
}

/**
 * @param {ReturnType<rollupConfig>} config 
 */
function rollupWatch(config) {
    const { buildInput, buildExternals, buildPlugins, outputName, outputPlugins } = config;
    
    const onExit = () => {
        console.log('Exit watch mode 👋 Good-bye!\n');
        process.exit(0);
    };
    process.on('SIGINT', onExit);
    process.on('SIGTERM', onExit);
    process.on('SIGBREAK', onExit);

    const watcher = rollup.watch({
        external: buildExternals,
        input: buildInput,
        plugins: buildPlugins,
        output: {
            file: `dist/${outputName}.esm.js`,
            format: 'esm',
            sourcemap: true,
            plugins: outputPlugins,
        }
    });

    watcher.on('event', (e) => {
        switch(e.code) {
            case 'START':
                break;
            case 'BUNDLE_START':
                console.log('Building...\n');
                break;
            case 'BUNDLE_END':
                console.log('Build success!\n');
                console.log('Watching for changes...\n');
                break;
            case 'END':
                break;
            case 'ERROR':
                console.error(`Build failure! - ${JSON.stringify(e.error)}\n`);
                console.log('Watching for changes...\n');
                break;
        }
    });
}

/**
 * @param {ReturnType<rollupConfig>} config 
 */
async function rollupBuild(config) {
    const {
        buildInput,
        buildPlugins,
        buildExternals,
        umdName,
        umdGlobals,
        umdExternals,
        outputName,
        outputPlugins,
    } = config;

    let [ esmBuild, cjsBuild, umdBuild, typesBuild ] = await Promise.all([
        rollup.rollup({
            external: buildExternals,
            input: buildInput,
            plugins: buildPlugins,
        }),
        rollup.rollup({
            external: buildExternals,
            input: buildInput,
            plugins: buildPlugins,
        }),
        rollup.rollup({
            external: umdExternals,
            input: buildInput,
            plugins: buildPlugins,
        }),
        rollup.rollup({
            external: buildExternals,
            input: buildInput,
            plugins: [
                ...buildPlugins,
                dts.default({
                    compilerOptions: {
                        allowJs: true,
                        declaration: true,
                        emitDeclarationOnly: true,
                        esModuleInterop: true
                    }
                })
            ]
        })
    ]);
    await Promise.all([
        esmBuild.write({
            file: `dist/${outputName}.esm.js`,
            format: 'esm',
            sourcemap: true,
            sourcemapExcludeSources: false,
            plugins: outputPlugins,
        }),
        cjsBuild.write({
            file: `dist/${outputName}.cjs.js`,
            format: 'cjs',
            sourcemap: true,
            sourcemapExcludeSources: false,
            plugins: [
                ...outputPlugins,
                terser({ format: { comments: false }}),
            ],
        }),
        umdBuild.write({
            file: `dist/${outputName}.umd.js`,
            format: 'umd',
            name: umdName,
            globals: umdGlobals,
            sourcemap: true,
            sourcemapExcludeSources: false,
            plugins: [
                ...outputPlugins,
                terser({ format: { comments: false }}),
            ],
        }),
        typesBuild.write({
            file: 'dist/index.d.ts',
            format: 'esm',
        })
    ]);
}

async function main$2(watch = false) {
    // Clean `dist`
    try {
        await clearDir('./dist');
    } catch (e) {
        console.error('Failed cleaning dist.');
        throw e;
    }

    // Process args...
    process.argv.slice(2);
    const cwd = process.cwd();

    // Process package.json...
    let packageJson;
    try {
        let filePath = path.resolve(cwd, 'package.json');
        let fileData = await fs.readFile(filePath, 'utf-8');
        packageJson = JSON.parse(fileData);
    } catch (e) {
        throw new Error(`Cannot read package.json '${filePath}'.`);
    }
    const packageName = packageJson.name;
    if (!packageName) {
        throw new Error(`Invalid "name" in package.json - must be defined.`);
    }
    const outputName = packageNameToKebab(packageName);

    let expectedPackageMain = `dist/${outputName}.cjs.js`;
    let expectedPackageModule = `dist/${outputName}.esm.js`;
    let expectedPackageTypes = `dist/index.d.ts`;
    if (packageJson.main !== expectedPackageMain) {
        throw new Error(`Invalid "main" in package.json - expected '${expectedPackageMain}'.`);
    }
    if (packageJson.module !== expectedPackageModule) {
        throw new Error(`Invalid "module" in package.json - expected '${expectedPackageModule}'.`);
    }
    if (packageJson.types !== expectedPackageTypes) {
        throw new Error(`Invalid "types" in package.json - expected '${expectedPackageTypes}'.`);
    }

    // Create config...
    let config = rollupConfig({
        packageName,
        outputName,
        input: 'src/index.js',
        dependencies: packageJson.dependencies,
        peerDependencies: packageJson.peerDependencies,
        umdGlobals: packageJson.globals,
    });

    // Watch!
    if (watch) {
        rollupWatch(config);
        return;
    }

    // or Build!
    await rollupBuild(config);
}

async function main$1() {
    return await main$2(true);
}

async function main() {
    const { projectName } = await enquirer.prompt({
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

async function cli() {
    const args = process.argv.slice(2);
    switch(args[0]) {
        case 'build':
            return await main$2();
        case 'watch':
            return await main$1();
        case 'init':
            return await main();
        default:
            throw new Error(`Unknown command '${args[0]}'`);
    }
}

// Execute!
cli().catch(error => {
    console.error(error);
    if (process.argv[2] === 'watch') {
        process.exit(0);
    } else {
        process.exit(1);
    }
});
