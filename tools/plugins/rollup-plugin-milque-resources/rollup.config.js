import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import pkg from './package.json';

export default {
    input: 'src/index.js',
    external: [
        'fs/promises',
        'path',
    ],
    output: [
        { file: pkg.main, format: 'cjs', sourcemap: true, exports: 'auto'},
        { file: pkg.module, format: 'es', sourcemap: true },
    ],
    plugins: [
        nodeResolve(),
        commonjs(),
    ]
};
