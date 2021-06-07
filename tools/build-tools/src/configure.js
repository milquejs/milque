import dts from 'rollup-plugin-dts';
import clear from 'rollup-plugin-clear';
import { string } from 'rollup-plugin-string';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-polyfill-node';

/**
 * @param {object} opts 
 * @param {object} opts.packageJson
 * @param {string} opts.input
 * @param {string} opts.moduleName
 * @returns {object}
 */
export function configure({ packageJson, input, moduleName })
{
    return [
        {
            input: input,
            output: [
                packageJson.module && {
                    file: packageJson.module,
                    format: 'esm'
                },
                packageJson.main && {
                    file: packageJson.main,
                    format: 'cjs'
                }
            ].filter(ifDefined),
            plugins: [
                clear({
                    targets: ['out', 'dist']
                }),
                string({
                    include: [
                        '**/*.html',
                        '**/*.css',
                    ]
                }),
            ].filter(ifDefined)
        },
        packageJson.browser && {
            input: input,
            output: {
                file: packageJson.browser,
                name: moduleName,
                format: 'umd',
            },
            plugins: [
                // TODO: https://github.com/micromatch/picomatch/pull/73
                nodePolyfills(),
                nodeResolve({ preferBuiltins: false }),
                commonjs(),
                terser(),
                string({
                    include: [
                        '**/*.html',
                        '**/*.css',
                    ]
                }),
            ],
        },
        packageJson.types && {
            input: input,
            output: {
                file: packageJson.types,
                format: 'esm'
            },
            plugins: [
                dts({
                    compilerOptions: {
                        allowJs: true,
                        declaration: true,
                        emitDeclarationOnly: true,
                        esModuleInterop: true
                    }
                })
            ],
        }
    ].filter(ifDefined);
}

function ifDefined(value)
{
    return typeof value !== 'undefined';
}
