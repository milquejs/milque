import path from 'path';

import * as packageJson from './package.json';

const MODULE_DIR = path.dirname(packageJson.module);
const MODULE_NAME = 'Milque.Mogli';
const MAIN_PATH = packageJson.main;

export default [
    {
        input: 'src/index.js',
        output: {
            file: MAIN_PATH,
            format: 'umd',
            name: MODULE_NAME,
            globals: {
                'gl-matrix': 'glMatrix'
            }
        },
        external: [
            'gl-matrix'
        ]
    },
    {
        input: [
            'src/index.js'
        ],
        output: {
            dir: MODULE_DIR,
            format: 'esm',
        },
        external: [
            'gl-matrix',
        ]
    }
];
