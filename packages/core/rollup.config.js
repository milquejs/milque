import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import clear from 'rollup-plugin-clear';
import pkg from './package.json';

const POLYFILL_INPUT_PATH = './src/polyfill.js';
const INPUT_PATH = './src/index.js';
const PACKAGE_NAME = 'Milque';

export default [
    {
        input: POLYFILL_INPUT_PATH,
        output: {
            file: pkg.browser,
            format: 'umd',
            name: PACKAGE_NAME,
            exports: 'named'
        },
        plugins: [
            clear({ targets: ['build'] }),
            /** Converts imported CommonJS modules to ES6 */
            resolve(),
            commonjs(),
            babel(),
        ]
    },
    {
        input: POLYFILL_INPUT_PATH,
        output: {
            file: pkg.browser.substring(0, pkg.browser.lastIndexOf('.')) + '.min.js',
            format: 'umd',
            name: PACKAGE_NAME,
            exports: 'named'
        },
        plugins: [
            clear({ targets: ['build'] }),
            /** Converts imported CommonJS modules to ES6 */
            resolve(),
            commonjs(),
            babel(),
            terser()
        ]
    },
    {
        input: INPUT_PATH,
        output: {
            file: pkg.module,
            format: 'es'
        },
        external: [
            'gl-matrix'
        ],
        plugins: [
            clear({ targets: ['build'] }),
        ]
    }
];