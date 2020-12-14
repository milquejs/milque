/* global __dirname process */
import path from 'path';

import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import clear from 'rollup-plugin-clear';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import styles from 'rollup-plugin-styles';
import { string } from 'rollup-plugin-string';
import { terser } from 'rollup-plugin-terser';
import stylelint from 'rollup-plugin-stylelint';
import eslint from '@rollup/plugin-eslint';

// Development plugins
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import watchAssets from 'rollup-plugin-watch-assets';

// Utility
import { getModuleName, getPackageJsons } from './tools/lib/package-util.js';
import { cleanArray } from './tools/lib/array-util.js';
import { topoSort } from './tools/lib/topo-sort.js';

const SOURCE_ROOT_PATH = 'src';
const OUTPUT_ROOT_PATH = 'dist';
const TEMP_OUTPUT_ROOT_PATH = 'out';

export default async function main()
{
    const { target, NODE_ENV } = process.env;
    const isDevelopment = NODE_ENV === 'development';

    if (target)
    {
        // Build mapping for module name to packageJson
        const packages = (await getPackageJsons()).reduce(
            (prev, packageJson) => {
                prev[packageJson.name] = packageJson;
                return prev;
            }, {});

        let targetPackage = packages[target];
        if (!targetPackage)
        {
            throw new Error(`Cannot find package info for ${target}.`);
        }

        // Sort map
        let result = topoSort(
            [targetPackage],
            packageJson => {
                let names = Object.keys(packageJson.dependencies);
                return names.map(name => packages[name]).filter(Boolean);
            });
        
        console.log(`Dependencies found:\n=> ${result.map(packageJson => packageJson.name).join('\n=> ')}\n`);
        return configure(result, isDevelopment);
    }
    else
    {
        const result = await getPackageJsons();
        return configure(result, isDevelopment);
    }
}

function configure(packageJsons, isDevelopment)
{
    return packageJsons.map(packageJson => {
        if (packageJson.browser)
        {
            return createBrowserConfig(packageJson, '@app', isDevelopment);
        }
        else
        {
            return createLibraryConfig(packageJson, '@module');
        }
    });
}

function createLibraryConfig(packageJson, sourceAlias)
{
    const {
        input = 'src/index.js',
        location,
        // Modules should only output library files
        main,
        module,
        bundle,
    } = packageJson;

    const packagePath = path.relative(__dirname, location);
    const inputPath = path.join(packagePath, input);
    const outputRoot = path.join(packagePath, OUTPUT_ROOT_PATH);
    
    const moduleName = getModuleName(packageJson);

    return {
        input: inputPath,
        output: cleanArray([
            bundle && outputUMD(path.join(packagePath, bundle), moduleName),
            main && outputCJS(path.join(packagePath, main)),
            module && outputESM(path.join(packagePath, module)),
        ]),
        external: [
            'gl-matrix'
        ],
        plugins: plugins(outputRoot, sourceAlias, true),
    };
}

function outputUMD(outputPath, moduleName)
{
    return {
        file: outputPath,
        format: 'umd',
        name: moduleName,
        globals: {
            'gl-matrix': 'glMatrix'
        },
        plugins: [
            // Minify
            terser(),
        ],
    };
}

function outputCJS(outputPath)
{
    return {
        file: outputPath,
        format: 'cjs',
    };
}

function outputESM(outputPath)
{
    return {
        file: outputPath,
        format: 'esm',
    };
}

function plugins(outputDir, sourceAlias, test = false)
{
    return [
        // Linting
        ...(test ? [
            eslint(),
            stylelint(),
        ] : []),
        // Including external packages
        nodeResolve(),
        commonjs(),
        // Clean output dir
        clear({
            targets: [ outputDir ]
        }),
        // Import alias
        alias({
            entries: [
                { find: sourceAlias, replacement: SOURCE_ROOT_PATH }
            ]
        }),
        // Import JSON
        json(),
        // Preprocess CSS (emit for plugin)
        styles({ mode: 'emit' }),
        // Import CSS & HTML as string
        string({
            include: [
                '**/*.template.html',
                '**/*.module.css'
            ]
        }),
        // Transpile macros
        babel({
            babelHelpers: 'bundled',
        }),
    ];
}

function createBrowserConfig(packageJson, sourceAlias, isDevelopment = false)
{
    const {
        input = 'src/main.js',
        location,
        // Apps should only output browser files
        browser,
    } = packageJson;

    const indexTemplatePath = 'src/template.html';

    const packagePath = path.relative(__dirname, location);
    const inputPath = path.join(packagePath, input);
    const outputRoot = path.join(packagePath, isDevelopment ? TEMP_OUTPUT_ROOT_PATH : OUTPUT_ROOT_PATH);
    const contentRoots = [
        'res',
        path.join(packagePath, 'res'),
    ];
    
    // HACK: For some reason, the copy plugin REQUIRES unix path separators
    const indexHTMLPath = path.join(packagePath, indexTemplatePath).replaceAll('\\', '/');

    return {
        input: inputPath,
        output: [
            outputBrowser(path.join(outputRoot, path.basename(browser))),
        ],
        plugins: [
            // Including external packages
            nodeResolve({ browser: true }),
            commonjs(),
            // Clean output dir
            clear({
                targets: [ outputRoot ]
            }),
            // Copy assets
            copy({
                targets: [
                    { dest: outputRoot, src: indexHTMLPath, rename: 'index.html' },
                ]
            }),
            // Import alias
            alias({
                entries: [
                    { find: sourceAlias, replacement: SOURCE_ROOT_PATH }
                ]
            }),
            // Import JSON
            json(),
            ...(isDevelopment
                ? [
                    // Development-only plugins
                    serve({
                        open: true,
                        contentBase: [
                            outputRoot,
                            ...contentRoots
                        ]
                    }),
                    watchAssets({ assets: [ indexHTMLPath ] }),
                    livereload({ watch: outputRoot })
                ]
                : [
                    // Production-only plugins
                    terser()
                ])
        ]
    };
}

function outputBrowser(outputPath)
{
    return {
        file: outputPath,
        format: 'iife',
    };
}
