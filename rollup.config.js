import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import {
    module as MODULE_PATH,
    browser as BROWSER_PATH,
} from './package.json';

const INPUT_PATH = 'index.js';
const MODULE_NAME = 'Milque';
const BROWSER_GLOBALS = {};
const EXTERNALS = Object.keys(BROWSER_GLOBALS);

function getMinifiedFileName(filename)
{
    let i = filename.lastIndexOf('.');
    if (i < 0) return filename + '_min';
    else return filename.substring(0, i) + '.min' + filename.substring(i);
}

export default [
    {
        input: INPUT_PATH,
        external: EXTERNALS,
        output: [
            {
                file: MODULE_PATH,
                format: 'esm'
            },
            {
                file: getMinifiedFileName(MODULE_PATH),
                format: 'esm',
                plugins: [
                    terser()
                ]
            },
            {
                file: BROWSER_PATH,
                format: 'umd',
                name: MODULE_NAME,
                exports: 'named'
            },
            {
                file: getMinifiedFileName(BROWSER_PATH),
                format: 'umd',
                name: MODULE_NAME,
                exports: 'named',
                plugins: [
                    terser()
                ]
            }
        ],
        plugins: [ resolve() ]
    }
];
