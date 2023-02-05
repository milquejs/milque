import { rollup, watch } from 'rollup';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { string } from 'rollup-plugin-string';

import { packageNameToPascal } from './util';

export function rollupConfig({
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
        string({
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
export function rollupWatch(config) {
    const { buildInput, buildExternals, buildPlugins, outputName, outputPlugins } = config;
    
    const onExit = () => {
        console.log('Exit watch mode 👋 Good-bye!\n');
        process.exit(0);
    };
    process.on('SIGINT', onExit);
    process.on('SIGTERM', onExit);
    process.on('SIGBREAK', onExit);

    const watcher = watch({
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
export async function rollupBuild(config) {
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
        rollup({
            external: buildExternals,
            input: buildInput,
            plugins: buildPlugins,
        }),
        rollup({
            external: buildExternals,
            input: buildInput,
            plugins: buildPlugins,
        }),
        rollup({
            external: umdExternals,
            input: buildInput,
            plugins: buildPlugins,
        }),
        rollup({
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
