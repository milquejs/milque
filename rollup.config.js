import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import clear from 'rollup-plugin-clear';

import pkg from './package.json';

export default [
    ...createBuildConfig('Milque', './src/milque/index.js', pkg),
    ...createBuildConfig('Mogli', './src/mogli/index.js', {
        main: 'build/cjs/mogli.js',
        module: 'build/esm/mogli.js',
        browser: 'build/mogli.js',
    }),
];

function createBuildConfig(name, input, opts)
{
    return [
        {
            input,
            output: {
                file: opts.browser,
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
                file: opts.browser.substring(0, opts.browser.lastIndexOf('.')) + '.min.js',
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
                { file: opts.main, format: 'cjs' },
                { file: opts.module, format: 'es' },
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
}
