import * as packageJson from './package.json';

const MODULE_NAME = 'Input';
const BROWSER_GLOBALS = {};

const EXTERNALS = Object.keys(BROWSER_GLOBALS);
const MODULE_PATH = packageJson.module;
const BROWSER_PATH = packageJson.browser;

export default {
    input: 'src/index.js',
    external: EXTERNALS,
    output: [
        {
            file: MODULE_PATH,
            format: 'esm'
        },
        {
            file: BROWSER_PATH,
            format: 'umd',
            name: MODULE_NAME,
            exports: 'named',
            globals: BROWSER_GLOBALS,
        },
    ]
};
