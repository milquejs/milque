import path from 'path';
import * as packageJson from './package.json';

const MODULE_DIR = path.dirname(packageJson.module);
const MODULE_NAME = 'Milque.Random';
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
            'src/Random.js',
            'src/generators/RandomGenerator.js',
            'src/generators/SimpleRandomGenerator.js'
        ],
        output: {
            dir: MODULE_DIR,
            format: 'esm',
        }
    }
];
