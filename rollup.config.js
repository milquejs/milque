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
import replace from '@rollup/plugin-replace';

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
        // HACK: Undo path separator formatting
        let targetPackageName = target.replaceAll('\\', '/');

        // Build mapping for module name to packageJson
        const packages = (await getPackageJsons()).reduce(
            (prev, packageJson) => {
                prev[packageJson.name] = packageJson;
                return prev;
            }, {});
        let targetPackage = packages[targetPackageName];
        if (!targetPackage)
        {
            throw new Error(`Cannot find package info for ${targetPackageName}.`);
        }

        // Sort map
        let result = topoSort(
            [targetPackage],
            packageJson => {
                const { dependencies } = packageJson;
                if (dependencies)
                {
                    let names = Object.keys(packageJson.dependencies);
                    return names.map(name => packages[name]).filter(Boolean);
                }
                else
                {
                    return [];
                }
            });
        
        console.log(`Dependencies found:\n=> ${result.map(packageJson => packageJson.name).join('\n=> ')}\n`);
        return await configure(result, isDevelopment);
    }
    else
    {
        const result = await getPackageJsons();
        return await configure(result, isDevelopment);
    }
}

async function configure(packageJsons, isDevelopment)
{
    let promises = packageJsons.map(async packageJson => {
        if (packageJson.browser)
        {
            return await createBrowserConfig(packageJson, '@app', isDevelopment);
        }
        else
        {
            if (packageJson.name.endsWith('.macro'))
            {
                // Nothing to bundle for macros.
                return null;
            }
            else
            {
                return await createLibraryConfig(packageJson, '@module');
            }
        }
    });
    return cleanArray(await Promise.all(promises));
}

async function createLibraryConfig(packageJson, sourceAlias)
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
        plugins: [
            // Linting
            eslint(),
            stylelint(),
            // Including external packages
            nodeResolve(),
            // Clean output dir
            clear({
                targets: [ outputRoot ]
            }),
            // Import alias
            alias({
                entries: [
                    { find: sourceAlias, replacement: path.join(packagePath, SOURCE_ROOT_PATH) }
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
            // Allow `process.env` access
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            // Transpile macros
            babel({
                babelHelpers: 'bundled',
                plugins: ['macros']
            }),
        ]
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

function resolveAsset(packagePath, assetPath)
{
    // HACK: For some reason, the copy plugin REQUIRES unix path separators
    return path.join(packagePath, assetPath).replaceAll('\\', '/');
}

async function createBrowserConfig(packageJson, sourceAlias, isDevelopment = false)
{
    const {
        input = 'src/main.js',
        location,
        // Apps should only output browser files
        browser,
    } = packageJson;

    const packagePath = path.relative(__dirname, location);
    const inputPath = path.join(packagePath, input);
    const outputRoot = path.join(packagePath, isDevelopment ? TEMP_OUTPUT_ROOT_PATH : OUTPUT_ROOT_PATH);
    const contentRoots = [
        path.resolve(__dirname, 'res'),
        path.join(packagePath, 'res'),
    ];
    const staticAssets = [
        { src: resolveAsset(packagePath, 'src/template.html'), rename: 'index.html' },
        { src: resolveAsset(packagePath, 'src/style.css'), rename: 'index.css' },
    ];

    return {
        input: inputPath,
        output: {
            file: path.join(outputRoot, path.basename(browser)),
            format: 'iife',
        },
        plugins: [
            // Linting
            eslint(),
            stylelint(),
            // Including external packages
            nodeResolve({ browser: true }),
            commonjs(),
            // Clean output dir
            clear({
                targets: [ outputRoot ]
            }),
            // Copy assets
            copy({
                targets: staticAssets.map(opt => ({ dest: outputRoot, ...opt }))
            }),
            // Import alias
            alias({
                entries: [
                    { find: sourceAlias, replacement: path.join(packagePath, SOURCE_ROOT_PATH) }
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
            // Allow `process.env` access
            replace({
                'process.env.NODE_ENV': JSON.stringify(isDevelopment ? 'development' : 'production'),
            }),
            // Transpile macros
            babel({
                babelHelpers: 'bundled',
                plugins: ['macros']
            }),
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
                    watchAssets({
                        assets: [
                            ...staticAssets.map(opt => opt.src),
                            ...contentRoots,
                        ]
                    }),
                    livereload({ watch: outputRoot })
                ]
                : [
                    // Production-only plugins
                    terser()
                ])
        ]
    };
}
