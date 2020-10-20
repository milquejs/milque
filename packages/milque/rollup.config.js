import path from 'path';

import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import clear from 'rollup-plugin-clear';

import * as packageJson from './package.json';

const PUBLIC_DIR_PATH = 'dist';
const MODULE_DIR = path.dirname(packageJson.module);
const MODULE_NAME = 'Milque';
const MAIN_PATH = packageJson.main;

export default [
    {
        input: 'src/index.js',
        output: {
            file: MAIN_PATH,
            format: 'umd',
            name: MODULE_NAME,
        },
        plugins: [
            nodeResolve(),
            commonjs(),
            clear({
                targets: [ PUBLIC_DIR_PATH ]
            })
        ]
    },
    {
        input: [
            'src/index.js',
            'src/Display.js',
            'src/Input.js',
            'src/Mogli.js',
            'src/Next.js',
            'src/Random.js',
            'src/Util.js',
            'src/View.js',
        ],
        output: {
            dir: MODULE_DIR,
            format: 'esm',
        },
        external: [
            'gl-matrix',
            'tinycolor2'
        ],
        plugins: [
            nodeResolve()
        ]
    }
];
