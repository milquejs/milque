import * as packageJson from './package.json';

const MODULE_NAME = 'Milque.Next';
const MODULE_PATH = packageJson.module;
const MAIN_PATH = packageJson.main;

export default {
    input: 'src/index.js',
    output: [
        {
            file: MODULE_PATH,
            format: 'esm',
        },
        {
            file: MAIN_PATH,
            format: 'umd',
            name: MODULE_NAME,
        },
    ]
};
