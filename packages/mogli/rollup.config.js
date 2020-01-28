import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import {
    module as MODULE_PATH,
    browser as BROWSER_PATH,
} from './package.json';

const INPUT_PATH = 'src/index.js';
const MODULE_NAME = 'Mogli';

function getMinifiedFileName(filename)
{
    let i = filename.lastIndexOf('.');
    if (i < 0) return filename + '_min';
    else return filename.substring(0, i) + '.min' + filename.substring(i);
}

export default [
    {
        input: INPUT_PATH,
        external: [ 'gl-matrix' ],
        output: [
            {
                file: MODULE_PATH,
                format: 'esm',
                globals: {
                    'gl-matrix': 'glMatrix'
                }
            },
            {
                file: getMinifiedFileName(MODULE_PATH),
                format: 'esm',
                plugins: [
                    terser()
                ],
                globals: {
                    'gl-matrix': 'glMatrix'
                }
            },
            {
                file: BROWSER_PATH,
                format: 'umd',
                name: MODULE_NAME,
                exports: 'named',
                globals: {
                    'gl-matrix': 'glMatrix'
                }
            },
            {
                file: getMinifiedFileName(BROWSER_PATH),
                format: 'umd',
                name: MODULE_NAME,
                exports: 'named',
                plugins: [
                    terser()
                ],
                globals: {
                    'gl-matrix': 'glMatrix'
                }
            }
        ]
    }
];