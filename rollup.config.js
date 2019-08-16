import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import clear from 'rollup-plugin-clear';

import pkg from './package.json';

const input = './src/index.js';
const name = 'Milque';

export default [
    {
        input,
        output: {
            file: pkg.browser,
            format: 'umd',
            name
        },
        plugins: [
            clear({ targets: ['build'] }),
            resolve(),
            commonjs(),
            babel({ exclude: 'node_modules/**' }),
        ]
    },
    {
        input,
        output: {
            file: pkg.browser.substring(0, pkg.browser.lastIndexOf('.')) + '.min.js',
            format: 'umd',
            name
        },
        plugins: [
            clear({ targets: ['build'] }),
            resolve(),
            commonjs(),
            babel({ exclude: 'node_modules/**' }),
            terser()
        ]
    },
    {
        input,
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' },
        ],
        external: [
            'gl-matrix'
        ],
        plugins: [
            clear({ targets: ['build'] }),
            babel({ exclude: 'node_modules/**' }),
        ]
    }
];
