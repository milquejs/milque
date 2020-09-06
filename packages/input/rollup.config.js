import path from 'path';
import * as packageJson from './package.json';

const MODULE_DIR = path.dirname(packageJson.module);
const MODULE_NAME = 'Milque.Input';
const MAIN_PATH = packageJson.main;

export default [
    {
        input: 'src/index.js',
        output: {
            file: MAIN_PATH,
            format: 'umd',
            name: MODULE_NAME,
        }
    },
    {
        input: [
            'src/index.js',
            'src/device/index.js',
            'src/InputContext.js',
            'src/InputKey.js',
        ],
        output: {
            dir: MODULE_DIR,
            format: 'esm',
        }
    }
];
